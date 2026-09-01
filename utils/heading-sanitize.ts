/**
 * Sanitizes CMS-authored inline HTML for headings.
 *
 * Legacy CMS content carries `class="text-white/40..60"` spans that were
 * designed for dark heroes. On light sections those are invisible. This
 * rewrites them to the brand emerald accent. Callers that already render on
 * a dark background can skip this.
 */
export function sanitizeHeadingHtml(html: string, opts?: { onDark?: boolean }): string {
  if (opts?.onDark) return html
  return html.replace(/class="text-white\/(30|40|50|60)"/g, 'class="text-brand-emerald"')
}
