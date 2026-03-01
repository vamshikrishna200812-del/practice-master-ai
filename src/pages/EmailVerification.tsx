import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, MailCheck, ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import authKeyVideo from "@/assets/auth-key.mp4";

const RESEND_COOLDOWN = 30;

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // Listen for auth state changes — user clicked the link in the email
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        toast.success("Email verified! Welcome aboard 🎉");
        navigate("/dashboard");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        email,
        type: "signup",
      });
      if (error) throw error;
      toast.success("New verification email sent! Check your inbox.");
      setResendTimer(RESEND_COOLDOWN);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend email");
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src={authKeyVideo} type="video/mp4" />
              </video>
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <MailCheck className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              We've sent a verification link to{" "}
              <span className="font-semibold text-foreground">{email || "your inbox"}</span>.
              Click the link in the email to activate your training zone.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-8">
            {[
              { step: "1", text: "Open your email inbox" },
              { step: "2", text: "Find the email from AITRAININGZONE" },
              { step: "3", text: "Click the verification link" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/50">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {step}
                </span>
                <span className="text-sm text-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Open email button */}
          <Button
            className="w-full mb-4"
            size="lg"
            onClick={() => {
              const domain = email.split("@")[1];
              const mailUrls: Record<string, string> = {
                "gmail.com": "https://mail.google.com",
                "yahoo.com": "https://mail.yahoo.com",
                "outlook.com": "https://outlook.live.com",
                "hotmail.com": "https://outlook.live.com",
              };
              window.open(mailUrls[domain] || `https://mail.${domain}`, "_blank");
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Open Email App
          </Button>

          {/* Resend */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground mb-2">Didn't receive the email? Check your spam folder, or</p>
            {resendTimer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend in{" "}
                <span className="font-mono font-semibold text-foreground">
                  {formatTimer(resendTimer)}
                </span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-primary hover:underline font-medium disabled:opacity-50 inline-flex items-center gap-1"
              >
                {resending ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Resend verification email"
                )}
              </button>
            )}
          </div>

          {/* Back */}
          <div className="text-center">
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to sign up
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
