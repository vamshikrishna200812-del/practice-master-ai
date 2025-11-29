-- Add RLS policies for user_roles table
CREATE POLICY "Users can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can manage roles" ON public.user_roles FOR ALL TO authenticated USING (false);