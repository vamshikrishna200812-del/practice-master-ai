import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const calculatePasswordStrength = (password: string): StrengthResult => {
  if (!password) {
    return { score: 0, label: "No password", color: "bg-muted", icon: <Shield className="w-4 h-4" /> };
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lengthBonus: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    noSequence: !/(.)\1{2,}/.test(password), // No repeating chars
    variety: new Set(password).size / password.length > 0.6, // Character variety
  };

  // Base scoring
  if (checks.length) score += 20;
  if (checks.lengthBonus) score += 15;
  if (checks.uppercase) score += 15;
  if (checks.lowercase) score += 15;
  if (checks.numbers) score += 15;
  if (checks.special) score += 15;
  if (checks.noSequence) score += 5;
  if (checks.variety) score += 10;

  // Entropy calculation bonus
  const charsetSize = 
    (checks.lowercase ? 26 : 0) +
    (checks.uppercase ? 26 : 0) +
    (checks.numbers ? 10 : 0) +
    (checks.special ? 32 : 0);
  
  const entropy = password.length * Math.log2(charsetSize);
  if (entropy > 60) score = Math.min(100, score + 10);

  // Determine strength level
  if (score < 40) {
    return { 
      score, 
      label: "Weak", 
      color: "bg-destructive",
      icon: <ShieldAlert className="w-4 h-4 text-destructive" />
    };
  } else if (score < 70) {
    return { 
      score, 
      label: "Medium", 
      color: "bg-yellow-500",
      icon: <Shield className="w-4 h-4 text-yellow-500" />
    };
  } else {
    return { 
      score, 
      label: "Strong", 
      color: "bg-green-500",
      icon: <ShieldCheck className="w-4 h-4 text-green-500" />
    };
  }
};

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {strength.icon}
          <span className="text-sm font-medium">
            Password Strength: <span className={strength.score < 40 ? "text-destructive" : strength.score < 70 ? "text-yellow-600" : "text-green-600"}>{strength.label}</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{strength.score}%</span>
      </div>
      
      <Progress 
        value={strength.score} 
        className="h-2"
        indicatorClassName={strength.color}
      />
    </div>
  );
};
