/**
 * Cookie-consent state, kept in a plain (non-httpOnly) cookie so the static,
 * CDN-cached pages can read it on the client. The previous implementation used
 * an httpOnly cookie read with `cookies()` in the root layout, which forced
 * every route to render per request. Consent is not a secret — nothing
 * sensitive is stored here.
 */
export const CONSENT_COOKIE = 'exv_consent'
export const CONSENT_EVENT = 'exv:consent'

export type Consent = 'accepted' | 'declined' | null

export function readConsent(): Consent {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))
  const value = match?.[1]
  return value === 'accepted' || value === 'declined' ? value : null
}

export function writeConsent(value: 'accepted' | 'declined') {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new Event(CONSENT_EVENT))
}
