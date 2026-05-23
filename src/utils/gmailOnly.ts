/**
 * Gmail-only validator. Enforces:
 *  - well-formed email
 *  - domain is exactly gmail.com (no googlemail.com, no plus-addressing tricks)
 */
export const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export function isGmail(email: string): boolean {
  return GMAIL_REGEX.test(email.trim().toLowerCase());
}

export function gmailError(): string {
  return "Only @gmail.com addresses are accepted.";
}

/** Mask an email for display: jonathan@gmail.com → j******n@gmail.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local[0]}${"*".repeat(Math.max(local.length - 2, 1))}${local[local.length - 1]}@${domain}`;
}
