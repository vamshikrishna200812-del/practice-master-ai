import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { sanitizeAuthInput } from "@/utils/authSanitizer";
import { GMAIL_REGEX, gmailError } from "@/utils/gmailOnly";
import { evaluatePassword, isPwned, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "@/utils/passwordPolicy";
import { deviceFingerprint } from "@/utils/deviceFingerprint";

// ── State Machine Types ──

export type AuthPhase =
  | "idle"
  | "authenticating"
  | "success"
  | "expected_failure"
  | "system_failure";

export interface AuthState {
  phase: AuthPhase;
  error: string | null;
  retryCount: number;
  lastAttempt: number | null;
}

interface AuthFormData {
  fullName: string;
  email: string;
  password: string;
}

// ── Validation Schemas ──

const passwordSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH);

const gmailSchema = z.string()
  .email("Invalid email address")
  .max(255)
  .regex(GMAIL_REGEX, gmailError());

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: gmailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: gmailSchema,
  password: z.string().min(1, "Password is required").max(PASSWORD_MAX_LENGTH),
});

// ── Constants ──

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;
const DEBOUNCE_MS = 600;
const ANTI_TIMING_DELAY_MS = 700;
const GENERIC_LOGIN_ERROR = "Invalid email or password.";

// ── Helpers ──

function classifyError(error: any): "expected" | "system" {
  const msg = (error?.message || "").toLowerCase();
  const status = error?.status;
  if (msg.includes("invalid login credentials")) return "expected";
  if (msg.includes("email not confirmed")) return "expected";
  if (msg.includes("user already registered")) return "expected";
  if (msg.includes("signup disabled")) return "expected";
  if (msg.includes("password") && msg.includes("pwned")) return "expected";
  if (status === 400 || status === 401 || status === 422) return "expected";
  return "system";
}

function getUserFriendlyMessage(error: any, isLogin: boolean): string {
  const msg = (error?.message || "").toLowerCase();
  const status = error?.status;
  // Anti-enumeration: same message for wrong email and wrong password
  if (isLogin && (msg.includes("invalid login credentials") || msg.includes("email not confirmed"))) {
    return GENERIC_LOGIN_ERROR;
  }
  if (msg.includes("user already registered")) {
    return "An account with this email already exists. Try signing in.";
  }
  if (msg.includes("password") && (msg.includes("pwned") || msg.includes("compromised") || msg.includes("breach"))) {
    return "This password has appeared in known data breaches. Please choose another.";
  }
  if (status === 429 || msg.includes("rate limit")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (status >= 500 || msg.includes("timeout") || msg.includes("network")) {
    return "We're experiencing server issues. Retrying automatically…";
  }
  return error?.message || "Authentication failed. Please try again.";
}

async function callGuard(body: Record<string, unknown>) {
  try {
    return (await supabase.functions.invoke("auth-guard", { body })).data as any;
  } catch {
    return null;
  }
}

// ── Hook ──

export function useAuthStateMachine() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    phase: "idle", error: null, retryCount: 0, lastAttempt: null,
  });

  const lastSubmitRef = useRef<number>(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToIdle = useCallback(() => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    setState({ phase: "idle", error: null, retryCount: 0, lastAttempt: null });
  }, []);

  const authenticate = useCallback(
    async (formData: AuthFormData, isLogin: boolean) => {
      const now = Date.now();
      if (now - lastSubmitRef.current < DEBOUNCE_MS) return;
      lastSubmitRef.current = now;

      const sanitized = sanitizeAuthInput(formData);
      setState((s) => ({ ...s, phase: "authenticating", error: null, lastAttempt: now }));

      try {
        // ── Validate (Gmail-only + password policy) ──
        const validated = isLogin
          ? loginSchema.parse({ email: sanitized.email, password: sanitized.password })
          : signupSchema.parse(sanitized);

        const emailLower = validated.email.toLowerCase();

        // ── Lockout check (login only) ──
        if (isLogin) {
          const check = await callGuard({ action: "check_login", email: emailLower });
          if (check && check.allowed === false) {
            const mins = Math.ceil((check.lockedSeconds || 0) / 60);
            const msg = `Account locked due to too many failed attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.`;
            setState({ phase: "expected_failure", error: msg, retryCount: 0, lastAttempt: now });
            toast.error(msg);
            return;
          }
        }

        // ── Signup: extra password checks (HIBP + common-pw + policy) ──
        if (!isLogin) {
          const check = evaluatePassword((validated as z.infer<typeof signupSchema>).password);
          if (!check.ok) throw new z.ZodError([{ code: "custom", path: ["password"], message: check.errors[0] }] as any);
          // Best-effort breach check (k-anonymity; Supabase HIBP also enforces server-side).
          const pwned = await isPwned((validated as z.infer<typeof signupSchema>).password);
          if (pwned) {
            throw new z.ZodError([{ code: "custom", path: ["password"], message: "This password has appeared in known data breaches. Please choose another." }] as any);
          }
        }

        // ── Anti-timing delay before hitting the backend ──
        const guardrailDelay = new Promise((r) => setTimeout(r, ANTI_TIMING_DELAY_MS));

        if (isLogin) {
          const [authResult] = await Promise.all([
            supabase.auth.signInWithPassword({
              email: validated.email,
              password: validated.password,
            }),
            guardrailDelay,
          ]);
          const { data, error } = authResult;
          if (error) {
            // Record failure server-side (drives lockout)
            await callGuard({ action: "record_login_failure", email: emailLower });
            throw error;
          }

          // Record success + register device + audit
          await callGuard({
            action: "record_login_success",
            email: emailLower,
            userId: data.user?.id,
            deviceHash: deviceFingerprint(),
          });
        } else {
          const fullValidated = validated as z.infer<typeof signupSchema>;
          const [authResult] = await Promise.all([
            supabase.auth.signUp({
              email: fullValidated.email,
              password: fullValidated.password,
              options: {
                data: { full_name: fullValidated.fullName },
                emailRedirectTo: `${window.location.origin}/dashboard`,
              },
            }),
            guardrailDelay,
          ]);
          const { data, error } = authResult;
          if (error) throw error;

          await callGuard({
            action: "log_event",
            email: emailLower,
            userId: data?.user?.id,
            eventType: "signup",
          });

          // If no session, route to OTP verification (Gmail OTP)
          if (!data?.session) {
            setState({ phase: "idle", error: null, retryCount: 0, lastAttempt: now });
            toast.success("Account created! Enter the 6-digit code we sent you.", { duration: 6000 });
            navigate("/verify-otp?email=" + encodeURIComponent(fullValidated.email), { replace: true });
            return;
          }
        }

        setState({ phase: "success", error: null, retryCount: 0, lastAttempt: now });
        toast.success(isLogin ? "Welcome back!" : "Account created! Welcome aboard 🎉");
        navigate("/dashboard", { replace: true });
      } catch (error: any) {
        console.error("[Auth] Caught error:", error);
        if (error instanceof z.ZodError) {
          const msg = error.errors[0].message;
          setState({ phase: "expected_failure", error: msg, retryCount: 0, lastAttempt: now });
          toast.error(msg);
          return;
        }

        const classification = classifyError(error);
        const friendlyMsg = getUserFriendlyMessage(error, isLogin);

        if (classification === "expected") {
          setState({ phase: "expected_failure", error: friendlyMsg, retryCount: 0, lastAttempt: now });
          toast.error(friendlyMsg);
        } else {
          setState((s) => {
            const nextRetry = s.retryCount + 1;
            if (nextRetry <= MAX_RETRIES) {
              const backoffMs = BASE_BACKOFF_MS * Math.pow(2, nextRetry - 1);
              toast.error(`${friendlyMsg} Retrying in ${Math.round(backoffMs / 1000)}s… (${nextRetry}/${MAX_RETRIES})`);
              retryTimeoutRef.current = setTimeout(() => { authenticate(formData, isLogin); }, backoffMs);
              return { phase: "system_failure", error: friendlyMsg, retryCount: nextRetry, lastAttempt: now };
            }
            toast.error("Unable to connect. Please check your internet and try again later.", { duration: 8000 });
            return { phase: "system_failure", error: "Connection failed after multiple attempts. Please try again later.", retryCount: nextRetry, lastAttempt: now };
          });
        }
      }
    },
    [navigate]
  );

  const forgotPassword = useCallback(async (email: string) => {
    const now = Date.now();
    if (now - lastSubmitRef.current < DEBOUNCE_MS) return;
    lastSubmitRef.current = now;

    const sanitizedEmail = sanitizeAuthInput({ fullName: "", email, password: "" }).email;
    if (!sanitizedEmail) {
      toast.error("Please enter your email address first");
      return;
    }
    if (!GMAIL_REGEX.test(sanitizedEmail.toLowerCase())) {
      toast.error(gmailError());
      return;
    }

    setState((s) => ({ ...s, phase: "authenticating", error: null }));
    try {
      // Always show generic success to prevent enumeration
      const [{ error }] = await Promise.all([
        supabase.auth.resetPasswordForEmail(sanitizedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        }),
        new Promise((r) => setTimeout(r, ANTI_TIMING_DELAY_MS)),
      ]);
      if (error && error.status && error.status >= 500) throw error;
      await callGuard({ action: "log_event", email: sanitizedEmail, eventType: "password_reset_requested" });
      toast.success("If that account exists, a reset link has been sent.", { duration: 6000 });
      setState({ phase: "idle", error: null, retryCount: 0, lastAttempt: now });
    } catch (error: any) {
      const friendlyMsg = getUserFriendlyMessage(error, false);
      setState({ phase: "expected_failure", error: friendlyMsg, retryCount: 0, lastAttempt: now });
      toast.error(friendlyMsg, { duration: 8000 });
    }
  }, []);

  return {
    state,
    authenticate,
    forgotPassword,
    resetToIdle,
    isSubmitting: state.phase === "authenticating",
    isRetrying: state.phase === "system_failure" && state.retryCount > 0 && state.retryCount <= MAX_RETRIES,
  };
}
