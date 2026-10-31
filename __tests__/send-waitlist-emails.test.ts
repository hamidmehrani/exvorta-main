import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sendWaitlistEmails,
  buildWaitlistConfirmationHtml,
  buildWaitlistConfirmationText,
  buildWaitlistAdminNotificationHtml,
  buildWaitlistAdminNotificationText,
  WaitlistEmailDoc,
} from '@/payload/collections/Waitlist/hooks/sendWaitlistEmails'
import { reportWarning, reportError } from '@/lib/error-reporting'

const mockSend = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return {
      emails: {
        send: mockSend,
      },
    }
  }),
}))

vi.mock('@/lib/error-reporting', () => ({
  reportWarning: vi.fn(),
  reportError: vi.fn(),
}))

describe('sendWaitlistEmails transactional hook & templates', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Template formatting & design tokens', () => {
    const sampleDoc: WaitlistEmailDoc = {
      id: 'W-8801',
      email: 'founder@sovereign-alpha.ch',
      source: 'Institutional Sovereign',
      payload: {
        jurisdiction: 'Switzerland / UAE',
        volumeAnnual: '$50M+',
      },
    }

    it('buildWaitlistConfirmationText outputs structured plain text without fake SLA promises', () => {
      const text = buildWaitlistConfirmationText(sampleDoc)
      expect(text).toContain('EXVORTA // PRIVATE ACCESS')
      expect(text).toContain('REF #W-8801')
      expect(text).toContain('Private Access Waitlist Confirmed.')
      expect(text).toContain('Thank you for requesting access')
      expect(text).toContain('COHORT: Institutional Sovereign')
      expect(text).toContain('IDENTIFIER: founder@sovereign-alpha.ch')
      expect(text).toContain('STATUS: QUEUED FOR PRIVATE ACCESS REVIEW')
      expect(text).toContain('Dubai International Financial Centre (DIFC) · Dubai, UAE')
      expect(text).toContain('© 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.')

      // Ensure NO fake SLA promises
      expect(text).not.toContain('one business day')
      expect(text).not.toContain('1 business day')
      expect(text).not.toContain('24 hours')
    })

    it('buildWaitlistConfirmationText handles missing optional doc fields gracefully', () => {
      const text = buildWaitlistConfirmationText({})
      expect(text).toContain('REF #WAITLIST')
      expect(text).toContain('COHORT: Standard')
      expect(text).toContain('IDENTIFIER: —')
    })

    it('buildWaitlistConfirmationHtml adheres to Institutional Elite design tokens and typography', () => {
      const html = buildWaitlistConfirmationHtml(sampleDoc)
      // Design tokens
      expect(html).toContain('background-color:#FAFAF8')
      expect(html).toContain('background:#FFFFFF')
      expect(html).toContain('color:#0D0D0D')
      expect(html).toContain('border:1px solid #E5E5E0')
      expect(html).toContain('background:#0D0D0D')

      // Typography
      expect(html).toContain('font-family:Georgia,Cambria,serif')
      expect(html).toContain("font-family:'Courier New',Courier,monospace")

      // Details
      expect(html).toContain('REF #W-8801')
      expect(html).toContain('Waitlist Confirmed.')
      expect(html).toContain('COHORT: Institutional Sovereign')
      expect(html).toContain('founder@sovereign-alpha.ch')
      expect(html).toContain('Dubai International Financial Centre (DIFC) · Dubai, UAE')

      // No fake SLA guarantee
      expect(html).not.toContain('one business day')
      expect(html).not.toContain('1 business day')
      expect(html).not.toContain('24 hours')
    })

    it('buildWaitlistAdminNotificationText outputs structured plain text with payload attributes', () => {
      const text = buildWaitlistAdminNotificationText(sampleDoc, sampleDoc.email!)
      expect(text).toContain('EXVORTA OS // WAITLIST INTAKE')
      expect(text).toContain('REF #W-8801')
      expect(text).toContain('New Waitlist Registration: founder@sovereign-alpha.ch')
      expect(text).toContain('ID: W-8801')
      expect(text).toContain('Email: founder@sovereign-alpha.ch')
      expect(text).toContain('Source / Cohort: Institutional Sovereign')
      expect(text).toContain('jurisdiction: Switzerland / UAE')
      expect(text).toContain('volumeAnnual: $50M+')
      expect(text).toContain('Target: founder@sovereign-alpha.ch')
      expect(text).toContain('Status: Queued for private access cohort review')
    })

    it('buildWaitlistAdminNotificationHtml adheres to design tokens and formats payload rows', () => {
      const html = buildWaitlistAdminNotificationHtml(sampleDoc, sampleDoc.email!)
      expect(html).toContain('background-color:#FAFAF8')
      expect(html).toContain('background:#FFFFFF')
      expect(html).toContain('color:#0D0D0D')
      expect(html).toContain('border:1px solid #E5E5E0')
      expect(html).toContain('font-family:Georgia,Cambria,serif')
      expect(html).toContain("font-family:'Courier New',Courier,monospace")
      expect(html).toContain('New Waitlist Registration: founder@sovereign-alpha.ch')
      expect(html).toContain('Institutional Sovereign')
      expect(html).toContain('jurisdiction')
      expect(html).toContain('Switzerland / UAE')
      expect(html).toContain('volumeAnnual')
      expect(html).toContain('$50M+')
      expect(html).toContain(`mailto:${sampleDoc.email}`)
    })
  })

  describe('Hook execution & guards', () => {
    it('returns doc without sending when operation is not create', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      const doc = { id: 'W-1', email: 'user@example.com' }

      const result = await sendWaitlistEmails({
        doc,
        operation: 'update',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(result).toBe(doc)
      expect(mockSend).not.toHaveBeenCalled()
    })

    it('returns doc without sending when ENABLE_WAITLIST_EMAILS is not true', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'false'
      process.env.RESEND_API_KEY = 're_test_key'
      const doc = { id: 'W-1', email: 'user@example.com' }

      const result = await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(result).toBe(doc)
      expect(mockSend).not.toHaveBeenCalled()
    })

    it('warns and skips when RESEND_API_KEY is missing or placeholder', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      delete process.env.RESEND_API_KEY
      const doc = { id: 'W-1', email: 'user@example.com' }

      const result = await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(result).toBe(doc)
      expect(reportWarning).toHaveBeenCalledWith(
        expect.stringContaining('RESEND_API_KEY missing')
      )
      expect(mockSend).not.toHaveBeenCalled()
    })

    it('sends both subscriber confirmation and admin notification with html, text, and proper replyTo', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'
      process.env.OWNER_EMAIL = 'owner@exvorta.com'
      process.env.EMAIL_FROM_DOMAIN = 'mail.exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-w-1' }, error: null })

      const doc: WaitlistEmailDoc = {
        id: 'W-200',
        email: 'subscriber@fund.ae',
        source: 'Private Tier 1',
      }

      await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(mockSend).toHaveBeenCalledTimes(2)

      // 1. Subscriber confirmation
      expect(mockSend).toHaveBeenNthCalledWith(1, {
        from: 'Exvorta <hello@mail.exvorta.com>',
        to: 'subscriber@fund.ae',
        replyTo: 'owner@exvorta.com',
        subject: 'Exvorta Private Access — Waitlist Confirmed',
        text: expect.stringContaining('Private Access Waitlist Confirmed.'),
        html: expect.stringContaining('Waitlist Confirmed.'),
      })

      // 2. Internal admin notification
      expect(mockSend).toHaveBeenNthCalledWith(2, {
        from: 'Exvorta OS <system@mail.exvorta.com>',
        to: 'admin@exvorta.com',
        replyTo: 'subscriber@fund.ae',
        subject: '[Waitlist] subscriber@fund.ae — Private Tier 1',
        text: expect.stringContaining('New Waitlist Registration: subscriber@fund.ae'),
        html: expect.stringContaining('New Waitlist Registration: subscriber@fund.ae'),
      })
    })

    it('falls back to adminEmail for subscriber replyTo when OWNER_EMAIL is not set', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'desk@exvorta.com'
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-w-2' }, error: null })

      const doc = { id: 'W-201', email: 'allocator@geneva.ch' }

      await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(mockSend).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          replyTo: 'desk@exvorta.com',
        })
      )
    })

    it('falls back to operations@{domain} for subscriber replyTo when neither OWNER_EMAIL nor ADMIN_EMAIL are set', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      delete process.env.ADMIN_EMAIL
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-w-3' }, error: null })

      const doc = { id: 'W-202', email: 'trader@zurich.ch' }

      await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(reportWarning).toHaveBeenCalledWith(
        expect.stringContaining('ADMIN_EMAIL is missing or placeholder')
      )

      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'trader@zurich.ch',
          replyTo: 'operations@exvorta.com',
        })
      )
    })

    it('skips admin notification when ADMIN_EMAIL is placeholder but sends subscriber confirmation', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'admin@yourdomain.com'
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-w-4' }, error: null })

      const doc = { id: 'W-203', email: 'inbound@fund.com' }

      await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(reportWarning).toHaveBeenCalledWith(
        expect.stringContaining('ADMIN_EMAIL is missing or placeholder')
      )

      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'inbound@fund.com',
          replyTo: 'operations@exvorta.com',
        })
      )
    })

    it('reports Resend error responses gracefully without crashing the hook', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'

      mockSend.mockResolvedValue({
        data: null,
        error: { name: 'validation_error', message: 'Domain unverified' },
      })

      const doc = { id: 'W-204', email: 'unverified@test.com' }

      const result = await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(result).toBe(doc)
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Domain unverified'),
        }),
        expect.objectContaining({ context: 'sendWaitlistEmails.subscriber' })
      )
    })

    it('catches and reports unexpected exceptions gracefully', async () => {
      process.env.ENABLE_WAITLIST_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'

      mockSend.mockRejectedValue(new Error('Connection reset by peer'))

      const doc = { id: 'W-205', email: 'reset@test.com' }

      const result = await sendWaitlistEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(result).toBe(doc)
      expect(reportError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Connection reset by peer',
        }),
        expect.objectContaining({ context: 'sendWaitlistEmails.subscriber' })
      )
    })
  })
})
