import { supabase } from "@/integrations/supabase/client";
import { codingProblems } from "@/data/codingProblems";

/** Deterministic daily hash – must match DailyChallenge component */
const dayHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const getDailyProblemId = (solvedIds: Set<string>): string | null => {
  const unsolved = codingProblems.filter((p) => !solvedIds.has(p.id));
  const pool = unsolved.length > 0 ? unsolved : codingProblems;
  if (pool.length === 0) return null;
  const today = new Date().toISOString().split("T")[0];
  return pool[dayHash(today) % pool.length].id;
};

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

    const solvedSoFar = await getSolvedProblems();
    const dailyId = getDailyProblemId(solvedSoFar);
    const isDailyChallenge = params.problemId === dailyId;

    const { data, error } = await supabase.functions.invoke("secure-writes", {
      body: {
        action: "submit_coding",
        payload: {
          problemId: params.problemId,
          problemTitle: params.problemTitle,
          difficulty: params.difficulty,
          language: params.language,
          code: params.code,
          passedTests: params.passedTests,
          totalTests: params.totalTests,
          executionTimeMs: params.executionTimeMs,
          isDailyChallenge,
        },
      },
    });

    if (error) { console.error("Submission error:", error); return null; }
    return data as { verdict: string; points: number; alreadySolved: boolean; isDailyChallenge: boolean };
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
    const { data } = await supabase.rpc("get_leaderboard");
    if (!data || data.length === 0) return [];
    return (data as any[]).map((entry, i) => ({ rank: i + 1, ...entry }));
  };

  return { submitSolution, getSubmissions, getSolvedProblems, getLeaderboard };
};
