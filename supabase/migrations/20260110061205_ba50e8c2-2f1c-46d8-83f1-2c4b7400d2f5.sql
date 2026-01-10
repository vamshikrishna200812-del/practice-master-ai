-- Clean up invalid avatar_url data (including potential XSS injection)
UPDATE public.profiles 
SET avatar_url = NULL 
WHERE avatar_url IS NOT NULL 
  AND avatar_url != '' 
  AND avatar_url !~* '^https?://';

-- Now add database constraints for profile validation
-- Add length constraints on text fields  
ALTER TABLE public.profiles ADD CONSTRAINT check_full_name_length 
  CHECK (length(full_name) >= 2 AND length(full_name) <= 100);
  
ALTER TABLE public.profiles ADD CONSTRAINT check_bio_length 
  CHECK (bio IS NULL OR length(bio) <= 1000);
  
ALTER TABLE public.profiles ADD CONSTRAINT check_avatar_url_format
  CHECK (avatar_url IS NULL OR avatar_url = '' OR avatar_url ~* '^https?://');

-- Fix question_bank policy: Restore authenticated access for educational browsing
DROP POLICY IF EXISTS "Users with active interview can view questions" ON public.question_bank;

CREATE POLICY "Authenticated users can browse question bank"
ON public.question_bank
FOR SELECT
TO authenticated
USING (true);