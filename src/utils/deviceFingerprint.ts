/**
 * Stable, low-entropy device fingerprint used only to detect new browser/device
 * combinations for a user. Not a tracking signal.
 */
export function deviceFingerprint(): string {
  const parts = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ];
  return parts.join("|");
}
