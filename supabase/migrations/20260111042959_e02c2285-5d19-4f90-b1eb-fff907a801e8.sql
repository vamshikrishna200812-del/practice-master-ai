-- Create achievements table for badge definitions
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table for tracking earned badges
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievements are viewable by everyone (public badges)
CREATE POLICY "Achievements are viewable by everyone" 
ON public.achievements 
FOR SELECT 
USING (true);

-- Users can view their own earned achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can earn achievements (insert only)
CREATE POLICY "Users can earn achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, points) VALUES
('First Steps', 'Complete your first interview practice', 'rocket', 'interviews', 'interviews_completed', 1, 10),
('Interview Pro', 'Complete 10 interview practices', 'trophy', 'interviews', 'interviews_completed', 10, 50),
('Interview Master', 'Complete 50 interview practices', 'crown', 'interviews', 'interviews_completed', 50, 200),
('High Achiever', 'Score 90% or higher on an interview', 'star', 'interviews', 'high_score', 90, 30),
('Perfect Score', 'Score 100% on an interview', 'medal', 'interviews', 'perfect_score', 100, 100),
('Course Starter', 'Complete your first course', 'book-open', 'courses', 'courses_completed', 1, 20),
('Scholar', 'Complete 5 courses', 'graduation-cap', 'courses', 'courses_completed', 5, 100),
('Streak Starter', 'Maintain a 3-day practice streak', 'flame', 'streaks', 'practice_streak', 3, 15),
('Dedicated Learner', 'Maintain a 7-day practice streak', 'fire', 'streaks', 'practice_streak', 7, 50),
('Unstoppable', 'Maintain a 30-day practice streak', 'zap', 'streaks', 'practice_streak', 30, 200),
('Schedule Master', 'Schedule 5 classes', 'calendar', 'scheduling', 'classes_scheduled', 5, 25),
('Body Language Pro', 'Score 90% on body language', 'user', 'skills', 'body_language_score', 90, 40),
('Communication Expert', 'Score 90% on communication', 'message-circle', 'skills', 'communication_score', 90, 40);