-- Create question_bank table for commonly asked interview questions
CREATE TABLE public.question_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- Everyone can view questions (public library)
CREATE POLICY "Anyone can view questions"
ON public.question_bank
FOR SELECT
USING (true);

-- Create star_stories table for user's STAR method cheat sheets
CREATE TABLE public.star_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  situation TEXT,
  task TEXT,
  action TEXT,
  result TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.star_stories ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own stories
CREATE POLICY "Users can view own stories"
ON public.star_stories
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own stories"
ON public.star_stories
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own stories"
ON public.star_stories
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own stories"
ON public.star_stories
FOR DELETE
USING (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_star_stories_updated_at
BEFORE UPDATE ON public.star_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Pre-populate question bank with common interview questions
INSERT INTO public.question_bank (industry, category, question, difficulty, tips) VALUES
-- Tech Industry
('Tech', 'Behavioral', 'Tell me about a time you had to debug a complex issue under pressure.', 'medium', 'Use the STAR method. Focus on your systematic approach and what you learned.'),
('Tech', 'Behavioral', 'Describe a situation where you disagreed with a technical decision.', 'hard', 'Emphasize constructive communication and data-driven arguments.'),
('Tech', 'Behavioral', 'How do you stay updated with new technologies?', 'easy', 'Mention specific resources, communities, or projects you engage with.'),
('Tech', 'Technical', 'Explain the concept of API rate limiting and why it matters.', 'medium', 'Discuss both client and server perspectives.'),
('Tech', 'Leadership', 'Tell me about a time you mentored a junior developer.', 'medium', 'Focus on specific teaching methods and their growth outcomes.'),

-- Finance Industry
('Finance', 'Behavioral', 'Describe a time you identified a financial risk before it became a problem.', 'hard', 'Quantify the impact when possible. Show analytical thinking.'),
('Finance', 'Behavioral', 'How do you handle pressure during market volatility?', 'medium', 'Emphasize calm decision-making and sticking to fundamentals.'),
('Finance', 'Technical', 'Walk me through a DCF analysis.', 'hard', 'Be methodical and explain your assumptions clearly.'),
('Finance', 'Ethics', 'Describe a situation where you faced an ethical dilemma at work.', 'hard', 'Show integrity and explain your decision-making process.'),
('Finance', 'Leadership', 'Tell me about managing stakeholder expectations.', 'medium', 'Focus on communication and setting realistic timelines.'),

-- Healthcare Industry
('Healthcare', 'Behavioral', 'Tell me about a time you had to deliver difficult news to a patient or family.', 'hard', 'Emphasize empathy, clarity, and support offered.'),
('Healthcare', 'Behavioral', 'Describe how you handle high-stress emergency situations.', 'hard', 'Focus on protocols, teamwork, and staying calm.'),
('Healthcare', 'Technical', 'How do you ensure patient data privacy and HIPAA compliance?', 'medium', 'Be specific about procedures and training.'),
('Healthcare', 'Teamwork', 'Describe collaborating with a multidisciplinary team.', 'medium', 'Highlight communication and respect for different expertise.'),
('Healthcare', 'Ethics', 'How would you handle a situation where a colleague made a mistake?', 'hard', 'Balance patient safety with supportive colleague relationships.'),

-- Consulting Industry
('Consulting', 'Behavioral', 'Tell me about a time you had to convince a skeptical client.', 'hard', 'Focus on understanding their concerns and using data.'),
('Consulting', 'Case Study', 'How would you approach entering a new market?', 'hard', 'Show structured thinking: market size, competition, entry barriers.'),
('Consulting', 'Leadership', 'Describe leading a project with tight deadlines.', 'medium', 'Emphasize prioritization, delegation, and communication.'),
('Consulting', 'Teamwork', 'How do you handle conflicting opinions within your team?', 'medium', 'Show facilitation skills and focus on data-driven decisions.'),
('Consulting', 'Technical', 'Walk me through how you analyze large datasets.', 'medium', 'Mention specific tools and methodologies you use.'),

-- General/All Industries
('General', 'Behavioral', 'Tell me about yourself.', 'easy', 'Keep it professional, relevant, and under 2 minutes.'),
('General', 'Behavioral', 'What is your greatest weakness?', 'medium', 'Choose a real weakness and explain how you''re improving.'),
('General', 'Behavioral', 'Where do you see yourself in 5 years?', 'easy', 'Align your goals with the company''s growth trajectory.'),
('General', 'Behavioral', 'Why should we hire you?', 'medium', 'Connect your unique skills to the job requirements.'),
('General', 'Behavioral', 'Tell me about a time you failed.', 'hard', 'Be honest, focus on what you learned, and how you improved.');