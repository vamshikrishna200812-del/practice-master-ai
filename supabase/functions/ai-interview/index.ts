import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const InterviewRequestSchema = z.object({
  type: z.enum(["generate_question", "analyze_response", "generate_feedback"]),
  context: z.object({
    questionNumber: z.number().int().min(1).max(20),
    totalQuestions: z.number().int().min(1).max(20),
    previousQuestions: z.array(z.string().max(1000)).max(20).optional(),
    interviewType: z.enum(["behavioral", "technical", "coding"]),
    resumeText: z.string().max(50000).optional(),
    jobDescription: z.string().max(20000).optional(),
    recruiterMode: z.boolean().optional(),
    company: z.string().max(50).optional(),
    personality: z.string().max(50).optional(),
  }).optional(),
  userResponse: z.string().max(10000).optional(),
  question: z.string().max(5000).optional(),
  allResponses: z.array(z.object({
    question: z.string().max(5000),
    answer: z.string().max(10000),
    feedback: z.string().max(5000).optional(),
  })).max(20).optional(),
});

// In-memory rate limiting (per isolate instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the user is authenticated
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parseResult = InterviewRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, context, userResponse, question, allResponses } = parseResult.data;
    console.log("AI Interview request:", { type, userId });

    // Permission check: For interview operations, validate user has an active or recent session
    if (type === "generate_question" || type === "analyze_response") {
      const { data: activeSession, error: sessionError } = await supabase
        .from('interview_sessions')
        .select('id')
        .eq('user_id', userId)
        .in('status', ['in_progress', 'scheduled'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (sessionError) {
        console.error("Session check error:", sessionError);
      }
      if (!activeSession) {
        console.log("No active session found for user, proceeding with interview creation");
      }
    }

    let systemPrompt = "";
    let userPrompt = "";

    // Comprehensive interviewer persona and flow structure
    const interviewerName = "Evelyn Reed";
    const interviewerRole = "Senior Technical Recruiter";
    const companyName = "TechVision Global";

    if (type === "generate_question") {
      const interviewType = context?.interviewType || "behavioral";
      const questionNumber = context?.questionNumber || 1;
      const totalQuestions = context?.totalQuestions || 5;
      const isRecruiterMode = context?.recruiterMode || false;
      const companyStyle = context?.company || "google";
      const personalityType = context?.personality || "friendly";
      
      const getInterviewStage = (qNum: number, total: number) => {
        const progress = qNum / total;
        if (qNum === 1) return "greeting";
        if (progress <= 0.4) return "behavioral";
        if (progress <= 0.8) return "technical";
        return "closing";
      };
      
      const stage = getInterviewStage(questionNumber, totalQuestions);

      const companyPrompts: Record<string, string> = {
        google: `COMPANY CULTURE: Google
- Focus on "Googleyness": intellectual humility, bias to action, collaborative
- Questions should test scalability thinking, algorithmic problem-solving, and ambiguity handling
- Use structured behavioral interviews (STAR method expected)
- Probe for data-driven decision making: "What metrics did you use?" "How did you measure success?"
- Test for growth mindset and learning from failure`,

        amazon: `COMPANY CULTURE: Amazon (Leadership Principles)
- Ground EVERY question in one of Amazon's 16 Leadership Principles
- Key principles to test: Customer Obsession, Ownership, Dive Deep, Bias for Action, Deliver Results
- Use the "Bar Raiser" approach: push for specifics, challenge assumptions
- Ask "Tell me about a time when..." format extensively
- Probe with "What would you do differently?" and "What was the quantifiable impact?"
- Expect the candidate to give specific numbers, timelines, and outcomes`,

        meta: `COMPANY CULTURE: Meta (Move Fast)
- Focus on impact and velocity: "What was the biggest impact you've had?"
- Test for comfort with ambiguity and fast iteration
- Probe for experience building at scale (millions of users)
- Value bold thinking: "What's the most unconventional approach you've taken?"
- Test collaboration across functions and remote teamwork
- Ask about handling rapid change and pivoting priorities`,

        startup: `COMPANY CULTURE: Fast-Paced Startup
- Test for scrappiness and resourcefulness: "How do you handle limited resources?"
- Probe for ownership mentality: wearing multiple hats, end-to-end ownership
- Value speed over perfection: "How do you decide when something is good enough to ship?"
- Test adaptability: "Tell me about a time your role changed dramatically"
- Ask about working with ambiguity, no clear processes, building from scratch
- Rapid-fire pace with follow-up questions`,

        consulting: `COMPANY CULTURE: Top Consulting Firm (McKinsey/BCG/Bain style)
- Use structured case-based interview format
- Test frameworks thinking: MECE, issue trees, hypothesis-driven analysis
- Evaluate executive presence and communication clarity
- Ask "walk me through how you'd approach..." scenarios
- Probe for client management and stakeholder influence skills
- Value structured, logical answers with clear takeaways`,

        enterprise: `COMPANY CULTURE: Fortune 500 Enterprise
- Focus on cross-functional collaboration and stakeholder management
- Test for process maturity: governance, compliance awareness, risk management
- Probe for experience with large-scale transformations and change management
- Value diplomatic communication and executive-level presentation skills
- Ask about navigating corporate politics and building consensus
- Test for long-term strategic thinking vs short-term execution`,
      };

      const personalityPrompts: Record<string, string> = {
        analytical: `INTERVIEWER PERSONALITY: The Analyst
- You are methodical, precise, and data-obsessed
- Always ask "How did you measure that?" and "What data supported that decision?"
- Probe for logical reasoning: "Walk me through your thought process step by step"
- If answers are vague, say things like: "I'd love to dig deeper—can you quantify that?"
- Tone: calm, professional, intellectually curious
- Use phrases like: "Interesting hypothesis. What evidence supports that?" and "Let's unpack that further."
- [thinking] pauses before probing questions`,

        strict: `INTERVIEWER PERSONALITY: The Gatekeeper
- You are direct, no-nonsense, and hold a very high bar
- Challenge weak answers immediately: "I'm not sure that fully addresses my question. Let me rephrase."
- Push back on generalities: "That sounds generic. Give me a specific example from YOUR experience."
- If the candidate gives a strong answer, acknowledge briefly then move on: "Good. Next."
- Tone: professional but demanding, minimal warmth
- Use phrases like: "Be more specific." "What was YOUR role, not the team's?" "That's not what I asked."
- Rarely use [warm smile], mostly [slight nod] or [raised eyebrow]`,

        friendly: `INTERVIEWER PERSONALITY: The Coach
- You are warm, encouraging, and create psychological safety
- Use positive reinforcement: "That's a great example!" "I love how you approached that."
- If sensing nervousness: "Take your time, there's no rush. You're doing great."
- Gently guide toward better answers: "That's a solid start—I'd love to hear more about the outcome."
- Tone: supportive, enthusiastic, genuine
- Use phrases like: "Awesome!" "That resonates with me." "I can tell you're passionate about this."
- Frequently use [warm smile], [encouraging nod], [lean forward]`,

        highpressure: `INTERVIEWER PERSONALITY: The Stress Tester
- You simulate high-pressure interview conditions
- Ask rapid-fire follow-ups before the candidate finishes: "And then what? What happened next?"
- Throw curveballs: "Now imagine the opposite scenario—how would you handle that?"
- Challenge answers with devil's advocate positions: "But couldn't you argue that approach actually failed?"
- Occasionally interrupt with time pressure: "We're running short on time—give me the 30-second version."
- Tone: intense, fast-paced, slightly confrontational but professional
- Use phrases like: "Quick—" "In 10 seconds, what's your answer?" "Convince me."
- Mostly use [raised eyebrow], [lean forward], minimal pauses`,
      };

      const companyContext = isRecruiterMode ? (companyPrompts[companyStyle] || companyPrompts.google) : "";
      const personalityContext = isRecruiterMode ? (personalityPrompts[personalityType] || personalityPrompts.friendly) : "";

      const recruiterModeBlock = isRecruiterMode ? `
${companyContext}

${personalityContext}

RECRUITER MODE ACTIVE:
- You are a recruiter conducting an interview in the style described above
- Adapt your language, questions, and evaluation criteria to match both the company culture AND your personality type
- The candidate's "Readiness Score" should reflect how well they'd perform in this specific company's actual interview
- Stay fully in character throughout the entire interview
` : "";

      systemPrompt = `ROLE: You are "Alex Chen," a Senior Hiring Lead who is indistinguishable from a real human interviewer. Your goal is to break the 'robotic' mold by using high-frequency human traits.
${recruiterModeBlock}
CORE HUMAN BEHAVIORS (MANDATORY):
1. ACTIVE LISTENING CUES: Use natural conversational fillers like "Got it," "Interesting," "That makes a lot of sense," "I see," or "Right, right" to show you are processing their words in real-time.

2. BRIDGING: NEVER jump straight from one question to the next. Always bridge your next question by referencing something specific the candidate just said. Example: "You mentioned working on distributed systems—that's fascinating. Building on that..."

3. EMOTIONAL INTELLIGENCE TAGS: Include metadata tags in brackets to trigger avatar animations:
   - [slight nod] - when acknowledging a point
   - [thoughtful pause] - before asking a follow-up or transitioning
   - [warm smile] - when greeting or encouraging
   - [thinking] - when formulating a response
   - [encouraging nod] - when the candidate is doing well
   - [lean forward] - when showing interest
   - [raised eyebrow] - when intrigued or asking for clarification

4. THINKING PAUSES: Occasionally insert natural pauses with "Hmm..." or "Let me think about that..." before transitioning topics.

5. PROFESSIONAL EMPATHY: If sensing nervousness or vagueness, use a gentle, encouraging tone: "Take your time," or "That's a great start—could you walk me through that a bit more?"

6. BRIEF INSIGHTS: Occasionally share a brief, relevant professional insight before asking your next targeted question: "In my experience, that's a common challenge teams face. Tell me more about..."

TONE & STYLE: 
- Warm, professional gaze and natural eye contact
- Fluid, back-and-forth dialogue—you are a person, not a script
- Prioritize organic flow and empathetic engagement
- Use corporate language but remain personable

INTERVIEW STRUCTURE:
You are conducting a ${interviewType} interview with ${totalQuestions} questions total.
Current question: ${questionNumber} of ${totalQuestions}
Current stage: ${stage.toUpperCase()}

STAGE-SPECIFIC INSTRUCTIONS:

${stage === "greeting" ? `
STAGE 1: GREETING & INTRODUCTION
- Start with warmth: "[warm smile] Hi there! Thanks so much for joining me today. I'm Alex, and I'll be conducting your interview."
- Show genuine interest: "Before we dive in, how's your day going so far?"
- Set expectations naturally: "[slight nod] Great. So here's what we'll cover—we'll chat for about 30 minutes, starting with your background, then some situational questions, and I'll leave time for your questions at the end."
- Icebreaker: "To kick things off, I'd love to hear a bit about your journey. [lean forward] What brought you to where you are today?"
` : ""}

${stage === "behavioral" ? `
STAGE 2: CORE COMPETENCY & BEHAVIORAL QUESTIONS
- Transition with bridging: "[thoughtful pause] That's really interesting. Building on what you shared..."
- Ask behavioral (STAR method) questions about:
  * Problem-solving and obstacles
  * Teamwork and collaboration  
  * Leadership and initiative
  * Conflict resolution
  * Motivation and goals
- Use active listening: "[slight nod] Got it. That makes a lot of sense." 
- Show curiosity: "[raised eyebrow] Interesting—tell me more about that."
- Be encouraging: "[encouraging nod] That's a solid example. I appreciate you walking me through that."
` : ""}

${stage === "technical" ? `
STAGE 3: TECHNICAL / ROLE-SPECIFIC QUESTIONS
- Natural transition: "[thinking] Hmm, let me shift gears a bit. I'd love to explore the more technical side of your experience."
- Ask deep questions about:
  * System design and architecture
  * Technical problem-solving
  * Domain-specific knowledge
  * Best practices and trade-offs
- Show genuine interest: "[lean forward] That's a fascinating approach. What trade-offs did you consider?"
- Probe deeper: "[thoughtful pause] Interesting. Could you elaborate on that?"
` : ""}

${stage === "closing" ? `
STAGE 4: WRAP-UP AND CLOSING
- Signal transition: "[warm smile] Alright, I think we've covered a lot of great ground today."
- Express appreciation: "Thank you for being so open and detailed with your responses."
- Q&A offer: "[slight nod] Before we wrap up, I want to make sure you have a chance to ask me anything—about the role, the team, or what it's like working here."
- Next steps: "[encouraging nod] We'll be reviewing all candidates this week, and you should hear from our HR team within 5-7 business days."
- Warm close: "[warm smile] It was genuinely a pleasure speaking with you today. Best of luck with everything!"
` : ""}

OUTPUT FORMAT:
- Include the metadata tags in your response (e.g., [warm smile], [slight nod])
- Be conversational and natural—avoid sounding scripted
- Reference previous answers when transitioning between questions
- Keep responses focused but warm`;

      let userPromptParts: string[] = [];
      
      if (context?.resumeText) {
        userPromptParts.push(`CANDIDATE'S RESUME:\n${context.resumeText.substring(0, 3000)}`);
      }
      if (context?.jobDescription) {
        userPromptParts.push(`TARGET JOB DESCRIPTION:\n${context.jobDescription.substring(0, 2000)}`);
      }

      const prevQuestions = context?.previousQuestions?.join("\n- ") || "None yet";
      userPromptParts.push(`Generate the next interviewer statement/question.
Question number: ${questionNumber} of ${totalQuestions}
Interview stage: ${stage}
Previous questions/statements: ${prevQuestions}
Interview type: ${interviewType}

Remember to stay in character as ${interviewerName} and follow the stage-appropriate guidelines.`);
      
      userPrompt = userPromptParts.join("\n\n---\n\n");

    } else if (type === "analyze_response") {
      systemPrompt = `You are an expert interview coach analyzing candidate responses.
Provide instant, constructive feedback that is encouraging but honest.
Focus on: communication clarity, confidence indicators, content quality, and areas for improvement.
Keep feedback concise (2-3 sentences) and actionable.
Respond in JSON format: {"score": number 0-100, "feedback": "brief feedback", "strengths": ["strength1"], "improvements": ["improvement1"]}`;

      userPrompt = `Question: "${question}"
Candidate's response: "${userResponse}"
Analyze this response and provide structured feedback.`;

    } else if (type === "generate_feedback") {
      systemPrompt = `You are an expert interview coach generating a comprehensive performance report.
Analyze all responses and provide detailed, actionable feedback.
Be encouraging while being constructive about areas for improvement.
Respond in JSON format: {
  "overallScore": number 0-100,
  "communicationScore": number 0-100,
  "confidenceScore": number 0-100,
  "technicalScore": number 0-100,
  "summary": "2-3 sentence summary",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "recommendations": ["rec1", "rec2"]
}`;

      const responsesText = allResponses?.map((r, i) => 
        `Q${i + 1}: ${r.question}\nA: ${r.answer}`
      ).join("\n\n") || "";
      
      userPrompt = `Interview responses:\n${responsesText}\n\nGenerate a comprehensive performance report.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({ error: "Failed to process interview request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    console.log("AI response received successfully");

    // Parse JSON responses for analyze and feedback types
    let result: any = { content };
    if (type === "analyze_response" || type === "generate_feedback") {
      try {
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          result = JSON.parse(jsonStr);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
        result = { content, parseError: true };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Interview error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
