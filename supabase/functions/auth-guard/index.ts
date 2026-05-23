/**
 * auth-guard: server-side gatekeeper for sensitive auth events.
 * Actions:
 *  - check_login: returns whether the email is currently locked out
 *  - record_login_failure: increments fail counter; locks after 5 fails for 15 minutes
 *  - record_login_success: clears fail counter; registers device; logs audit
 *  - log_event: append-only event log (signup, logout, password_reset, otp_sent, etc.)
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MAX_FAILED = 5;
const LOCKOUT_MIN = 15;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const Schema = z.object({
  action: z.enum([
    "check_login",
    "record_login_failure",
    "record_login_success",
    "log_event",
  ]),
  email: z.string().email().max(255).optional(),
  userId: z.string().uuid().optional(),
  eventType: z.string().max(50).optional(),
  deviceHash: z.string().max(200).optional(),
  metadata: z.record(z.unknown()).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "bad_request", details: parsed.error.flatten() }, 400);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;
  const { action, email, userId, eventType, deviceHash, metadata } = parsed.data;
  const emailLower = email?.toLowerCase();

  try {
    switch (action) {
      case "check_login": {
        if (!emailLower) return json({ allowed: true });
        const { data } = await admin
          .from("auth_login_attempts")
          .select("locked_until, failed_count")
          .eq("email", emailLower)
          .maybeSingle();
        const locked = data?.locked_until && new Date(data.locked_until) > new Date();
        if (locked) {
          const seconds = Math.ceil(
            (new Date(data.locked_until).getTime() - Date.now()) / 1000
          );
          return json({
            allowed: false,
            lockedSeconds: seconds,
            failedCount: data?.failed_count ?? 0,
          });
        }
        return json({ allowed: true, failedCount: data?.failed_count ?? 0 });
      }

      case "record_login_failure": {
        if (!emailLower) return json({ ok: true });
        const { data: existing } = await admin
          .from("auth_login_attempts")
          .select("*")
          .eq("email", emailLower)
          .maybeSingle();
        const failed = (existing?.failed_count ?? 0) + 1;
        const shouldLock = failed >= MAX_FAILED;
        const locked_until = shouldLock
          ? new Date(Date.now() + LOCKOUT_MIN * 60_000).toISOString()
          : existing?.locked_until ?? null;

        if (existing) {
          await admin
            .from("auth_login_attempts")
            .update({
              failed_count: failed,
              locked_until,
              updated_at: new Date().toISOString(),
            })
            .eq("email", emailLower);
        } else {
          await admin.from("auth_login_attempts").insert({
            email: emailLower,
            failed_count: failed,
            first_failed_at: new Date().toISOString(),
            locked_until,
          });
        }

        await admin.from("auth_audit_log").insert({
          email: emailLower,
          event_type: "login_failure",
          ip_address: ip,
          user_agent: ua,
          metadata: { failedCount: failed, locked: shouldLock },
        });

        return json({
          ok: true,
          failedCount: failed,
          locked: shouldLock,
          lockedSeconds: shouldLock ? LOCKOUT_MIN * 60 : 0,
        });
      }

      case "record_login_success": {
        if (emailLower) {
          await admin
            .from("auth_login_attempts")
            .delete()
            .eq("email", emailLower);
        }

        let isNewDevice = false;
        if (userId && deviceHash) {
          const { data: known } = await admin
            .from("auth_known_devices")
            .select("id")
            .eq("user_id", userId)
            .eq("device_hash", deviceHash)
            .maybeSingle();
          if (known) {
            await admin
              .from("auth_known_devices")
              .update({ last_seen_at: new Date().toISOString() })
              .eq("id", known.id);
          } else {
            await admin.from("auth_known_devices").insert({
              user_id: userId,
              device_hash: deviceHash,
              user_agent: ua,
            });
            isNewDevice = true;
          }
        }

        await admin.from("auth_audit_log").insert({
          user_id: userId ?? null,
          email: emailLower ?? null,
          event_type: "login_success",
          ip_address: ip,
          user_agent: ua,
          metadata: { isNewDevice },
        });

        return json({ ok: true, isNewDevice });
      }

      case "log_event": {
        if (!eventType) return json({ error: "missing_event_type" }, 400);
        await admin.from("auth_audit_log").insert({
          user_id: userId ?? null,
          email: emailLower ?? null,
          event_type: eventType,
          ip_address: ip,
          user_agent: ua,
          metadata: metadata ?? {},
        });
        return json({ ok: true });
      }
    }
  } catch (e) {
    console.error("auth-guard error:", e);
    return json({ error: "internal_error", message: String(e) }, 500);
  }
});
