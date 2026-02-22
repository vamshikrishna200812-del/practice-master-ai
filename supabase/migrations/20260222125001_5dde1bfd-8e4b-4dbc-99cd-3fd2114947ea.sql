CREATE POLICY "Users can delete own achievements" 
ON public.user_achievements 
FOR DELETE 
USING (auth.uid() = user_id);