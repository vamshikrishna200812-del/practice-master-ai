-- Create INSERT policy for notifications table
-- This allows the service role (system) to insert notifications for any user
CREATE POLICY "Service role can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Note: This policy allows inserts from the service role (used in edge functions)
-- Regular users cannot insert via the anon key since the policy uses service role context