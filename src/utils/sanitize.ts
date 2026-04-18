/**
 * Sanitize utility — strips HTML tags and limits length.
 * Prevents XSS from user-submitted content displayed via dangerouslySetInnerHTML or similar.
 */

export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')          // strip HTML tags
    .replace(/[<>"'`]/g, (c) => ({    // escape dangerous chars
      '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#39;', '`': '&#96;',
    }[c] ?? c))
    .trim()
    .slice(0, maxLength);
}

export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  // Only allow http / https / mailto
  if (!/^(https?:\/\/|mailto:)/i.test(trimmed)) return '';
  // Prevent javascript: and data: URIs
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
  return trimmed.slice(0, 2048);
}

export function sanitizeNumber(input: unknown, min = 0, max = 99999): number {
  const n = Number(input);
  if (isNaN(n)) return min;
  return Math.min(max, Math.max(min, Math.floor(n)));
}
