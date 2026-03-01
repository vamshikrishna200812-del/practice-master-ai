import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const AvatarRequestSchema = z.object({
  type: z.enum(["create_talk", "get_talk_status"]),
  text: z.string().max(5000).optional(),
  talkId: z.string().max(200).optional(),
});

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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

// D-ID API configuration
const DID_API_URL = "https://api.d-id.com";
const AVATAR_SOURCE_URL = "https://create-images-results.d-id.com/google-oauth2%7C107577529499234497077/upl_dFGsOFCu1aR8Pf3OOLAkd/image.png";

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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const DID_API_KEY = Deno.env.get("DID_API_KEY");
    if (!DID_API_KEY) {
      console.error("DID_API_KEY is not configured");
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

    const parseResult = AvatarRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, text, talkId } = parseResult.data;
    console.log("D-ID Avatar request:", { type, textLength: text?.length, talkId, userId });

    if (type === "create_talk") {
      if (!text) {
        return new Response(
          JSON.stringify({ error: "Text is required for creating talk" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch(`${DID_API_URL}/talks`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${DID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_url: AVATAR_SOURCE_URL,
          script: {
            type: "text",
            input: text,
            provider: { type: "microsoft", voice_id: "en-US-JennyNeural" },
          },
          config: { fluent: true, pad_audio: 0.5, stitch: true },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("D-ID create talk error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to create avatar video" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("D-ID talk created:", data.id);

      return new Response(JSON.stringify({ talkId: data.id, status: data.status }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (type === "get_talk_status") {
      if (!talkId) {
        return new Response(
          JSON.stringify({ error: "Talk ID is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch(`${DID_API_URL}/talks/${talkId}`, {
        method: "GET",
        headers: { "Authorization": `Basic ${DID_API_KEY}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("D-ID get talk error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to get avatar status" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("D-ID talk status:", data.status, data.result_url ? "has result" : "no result yet");

      return new Response(JSON.stringify({
        status: data.status,
        resultUrl: data.result_url,
        error: data.error,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid request type" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("D-ID Avatar error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
