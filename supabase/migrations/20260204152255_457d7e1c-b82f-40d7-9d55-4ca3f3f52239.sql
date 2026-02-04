-- Add DELETE policy for class_schedules so users can cancel their scheduled classes
CREATE POLICY "Users can delete own schedules"
ON public.class_schedules
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid() OR instructor_id = auth.uid()
);