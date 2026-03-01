import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { sanitizeAuthInput } from "@/utils/authSanitizer";

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

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

// ── Constants ──

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;
const DEBOUNCE_MS = 600;

// ── Classify Errors ──

function classifyError(error: any): "expected" | "system" {
  const msg = (error?.message || "").toLowerCase();
  const status = error?.status;

  // Expected: user-fixable errors
  if (msg.includes("invalid login credentials")) return "expected";
  if (msg.includes("email not confirmed")) return "expected";
  if (msg.includes("user already registered")) return "expected";
  if (msg.includes("signup disabled")) return "expected";
  if (status === 400 || status === 401 || status === 422) return "expected";

  // System: rate limits, server errors, network issues
  return "system";
}

function getUserFriendlyMessage(error: any): string {
  const msg = (error?.message || "").toLowerCase();
  const status = error?.status;

  if (msg.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please verify your email before signing in.";
  }
  if (msg.includes("user already registered")) {
    return "An account with this email already exists. Try signing in.";
  }
  if (status === 429 || msg.includes("rate limit")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (status >= 500 || msg.includes("timeout") || msg.includes("network")) {
    return "We're experiencing server issues. Retrying automatically…";
  }
  return error?.message || "Authentication failed. Please try again.";
}

// ── Hook ──

export function useAuthStateMachine() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    phase: "idle",
    error: null,
    retryCount: 0,
    lastAttempt: null,
  });

  // Debounce guard
  const lastSubmitRef = useRef<number>(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToIdle = useCallback(() => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    setState({ phase: "idle", error: null, retryCount: 0, lastAttempt: null });
  }, []);

  const authenticate = useCallback(
    async (formData: AuthFormData, isLogin: boolean) => {
      // ── Debounce: prevent double-posts ──
      const now = Date.now();
      if (now - lastSubmitRef.current < DEBOUNCE_MS) return;
      lastSubmitRef.current = now;

      // ── Sanitize inputs ──
      const sanitized = sanitizeAuthInput(formData);

      // ── Transition: Idle → Authenticating ──
      setState((s) => ({
        ...s,
        phase: "authenticating",
        error: null,
        lastAttempt: now,
      }));

      try {
        // ── Validate ──
        const validated = isLogin
          ? loginSchema.parse({ email: sanitized.email, password: sanitized.password })
          : signupSchema.parse(sanitized);

        // ── Call Supabase ──
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email: validated.email,
            password: validated.password,
          });
          if (error) throw error;
        } else {
          const fullValidated = validated as z.infer<typeof signupSchema>;
          const { error } = await supabase.auth.signUp({
            email: fullValidated.email,
            password: fullValidated.password,
            options: {
              data: { full_name: fullValidated.fullName },
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });
          if (error) throw error;
        }

        // ── Transition: Authenticating → Success (atomic redirect) ──
        setState({ phase: "success", error: null, retryCount: 0, lastAttempt: now });
        toast.success(isLogin ? "Welcome back!" : "Account created! Welcome aboard 🎉");

        // Atomic redirect — replace history entry to prevent back-button re-auth
        navigate("/dashboard", { replace: true });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          // Validation errors are always "expected"
          const msg = error.errors[0].message;
          setState({ phase: "expected_failure", error: msg, retryCount: 0, lastAttempt: now });
          toast.error(msg);
          return;
        }

        const classification = classifyError(error);
        const friendlyMsg = getUserFriendlyMessage(error);

        if (classification === "expected") {
          // ── Transition: Authenticating → Expected Failure ──
          setState({ phase: "expected_failure", error: friendlyMsg, retryCount: 0, lastAttempt: now });
          toast.error(friendlyMsg);
        } else {
          // ── Transition: Authenticating → System Failure (with backoff retry) ──
          setState((s) => {
            const nextRetry = s.retryCount + 1;
            if (nextRetry <= MAX_RETRIES) {
              const backoffMs = BASE_BACKOFF_MS * Math.pow(2, nextRetry - 1);
              toast.error(`${friendlyMsg} Retrying in ${Math.round(backoffMs / 1000)}s… (${nextRetry}/${MAX_RETRIES})`);

              retryTimeoutRef.current = setTimeout(() => {
                authenticate(formData, isLogin);
              }, backoffMs);

              return {
                phase: "system_failure",
                error: friendlyMsg,
                retryCount: nextRetry,
                lastAttempt: now,
              };
            }

            // Max retries exhausted
            toast.error("Unable to connect. Please check your internet and try again later.", { duration: 8000 });
            return {
              phase: "system_failure",
              error: "Connection failed after multiple attempts. Please try again later.",
              retryCount: nextRetry,
              lastAttempt: now,
            };
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

    setState((s) => ({ ...s, phase: "authenticating", error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent! Check your email inbox.", { duration: 6000 });
      setState({ phase: "idle", error: null, retryCount: 0, lastAttempt: now });
    } catch (error: any) {
      const friendlyMsg = getUserFriendlyMessage(error);
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
