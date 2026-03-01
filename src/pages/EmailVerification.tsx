import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, MailCheck, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import authKeyVideo from "@/assets/auth-key.mp4";

const RESEND_COOLDOWN = 30;

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleVerify = useCallback(async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setError("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (verifyError) throw verifyError;

      setVerified(true);
      toast.success("Email verified! Welcome aboard 🎉");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Invalid code, please try again");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setOtp("");
    } finally {
      setLoading(false);
    }
  }, [otp, email, navigate]);

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        email,
        type: "signup",
      });
      if (error) throw error;
      toast.success("New code sent! Check your inbox.");
      setResendTimer(RESEND_COOLDOWN);
      setError("");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-glow)/0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.15),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-2xl">
          <AnimatePresence mode="wait">
            {verified ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Verified!</h2>
                <p className="text-muted-foreground text-sm">
                  Redirecting you to your dashboard…
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={authKeyVideo} type="video/mp4" />
                    </video>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MailCheck className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">
                      Verify your email
                    </h2>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-foreground">
                      {email || "your inbox"}
                    </span>
                    . Enter it below to activate your training zone.
                  </p>
                </div>

                {/* OTP Input */}
                <motion.div
                  animate={shake ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-6"
                >
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => {
                      setOtp(val);
                      setError("");
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-14 text-lg font-mono font-bold border-input" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-lg font-mono font-bold border-input" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-lg font-mono font-bold border-input" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="w-12 h-14 text-lg font-mono font-bold border-input" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-lg font-mono font-bold border-input" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-lg font-mono font-bold border-input" />
                    </InputOTPGroup>
                  </InputOTP>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-destructive text-sm text-center mb-4 font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Verify button */}
                <Button
                  className="w-full mb-4"
                  size="lg"
                  disabled={otp.length < 6 || loading}
                  onClick={handleVerify}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Verify Account"
                  )}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend code in{" "}
                      <span className="font-mono font-semibold text-foreground">
                        {formatTimer(resendTimer)}
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={resending}
                      className="text-sm text-primary hover:underline font-medium disabled:opacity-50"
                    >
                      {resending ? "Sending…" : "Resend Code"}
                    </button>
                  )}
                </div>

                {/* Back to sign up */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to sign up
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
