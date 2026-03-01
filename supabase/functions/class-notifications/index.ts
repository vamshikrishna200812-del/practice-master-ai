import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "AITRAININGZONE <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) console.error("Email send failed:", await res.text());
}

function buildBookingEmail(classTitle: string, scheduledAt: string, _classId: string) {
  const date = new Date(scheduledAt);
  const formatted = date.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(classTitle)}&dates=${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${new Date(date.getTime() + 3600000).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: 'Inter', Arial, sans-serif; background: #ffffff; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 16px; padding: 32px; color: white; text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0 0 8px; font-size: 24px;">🎓 Class Booked!</h1>
      <p style="margin: 0; opacity: 0.9; font-size: 14px;">Your AI classroom session is confirmed</p>
    </div>
    <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px;">${classTitle}</h2>
      <p style="margin: 0 0 8px; color: #64748b;">📅 ${formatted}</p>
      <p style="margin: 0 0 8px; color: #64748b;">⏱️ Duration: 60 minutes</p>
      <p style="margin: 0; color: #64748b;">🤖 Instructor: AI Teacher</p>
    </div>
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${calendarUrl}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">📅 Add to Google Calendar</a>
    </div>
    <p style="color: #94a3b8; font-size: 12px; text-align: center;">AITRAININGZONE — Your AI Interview Training Platform</p>
  </div>
</body></html>`;
}

function buildReminderEmail(classTitle: string, scheduledAt: string, minutesBefore: number) {
  const date = new Date(scheduledAt);
  const formatted = date.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: 'Inter', Arial, sans-serif; background: #ffffff; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); border-radius: 16px; padding: 32px; color: white; text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0 0 8px; font-size: 24px;">⏰ Class Starting ${minutesBefore === 15 ? "in 15 Minutes" : "in 1 Hour"}!</h1>
      <p style="margin: 0; opacity: 0.9;">${classTitle}</p>
    </div>
    <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="color: #64748b; margin: 0 0 16px;">📅 ${formatted}</p>
      <h3 style="margin: 0 0 8px; color: #1e293b;">What you'll learn today:</h3>
      <ul style="text-align: left; color: #475569; padding-left: 20px;">
        <li>Core interview strategies & frameworks</li>
        <li>Live Q&A with AI instructor</li>
        <li>Hands-on practice techniques</li>
      </ul>
    </div>
    <div style="text-align: center;">
      <a href="https://aitraningzone.lovable.app/classroom" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 18px;">🚀 Enter Classroom</a>
    </div>
  </div>
</body></html>`;
}

function buildFollowUpEmail(classTitle: string, duration: number) {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: 'Inter', Arial, sans-serif; background: #ffffff; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px; padding: 32px; color: white; text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0 0 8px; font-size: 24px;">🎉 Class Complete!</h1>
      <p style="margin: 0; opacity: 0.9;">Great job completing "${classTitle}"</p>
    </div>
    <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="color: #64748b; margin: 0 0 16px;">Session duration: ${Math.round(duration / 60)} minutes</p>
      <div style="display: inline-block; background: #fef3c7; border-radius: 8px; padding: 12px 24px;">
        <span style="font-size: 24px;">🏆</span>
        <p style="margin: 4px 0 0; color: #92400e; font-weight: 600;">+50 Points Earned!</p>
      </div>
    </div>
    <div style="text-align: center;">
      <a href="https://aitraningzone.lovable.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600;">View Your Progress</a>
    </div>
    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">Keep practicing to improve your interview skills!</p>
  </div>
</body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, classTitle, scheduledAt, classId, duration, email } = await req.json();

    if (action === "booking_confirmation" && email) {
      await sendEmail(email, `🎓 Class Booked: ${classTitle}`, buildBookingEmail(classTitle, scheduledAt, classId));
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "send_reminder" && email) {
      const minutesBefore = 15;
      await sendEmail(email, `⏰ "${classTitle}" starts in ${minutesBefore} minutes!`, buildReminderEmail(classTitle, scheduledAt, minutesBefore));
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "send_followup" && email) {
      await sendEmail(email, `🎉 Class Complete: ${classTitle}`, buildFollowUpEmail(classTitle, duration || 0));
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Cron: check for upcoming classes
    if (action === "check_reminders") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const adminClient = createClient(supabaseUrl, supabaseKey);

      const now = new Date();
      const fifteenMinsLater = new Date(now.getTime() + 16 * 60000);
      const fourteenMinsLater = new Date(now.getTime() + 14 * 60000);

      // Find classes starting in ~15 minutes
      const { data: upcoming } = await adminClient
        .from("class_schedules")
        .select("*, profiles!class_schedules_user_id_fkey(full_name)")
        .eq("status", "scheduled")
        .gte("scheduled_at", fourteenMinsLater.toISOString())
        .lte("scheduled_at", fifteenMinsLater.toISOString());

      if (upcoming?.length) {
        for (const cls of upcoming) {
          // Create in-app notification
          await adminClient.from("notifications").insert({
            user_id: cls.user_id,
            title: `⏰ Class in 15 minutes!`,
            message: `"${cls.title}" is starting soon. Click to join!`,
            type: "class_reminder",
            link: `/classroom?id=${cls.id}`,
          });

          // Get user email for email notification
          const { data: userData } = await adminClient.auth.admin.getUserById(cls.user_id);
          if (userData?.user?.email) {
            await sendEmail(
              userData.user.email,
              `⏰ "${cls.title}" starts in 15 minutes!`,
              buildReminderEmail(cls.title, cls.scheduled_at, 15)
            );
          }
        }
      }

      return new Response(JSON.stringify({ checked: upcoming?.length || 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Class notification error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
