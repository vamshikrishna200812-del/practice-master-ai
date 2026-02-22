import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const ParseRequestSchema = z.object({
  type: z.enum(["parse_resume", "generate_questions"]),
  resumeUrl: z.string().max(500).optional(),
  resumeText: z.string().max(50000).optional(),
  jobDescription: z.string().max(20000).optional(),
  interviewType: z.enum(["behavioral", "technical", "coding"]).optional(),
  questionCount: z.number().int().min(1).max(20).optional(),
});

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

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

    const parseResult = ParseRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, resumeUrl, resumeText, jobDescription, interviewType, questionCount = 5 } = parseResult.data;
    console.log("Parse resume request:", { type, hasResumeUrl: !!resumeUrl, hasResumeText: !!resumeText, hasJD: !!jobDescription, userId });

    if (type === "parse_resume") {
      let content = resumeText || "";
      
      if (resumeUrl && !resumeText) {
        if (!resumeUrl.startsWith(`${userId}/`)) {
          console.warn("Blocked resume access attempt for non-owned file:", { userId, resumeUrl });
          return new Response(
            JSON.stringify({ error: "Unauthorized file access" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: fileData, error: downloadError } = await supabase.storage
          .from("resumes")
          .download(resumeUrl);
          
        if (downloadError) {
          console.error("Download error:", downloadError);
          return new Response(
            JSON.stringify({ error: "Failed to access resume file" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { 
                role: "system", 
                content: "You are a document parser. Extract all text content from the provided document. Return ONLY the extracted text, preserving structure where possible. Focus on: name, contact info, skills, experience, education, projects." 
              },
              { 
                role: "user", 
                content: [
                  { type: "text", text: "Extract all text from this resume document:" },
                  { type: "image_url", image_url: { url: `data:application/pdf;base64,${base64}` } }
                ]
              },
            ],
          }),
        });

        if (!extractResponse.ok) {
          console.error("Failed to extract text from resume");
          return new Response(JSON.stringify({ 
            error: "Could not extract text from document. Please try pasting the resume text directly." 
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const extractData = await extractResponse.json();
        content = extractData.choices?.[0]?.message?.content || "";
      }

      const parseResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { 
              role: "system", 
              content: `You are an expert resume parser. Analyze the resume and extract structured information.
Return JSON in this exact format:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number if present",
  "summary": "Brief professional summary",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Date Range",
      "highlights": ["achievement1", "achievement2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "year": "Year"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "certifications": ["cert1", "cert2"]
}` 
            },
            { role: "user", content: `Parse this resume:\n\n${content}` },
          ],
        }),
      });

      if (!parseResponse.ok) {
        console.error("Failed to parse resume");
        return new Response(
          JSON.stringify({ error: "Failed to parse resume" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const parseData = await parseResponse.json();
      const parsedContent = parseData.choices?.[0]?.message?.content || "";
      
      let parsedResume;
      try {
        const jsonMatch = parsedContent.match(/```json\n?([\s\S]*?)\n?```/) || parsedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          parsedResume = JSON.parse(jsonStr);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
        parsedResume = { raw: parsedContent };
      }

      console.log("Parsed resume successfully:", { skills: parsedResume?.skills?.length || 0 });

      return new Response(JSON.stringify({ parsedResume, rawText: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "generate_questions") {
      let systemPrompt = `You are an expert interviewer who creates highly personalized interview questions.`;
      let contextParts: string[] = [];

      if (resumeText) {
        contextParts.push(`CANDIDATE'S RESUME:\n${resumeText}`);
        systemPrompt += ` You have access to the candidate's resume and should ask specific questions about their listed skills, projects, and experience.`;
      }

      if (jobDescription) {
        contextParts.push(`JOB DESCRIPTION:\n${jobDescription}`);
        systemPrompt += ` You are acting as the hiring manager for this specific role. Ask questions that assess if the candidate is a good fit for this position.`;
      }

      systemPrompt += `\n\nGenerate ${questionCount} interview questions that are:
1. Specific to the candidate's background (if resume provided)
2. Relevant to the job requirements (if JD provided)
3. Progressive in difficulty
4. Mix of behavioral and technical based on the interview type

Return JSON array: ["question1", "question2", ...]`;

      const context = contextParts.join("\n\n---\n\n");
      
      const questionsResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `${context}\n\nInterview type: ${interviewType || "behavioral"}\n\nGenerate ${questionCount} personalized interview questions.` 
            },
          ],
        }),
      });

      if (!questionsResponse.ok) {
        console.error("Failed to generate questions");
        return new Response(
          JSON.stringify({ error: "Failed to generate questions" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const questionsData = await questionsResponse.json();
      const questionsContent = questionsData.choices?.[0]?.message?.content || "";
      
      let questions: string[] = [];
      try {
        const jsonMatch = questionsContent.match(/```json\n?([\s\S]*?)\n?```/) || questionsContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          questions = JSON.parse(jsonStr);
        }
      } catch (e) {
        console.error("JSON parse error:", e);
        questions = questionsContent.split("\n").filter((q: string) => q.trim().length > 10);
      }

      console.log("Generated personalized questions:", questions.length);

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid request type" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Parse resume error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
