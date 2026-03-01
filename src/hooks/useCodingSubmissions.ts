import { supabase } from "@/integrations/supabase/client";
import { POINTS_MAP } from "@/data/codingProblems";

export interface CodingSubmission {
  id: string;
  problem_id: string;
  problem_title: string;
  language: string;
  verdict: string;
  passed_tests: number;
  total_tests: number;
  points_earned: number;
  execution_time_ms: number;
  created_at: string;
}

export const useCodingSubmissions = () => {
  const submitSolution = async (params: {
    problemId: string;
    problemTitle: string;
    difficulty: string;
    language: string;
    code: string;
    passedTests: number;
    totalTests: number;
    executionTimeMs: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const allPassed = params.passedTests === params.totalTests;
    const verdict = allPassed ? "Accepted" : "Wrong Answer";
    const points = allPassed ? (POINTS_MAP[params.difficulty] || 10) : 0;

    // Check if already solved
    const { data: existing } = await supabase
      .from("coding_submissions")
      .select("id, verdict")
      .eq("user_id", user.id)
      .eq("problem_id", params.problemId)
      .eq("verdict", "Accepted")
      .limit(1);

    const alreadySolved = existing && existing.length > 0;

    // Save submission
    const { error } = await supabase.from("coding_submissions").insert({
      user_id: user.id,
      problem_id: params.problemId,
      problem_title: params.problemTitle,
      language: params.language,
      code: params.code,
      verdict,
      passed_tests: params.passedTests,
      total_tests: params.totalTests,
      points_earned: alreadySolved ? 0 : points,
      execution_time_ms: params.executionTimeMs,
    });

    if (error) { console.error("Submission error:", error); return null; }

    // Update points only if newly solved
    if (allPassed && !alreadySolved) {
      await updatePoints(user.id, params.difficulty);
    }

    return { verdict, points: alreadySolved ? 0 : points, alreadySolved };
  };

  const updatePoints = async (userId: string, difficulty: string) => {
    const points = POINTS_MAP[difficulty] || 10;
    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("coding_points")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const lastDate = existing.last_solve_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      let streak = existing.current_streak;
      if (lastDate === today) { /* same day */ }
      else if (lastDate === yesterday) streak += 1;
      else streak = 1;

      await supabase.from("coding_points").update({
        total_points: existing.total_points + points,
        problems_solved: existing.problems_solved + 1,
        easy_solved: existing.easy_solved + (difficulty === "Easy" ? 1 : 0),
        medium_solved: existing.medium_solved + (difficulty === "Medium" ? 1 : 0),
        hard_solved: existing.hard_solved + (difficulty === "Hard" ? 1 : 0),
        current_streak: streak,
        last_solve_date: today,
        updated_at: new Date().toISOString(),
      }).eq("user_id", userId);
    } else {
      await supabase.from("coding_points").insert({
        user_id: userId,
        total_points: points,
        problems_solved: 1,
        easy_solved: difficulty === "Easy" ? 1 : 0,
        medium_solved: difficulty === "Medium" ? 1 : 0,
        hard_solved: difficulty === "Hard" ? 1 : 0,
        current_streak: 1,
        last_solve_date: today,
      });
    }
  };

  const getSubmissions = async (problemId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from("coding_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (problemId) query = query.eq("problem_id", problemId);

    const { data } = await query.limit(50);
    return (data || []) as CodingSubmission[];
  };

  const getSolvedProblems = async (): Promise<Set<string>> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Set();

    const { data } = await supabase
      .from("coding_submissions")
      .select("problem_id")
      .eq("user_id", user.id)
      .eq("verdict", "Accepted");

    return new Set((data || []).map(d => d.problem_id));
  };

  const getLeaderboard = async () => {
    const { data } = await supabase
      .from("coding_points")
      .select("user_id, total_points, problems_solved, easy_solved, medium_solved, hard_solved, current_streak")
      .order("total_points", { ascending: false })
      .limit(50);

    if (!data || data.length === 0) return [];

    // Get profile names
    const userIds = data.map(d => d.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));

    return data.map((entry, i) => ({
      rank: i + 1,
      ...entry,
      full_name: profileMap.get(entry.user_id)?.full_name || "Anonymous",
      avatar_url: profileMap.get(entry.user_id)?.avatar_url || null,
    }));
  };

  return { submitSolution, getSubmissions, getSolvedProblems, getLeaderboard };
};
