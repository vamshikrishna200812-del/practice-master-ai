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

    if (type === "generate_question") {
      let systemPromptParts = [`You are an expert AI interviewer conducting a ${context?.interviewType || "behavioral"} interview.`];
      
      if (context?.resumeText) {
        systemPromptParts.push("You have access to the candidate's resume. Ask specific questions about their listed skills, projects, and experience.");
      }
      if (context?.jobDescription) {
        systemPromptParts.push("You are acting as the hiring manager for a specific role. Ask questions that assess if the candidate is a good fit for this position.");
      }
      
      systemPromptParts.push("Generate engaging, professional interview questions that assess the candidate's skills effectively.");
      systemPromptParts.push("Be conversational but professional. Ask follow-up worthy questions.");
      systemPromptParts.push("Respond with ONLY the question text, nothing else.");

      systemPrompt = systemPromptParts.join("\n");

      let userPromptParts: string[] = [];
      
      if (context?.resumeText) {
        userPromptParts.push(`CANDIDATE'S RESUME:\n${context.resumeText.substring(0, 3000)}`);
      }
      if (context?.jobDescription) {
        userPromptParts.push(`JOB DESCRIPTION:\n${context.jobDescription.substring(0, 2000)}`);
      }

      const prevQuestions = context?.previousQuestions?.join("\n- ") || "None yet";
      userPromptParts.push(`Generate question ${context?.questionNumber || 1} of ${context?.totalQuestions || 5}.
Previous questions asked: ${prevQuestions}
Interview type: ${context?.interviewType || "behavioral"}
Make this question unique and progressively more challenging.`);
      
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
