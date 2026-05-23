import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { maskEmail } from "@/utils/gmailOnly";
import { toast } from "sonner";
import logo from "@/assets/logo.jpeg";
import { BackgroundPaths } from "@/components/ui/background-paths";

const RESEND_COOLDOWN_SEC = 60;
const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 15;

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [resendIn, setResendIn] = useState(RESEND_COOLDOWN_SEC);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  // Lockout countdown
  const lockedSecs = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)) : 0;
  useEffect(() => {
    if (!lockedUntil) return;
    const t = setInterval(() => {
      if (Date.now() >= lockedUntil) setLockedUntil(null);
    }, 1000);
    return () => clearInterval(t);
  }, [lockedUntil]);

  const setDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    const focusIdx = Math.min(text.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (digits.every((d) => d.length === 1) && !submitting && !success && !lockedUntil) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  const submit = async () => {
    if (!email) {
      toast.error("Missing email — please sign up again");
      navigate("/auth", { replace: true });
      return;
    }
    setSubmitting(true);
    setError(null);
    const token = digits.join("");
    try {
      const { error: vErr } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      if (vErr) throw vErr;

      // Log the success (best-effort, non-blocking)
      try {
        await supabase.functions.invoke("auth-guard", {
          body: { action: "log_event", email, eventType: "otp_verified" },
        });
      } catch { /* non-blocking */ }

      setSuccess(true);
      toast.success("Email verified!");
      setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
    } catch (e: any) {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      if (remaining <= 0) {
        setLockedUntil(Date.now() + LOCK_MINUTES * 60 * 1000);
        setError(`Too many failed attempts. Try again in ${LOCK_MINUTES} minutes.`);
      } else {
        setError(`Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} left.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (resendIn > 0 || !email) return;
    try {
      const { error: rErr } = await supabase.auth.resend({ type: "signup", email });
      if (rErr) throw rErr;
      try {
        await supabase.functions.invoke("auth-guard", {
          body: { action: "log_event", email, eventType: "otp_resent" },
        });
      } catch { /* non-blocking */ }
      toast.success("Verification code resent. Check your inbox.");
      setResendIn(RESEND_COOLDOWN_SEC);
      setAttemptsLeft(MAX_ATTEMPTS);
      setError(null);
    } catch (e: any) {
      toast.error(e?.message || "Couldn't resend code");
    }
  };

  const disabled = submitting || success || !!lockedUntil;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <BackgroundPaths />
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl relative z-10 border-black/10">
        <div className="text-center mb-6">
          <img src={logo} alt="AITRAININGZONE" className="w-14 h-14 rounded-xl object-cover mx-auto mb-3" />
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-black/5 flex items-center justify-center">
            {success ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 animate-scale-in" />
            ) : (
              <Mail className="w-6 h-6 text-black" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-black mb-1">
            {success ? "Verified!" : "Verify your email"}
          </h1>
          <p className="text-sm text-black/60">
            {success ? (
              "Redirecting to your dashboard…"
            ) : (
              <>We sent a 6-digit code to <span className="font-medium text-black">{maskEmail(email)}</span></>
            )}
          </p>
        </div>

        {!success && (
          <>
            <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <Input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete="off"
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={disabled}
                  className="w-12 h-14 text-center text-xl font-semibold text-black bg-white border-black/20 focus-visible:ring-black/30"
                />
              ))}
            </div>

            {lockedUntil && (
              <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">
                  Locked. Try again in {Math.floor(lockedSecs / 60)}:{String(lockedSecs % 60).padStart(2, "0")}
                </p>
              </div>
            )}

            {error && !lockedUntil && (
              <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button onClick={submit} disabled={disabled || digits.some((d) => !d)} className="w-full bg-black text-white hover:bg-black/90">
              {submitting ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Verifying…</> : "Verify"}
            </Button>

            <div className="mt-4 text-center text-sm">
              {resendIn > 0 ? (
                <span className="text-black/50">Resend available in {resendIn}s</span>
              ) : (
                <button onClick={resend} className="text-black font-medium hover:underline" disabled={!!lockedUntil}>
                  Resend code
                </button>
              )}
            </div>

            <div className="mt-3 text-center">
              <button
                onClick={() => navigate("/auth", { replace: true })}
                className="text-xs text-black/50 hover:text-black hover:underline"
              >
                Use a different email
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyOTP;
