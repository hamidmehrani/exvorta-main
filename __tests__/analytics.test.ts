import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  sanitizeAnalyticsPayload,
  trackEvent,
  TOOL_RESULT_GENERATED,
  RFQ_SUBMIT,
  CONTACT_SUBMIT,
  WAITLIST_JOIN,
  TOOL_SHARE,
  ANALYTICS_EVENTS,
} from '@/lib/analytics'

describe('sanitizeAnalyticsPayload', () => {
  it('returns undefined for null, undefined, empty object, or non-object input', () => {
    expect(sanitizeAnalyticsPayload(null as unknown as Record<string, unknown>)).toBeUndefined()
    expect(sanitizeAnalyticsPayload(undefined)).toBeUndefined()
    expect(sanitizeAnalyticsPayload({})).toBeUndefined()
    expect(sanitizeAnalyticsPayload('invalid' as unknown as Record<string, unknown>)).toBeUndefined()
    expect(sanitizeAnalyticsPayload(12345 as unknown as Record<string, unknown>)).toBeUndefined()
    expect(sanitizeAnalyticsPayload(true as unknown as Record<string, unknown>)).toBeUndefined()
    expect(sanitizeAnalyticsPayload([] as unknown as Record<string, unknown>)).toBeUndefined()
    expect(sanitizeAnalyticsPayload(['item'] as unknown as Record<string, unknown>)).toBeUndefined()
  })

  it('strips direct PII keys (case-insensitive and normalized)', () => {
    const directPiiPayload: Record<string, unknown> = {
      email: 'test@example.com',
      emailAddress: 'user@example.com',
      phone: '1234567890',
      phoneNumber: '1234567890',
      name: 'John Doe',
      fullName: 'Johnathan Doe',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Exvorta Corp',
      companyName: 'Exvorta International',
      message: 'Hello world inquiry',
      notes: 'Internal operator notes',
      token: 'secret-token-xyz',
      turnstileToken: 'cf-turnstile-token',
      botField: 'honeypot-value',
      ip: '192.168.1.1',
      ipAddress: '10.0.0.1',
      address: 'Tehran, Iran',
      // Operational non-PII attribute to verify retention alongside stripped fields
      tool_id: 'price-estimator',
    }

    const result = sanitizeAnalyticsPayload(directPiiPayload)
    expect(result).toEqual({ tool_id: 'price-estimator' })
  })

  it('strips case-insensitive and normalized PII key variations', () => {
    const variationsPayload = {
      EMAIL: 'john@example.com',
      Email_Address: 'jane@example.com',
      phone_number: '555-123-4567',
      'FIRST-NAME': 'Jane',
      'last_name': 'Smith',
      'Company-Name': 'Global Logistics',
      'user_ip_address': '127.0.0.1',
      turnstile_token: 'cf-abc-123',
      category: 'fintech',
    }

    const result = sanitizeAnalyticsPayload(variationsPayload)
    expect(result).toEqual({ category: 'fintech' })
  })

  it('strips string values matching email patterns', () => {
    const payload = {
      search_query: 'test@example.com',
      contact_alias: 'user+tag@domain.co',
      valid_tag: 'analytics',
    }

    const result = sanitizeAnalyticsPayload(payload)
    expect(result).toEqual({ valid_tag: 'analytics' })
  })

  it('strips string values matching phone number formats', () => {
    const payload = {
      intl_format: '+1 (555) 000-0000',
      local_format: '0501234567',
      dashed_format: '555-123-4567',
      tel_prefix: 'tel:+982112345678',
      channel: 'web',
    }

    const result = sanitizeAnalyticsPayload(payload)
    expect(result).toEqual({ channel: 'web' })
  })

  it('strips string values exceeding 100 characters in length', () => {
    const exactly100Chars = 'a'.repeat(100)
    const exceeds100Chars = 'b'.repeat(101)

    const payload = {
      valid_description: exactly100Chars,
      oversized_description: exceeds100Chars,
      operational_mode: 'fast',
    }

    const result = sanitizeAnalyticsPayload(payload)
    expect(result).toEqual({
      valid_description: exactly100Chars,
      operational_mode: 'fast',
    })
  })

  it('retains valid, safe non-PII categorical and operational attributes', () => {
    const safePayload = {
      tool_id: 'cost-calculator',
      tool_name: 'Freight Cost Calculator',
      businessType: 'logistics',
      budget: 'high',
      source: 'landing_hero',
      category: 'freight',
      method: 'sea',
      step: 'review_results',
    }

    const result = sanitizeAnalyticsPayload(safePayload)
    expect(result).toEqual(safePayload)
  })

  it('retains finite numbers and boolean values while discarding non-finite numbers', () => {
    const mixedPayload = {
      step: 2,
      budget: 25000,
      score: 0,
      negative_offset: -15,
      is_enterprise: true,
      has_vat: false,
      invalid_nan: NaN,
      invalid_inf: Infinity,
      invalid_neg_inf: -Infinity,
      category: 'export',
    }

    const result = sanitizeAnalyticsPayload(mixedPayload)
    expect(result).toEqual({
      step: 2,
      budget: 25000,
      score: 0,
      negative_offset: -15,
      is_enterprise: true,
      has_vat: false,
      category: 'export',
    })
  })

  it('returns undefined if all fields in the payload are stripped out', () => {
    expect(
      sanitizeAnalyticsPayload({
        email: 'test@example.com',
        phone: '0501234567',
        message: 'A message note here',
      }),
    ).toBeUndefined()

    expect(
      sanitizeAnalyticsPayload({
        oversized: 'x'.repeat(105),
      }),
    ).toBeUndefined()

    expect(
      sanitizeAnalyticsPayload({
        custom_input: 'test@example.com',
      }),
    ).toBeUndefined()
  })
})

describe('trackEvent', () => {
  const originalWindow = globalThis.window

  afterEach(() => {
    if (originalWindow === undefined) {
      delete (globalThis as unknown as { window?: unknown }).window
    } else {
      globalThis.window = originalWindow
    }
    vi.restoreAllMocks()
  })

  it('SSR safe: handles typeof window === "undefined" without throwing', () => {
    delete (globalThis as unknown as { window?: unknown }).window
    expect(typeof window).toBe('undefined')

    expect(() => {
      trackEvent('test_ssr_event', { tool_id: 'pricing-tool' })
    }).not.toThrow()
  })

  it('handles client environment when window.umami is undefined or has no track function without throwing', () => {
    // window defined, but umami is undefined
    ;(globalThis as unknown as { window: unknown }).window = {}
    expect(() => {
      trackEvent('test_client_event', { tool_id: 'pricing-tool' })
    }).not.toThrow()

    // window.umami is an empty object without track
    ;(globalThis as unknown as { window: unknown }).window = { umami: {} }
    expect(() => {
      trackEvent('test_client_event', { tool_id: 'pricing-tool' })
    }).not.toThrow()

    // window.umami.track is not a function
    ;(globalThis as unknown as { window: unknown }).window = {
      umami: { track: 'not_a_function' },
    }
    expect(() => {
      trackEvent('test_client_event', { tool_id: 'pricing-tool' })
    }).not.toThrow()
  })

  it('when window.umami exists and has track function, calls window.umami.track(eventName, sanitizedPayload)', () => {
    const trackMock = vi.fn()
    ;(globalThis as unknown as { window: unknown }).window = {
      umami: {
        track: trackMock,
      },
    }

    trackEvent('tool_result_generated', {
      tool_id: 'customs-calc',
      budget: 10000,
      businessType: 'import',
    })

    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith('tool_result_generated', {
      tool_id: 'customs-calc',
      budget: 10000,
      businessType: 'import',
    })
  })

  it('verifies that PII fields are stripped before window.umami.track is called', () => {
    const trackMock = vi.fn()
    ;(globalThis as unknown as { window: unknown }).window = {
      umami: {
        track: trackMock,
      },
    }

    trackEvent('rfq_submit', {
      email: 'lead@example.com',
      phoneNumber: '+1 (555) 000-0000',
      message: 'Inquiry details that should be stripped',
      businessType: 'manufacturer',
      step: 'final',
    })

    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith('rfq_submit', {
      businessType: 'manufacturer',
      step: 'final',
    })
  })

  it('sanitizes sensitive keys (name, email, phone, token, message, ip) before dispatching', () => {
    const trackMock = vi.fn()
    ;(globalThis as unknown as { window: unknown }).window = {
      umami: {
        track: trackMock,
      },
    }

    trackEvent(CONTACT_SUBMIT, {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+971501234567',
      token: 'turnstile-token-secret',
      message: 'Confidential commercial inquiry',
      ip: '192.168.1.1',
      form: 'contact',
    })

    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith(CONTACT_SUBMIT, {
      form: 'contact',
    })
  })

  it('tracks all 5 standard PLAT-03 event types correctly', () => {
    const trackMock = vi.fn()
    ;(globalThis as unknown as { window: unknown }).window = {
      umami: {
        track: trackMock,
      },
    }

    // 1. TOOL_RESULT_GENERATED
    trackEvent(TOOL_RESULT_GENERATED, {
      tool_id: 'incoterm-cbm',
      incoterm: 'FOB',
      transport_mode: 'sea',
      doc_type: 'commercial-invoice',
    })
    expect(trackMock).toHaveBeenNthCalledWith(1, TOOL_RESULT_GENERATED, {
      tool_id: 'incoterm-cbm',
      incoterm: 'FOB',
      transport_mode: 'sea',
      doc_type: 'commercial-invoice',
    })

    // 2. RFQ_SUBMIT
    trackEvent(RFQ_SUBMIT, {
      business_type: 'freight-forwarder',
      main_markets: 'Middle East',
      budget: '$50k-$100k',
    })
    expect(trackMock).toHaveBeenNthCalledWith(2, RFQ_SUBMIT, {
      business_type: 'freight-forwarder',
      main_markets: 'Middle East',
      budget: '$50k-$100k',
    })

    // 3. CONTACT_SUBMIT
    trackEvent(CONTACT_SUBMIT, {
      form: 'contact',
    })
    expect(trackMock).toHaveBeenNthCalledWith(3, CONTACT_SUBMIT, {
      form: 'contact',
    })

    // 4. WAITLIST_JOIN
    trackEvent(WAITLIST_JOIN, {
      source: 'waitlist',
    })
    expect(trackMock).toHaveBeenNthCalledWith(4, WAITLIST_JOIN, {
      source: 'waitlist',
    })

    // 5. TOOL_SHARE
    trackEvent(TOOL_SHARE, {
      tool_id: 'docs-generator',
      method: 'print_pdf',
    })
    expect(trackMock).toHaveBeenNthCalledWith(5, TOOL_SHARE, {
      tool_id: 'docs-generator',
      method: 'print_pdf',
    })
  })
})

describe('Event Constants and Exports', () => {
  it('verifies standard event constants', () => {
    expect(TOOL_RESULT_GENERATED).toBe('tool_result_generated')
    expect(RFQ_SUBMIT).toBe('rfq_submit')
    expect(CONTACT_SUBMIT).toBe('contact_submit')
    expect(WAITLIST_JOIN).toBe('waitlist_join')
    expect(TOOL_SHARE).toBe('tool_share')
  })

  it('verifies ANALYTICS_EVENTS contains standard constants and backward-compatible legacy aliases', () => {
    // Standard constants
    expect(ANALYTICS_EVENTS.TOOL_RESULT_GENERATED).toBe('tool_result_generated')
    expect(ANALYTICS_EVENTS.RFQ_SUBMIT).toBe('rfq_submit')
    expect(ANALYTICS_EVENTS.CONTACT_SUBMIT).toBe('contact_submit')
    expect(ANALYTICS_EVENTS.WAITLIST_JOIN).toBe('waitlist_join')
    expect(ANALYTICS_EVENTS.TOOL_SHARE).toBe('tool_share')

    // Backward-compatible legacy aliases
    expect(ANALYTICS_EVENTS.RFQ_SUBMITTED).toBe('rfq_submitted')
    expect(ANALYTICS_EVENTS.WAITLIST_JOINED).toBe('waitlist_joined')
    expect(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED).toBe('contact_form_submitted')
    expect(ANALYTICS_EVENTS.PORTFOLIO_VIEWED).toBe('portfolio_viewed')
    expect(ANALYTICS_EVENTS.CASE_STUDY_OPENED).toBe('case_study_opened')
    expect(ANALYTICS_EVENTS.ECOSYSTEM_EXPLORED).toBe('ecosystem_explored')
    expect(ANALYTICS_EVENTS.WHATSAPP_CLICKED).toBe('whatsapp_clicked')
    expect(ANALYTICS_EVENTS.CTA_CLICKED).toBe('cta_clicked')
    expect(ANALYTICS_EVENTS.NEWSLETTER_SUBSCRIBED).toBe('newsletter_subscribed')
  })
})
