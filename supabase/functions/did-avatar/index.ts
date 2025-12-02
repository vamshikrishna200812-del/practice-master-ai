import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AvatarRequest {
  type: "create_talk" | "get_talk_status";
  text?: string;
  talkId?: string;
}

// D-ID API configuration
const DID_API_URL = "https://api.d-id.com";

// Professional AI interviewer avatar (D-ID's presenter)
const AVATAR_SOURCE_URL = "https://create-images-results.d-id.com/google-oauth2%7C107577529499234497077/upl_dFGsOFCu1aR8Pf3OOLAkd/image.png";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DID_API_KEY = Deno.env.get("DID_API_KEY");
    if (!DID_API_KEY) {
      throw new Error("DID_API_KEY is not configured");
    }

    const { type, text, talkId }: AvatarRequest = await req.json();
    console.log("D-ID Avatar request:", { type, textLength: text?.length, talkId });

    if (type === "create_talk") {
      if (!text) {
        throw new Error("Text is required for creating talk");
      }

      // Create a talk video with the avatar
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
            provider: {
              type: "microsoft",
              voice_id: "en-US-JennyNeural", // Professional female voice
            },
          },
          config: {
            fluent: true,
            pad_audio: 0.5,
            stitch: true,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("D-ID create talk error:", response.status, errorText);
        throw new Error(`D-ID API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("D-ID talk created:", data.id);

      return new Response(JSON.stringify({ 
        talkId: data.id,
        status: data.status,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (type === "get_talk_status") {
      if (!talkId) {
        throw new Error("Talk ID is required");
      }

      // Get talk status and result URL
      const response = await fetch(`${DID_API_URL}/talks/${talkId}`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${DID_API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("D-ID get talk error:", response.status, errorText);
        throw new Error(`D-ID API error: ${response.status}`);
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

    throw new Error("Invalid request type");

  } catch (error) {
    console.error("D-ID Avatar error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
