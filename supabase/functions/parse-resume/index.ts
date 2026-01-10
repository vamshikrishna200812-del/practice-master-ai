import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParseRequest {
  type: "parse_resume" | "generate_questions";
  resumeUrl?: string;
  resumeText?: string;
  jobDescription?: string;
  interviewType?: "behavioral" | "technical" | "coding";
  questionCount?: number;
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, resumeUrl, resumeText, jobDescription, interviewType, questionCount = 5 }: ParseRequest = await req.json();
    console.log("Parse resume request:", { type, hasResumeUrl: !!resumeUrl, hasResumeText: !!resumeText, hasJD: !!jobDescription, userId: claimsData.claims.sub });

    if (type === "parse_resume") {
      // If we have a URL, fetch the resume content
      let content = resumeText || "";
      
      if (resumeUrl && !resumeText) {
        // Download file from storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("resumes")
          .download(resumeUrl);
          
        if (downloadError) {
          console.error("Download error:", downloadError);
          throw new Error("Failed to download resume file");
        }

        // For now, we'll extract text from the file
        // For PDFs and DOCXs, we'll use AI to extract text from base64
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Use AI to extract text from the document
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
                  { 
                    type: "image_url", 
                    image_url: { 
                      url: `data:application/pdf;base64,${base64}` 
                    } 
                  }
                ]
              },
            ],
          }),
        });

        if (!extractResponse.ok) {
          console.error("Failed to extract text from resume");
          // Fallback: return base64 and let frontend handle it
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

      // Parse the resume content with AI
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
        throw new Error("Failed to parse resume");
      }

      const parseData = await parseResponse.json();
      const parsedContent = parseData.choices?.[0]?.message?.content || "";
      
      // Extract JSON from response
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
        throw new Error("Failed to generate questions");
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
        // Fallback: split by newlines if JSON parsing fails
        questions = questionsContent.split("\n").filter((q: string) => q.trim().length > 10);
      }

      console.log("Generated personalized questions:", questions.length);

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid request type");

  } catch (error) {
    console.error("Parse resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
