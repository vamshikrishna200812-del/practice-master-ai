import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { codingProblems, allCategories } from "@/data/codingProblems";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import { CheckCircle, Circle, TrendingUp } from "lucide-react";

interface ProgressDashboardProps {
  solvedSet: Set<string>;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(142 71% 45%)",
  "hsl(38 92% 50%)",
  "hsl(0 84% 60%)",
  "hsl(262 83% 58%)",
  "hsl(199 89% 48%)",
  "hsl(330 81% 60%)",
  "hsl(168 76% 42%)",
  "hsl(25 95% 53%)",
  "hsl(221 83% 53%)",
];

const ProgressDashboard = ({ solvedSet }: ProgressDashboardProps) => {
  const diffStats = useMemo(() => {
    const difficulties = ["Easy", "Medium", "Hard"] as const;
    return difficulties.map((d) => {
      const total = codingProblems.filter((p) => p.difficulty === d).length;
      const solved = codingProblems.filter((p) => p.difficulty === d && solvedSet.has(p.id)).length;
      return { difficulty: d, total, solved, unsolved: total - solved };
    });
  }, [solvedSet]);

  const categoryStats = useMemo(() => {
    return allCategories.map((cat) => {
      const total = codingProblems.filter((p) => p.category === cat).length;
      const solved = codingProblems.filter((p) => p.category === cat && solvedSet.has(p.id)).length;
      const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
      return { category: cat, total, solved, pct };
    });
  }, [solvedSet]);

  const chartData = useMemo(
    () =>
      categoryStats.map((s) => ({
        name: s.category.length > 12 ? s.category.slice(0, 11) + "…" : s.category,
        fullName: s.category,
        solved: s.solved,
        total: s.total,
        pct: s.pct,
      })),
    [categoryStats]
  );

  const overallPct = codingProblems.length > 0
    ? Math.round((solvedSet.size / codingProblems.length) * 100)
    : 0;

  const diffColors: Record<string, string> = {
    Easy: "hsl(142 71% 45%)",
    Medium: "hsl(38 92% 50%)",
    Hard: "hsl(0 84% 60%)",
  };

  const diffBg: Record<string, string> = {
    Easy: "bg-emerald-500/15 border-emerald-500/30",
    Medium: "bg-amber-500/15 border-amber-500/30",
    Hard: "bg-red-500/15 border-red-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Difficulty Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {diffStats.map((d) => (
          <Card key={d.difficulty} className={`border ${diffBg[d.difficulty]}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm" style={{ color: diffColors[d.difficulty] }}>
                  {d.difficulty}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {d.solved}/{d.total}
                </Badge>
              </div>
              <Progress
                value={d.total > 0 ? (d.solved / d.total) * 100 : 0}
                className="h-2"
                indicatorClassName={
                  d.difficulty === "Easy"
                    ? "bg-emerald-500"
                    : d.difficulty === "Medium"
                    ? "bg-amber-500"
                    : "bg-red-500"
                }
              />
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Circle className="w-3 h-3" />
                <span>{d.unsolved} unsolved</span>
                <CheckCircle className="w-3 h-3 ml-auto text-emerald-500" />
                <span>{d.solved} done</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Progress Chart + List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Category Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold">{d.fullName}</p>
                          <p className="text-muted-foreground">{d.solved}/{d.total} solved ({d.pct}%)</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-1">
              <span className="text-xs text-muted-foreground">
                Overall: {solvedSet.size}/{codingProblems.length} ({overallPct}%)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Category List */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Per-Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
            {categoryStats.map((s, i) => (
              <div key={s.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium truncate max-w-[60%]">{s.category}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {s.solved}/{s.total} ({s.pct}%)
                  </span>
                </div>
                <Progress
                  value={s.pct}
                  className="h-1.5"
                  indicatorClassName="transition-all duration-500"
                  style={{
                    ["--progress-color" as string]: COLORS[i % COLORS.length],
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProgressDashboard;
