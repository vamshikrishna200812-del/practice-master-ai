import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const CourseCompletionSchema = z.object({
  email: z.string().email().max(255).optional(), // ignored, we use auth email
  userName: z.string().max(200),
  courseName: z.string().max(500),
  completionDate: z.string().max(100),
});

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claimsData.claims.sub;

    // Rate limiting
    if (!checkRateLimit(userId as string)) {
      return new Response(
        JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again in a moment." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the user's email from auth to prevent email spoofing
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user?.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Could not verify user email" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const parseResult = CourseCompletionSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { userName, courseName, completionDate } = parseResult.data;
    
    // Use the authenticated user's email, not the one provided in the request
    const email = user.email;

    console.log(`Sending course completion email to ${email} for course: ${courseName}, userId: ${userId}`);

    const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Completion Certificate</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Congratulations, ${userName}! 🎓
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                We're thrilled to inform you that you have successfully completed the course:
              </p>
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <h2 style="color: #92400e; margin: 0; font-size: 22px; font-weight: bold;">
                  ${courseName}
                </h2>
                <p style="color: #a16207; margin: 8px 0 0 0; font-size: 14px;">
                  Completed on ${formattedDate}
                </p>
              </div>
              <p style="color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                This is a significant achievement that demonstrates your commitment to improving your interview skills and career growth.
              </p>
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px;">
                  What's Next?
                </h3>
                <ul style="color: #475569; font-size: 14px; line-height: 22px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Download your certificate from the Courses page</li>
                  <li style="margin-bottom: 8px;">Share your achievement on LinkedIn and social media</li>
                  <li style="margin-bottom: 8px;">Explore more courses to continue your learning journey</li>
                  <li>Practice with our AI Interview Bot for real interview preparation</li>
                </ul>
              </div>
              <div style="text-align: center;">
                <a href="https://aitrainingzone.lovable.app/courses" 
                   style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  View Your Certificate
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">
                Thank you for being a valued member of AITRAININGZONE. Your dedication to self-improvement inspires us!
              </p>
              <div style="color: #94a3b8; font-size: 12px;">
                <p style="margin: 0;">AITRAININGZONE - Your Personal AI Interview Coach</p>
                <p style="margin: 4px 0 0 0;">Empowering careers through AI-driven interview preparation</p>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AITRAININGZONE <onboarding@resend.dev>",
        to: [email],
        subject: `Congratulations! You've completed "${courseName}"`,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const responseData = await emailResponse.json();
    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-course-completion-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An error occurred sending the email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
