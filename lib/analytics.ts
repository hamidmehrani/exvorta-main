/**
 * Analytics & Event Tracking Utility
 * ------------------------------------
 * Thin wrapper around Umami for custom event tracking.
 * Umami is loaded via DeferredWidgets after cookie consent.
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics'
 *   trackEvent('rfq_submitted', { industry: 'textiles' })
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void
    }
  }
}

/**
 * Track a custom event with optional metadata.
 * Safe to call server-side (no-ops), or before Umami loads (no-ops).
 */
export const trackEvent = (eventName: string, data?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return
  if (!window.umami) return
  window.umami.track(eventName, data)
}

/**
 * Pre-defined event constants for consistent naming.
 * Always use these instead of bare strings to prevent typos.
 */
export const ANALYTICS_EVENTS = {
  // Lead generation
  RFQ_SUBMITTED: 'rfq_submitted',
  WAITLIST_JOINED: 'waitlist_joined',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',

  // Navigation
  PORTFOLIO_VIEWED: 'portfolio_viewed',
  CASE_STUDY_OPENED: 'case_study_opened',
  ECOSYSTEM_EXPLORED: 'ecosystem_explored',

  // Engagement
  WHATSAPP_CLICKED: 'whatsapp_clicked',
  CTA_CLICKED: 'cta_clicked',
  QUOTE_BAR_DISMISSED: 'quote_bar_dismissed',
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
  TOOL_SHARE: 'tool_share',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]
