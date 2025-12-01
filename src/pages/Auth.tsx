import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Brain } from "lucide-react";
import { z } from "zod";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const validated = loginSchema.parse(formData);
        const { error } = await supabase.auth.signInWithPassword({
          email: validated.email,
          password: validated.password,
        });

        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const validated = signupSchema.parse(formData);
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { error } = await supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
          options: {
            data: {
              full_name: validated.fullName,
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) throw error;
        toast.success("Account created! Welcome aboard!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-glow)/0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.15),transparent_50%)]" />
      
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AITRAININGZONE</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back! Ready to practice?" : "Start your journey to interview mastery"}
          </p>
        </div>

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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ fullName: "", email: "", password: "" });
            }}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;