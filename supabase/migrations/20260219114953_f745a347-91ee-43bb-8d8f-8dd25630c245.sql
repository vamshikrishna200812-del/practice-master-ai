
-- Add DELETE policies for tables where user deletion makes sense

-- Allow users to delete their own interview sessions
CREATE POLICY "Users can delete own sessions"
ON public.interview_sessions
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Allow users to delete their own behavioral assessments
CREATE POLICY "Users can delete own assessments"
ON public.behavioral_assessments
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Allow users to unenroll from courses
CREATE POLICY "Users can delete own enrollments"
ON public.course_enrollments
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
