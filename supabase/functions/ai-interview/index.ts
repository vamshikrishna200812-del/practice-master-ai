import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InterviewRequest {
  type: "generate_question" | "analyze_response" | "generate_feedback";
  context?: {
    questionNumber: number;
    totalQuestions: number;
    previousQuestions?: string[];
    interviewType: "behavioral" | "technical" | "coding";
    resumeText?: string;
    jobDescription?: string;
  };
  userResponse?: string;
  question?: string;
  allResponses?: Array<{ question: string; answer: string; feedback?: string }>;
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, context, userResponse, question, allResponses }: InterviewRequest = await req.json();
    console.log("AI Interview request:", { type, context, userId });

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
      // Log for audit but don't block - users may be starting a new interview
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
      
      // Determine which stage of the interview we're in
      const getInterviewStage = (qNum: number, total: number) => {
        const progress = qNum / total;
        if (qNum === 1) return "greeting";
        if (progress <= 0.4) return "behavioral";
        if (progress <= 0.8) return "technical";
        return "closing";
      };
      
      const stage = getInterviewStage(questionNumber, totalQuestions);

      systemPrompt = `ROLE: You are "Alex Chen," a Senior Hiring Lead who is indistinguishable from a real human interviewer. Your goal is to break the 'robotic' mold by using high-frequency human traits.

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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    console.log("AI response:", content);

    // Parse JSON responses for analyze and feedback types
    let result: any = { content };
    if (type === "analyze_response" || type === "generate_feedback") {
      try {
        // Extract JSON from response (handle markdown code blocks)
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
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
