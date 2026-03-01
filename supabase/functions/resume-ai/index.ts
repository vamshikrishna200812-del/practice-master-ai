import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { action, ...params } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate_summary") {
      const { jobTitle, skills } = params;
      systemPrompt = "You are a professional resume writer. Generate exactly 3 professional summary options for a resume. Each should be 2-3 sentences, action-oriented, and tailored to the target role. Return ONLY a JSON array of 3 strings, no markdown.";
      userPrompt = `Target Job Title: ${jobTitle}\nTop Skills: ${skills}\n\nGenerate 3 different professional summary options.`;
    } else if (action === "improve_bullet") {
      const { bullet, jobTitle } = params;
      systemPrompt = "You are a resume optimization expert. Rewrite the given bullet point to be action-oriented, quantified with metrics where possible, and impactful. Return ONLY the improved single bullet point text, no quotes or extra formatting.";
      userPrompt = `Job context: ${jobTitle || "General"}\nOriginal bullet: "${bullet}"\n\nRewrite this to be more impactful with metrics.`;
    } else if (action === "scan_keywords") {
      const { jobDescription, resumeText } = params;
      systemPrompt = "You are an ATS (Applicant Tracking System) expert. Analyze the job description and resume, then identify missing keywords. Return ONLY a JSON object with: { \"found\": [keywords present], \"missing\": [keywords absent], \"suggestions\": [brief tips] }. Max 10 items per array.";
      userPrompt = `Job Description:\n${jobDescription}\n\nResume Content:\n${resumeText}\n\nIdentify matching and missing keywords.`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("resume-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
