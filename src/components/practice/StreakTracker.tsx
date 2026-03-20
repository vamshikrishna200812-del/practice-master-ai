import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Flame, Calendar, Trophy, Zap } from "lucide-react";

interface StreakTrackerProps {
  className?: string;
}

interface DayData {
  date: string;
  count: number;
}

const WEEKS_TO_SHOW = 20;
const DAYS_IN_WEEK = 7;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getIntensityClass = (count: number): string => {
  if (count === 0) return "bg-muted/40";
  if (count === 1) return "bg-emerald-500/30";
  if (count === 2) return "bg-emerald-500/50";
  if (count <= 4) return "bg-emerald-500/70";
  return "bg-emerald-500";
};

const StreakTracker = ({ className }: StreakTrackerProps) => {
  const [activityMap, setActivityMap] = useState<Map<string, number>>(new Map());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalActiveDays, setTotalActiveDays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Fetch submissions from the last ~20 weeks
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - WEEKS_TO_SHOW * 7);

      const { data: submissions } = await supabase
        .from("coding_submissions")
        .select("created_at, verdict")
        .eq("user_id", user.id)
        .eq("verdict", "Accepted")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      const map = new Map<string, number>();
      (submissions || []).forEach((s) => {
        const day = s.created_at.slice(0, 10);
        map.set(day, (map.get(day) || 0) + 1);
      });
      setActivityMap(map);
      setTotalActiveDays(map.size);

      // Calculate streaks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let streak = 0;
      let d = new Date(today);
      // Check if today or yesterday has activity to start streak
      const todayStr = d.toISOString().slice(0, 10);
      if (!map.has(todayStr)) {
        d.setDate(d.getDate() - 1);
      }
      while (map.has(d.toISOString().slice(0, 10))) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
      setCurrentStreak(streak);

      // Longest streak
      let longest = 0;
      let cur = 0;
      const allDays = Array.from(map.keys()).sort();
      for (let i = 0; i < allDays.length; i++) {
        if (i === 0) { cur = 1; } else {
          const prev = new Date(allDays[i - 1]);
          const curr = new Date(allDays[i]);
          const diff = (curr.getTime() - prev.getTime()) / 86400000;
          cur = diff === 1 ? cur + 1 : 1;
        }
        longest = Math.max(longest, cur);
      }
      setLongestStreak(longest);

      // Fetch stored streak from coding_points
      const { data: points } = await supabase
        .from("coding_points")
        .select("current_streak")
        .eq("user_id", user.id)
        .maybeSingle();
      if (points && points.current_streak > streak) {
        setCurrentStreak(points.current_streak);
      }

      setLoading(false);
    };

    fetchActivity();
  }, []);

  // Build grid: each column is a week, rows are days (Sun=0..Sat=6)
  const grid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay(); // 0=Sun
    // End of grid is today
    // Start of grid: go back enough to fill WEEKS_TO_SHOW columns
    const totalDays = WEEKS_TO_SHOW * 7 + dayOfWeek;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dow = d.getDay();

      if (dow === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
      });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return weeks;
  }, [activityMap]);

  // Month labels for the top
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ label: MONTH_LABELS[month], col: wi });
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [grid]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="h-32 animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Activity Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <Flame className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-lg font-bold leading-none">{currentStreak}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Current Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-lg font-bold leading-none">{longestStreak}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Best Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-lg font-bold leading-none">{totalActiveDays}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Active Days</p>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="overflow-x-auto">
            <TooltipProvider delayDuration={100}>
              <div className="inline-flex flex-col gap-0.5 min-w-fit">
                {/* Month labels */}
                <div className="flex ml-8 mb-1">
                  {monthLabels.map((m, i) => (
                    <span
                      key={i}
                      className="text-[9px] text-muted-foreground"
                      style={{
                        position: "relative",
                        left: `${m.col * 14}px`,
                        marginRight: i < monthLabels.length - 1
                          ? `${((monthLabels[i + 1]?.col || 0) - m.col) * 14 - 24}px`
                          : 0,
                      }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                {/* Grid rows */}
                {Array.from({ length: DAYS_IN_WEEK }).map((_, dayIdx) => (
                  <div key={dayIdx} className="flex items-center gap-0.5">
                    <span className="text-[9px] text-muted-foreground w-7 text-right pr-1 shrink-0">
                      {DAY_LABELS[dayIdx]}
                    </span>
                    {grid.map((week, wi) => {
                      const cell = week[dayIdx];
                      if (!cell) {
                        return <div key={wi} className="w-[12px] h-[12px]" />;
                      }
                      const dateObj = new Date(cell.date);
                      const label = `${dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}: ${cell.count} solve${cell.count !== 1 ? "s" : ""}`;

                      return (
                        <Tooltip key={wi}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-[12px] h-[12px] rounded-[2px] transition-colors ${getIntensityClass(cell.count)} hover:ring-1 hover:ring-foreground/30`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {label}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-[9px] text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 5].map((n) => (
              <div
                key={n}
                className={`w-[10px] h-[10px] rounded-[2px] ${getIntensityClass(n)}`}
              />
            ))}
            <span className="text-[9px] text-muted-foreground">More</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StreakTracker;
