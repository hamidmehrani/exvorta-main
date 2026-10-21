/**
 * CMS eyebrows are authored with their own brackets ("[ ENGINE V1.0 LIVE ]")
 * while some components add brackets themselves. Strip the authored pair so a
 * label is never rendered as "[ [ … ] ]".
 */
export function unbracket(value: string | null | undefined): string {
  return (value ?? '').replace(/^\s*\[\s*/, '').replace(/\s*\]\s*$/, '').trim()
}
