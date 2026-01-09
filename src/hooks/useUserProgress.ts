import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type InterviewType = Database["public"]["Enums"]["interview_type"];

interface UpdateProgressParams {
  communicationScore: number;
  confidenceScore: number; // Used as body language score
  technicalScore: number;  // Used as coding score
  interviewType: "behavioral" | "technical" | "coding";
}

export const useUserProgress = () => {
  const updateProgress = async (params: UpdateProgressParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user logged in, skipping progress update");
        return;
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Calculate overall score using the formula:
      // (0.3 × Communication) + (0.3 × Body Language) + (0.4 × Technical/Coding)
      const sessionOverallScore = Math.round(
        (0.3 * params.communicationScore) +
        (0.3 * params.confidenceScore) +
        (0.4 * params.technicalScore)
      );

      // Save individual interview session for historical tracking
      const { error: sessionError } = await supabase
        .from("interview_sessions")
        .insert({
          user_id: user.id,
          interview_type: params.interviewType as InterviewType,
          status: "completed" as const,
          communication_score: params.communicationScore,
          coding_score: params.technicalScore,
          body_language_score: params.confidenceScore,
          overall_score: sessionOverallScore,
          completed_at: now.toISOString(),
        });

      if (sessionError) {
        console.error("Error saving interview session:", sessionError);
      } else {
        console.log("Interview session saved for historical tracking");
      }

      // Fetch current progress
      const { data: existingProgress, error: fetchError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching progress:", fetchError);
        return;
      }
      
      // Calculate new average scores (weighted with existing)
      const currentInterviews = existingProgress?.total_interviews || 0;
      const newInterviewCount = currentInterviews + 1;
      
      // Calculate weighted average for each score
      const calculateNewAverage = (current: number, newScore: number) => {
        if (currentInterviews === 0) return newScore;
        return Math.round(((current * currentInterviews) + newScore) / newInterviewCount);
      };

      const newCommunicationScore = calculateNewAverage(
        existingProgress?.communication_score || 0,
        params.communicationScore
      );
      
      const newBodyLanguageScore = calculateNewAverage(
        existingProgress?.body_language_score || 0,
        params.confidenceScore // Confidence score maps to body language
      );
      
      const newCodingScore = calculateNewAverage(
        existingProgress?.coding_score || 0,
        params.technicalScore // Technical score maps to coding
      );

      // Calculate overall score using the formula
      const overallScore = Math.round(
        (0.3 * newCommunicationScore) +
        (0.3 * newBodyLanguageScore) +
        (0.4 * newCodingScore)
      );

      // Calculate practice streak
      let newStreak = 1;
      if (existingProgress?.last_practice_date) {
        const lastPractice = new Date(existingProgress.last_practice_date);
        const lastPracticeDate = lastPractice.toISOString().split('T')[0];
        
        // Calculate days difference
        const daysDiff = Math.floor(
          (now.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (lastPracticeDate === today) {
          // Same day, keep current streak
          newStreak = existingProgress.practice_streak || 1;
        } else if (daysDiff === 1) {
          // Consecutive day, increment streak
          newStreak = (existingProgress.practice_streak || 0) + 1;
        } else {
          // Streak broken, reset to 1
          newStreak = 1;
        }
      }

      const updateData = {
        communication_score: newCommunicationScore,
        body_language_score: newBodyLanguageScore,
        coding_score: newCodingScore,
        overall_score: overallScore,
        total_interviews: newInterviewCount,
        practice_streak: newStreak,
        last_practice_date: today,
        updated_at: now.toISOString(),
      };

      if (existingProgress) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("user_progress")
          .update(updateData)
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Error updating progress:", updateError);
          return;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("user_progress")
          .insert({
            user_id: user.id,
            ...updateData,
          });

        if (insertError) {
          console.error("Error inserting progress:", insertError);
          return;
        }
      }

      console.log("Progress updated successfully:", updateData);
    } catch (error) {
      console.error("Error in updateProgress:", error);
    }
  };

  return { updateProgress };
};

