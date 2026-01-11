import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface CheckAchievementsParams {
  interviewsCompleted?: number;
  highScore?: number;
  perfectScore?: boolean;
  coursesCompleted?: number;
  practiceStreak?: number;
  classesScheduled?: number;
  bodyLanguageScore?: number;
  communicationScore?: number;
}

export const useAchievements = () => {
  const [loading, setLoading] = useState(false);
  const [newlyEarned, setNewlyEarned] = useState<Achievement[]>([]);

  const fetchUserAchievements = useCallback(async (): Promise<UserAchievement[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          id,
          achievement_id,
          earned_at,
          achievements (
            id,
            name,
            description,
            icon,
            category,
            requirement_type,
            requirement_value,
            points
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      return (data || []).map((ua: any) => ({
        id: ua.id,
        achievement_id: ua.achievement_id,
        earned_at: ua.earned_at,
        achievement: ua.achievements,
      }));
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
  }, []);

  const fetchAllAchievements = useCallback(async (): Promise<Achievement[]> => {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("points", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching all achievements:", error);
      return [];
    }
  }, []);

  const checkAndAwardAchievements = useCallback(async (params: CheckAchievementsParams): Promise<Achievement[]> => {
    setLoading(true);
    const earnedAchievements: Achievement[] = [];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch all achievements
      const allAchievements = await fetchAllAchievements();
      const userAchievements = await fetchUserAchievements();
      const earnedIds = new Set(userAchievements.map(ua => ua.achievement_id));

      for (const achievement of allAchievements) {
        // Skip if already earned
        if (earnedIds.has(achievement.id)) continue;

        let shouldAward = false;

        switch (achievement.requirement_type) {
          case "interviews_completed":
            shouldAward = (params.interviewsCompleted || 0) >= achievement.requirement_value;
            break;
          case "high_score":
            shouldAward = (params.highScore || 0) >= achievement.requirement_value;
            break;
          case "perfect_score":
            shouldAward = params.perfectScore === true;
            break;
          case "courses_completed":
            shouldAward = (params.coursesCompleted || 0) >= achievement.requirement_value;
            break;
          case "practice_streak":
            shouldAward = (params.practiceStreak || 0) >= achievement.requirement_value;
            break;
          case "classes_scheduled":
            shouldAward = (params.classesScheduled || 0) >= achievement.requirement_value;
            break;
          case "body_language_score":
            shouldAward = (params.bodyLanguageScore || 0) >= achievement.requirement_value;
            break;
          case "communication_score":
            shouldAward = (params.communicationScore || 0) >= achievement.requirement_value;
            break;
        }

        if (shouldAward) {
          // Award the achievement
          const { error } = await supabase
            .from("user_achievements")
            .insert({
              user_id: user.id,
              achievement_id: achievement.id,
            });

          if (!error) {
            earnedAchievements.push(achievement);
            toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
              description: achievement.description,
              duration: 5000,
            });
          }
        }
      }

      setNewlyEarned(earnedAchievements);
      return earnedAchievements;
    } catch (error) {
      console.error("Error checking achievements:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchAllAchievements, fetchUserAchievements]);

  const clearNewlyEarned = useCallback(() => {
    setNewlyEarned([]);
  }, []);

  return {
    loading,
    newlyEarned,
    fetchUserAchievements,
    fetchAllAchievements,
    checkAndAwardAchievements,
    clearNewlyEarned,
  };
};

export default useAchievements;
