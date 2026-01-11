import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementBadge } from "./AchievementBadge";
import { Trophy, Flame, BookOpen, Calendar, Sparkles } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  interviews: Trophy,
  courses: BookOpen,
  streaks: Flame,
  scheduling: Calendar,
  skills: Sparkles,
};

export const AchievementsDisplay = () => {
  const { fetchAllAchievements, fetchUserAchievements } = useAchievements();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [all, user] = await Promise.all([
        fetchAllAchievements(),
        fetchUserAchievements(),
      ]);
      setAllAchievements(all);
      setUserAchievements(user);
      setLoading(false);
    };
    loadData();
  }, [fetchAllAchievements, fetchUserAchievements]);

  const earnedIds = new Set(userAchievements.map((ua) => ua.achievement_id));
  const earnedMap = new Map(
    userAchievements.map((ua) => [ua.achievement_id, ua.earned_at])
  );

  const totalPoints = userAchievements.reduce((sum, ua) => {
    const achievement = allAchievements.find((a) => a.id === ua.achievement_id);
    return sum + (achievement?.points || 0);
  }, 0);

  const categories = [...new Set(allAchievements.map((a) => a.category))];

  const getAchievementsByCategory = (category: string) =>
    allAchievements.filter((a) => a.category === category);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Achievements
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {userAchievements.length} of {allAchievements.length} unlocked
          </p>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {totalPoints} pts
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Trophy;
            return (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                <Icon className="w-4 h-4 mr-1" />
                {cat}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all">
          <motion.div
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {allAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                className="flex flex-col items-center gap-1"
              >
                <AchievementBadge
                  name={achievement.name}
                  description={achievement.description}
                  icon={achievement.icon}
                  category={achievement.category}
                  points={achievement.points}
                  isEarned={earnedIds.has(achievement.id)}
                  earnedAt={earnedMap.get(achievement.id)}
                  size="md"
                />
                <span className="text-[10px] text-muted-foreground text-center truncate max-w-full">
                  {achievement.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getAchievementsByCategory(category).map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`p-4 transition-all ${
                    earnedIds.has(achievement.id)
                      ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AchievementBadge
                      name={achievement.name}
                      description={achievement.description}
                      icon={achievement.icon}
                      category={achievement.category}
                      points={achievement.points}
                      isEarned={earnedIds.has(achievement.id)}
                      earnedAt={earnedMap.get(achievement.id)}
                      size="sm"
                      showTooltip={false}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {achievement.description}
                      </p>
                      {earnedIds.has(achievement.id) && (
                        <p className="text-[10px] text-primary mt-1">
                          +{achievement.points} points
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default AchievementsDisplay;
