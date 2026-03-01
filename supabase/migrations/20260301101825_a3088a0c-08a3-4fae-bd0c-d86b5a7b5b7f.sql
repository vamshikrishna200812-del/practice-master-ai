
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  full_name text,
  avatar_url text,
  total_points integer,
  problems_solved integer,
  easy_solved integer,
  medium_solved integer,
  hard_solved integer,
  current_streak integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT
    cp.user_id,
    p.full_name,
    p.avatar_url,
    cp.total_points,
    cp.problems_solved,
    cp.easy_solved,
    cp.medium_solved,
    cp.hard_solved,
    cp.current_streak
  FROM public.coding_points cp
  JOIN public.profiles p ON p.id = cp.user_id
  ORDER BY cp.total_points DESC
  LIMIT 50;
$$;
