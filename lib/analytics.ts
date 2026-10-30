/**
 * Analytics & Event Tracking Utility
 * ------------------------------------
 * Umami virtual event tracking with strict zero-PII enforcement (PLAT-03).
 * Loaded via DeferredWidgets after cookie consent.
 */

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void
    }
  }
}

// Standard PLAT-03 event constants
export const TOOL_RESULT_GENERATED = 'tool_result_generated'
export const RFQ_SUBMIT = 'rfq_submit'
export const CONTACT_SUBMIT = 'contact_submit'
export const WAITLIST_JOIN = 'waitlist_join'
export const TOOL_SHARE = 'tool_share'

/**
 * Pre-defined event taxonomy.
 * Preserves legacy names alongside standard constants for backward compatibility.
 */
export const ANALYTICS_EVENTS = {
  // PLAT-03 Standard events
  TOOL_RESULT_GENERATED,
  RFQ_SUBMIT,
  CONTACT_SUBMIT,
  WAITLIST_JOIN,
  TOOL_SHARE,

  // Backward compatibility / legacy aliases
  RFQ_SUBMITTED: 'rfq_submitted',
  WAITLIST_JOINED: 'waitlist_joined',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  PORTFOLIO_VIEWED: 'portfolio_viewed',
  CASE_STUDY_OPENED: 'case_study_opened',
  ECOSYSTEM_EXPLORED: 'ecosystem_explored',
  WHATSAPP_CLICKED: 'whatsapp_clicked',
  CTA_CLICKED: 'cta_clicked',
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

const PII_KEYS = new Set([
  'email',
  'emailaddress',
  'phone',
  'phonenumber',
  'name',
  'fullname',
  'firstname',
  'lastname',
  'company',
  'companyname',
  'message',
  'notes',
  'token',
  'turnstiletoken',
  'botfield',
  'ip',
  'ipaddress',
  'address',
])

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isEmail(val: string): boolean {
  const trimmed = val.trim()
  return EMAIL_REGEX.test(trimmed) || /[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(trimmed)
}

function isPhone(val: string): boolean {
  const trimmed = val.trim()
  if (trimmed.startsWith('tel:')) return true
  const digitsOnly = trimmed.replace(/\D/g, '')

  // International format starting with + or 00 (7 to 15 digits)
  if (
    (trimmed.startsWith('+') || trimmed.startsWith('00')) &&
    /^[\d\s().+-]+$/.test(trimmed) &&
    digitsOnly.length >= 7 &&
    digitsOnly.length <= 15
  ) {
    return true
  }

  // Common formatted phone numbers with separators (e.g. 555-123-4567, (555) 234-5678)
  if (/^\(?\d{2,4}\)?[\s.-]\d{3,4}[\s.-]\d{3,4}$/.test(trimmed)) {
    return true
  }

  // Local unformatted or single-separator numbers starting with 0 (e.g. 0501234567, 050-1234567)
  if (/^0[1-9]\d{1,3}[\s.-]?\d{6,8}$/.test(trimmed)) {
    return true
  }

  return false
}

function isPiiKey(key: string): boolean {
  const lower = key.toLowerCase()
  const normalized = lower.replace(/[-_]/g, '')

  if (PII_KEYS.has(lower) || PII_KEYS.has(normalized)) return true
  if (normalized.includes('email')) return true
  if (normalized.includes('phone')) return true
  if (normalized.includes('address')) return true
  if (normalized.includes('token')) return true
  if (normalized.includes('message')) return true
  if (normalized.includes('notes')) return true
  if (normalized.includes('botfield')) return true
  if (/^(?:.*[_-])?ip(?:[_-].*)?$/i.test(key) || /^(client|user)?ip(address)?$/i.test(normalized)) {
    return true
  }
  if (
    normalized === 'username' ||
    normalized === 'contactname' ||
    normalized === 'clientname'
  ) {
    return true
  }

  return false
}

/**
 * Filter out PII keys, emails, phone numbers, and oversized strings from analytics payload.
 * Returns undefined if input is empty or all properties were stripped.
 */
export function sanitizeAnalyticsPayload(
  data?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return undefined
  }

  const entries = Object.entries(data)
  if (entries.length === 0) {
    return undefined
  }

  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of entries) {
    if (isPiiKey(key)) continue

    if (typeof value === 'string') {
      if (value.length > 100) continue
      if (isEmail(value)) continue
      if (isPhone(value)) continue
      sanitized[key] = value
    } else if (typeof value === 'number') {
      if (Number.isFinite(value)) {
        sanitized[key] = value
      }
    } else if (typeof value === 'boolean') {
      sanitized[key] = value
    }
  }

  if (Object.keys(sanitized).length === 0) {
    return undefined
  }

  return sanitized
}

/**
 * Track a custom event with zero-PII sanitization.
 * SSR safe; gracefully handles absence of window.umami.
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (!window.umami || typeof window.umami.track !== 'function') return

  const sanitized = sanitizeAnalyticsPayload(data)
  window.umami.track(eventName, sanitized)
}
