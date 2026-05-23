import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { evaluatePassword } from "@/utils/passwordPolicy";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const result = useMemo(() => evaluatePassword(password), [password]);
  if (!password) return null;

  const color =
    result.score < 30 ? "bg-destructive" :
    result.score < 50 ? "bg-orange-500" :
    result.score < 70 ? "bg-yellow-500" :
    result.score < 90 ? "bg-green-500" : "bg-emerald-600";

  const textColor =
    result.score < 30 ? "text-destructive" :
    result.score < 50 ? "text-orange-600" :
    result.score < 70 ? "text-yellow-600" :
    result.score < 90 ? "text-green-600" : "text-emerald-700";

  const Icon = result.score < 50 ? ShieldAlert : result.score < 90 ? Shield : ShieldCheck;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${textColor}`} />
          <span className="text-sm font-medium">
            Strength: <span className={textColor}>{result.label}</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{result.score}%</span>
      </div>
      <Progress value={result.score} className="h-2" indicatorClassName={color} />
    </div>
  );
};
