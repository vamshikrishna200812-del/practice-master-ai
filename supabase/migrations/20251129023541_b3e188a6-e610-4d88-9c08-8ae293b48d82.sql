-- Create enum types for roles and skill levels
CREATE TYPE app_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE interview_type AS ENUM ('coding', 'behavioral', 'system_design', 'technical');
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Create profiles table with extended user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  skill_level skill_level DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create user_progress table to track learning progress
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_interviews INTEGER DEFAULT 0,
  coding_score NUMERIC(5,2) DEFAULT 0.0,
  communication_score NUMERIC(5,2) DEFAULT 0.0,
  body_language_score NUMERIC(5,2) DEFAULT 0.0,
  overall_score NUMERIC(5,2) DEFAULT 0.0,
  practice_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty skill_level NOT NULL,
  duration_minutes INTEGER,
  topics TEXT[],
  instructor_id UUID REFERENCES public.profiles(id),
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_enrollments table
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  progress NUMERIC(5,2) DEFAULT 0.0,
  completed BOOLEAN DEFAULT false,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Create interview_sessions table
CREATE TABLE public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  interview_type interview_type NOT NULL,
  status session_status DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  coding_score NUMERIC(5,2),
  communication_score NUMERIC(5,2),
  body_language_score NUMERIC(5,2),
  overall_score NUMERIC(5,2),
  feedback JSONB,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create practice_sessions table for code practice
CREATE TABLE public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_title TEXT NOT NULL,
  problem_description TEXT,
  difficulty skill_level NOT NULL,
  language TEXT NOT NULL,
  code TEXT,
  output TEXT,
  passed_tests INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create behavioral_assessments table
CREATE TABLE public.behavioral_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  posture_score NUMERIC(5,2),
  eye_contact_score NUMERIC(5,2),
  confidence_score NUMERIC(5,2),
  clarity_score NUMERIC(5,2),
  ai_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create class_schedules table
CREATE TABLE public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  meeting_link TEXT,
  status session_status DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavioral_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Create RLS policies for courses
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "Instructors can manage own courses" ON public.courses FOR ALL TO authenticated USING (instructor_id = auth.uid());

-- Create RLS policies for course_enrollments
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own enrollments" ON public.course_enrollments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own enrollments" ON public.course_enrollments FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Create RLS policies for interview_sessions
CREATE POLICY "Users can view own sessions" ON public.interview_sessions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own sessions" ON public.interview_sessions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own sessions" ON public.interview_sessions FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Create RLS policies for practice_sessions
CREATE POLICY "Users can view own practice" ON public.practice_sessions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own practice" ON public.practice_sessions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Create RLS policies for behavioral_assessments
CREATE POLICY "Users can view own assessments" ON public.behavioral_assessments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own assessments" ON public.behavioral_assessments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Create RLS policies for class_schedules
CREATE POLICY "Users can view own schedules" ON public.class_schedules FOR SELECT TO authenticated USING (user_id = auth.uid() OR instructor_id = auth.uid());
CREATE POLICY "Users can create own schedules" ON public.class_schedules FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own schedules" ON public.class_schedules FOR UPDATE TO authenticated USING (user_id = auth.uid() OR instructor_id = auth.uid());

-- Create RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();