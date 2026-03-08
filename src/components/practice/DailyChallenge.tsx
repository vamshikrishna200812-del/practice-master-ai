import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Zap, ChevronRight } from "lucide-react";
import { CodingProblem, POINTS_MAP } from "@/data/codingProblems";
import { motion } from "framer-motion";

interface DailyChallengeProps {
  problems: CodingProblem[];
  solvedSet: Set<string>;
  onSelect: (slug: string) => void;
}

/** Deterministic daily seed from date string */
const dayHash = (dateStr: string) => {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) {
    h = (h * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const diffColor: Record<string, string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
};

const DailyChallenge = ({ problems, solvedSet, onSelect }: DailyChallengeProps) => {
  const today = new Date().toISOString().split("T")[0];

  const dailyProblem = useMemo(() => {
    // Prefer unsolved, fallback to any
    const unsolved = problems.filter((p) => !solvedSet.has(p.id));
    const pool = unsolved.length > 0 ? unsolved : problems;
    if (pool.length === 0) return null;
    const idx = dayHash(today) % pool.length;
    return pool[idx];
  }, [problems, solvedSet, today]);

  if (!dailyProblem) return null;

  const basePoints = POINTS_MAP[dailyProblem.difficulty] || 10;
  const bonusPoints = basePoints * 2;
  const isSolved = solvedSet.has(dailyProblem.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4 md:p-5 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Daily Challenge
              </span>
              <Badge variant="outline" className="text-[10px] gap-1 border-primary/40 text-primary">
                <Zap className="w-3 h-3" /> 2× Points
              </Badge>
            </div>
            <h3 className="font-bold text-foreground mt-0.5">{dailyProblem.title}</h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <span className={diffColor[dailyProblem.difficulty]}>{dailyProblem.difficulty}</span>
              <span>•</span>
              <span>{dailyProblem.category}</span>
              <span>•</span>
              <span className="text-primary font-medium">+{bonusPoints} pts</span>
            </div>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => onSelect(dailyProblem.slug)}
          className="gap-2 shrink-0"
          variant={isSolved ? "secondary" : "default"}
        >
          {isSolved ? "Completed ✓" : "Solve Now"}
          {!isSolved && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
