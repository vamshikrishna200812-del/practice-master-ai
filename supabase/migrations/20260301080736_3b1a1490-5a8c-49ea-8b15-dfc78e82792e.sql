
-- Coding submissions table
CREATE TABLE public.coding_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id text NOT NULL,
  problem_title text NOT NULL,
  language text NOT NULL,
  code text,
  verdict text NOT NULL DEFAULT 'pending',
  passed_tests integer NOT NULL DEFAULT 0,
  total_tests integer NOT NULL DEFAULT 0,
  points_earned integer NOT NULL DEFAULT 0,
  execution_time_ms integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON public.coding_submissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own submissions"
  ON public.coding_submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Coding points / leaderboard table
CREATE TABLE public.coding_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points integer NOT NULL DEFAULT 0,
  problems_solved integer NOT NULL DEFAULT 0,
  easy_solved integer NOT NULL DEFAULT 0,
  medium_solved integer NOT NULL DEFAULT 0,
  hard_solved integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  last_solve_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coding_points ENABLE ROW LEVEL SECURITY;

-- Everyone can view leaderboard
CREATE POLICY "Anyone can view leaderboard"
  ON public.coding_points FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own points"
  ON public.coding_points FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own points"
  ON public.coding_points FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create index for leaderboard queries
CREATE INDEX idx_coding_points_total ON public.coding_points(total_points DESC);
CREATE INDEX idx_coding_submissions_user ON public.coding_submissions(user_id, created_at DESC);
CREATE INDEX idx_coding_submissions_problem ON public.coding_submissions(user_id, problem_id);
