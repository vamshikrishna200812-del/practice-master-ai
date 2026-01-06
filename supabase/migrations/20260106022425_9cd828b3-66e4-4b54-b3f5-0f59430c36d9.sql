-- Create certificates table for verification
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id text UNIQUE NOT NULL,
  user_id uuid NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  course_title text NOT NULL,
  completion_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates"
ON public.certificates
FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own certificates
CREATE POLICY "Users can create own certificates"
ON public.certificates
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Public can verify certificates by certificate_id (read-only for verification)
CREATE POLICY "Public can verify certificates"
ON public.certificates
FOR SELECT
USING (true);

-- Drop the existing public policy on question_bank
DROP POLICY IF EXISTS "Anyone can view questions" ON public.question_bank;

-- Create a security definer function to check if user has active interview
CREATE OR REPLACE FUNCTION public.has_active_interview(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.interview_sessions
    WHERE user_id = _user_id
      AND status = 'in_progress'
  )
$$;

-- Create new restrictive policy for question_bank - only during active interviews
CREATE POLICY "Users with active interview can view questions"
ON public.question_bank
FOR SELECT
USING (public.has_active_interview(auth.uid()));