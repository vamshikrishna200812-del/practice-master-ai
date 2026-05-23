-- Lock down client write paths. All writes now go through the `secure-writes` edge function (service role).

-- certificates: drop direct INSERT, keep SELECT
DROP POLICY IF EXISTS "Users can create own certificates" ON public.certificates;

-- coding_points: drop client INSERT/UPDATE
DROP POLICY IF EXISTS "Users can insert own points" ON public.coding_points;
DROP POLICY IF EXISTS "Users can update own points" ON public.coding_points;

-- coding_submissions: drop client INSERT (verdict/points must be server-computed)
DROP POLICY IF EXISTS "Users can create own submissions" ON public.coding_submissions;

-- course_assessment_completions: drop client INSERT/UPDATE (server validates pass threshold)
DROP POLICY IF EXISTS "Users can create their own assessment completions" ON public.course_assessment_completions;
DROP POLICY IF EXISTS "Users can update their own assessment completions" ON public.course_assessment_completions;

-- user_achievements: drop client INSERT (server validates criteria)
DROP POLICY IF EXISTS "Users can earn achievements" ON public.user_achievements;

-- user_progress: drop client INSERT/UPDATE (server derives from real sessions)
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;

-- Tighten EXECUTE on internal SECURITY DEFINER helpers (linter warnings)
-- `has_role` is only used by RLS internally
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- `has_active_interview` is only used internally
REVOKE EXECUTE ON FUNCTION public.has_active_interview(uuid) FROM PUBLIC, anon, authenticated;

-- `get_leaderboard` is for signed-in users
REVOKE EXECUTE ON FUNCTION public.get_leaderboard() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;

-- `verify_certificate` is a public verification endpoint, keep open to anon
GRANT  EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;