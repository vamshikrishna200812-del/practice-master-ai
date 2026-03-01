import { cn } from "@/lib/utils";

interface ResumeStrengthMeterProps {
  score: number;
}

export default function ResumeStrengthMeter({ score }: ResumeStrengthMeterProps) {
  const getColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-400";
  };

  const getLabel = () => {
    if (score >= 80) return "Strong";
    if (score >= 50) return "Good";
    if (score >= 25) return "Needs Work";
    return "Getting Started";
  };

  const getBarColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-400";
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={cn("text-lg font-bold tabular-nums", getColor())}>{score}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </div>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBarColor())}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-medium shrink-0", getColor())}>{getLabel()}</span>
    </div>
  );
}
