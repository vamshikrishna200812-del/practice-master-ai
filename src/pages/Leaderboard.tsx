import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Flame, Code } from "lucide-react";
import { useCodingSubmissions } from "@/hooks/useCodingSubmissions";
import { motion } from "framer-motion";
import { getTier, getTierProgress } from "@/utils/levelTiers";
import { Progress } from "@/components/ui/progress";

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  total_points: number;
  problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  current_streak: number;
}

const rankStyles: Record<number, string> = {
  1: "bg-amber-500/20 border-amber-500/40",
  2: "bg-slate-400/20 border-slate-400/40",
  3: "bg-orange-600/20 border-orange-600/40",
};

const rankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
};

const TierBadge = ({ points }: { points: number }) => {
  const tier = getTier(points);
  const TierIcon = tier.icon;
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${tier.bgClass} ${tier.borderClass} border`}>
      <TierIcon className={`w-3 h-3 ${tier.textClass}`} />
      <span className={tier.textClass}>{tier.name}</span>
    </div>
  );
};

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { getLeaderboard } = useCodingSubmissions();

  useEffect(() => {
    getLeaderboard().then((data) => {
      setEntries(data as LeaderboardEntry[]);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-hero text-white rounded-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8" /> Hall of Fame
          </h1>
          <p className="text-white/80">Top coders ranked by points. Climb from Bronze to Platinum!</p>
        </div>

        {/* Tier Legend */}
        <div className="flex flex-wrap gap-3">
          {["Bronze", "Silver", "Gold", "Platinum"].map((name) => {
            const tier = getTier(name === "Bronze" ? 0 : name === "Silver" ? 101 : name === "Gold" ? 301 : 601);
            const TIcon = tier.icon;
            return (
              <div key={name} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${tier.bgClass} ${tier.borderClass}`}>
                <TIcon className={`w-4 h-4 ${tier.textClass}`} />
                <span className={`text-xs font-medium ${tier.textClass}`}>{name}</span>
                <span className="text-[10px] text-muted-foreground">{tier.minPoints}+ pts</span>
              </div>
            );
          })}
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading leaderboard...</div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Code className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No entries yet. Solve problems to appear on the leaderboard!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium text-muted-foreground bg-muted/30">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">User</div>
                <div className="col-span-2 text-center">Level</div>
                <div className="col-span-2 text-center">Points</div>
                <div className="col-span-2 text-center hidden sm:block">Solved</div>
                <div className="col-span-2 text-center hidden sm:block">Streak</div>
              </div>

              {entries.map((entry, i) => {
                const tier = getTier(entry.total_points);
                const progress = getTierProgress(entry.total_points);
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${rankStyles[entry.rank] || ""}`}
                  >
                    <div className="col-span-1 flex items-center">{rankIcon(entry.rank)}</div>
                    <div className="col-span-3 flex items-center gap-2 min-w-0">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {entry.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate text-sm">{entry.full_name}</span>
                    </div>
                    <div className="col-span-2 flex flex-col items-center gap-1">
                      <TierBadge points={entry.total_points} />
                      <Progress value={progress} className="h-1 w-16" />
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-bold text-primary">{entry.total_points}</span>
                    </div>
                    <div className="col-span-2 text-center hidden sm:flex items-center justify-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">{entry.easy_solved}E</Badge>
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">{entry.medium_solved}M</Badge>
                      <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">{entry.hard_solved}H</Badge>
                    </div>
                    <div className="col-span-2 text-center hidden sm:flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-sm">{entry.current_streak}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
