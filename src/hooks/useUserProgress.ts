import { supabase } from "@/integrations/supabase/client";

interface UpdateProgressParams {
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  interviewType: "behavioral" | "technical" | "coding";
}

interface ProgressResult {
  totalInterviews: number;
  practiceStreak: number;
  overallScore: number;
  bodyLanguageScore: number;
  communicationScore: number;
}

export const useUserProgress = () => {
  const updateProgress = async (params: UpdateProgressParams): Promise<ProgressResult | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.functions.invoke("secure-writes", {
        body: {
          action: "update_progress",
          payload: {
            interviewType: params.interviewType,
            communicationScore: params.communicationScore,
            confidenceScore: params.confidenceScore,
            technicalScore: params.technicalScore,
          },
        },
      });
      if (error) { console.error("updateProgress error:", error); return null; }
      return data as ProgressResult;
    } catch (error) {
      console.error("Error in updateProgress:", error);
      return null;
    }
  };

  return { updateProgress };
};
