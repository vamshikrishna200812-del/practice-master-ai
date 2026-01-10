-- Fix Issue 1: Restrict notifications INSERT to service_role only
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

CREATE POLICY "Only service role can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- Fix Issue 2: Create secure certificate verification function
-- First, drop the overly permissive public policy
DROP POLICY IF EXISTS "Public can verify certificates" ON public.certificates;

-- Create a secure verification function that only returns data for a specific certificate ID
CREATE OR REPLACE FUNCTION public.verify_certificate(
  _certificate_id text
)
RETURNS TABLE(
  certificate_id text,
  user_name text,
  course_title text,
  completion_date timestamptz,
  is_valid boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.certificate_id,
    c.user_name,
    c.course_title,
    c.completion_date,
    true as is_valid
  FROM public.certificates c
  WHERE c.certificate_id = _certificate_id
  LIMIT 1;
$$;

-- Grant execute to anon users for public verification
GRANT EXECUTE ON FUNCTION public.verify_certificate TO anon;
GRANT EXECUTE ON FUNCTION public.verify_certificate TO authenticated;