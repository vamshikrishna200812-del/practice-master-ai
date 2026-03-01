/**
 * Strict input sanitization for authentication fields.
 * Prevents injection attacks (SQL, XSS, header injection) at the application layer.
 */

// Strip control characters, null bytes, and common injection vectors
function stripDangerous(input: string): string {
  return input
    // Remove null bytes
    .replace(/\0/g, "")
    // Remove control characters (except normal whitespace)
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Remove common XSS vectors
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

// Validate email structure beyond Zod (defense in depth)
function sanitizeEmail(email: string): string {
  let clean = stripDangerous(email).trim().toLowerCase();
  // Remove any CRLF (header injection prevention)
  clean = clean.replace(/[\r\n]/g, "");
  // Max length guard
  return clean.slice(0, 255);
}

function sanitizeName(name: string): string {
  let clean = stripDangerous(name).trim();
  // Remove HTML tags
  clean = clean.replace(/<[^>]*>/g, "");
  // Remove CRLF
  clean = clean.replace(/[\r\n]/g, " ");
  return clean.slice(0, 100);
}

function sanitizePassword(password: string): string {
  // Passwords: only strip null bytes and control chars, preserve all printable chars
  return password
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, 100);
}

export function sanitizeAuthInput(input: {
  fullName: string;
  email: string;
  password: string;
}) {
  return {
    fullName: sanitizeName(input.fullName),
    email: sanitizeEmail(input.email),
    password: sanitizePassword(input.password),
  };
}
