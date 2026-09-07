/**
 * Security and privacy sanitization utilities for Muhammad Arslan Portfolio
 */

/**
 * Escapes characters that could break out of a <script type="application/ld+json"> block.
 * In particular, </script> sequences or HTML entities can cause reflected/stored DOM XSS.
 */
export function sanitizeJsonLd(data: unknown): string {
  const json = JSON.stringify(data);
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Validates and sanitizes a URL to ensure it uses a safe protocol.
 * Neutralizes dangerous pseudoprotocols like javascript:, data:, vbscript:
 *
 * Allowed protocols: http:, https:, mailto:, tel:
 * Allowed relative formats: /path, #hash
 */
export function sanitizeUrl(url: string | undefined | null, fallback = "#"): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();

  // Allow relative URLs starting with / or #
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    // Prevent protocol-relative URLs (//malicious.com) from bypassing if needed,
    // or normalize them safely.
    if (trimmed.startsWith("//")) {
      return `https:${trimmed}`;
    }
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();

    if (["http:", "https:", "mailto:", "tel:"].includes(protocol)) {
      return trimmed;
    }
  } catch {
    // If it fails URL parsing but looks like a safe relative hash or slug
    if (/^[a-zA-Z0-9_\-./#?&=]+$/.test(trimmed)) {
      return trimmed;
    }
  }

  return fallback;
}

/**
 * Validates email format according to a secure RFC 5322 subset pattern.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  // Standard strict regex for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/**
 * Client-side rate-limiting helper using localStorage/sessionStorage.
 * Prevents rapid automated spam loops.
 */
export function rateLimitCheck(key: string, cooldownMs: number): { allowed: boolean; remainingSec: number } {
  if (typeof window === "undefined") {
    return { allowed: true, remainingSec: 0 };
  }

  const storageKey = `sec_rl_${key}`;
  const now = Date.now();

  try {
    const lastAttemptStr = window.localStorage.getItem(storageKey);
    if (lastAttemptStr) {
      const lastAttempt = parseInt(lastAttemptStr, 10);
      const elapsed = now - lastAttempt;
      if (elapsed < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - elapsed) / 1000);
        return { allowed: false, remainingSec };
      }
    }
    window.localStorage.setItem(storageKey, now.toString());
  } catch {
    // Fallback if localStorage is disabled or restricted
    return { allowed: true, remainingSec: 0 };
  }

  return { allowed: true, remainingSec: 0 };
}
