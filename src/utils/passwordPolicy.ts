/**
 * Password policy and common-password blocklist.
 *
 * Rules enforced:
 *  - min 12 characters
 *  - at least one uppercase, lowercase, number, and special character
 *  - not in the common-password blocklist
 *  - (server-side) not in HIBP-pwned database (handled by Supabase Auth setting)
 */

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

// Small but high-signal block list (top breached + obvious junk).
// Server-side HIBP catches the long tail.
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "password!", "passw0rd",
  "qwerty", "qwerty123", "qwertyuiop",
  "123456", "1234567", "12345678", "123456789", "1234567890",
  "abc123", "admin", "admin123", "letmein", "welcome", "welcome1",
  "iloveyou", "monkey", "dragon", "master", "sunshine", "princess",
  "football", "baseball", "shadow", "michael", "superman", "trustno1",
  "qazwsx", "starwars", "111111", "000000", "654321",
  "aitrainingzone", "aitrainingzone1", "aitrainingzone123",
]);

export interface PasswordCheck {
  ok: boolean;
  errors: string[];
  /** 0..100 score for the strength meter */
  score: number;
  /** Tier label */
  label: "Too Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
}

export function evaluatePassword(password: string): PasswordCheck {
  const errors: string[] = [];
  const pwd = password ?? "";
  const lower = pwd.toLowerCase();

  if (pwd.length < PASSWORD_MIN_LENGTH) errors.push(`Must be at least ${PASSWORD_MIN_LENGTH} characters`);
  if (pwd.length > PASSWORD_MAX_LENGTH) errors.push(`Must be ${PASSWORD_MAX_LENGTH} characters or fewer`);
  if (!/[A-Z]/.test(pwd)) errors.push("Must contain an uppercase letter");
  if (!/[a-z]/.test(pwd)) errors.push("Must contain a lowercase letter");
  if (!/[0-9]/.test(pwd)) errors.push("Must contain a number");
  if (!/[^A-Za-z0-9]/.test(pwd)) errors.push("Must contain a special character");
  if (COMMON_PASSWORDS.has(lower)) errors.push("This password is too common");
  if (/(.)\1{3,}/.test(pwd)) errors.push("Avoid repeating characters");

  // Score (0..100): length, character classes, entropy estimate
  let score = 0;
  if (pwd.length >= 8) score += 10;
  if (pwd.length >= 12) score += 15;
  if (pwd.length >= 16) score += 10;
  if (pwd.length >= 20) score += 10;
  if (/[A-Z]/.test(pwd)) score += 10;
  if (/[a-z]/.test(pwd)) score += 10;
  if (/[0-9]/.test(pwd)) score += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
  const variety = pwd.length ? new Set(pwd).size / pwd.length : 0;
  if (variety > 0.6) score += 10;
  if (COMMON_PASSWORDS.has(lower)) score = Math.min(score, 20);

  score = Math.max(0, Math.min(100, score));

  let label: PasswordCheck["label"];
  if (score < 30) label = "Too Weak";
  else if (score < 50) label = "Weak";
  else if (score < 70) label = "Fair";
  else if (score < 90) label = "Strong";
  else label = "Very Strong";

  return { ok: errors.length === 0, errors, score, label };
}

/** SHA-1 of password, used for HIBP k-anonymity check (first 5 chars sent to API). */
export async function sha1Hex(message: string): Promise<string> {
  const buf = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * Client-side HIBP check via k-anonymity (no plaintext password sent).
 * Returns true if the password appears in any known breach.
 */
export async function isPwned(password: string): Promise<boolean> {
  try {
    const hash = await sha1Hex(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
    });
    if (!res.ok) return false;
    const text = await res.text();
    return text
      .split("\n")
      .some((line) => line.split(":")[0]?.trim() === suffix);
  } catch {
    // Fail open so users aren't blocked by network issues. Server still rejects via Supabase HIBP setting.
    return false;
  }
}
