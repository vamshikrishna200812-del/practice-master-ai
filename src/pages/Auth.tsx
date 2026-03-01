import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertTriangle, RefreshCw } from "lucide-react";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { useAuthStateMachine } from "@/hooks/useAuthStateMachine";
import authKeyVideo from "@/assets/auth-key.mp4";
import logo from "@/assets/logo.jpeg";

const Auth = () => {
  const { state, authenticate, forgotPassword, resetToIdle, isSubmitting, isRetrying } = useAuthStateMachine();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate(formData, isLogin);
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
