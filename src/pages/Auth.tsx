import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertTriangle, RefreshCw } from "lucide-react";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { useAuthStateMachine } from "@/hooks/useAuthStateMachine";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import authKeyVideo from "@/assets/auth-key.mp4";
import logo from "@/assets/logo.jpeg";

const Auth = () => {
  const { state, authenticate, forgotPassword, resetToIdle, isSubmitting, isRetrying } = useAuthStateMachine();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate(formData, isLogin);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast.error("Google sign-in failed. Please try again.");
        console.error("Google OAuth error:", error);
      }
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.");
      console.error("Google OAuth error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullName: "", email: "", password: "" });
    resetToIdle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-glow)/0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.15),transparent_50%)]" />

      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={authKeyVideo} type="video/mp4" />
            </video>
          </div>
          <img src={logo} alt="AITRAININGZONE" className="w-16 h-16 rounded-xl object-cover mx-auto mb-3" />
          <h1 className="text-3xl font-bold mb-2">AITRAININGZONE</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back! Ready to practice?" : "Start your journey to interview mastery"}
          </p>
        </div>

        {/* System failure banner with retry indicator */}
        {state.phase === "system_failure" && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">{state.error}</p>
              {isRetrying && (
                <p className="text-muted-foreground mt-1 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Retrying… ({state.retryCount}/3)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Expected failure inline error */}
        {state.phase === "expected_failure" && state.error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required={!isLogin}
                maxLength={100}
                disabled={isSubmitting || isRetrying}
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              maxLength={255}
              disabled={isSubmitting || isRetrying}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                maxLength={100}
                disabled={isSubmitting || isRetrying}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isLogin && formData.password && (
              <>
                <div className="mt-3">
                  <PasswordStrengthMeter password={formData.password} />
                </div>
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Password requirements:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <p className={`transition-colors ${formData.password.length >= 8 ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                      {formData.password.length >= 8 ? "✓" : "○"} At least 8 characters
                    </p>
                    <p className={`transition-colors ${/[A-Z]/.test(formData.password) ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                      {/[A-Z]/.test(formData.password) ? "✓" : "○"} One uppercase letter
                    </p>
                    <p className={`transition-colors ${/[a-z]/.test(formData.password) ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                      {/[a-z]/.test(formData.password) ? "✓" : "○"} One lowercase letter
                    </p>
                    <p className={`transition-colors ${/[0-9]/.test(formData.password) ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                      {/[0-9]/.test(formData.password) ? "✓" : "○"} One number
                    </p>
                    <p className={`transition-colors ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                      {/[^A-Za-z0-9]/.test(formData.password) ? "✓" : "○"} One special character
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isRetrying || state.phase === "success"}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                {isRetrying ? "Retrying…" : "Please wait…"}
              </span>
            ) : state.phase === "success" ? (
              "Redirecting…"
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isRetrying || googleLoading}
        >
          {googleLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </Button>

        {isLogin && (
          <div className="mt-3 text-center">
            <button
              onClick={() => forgotPassword(formData.email)}
              disabled={isSubmitting || isRetrying}
              className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors disabled:opacity-50"
            >
              Forgot your password?
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={handleToggleMode}
            disabled={isSubmitting || isRetrying}
            className="text-sm text-primary hover:underline disabled:opacity-50"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
