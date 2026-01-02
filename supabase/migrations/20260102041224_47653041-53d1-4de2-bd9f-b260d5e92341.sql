-- Prevent updates to practice_sessions to maintain assessment integrity
-- Practice test results should be immutable once submitted
CREATE POLICY "Practice sessions are immutable"
ON public.practice_sessions
FOR UPDATE
USING (false);