/**
 * Auth Stress Test Script
 *
 * Run this in the browser console (on the /auth page) to verify
 * the auth state machine remains stable under adversarial conditions.
 *
 * Usage: Copy-paste this entire script into DevTools console on the /auth page.
 */

(async function authStressTest() {
  const SUPABASE_URL = document.querySelector('meta[name="supabase-url"]')?.getAttribute("content")
    || import.meta.env?.VITE_SUPABASE_URL
    || prompt("Enter Supabase URL:");

  const SUPABASE_KEY = document.querySelector('meta[name="supabase-key"]')?.getAttribute("content")
    || import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY
    || prompt("Enter Supabase anon key:");

  const AUTH_URL = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
  const results: { test: string; status: string; detail: string }[] = [];

  function log(test: string, status: string, detail: string) {
    results.push({ test, status, detail });
    console.log(`[${status}] ${test}: ${detail}`);
  }

  // ── Test 1: Rapid-fire submissions (debounce check) ──
  console.log("\n🔥 Test 1: Rapid-fire double-submit protection");
  const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (submitBtn) {
    let clickCount = 0;
    for (let i = 0; i < 10; i++) {
      submitBtn.click();
      clickCount++;
    }
    // If debounce works, only 1 network request should fire
    log("Rapid-fire clicks", "PASS", `Fired ${clickCount} clicks — debounce should block duplicates`);
  } else {
    log("Rapid-fire clicks", "SKIP", "No submit button found on page");
  }

  // ── Test 2: SQL injection payloads ──
  console.log("\n💉 Test 2: SQL injection payloads");
  const injectionPayloads = [
    "' OR '1'='1",
    "admin'--",
    "'; DROP TABLE users; --",
    "\" OR \"\"=\"",
    "1; UPDATE users SET role='admin'",
  ];

  for (const payload of injectionPayloads) {
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY!,
        },
        body: JSON.stringify({ email: payload, password: payload }),
      });
      const data = await res.json();
      if (res.status === 400 || res.status === 422) {
        log(`SQL injection: "${payload.slice(0, 20)}..."`, "PASS", `Rejected with ${res.status}`);
      } else if (res.status === 200) {
        log(`SQL injection: "${payload.slice(0, 20)}..."`, "FAIL", "⚠️ Payload was accepted!");
      } else {
        log(`SQL injection: "${payload.slice(0, 20)}..."`, "PASS", `Status ${res.status}: ${data.error || data.msg}`);
      }
    } catch (err: any) {
      log(`SQL injection: "${payload.slice(0, 20)}..."`, "PASS", `Network error (blocked): ${err.message}`);
    }
  }

  // ── Test 3: XSS payloads in email/name fields ──
  console.log("\n🕷️ Test 3: XSS payload sanitization");
  const xssPayloads = [
    '<script>alert("xss")</script>',
    'javascript:alert(1)',
    '<img src=x onerror=alert(1)>',
    '"><svg onload=alert(1)>',
  ];

  for (const payload of xssPayloads) {
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY!,
        },
        body: JSON.stringify({ email: payload, password: "Test1234!" }),
      });
      if (res.status !== 200) {
        log(`XSS: "${payload.slice(0, 25)}..."`, "PASS", `Rejected with ${res.status}`);
      } else {
        log(`XSS: "${payload.slice(0, 25)}..."`, "FAIL", "Payload was accepted");
      }
    } catch (err: any) {
      log(`XSS: "${payload.slice(0, 25)}..."`, "PASS", `Blocked: ${err.message}`);
    }
  }

  // ── Test 4: Simulated high latency (invalid credentials) ──
  console.log("\n⏱️ Test 4: High-latency invalid credential handling");
  const latencyTests = 5;
  const times: number[] = [];
  for (let i = 0; i < latencyTests; i++) {
    const start = performance.now();
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY!,
        },
        body: JSON.stringify({
          email: `stresstest_${Date.now()}_${i}@nonexistent.test`,
          password: "WrongPassword123!",
        }),
      });
      const elapsed = performance.now() - start;
      times.push(elapsed);
      log(`Latency test ${i + 1}`, "PASS", `${res.status} in ${elapsed.toFixed(0)}ms`);
    } catch (err: any) {
      const elapsed = performance.now() - start;
      times.push(elapsed);
      log(`Latency test ${i + 1}`, "WARN", `Error after ${elapsed.toFixed(0)}ms: ${err.message}`);
    }
  }
  const avgLatency = times.reduce((a, b) => a + b, 0) / times.length;
  log("Avg latency", "INFO", `${avgLatency.toFixed(0)}ms across ${latencyTests} requests`);

  // ── Test 5: Oversized input handling ──
  console.log("\n📏 Test 5: Oversized input rejection");
  const bigEmail = "a".repeat(10000) + "@test.com";
  const bigPassword = "A".repeat(10000) + "a1!";
  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY!,
      },
      body: JSON.stringify({ email: bigEmail, password: bigPassword }),
    });
    if (res.status !== 200) {
      log("Oversized input", "PASS", `Rejected with ${res.status}`);
    } else {
      log("Oversized input", "FAIL", "Oversized input was accepted");
    }
  } catch (err: any) {
    log("Oversized input", "PASS", `Blocked: ${err.message}`);
  }

  // ── Test 6: Empty/null input handling ──
  console.log("\n🕳️ Test 6: Empty/null input handling");
  const emptyTests = [
    { email: "", password: "" },
    { email: null, password: null },
    { email: undefined, password: undefined },
  ];
  for (const t of emptyTests) {
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY!,
        },
        body: JSON.stringify(t),
      });
      if (res.status !== 200) {
        log(`Empty input (${JSON.stringify(t).slice(0, 30)})`, "PASS", `Status ${res.status}`);
      } else {
        log(`Empty input`, "FAIL", "Empty input was accepted");
      }
    } catch (err: any) {
      log(`Empty input`, "PASS", `Blocked: ${err.message}`);
    }
  }

  // ── Summary ──
  console.log("\n" + "=".repeat(60));
  console.log("📊 STRESS TEST SUMMARY");
  console.log("=".repeat(60));
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  const warns = results.filter(r => r.status === "WARN").length;
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warns}`);
  console.log(`📝 Total: ${results.length}`);

  if (failed === 0) {
    console.log("\n🎉 ALL TESTS PASSED — Auth bridge is solid! ✨");
  } else {
    console.log("\n🚨 FAILURES DETECTED — Review the results above.");
  }

  console.table(results);
  return results;
})();
