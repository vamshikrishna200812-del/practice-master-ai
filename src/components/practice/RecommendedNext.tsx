import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { codingProblems, allCategories, POINTS_MAP } from "@/data/codingProblems";
import { motion } from "framer-motion";
import { Lightbulb, ChevronRight, TrendingDown } from "lucide-react";

interface RecommendedNextProps {
  solvedSet: Set<string>;
  onSelect: (slug: string) => void;
}

const diffColor: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

const RecommendedNext = ({ solvedSet, onSelect }: RecommendedNextProps) => {
  const recommendations = useMemo(() => {
    // Calculate completion % per category
    const categoryStats = allCategories.map((cat) => {
      const problems = codingProblems.filter((p) => p.category === cat);
      const solved = problems.filter((p) => solvedSet.has(p.id)).length;
      const total = problems.length;
      const pct = total > 0 ? solved / total : 1;
      const unsolved = problems.filter((p) => !solvedSet.has(p.id));
      return { category: cat, pct, total, solved, unsolved };
    });

    // Sort by lowest completion (weakest first), exclude 100% done
    const weakest = categoryStats
      .filter((s) => s.unsolved.length > 0)
      .sort((a, b) => a.pct - b.pct);

    // Pick up to 5 problems from the top 3 weakest categories
    const picks: typeof codingProblems = [];
    const seenIds = new Set<string>();

    for (const cat of weakest.slice(0, 3)) {
      // Prioritize Easy → Medium → Hard within weak categories
      const sorted = [...cat.unsolved].sort((a, b) => {
        const order = { Easy: 0, Medium: 1, Hard: 2 };
        return (order[a.difficulty] ?? 1) - (order[b.difficulty] ?? 1);
      });
      for (const p of sorted) {
        if (picks.length >= 5) break;
        if (!seenIds.has(p.id)) {
          picks.push(p);
          seenIds.add(p.id);
        }
      }
    }

    return { picks, weakest: weakest.slice(0, 3) };
  }, [solvedSet]);

  if (recommendations.picks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Recommended Next
            <Badge variant="outline" className="ml-auto text-[10px] font-normal">
              Based on weakest areas
            </Badge>
          </CardTitle>
          {recommendations.weakest.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-1">
              {recommendations.weakest.map((w) => (
                <span
                  key={w.category}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground"
                >
                  <TrendingDown className="w-3 h-3 text-destructive" />
                  {w.category}
                  <span className="font-mono">
                    ({w.solved}/{w.total})
                  </span>
                </span>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {recommendations.picks.map((problem, i) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-between h-auto py-2.5 px-3 group"
                  onClick={() => onSelect(problem.slug)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {problem.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {problem.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground">
                      +{POINTS_MAP[problem.difficulty] || 10}pts
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${diffColor[problem.difficulty]}`}
                    >
                      {problem.difficulty}
                    </Badge>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendedNext;
