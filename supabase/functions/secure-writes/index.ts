import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const POINTS_MAP: Record<string, number> = { Easy: 10, Medium: 25, Hard: 50 };
const PASS_THRESHOLD = 70;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function getUser(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await client.auth.getUser();
  return user;
}

const RequestSchema = z.object({
  action: z.enum([
    "issue_certificate",
    "submit_coding",
    "complete_assessment",
    "grant_achievement",
    "update_progress",
  ]),
  payload: z.record(z.unknown()),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: "unauthorized" }, 401);

  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "bad_request", details: parsed.error.flatten() }, 400);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { action, payload } = parsed.data;

  try {
    switch (action) {
      case "issue_certificate":      return await issueCertificate(admin, user.id, payload);
      case "submit_coding":          return await submitCoding(admin, user.id, payload);
      case "complete_assessment":    return await completeAssessment(admin, user.id, payload);
      case "grant_achievement":      return await grantAchievement(admin, user.id, payload);
      case "update_progress":        return await updateProgress(admin, user.id, payload);
    }
  } catch (e) {
    console.error(action, e);
    return json({ error: "internal_error", message: String(e) }, 500);
  }
});

// ---------- Certificates ----------
const CertSchema = z.object({
  courseId: z.string().uuid(),
  courseName: z.string().min(1).max(200),
  userName: z.string().min(1).max(200),
  completionDate: z.string().min(1),
});
async function issueCertificate(admin: any, userId: string, payload: unknown) {
  const p = CertSchema.safeParse(payload);
  if (!p.success) return json({ error: "bad_request", details: p.error.flatten() }, 400);

  // Already issued?
  const { data: existing } = await admin
    .from("certificates")
    .select("certificate_id")
    .eq("user_id", userId)
    .eq("course_id", p.data.courseId)
    .maybeSingle();
  if (existing) return json({ certificate_id: existing.certificate_id, existed: true });

  // Verify eligibility: assessment passed OR enrollment completed
  const { data: assess } = await admin
    .from("course_assessment_completions")
    .select("passed")
    .eq("user_id", userId)
    .eq("course_id", p.data.courseId)
    .eq("passed", true)
    .maybeSingle();
  let eligible = !!assess;
  if (!eligible) {
    const { data: enr } = await admin
      .from("course_enrollments")
      .select("completed")
      .eq("user_id", userId)
      .eq("course_id", p.data.courseId)
      .eq("completed", true)
      .maybeSingle();
    eligible = !!enr;
  }
  if (!eligible) return json({ error: "not_eligible" }, 403);

  const certificate_id = `CERT-${Date.now().toString(36).toUpperCase()}`;
  const { error } = await admin.from("certificates").insert({
    certificate_id,
    user_id: userId,
    course_id: p.data.courseId,
    user_name: p.data.userName,
    course_title: p.data.courseName,
    completion_date: p.data.completionDate,
  });
  if (error) return json({ error: error.message }, 400);
  return json({ certificate_id, existed: false });
}

// ---------- Coding submission ----------
const CodingSchema = z.object({
  problemId: z.string().min(1).max(100),
  problemTitle: z.string().min(1).max(300),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  language: z.string().min(1).max(40),
  code: z.string().max(50000).optional().default(""),
  passedTests: z.number().int().min(0),
  totalTests: z.number().int().min(1),
  executionTimeMs: z.number().int().min(0).max(60000).optional().default(0),
  isDailyChallenge: z.boolean().optional().default(false),
});
async function submitCoding(admin: any, userId: string, payload: unknown) {
  const p = CodingSchema.safeParse(payload);
  if (!p.success) return json({ error: "bad_request", details: p.error.flatten() }, 400);
  const d = p.data;
  if (d.passedTests > d.totalTests) return json({ error: "invalid_counts" }, 400);

  const allPassed = d.passedTests === d.totalTests;
  const verdict = allPassed ? "Accepted" : "Wrong Answer";

  // Already solved?
  const { data: solved } = await admin
    .from("coding_submissions")
    .select("id")
    .eq("user_id", userId)
    .eq("problem_id", d.problemId)
    .eq("verdict", "Accepted")
    .limit(1);
  const alreadySolved = !!(solved && solved.length);

  const base = POINTS_MAP[d.difficulty] || 10;
  const points = !allPassed || alreadySolved ? 0 : (d.isDailyChallenge ? base * 2 : base);

  const { error: subErr } = await admin.from("coding_submissions").insert({
    user_id: userId,
    problem_id: d.problemId,
    problem_title: d.problemTitle,
    language: d.language,
    code: d.code,
    verdict,
    passed_tests: d.passedTests,
    total_tests: d.totalTests,
    points_earned: points,
    execution_time_ms: d.executionTimeMs,
  });
  if (subErr) return json({ error: subErr.message }, 400);

  if (allPassed && !alreadySolved) {
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await admin
      .from("coding_points").select("*").eq("user_id", userId).maybeSingle();
    if (existing) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      let streak = existing.current_streak;
      if (existing.last_solve_date === today) { /* same day */ }
      else if (existing.last_solve_date === yesterday) streak += 1;
      else streak = 1;
      await admin.from("coding_points").update({
        total_points: existing.total_points + points,
        problems_solved: existing.problems_solved + 1,
        easy_solved: existing.easy_solved + (d.difficulty === "Easy" ? 1 : 0),
        medium_solved: existing.medium_solved + (d.difficulty === "Medium" ? 1 : 0),
        hard_solved: existing.hard_solved + (d.difficulty === "Hard" ? 1 : 0),
        current_streak: streak,
        last_solve_date: today,
        updated_at: new Date().toISOString(),
      }).eq("user_id", userId);
    } else {
      await admin.from("coding_points").insert({
        user_id: userId,
        total_points: points,
        problems_solved: 1,
        easy_solved: d.difficulty === "Easy" ? 1 : 0,
        medium_solved: d.difficulty === "Medium" ? 1 : 0,
        hard_solved: d.difficulty === "Hard" ? 1 : 0,
        current_streak: 1,
        last_solve_date: today,
      });
    }
  }

  return json({ verdict, points, alreadySolved, isDailyChallenge: d.isDailyChallenge });
}

// ---------- Assessment ----------
const AssessSchema = z.object({
  courseId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
});
async function completeAssessment(admin: any, userId: string, payload: unknown) {
  const p = AssessSchema.safeParse(payload);
  if (!p.success) return json({ error: "bad_request", details: p.error.flatten() }, 400);
  const passed = p.data.score >= PASS_THRESHOLD;
  const { data: existing } = await admin
    .from("course_assessment_completions")
    .select("id, score").eq("user_id", userId).eq("course_id", p.data.courseId).maybeSingle();
  if (existing) {
    if (p.data.score > existing.score) {
      await admin.from("course_assessment_completions")
        .update({ score: p.data.score, passed, completed_at: new Date().toISOString() })
        .eq("id", existing.id);
    }
  } else {
    await admin.from("course_assessment_completions")
      .insert({ user_id: userId, course_id: p.data.courseId, score: p.data.score, passed });
  }
  return json({ score: p.data.score, passed });
}

// ---------- Achievement ----------
const AchievementSchema = z.object({ achievementId: z.string().uuid() });
async function grantAchievement(admin: any, userId: string, payload: unknown) {
  const p = AchievementSchema.safeParse(payload);
  if (!p.success) return json({ error: "bad_request", details: p.error.flatten() }, 400);

  const { data: ach } = await admin
    .from("achievements").select("*").eq("id", p.data.achievementId).maybeSingle();
  if (!ach) return json({ error: "not_found" }, 404);

  const { data: own } = await admin
    .from("user_achievements").select("id")
    .eq("user_id", userId).eq("achievement_id", ach.id).maybeSingle();
  if (own) return json({ granted: false, reason: "already_owned" });

  // Validate criteria from real DB state
  const [{ data: progress }, { data: points }, { data: enrollments }, { data: schedules }] = await Promise.all([
    admin.from("user_progress").select("*").eq("user_id", userId).maybeSingle(),
    admin.from("coding_points").select("*").eq("user_id", userId).maybeSingle(),
    admin.from("course_enrollments").select("id, completed").eq("user_id", userId).eq("completed", true),
    admin.from("class_schedules").select("id").eq("user_id", userId),
  ]);

  const v = ach.requirement_value;
  const ok =
    (ach.requirement_type === "interviews_completed" && (progress?.total_interviews || 0) >= v) ||
    (ach.requirement_type === "high_score" && (progress?.overall_score || 0) >= v) ||
    (ach.requirement_type === "perfect_score" && (progress?.overall_score || 0) >= 100) ||
    (ach.requirement_type === "courses_completed" && (enrollments?.length || 0) >= v) ||
    (ach.requirement_type === "practice_streak" && (progress?.practice_streak || 0) >= v) ||
    (ach.requirement_type === "classes_scheduled" && (schedules?.length || 0) >= v) ||
    (ach.requirement_type === "body_language_score" && (progress?.body_language_score || 0) >= v) ||
    (ach.requirement_type === "communication_score" && (progress?.communication_score || 0) >= v) ||
    (ach.requirement_type === "coding_score" && (progress?.coding_score || 0) >= v) ||
    (ach.requirement_type === "problems_solved" && (points?.problems_solved || 0) >= v);

  if (!ok) return json({ granted: false, reason: "criteria_not_met" });
  const { error } = await admin.from("user_achievements")
    .insert({ user_id: userId, achievement_id: ach.id });
  if (error) return json({ error: error.message }, 400);
  return json({ granted: true });
}

// ---------- Progress ----------
const ProgressSchema = z.object({
  interviewType: z.enum(["behavioral", "technical", "coding"]),
  communicationScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
});
async function updateProgress(admin: any, userId: string, payload: unknown) {
  const p = ProgressSchema.safeParse(payload);
  if (!p.success) return json({ error: "bad_request", details: p.error.flatten() }, 400);
  const d = p.data;
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const overall = Math.round(0.3 * d.communicationScore + 0.3 * d.confidenceScore + 0.4 * d.technicalScore);

  await admin.from("interview_sessions").insert({
    user_id: userId, interview_type: d.interviewType, status: "completed",
    communication_score: d.communicationScore, coding_score: d.technicalScore,
    body_language_score: d.confidenceScore, overall_score: overall,
    completed_at: now.toISOString(),
  });

  const { data: existing } = await admin
    .from("user_progress").select("*").eq("user_id", userId).maybeSingle();
  const cur = existing?.total_interviews || 0;
  const next = cur + 1;
  const avg = (c: number, n: number) => cur === 0 ? n : Math.round((c * cur + n) / next);
  const comm = avg(existing?.communication_score || 0, d.communicationScore);
  const body = avg(existing?.body_language_score || 0, d.confidenceScore);
  const code = avg(existing?.coding_score || 0, d.technicalScore);
  const overallAvg = Math.round(0.3 * comm + 0.3 * body + 0.4 * code);

  let streak = 1;
  if (existing?.last_practice_date) {
    const last = new Date(existing.last_practice_date);
    const days = Math.floor((now.getTime() - last.getTime()) / 86400000);
    const lastStr = last.toISOString().split("T")[0];
    if (lastStr === today) streak = existing.practice_streak || 1;
    else if (days === 1) streak = (existing.practice_streak || 0) + 1;
  }

  const update = {
    communication_score: comm, body_language_score: body, coding_score: code,
    overall_score: overallAvg, total_interviews: next, practice_streak: streak,
    last_practice_date: today, updated_at: now.toISOString(),
  };
  if (existing) {
    await admin.from("user_progress").update(update).eq("user_id", userId);
  } else {
    await admin.from("user_progress").insert({ user_id: userId, ...update });
  }
  return json({
    totalInterviews: next, practiceStreak: streak, overallScore: overallAvg,
    bodyLanguageScore: body, communicationScore: comm,
  });
}
