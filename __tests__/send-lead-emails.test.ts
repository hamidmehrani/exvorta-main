import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sendLeadEmails,
  buildLeadAutoReplyHtml,
  buildLeadAutoReplyText,
  buildLeadAdminNotificationHtml,
  buildLeadAdminNotificationText,
} from '@/payload/collections/Leads/hooks/sendLeadEmails'
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

describe('sendLeadEmails transactional hook & templates (CONV-03)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Template formatting & design tokens', () => {
    const sampleDoc = {
      id: 'L-101',
      email: 'client@sovereign-trade.com',
      company: 'Sovereign Trade Ltd',
      source: 'RFQ',
      payload: {
        tradeType: 'Commodity Logistics',
        budget: '$150,000',
      },
    }

    it('buildLeadAutoReplyText outputs structured plain-text without fake SLA promises', () => {
      const text = buildLeadAutoReplyText(sampleDoc)
      expect(text).toContain('EXVORTA // INFRASTRUCTURE')
      expect(text).toContain('REF #L-101')
      expect(text).toContain('Inquiry Received.')
      expect(text).toContain('institutional digital infrastructure')
      expect(text).toContain('CHANNEL: RFQ')
      expect(text).toContain('REPRESENTING: Sovereign Trade Ltd')
      expect(text).toContain('STATUS: QUEUED FOR ENGINEERING DESK REVIEW')
      expect(text).toContain('Dubai International Financial Centre')
      // No fake SLA promises like "within 1 business day"
      expect(text).not.toContain('one business day')
      expect(text).not.toContain('24 hours')
    })

    it('buildLeadAdminNotificationText outputs structured plain-text with payload attributes', () => {
      const text = buildLeadAdminNotificationText(sampleDoc, 'client@sovereign-trade.com / Sovereign Trade Ltd')
      expect(text).toContain('EXVORTA OS // INTAKE DISPATCH')
      expect(text).toContain('REF #L-101')
      expect(text).toContain('New Lead Captured: RFQ')
      expect(text).toContain('Email: client@sovereign-trade.com')
      expect(text).toContain('Company: Sovereign Trade Ltd')
      expect(text).toContain('tradeType: Commodity Logistics')
      expect(text).toContain('budget: $150,000')
      expect(text).toContain('Target: client@sovereign-trade.com / Sovereign Trade Ltd')
      expect(text).toContain('Queued for institutional desk review')
    })

    it('buildLeadAutoReplyHtml adheres to design system typography and tokens', () => {
      const html = buildLeadAutoReplyHtml(sampleDoc)
      expect(html).toContain('background-color:#FAFAF8')
      expect(html).toContain('background:#FFFFFF')
      expect(html).toContain('color:#0D0D0D')
      expect(html).toContain('border:1px solid #E5E5E0')
      expect(html).toContain("font-family:Georgia,Cambria,serif")
      expect(html).toContain("font-family:'Courier New',Courier,monospace")
      // No fake SLA guarantee
      expect(html).not.toContain('one business day')
    })

    it('buildLeadAdminNotificationHtml adheres to design system typography and tokens', () => {
      const html = buildLeadAdminNotificationHtml(sampleDoc, 'client@sovereign-trade.com / Sovereign Trade Ltd')
      expect(html).toContain('background-color:#FAFAF8')
      expect(html).toContain('background:#FFFFFF')
      expect(html).toContain('color:#0D0D0D')
      expect(html).toContain('border:1px solid #E5E5E0')
      expect(html).toContain("font-family:Georgia,Cambria,serif")
      expect(html).toContain("font-family:'Courier New',Courier,monospace")
      expect(html).toContain('tradeType')
      expect(html).toContain('Commodity Logistics')
      expect(html).toContain('Target: client@sovereign-trade.com / Sovereign Trade Ltd')
    })
  })

  describe('Hook execution & guards', () => {
    it('returns doc without sending when operation is not create', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      const doc = { id: '1', email: 'test@example.com' }

      const result = await sendLeadEmails({
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

    it('returns doc without sending when ENABLE_LEAD_EMAILS is not true', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'false'
      process.env.RESEND_API_KEY = 're_test_key'
      const doc = { id: '1', email: 'test@example.com' }

      const result = await sendLeadEmails({
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
      process.env.ENABLE_LEAD_EMAILS = 'true'
      delete process.env.RESEND_API_KEY
      const doc = { id: '1', email: 'test@example.com' }

      const result = await sendLeadEmails({
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
        expect.stringContaining('RESEND_API_KEY is missing or placeholder')
      )
      expect(mockSend).not.toHaveBeenCalled()
    })

    it('sends both auto-reply and admin notification with html, text, and proper replyTo', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_valid_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'
      process.env.OWNER_EMAIL = 'owner@exvorta.com'
      process.env.EMAIL_FROM_DOMAIN = 'mail.exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-id' }, error: null })

      const doc = {
        id: 'L-200',
        email: 'lead@partner.ae',
        company: 'Partner Trade FZCO',
        source: 'RFQ',
      }

      await sendLeadEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(mockSend).toHaveBeenCalledTimes(2)

      // 1. Auto-reply to lead
      expect(mockSend).toHaveBeenNthCalledWith(1, {
        from: 'Exvorta <hello@mail.exvorta.com>',
        to: 'lead@partner.ae',
        replyTo: 'owner@exvorta.com',
        subject: 'We have received your inquiry — Exvorta',
        html: expect.stringContaining('Inquiry Received.'),
        text: expect.stringContaining('Inquiry Received.'),
      })

      // 2. Admin notification
      expect(mockSend).toHaveBeenNthCalledWith(2, {
        from: 'Exvorta OS <system@mail.exvorta.com>',
        to: 'admin@exvorta.com',
        replyTo: 'lead@partner.ae',
        subject: '[LEAD] RFQ — lead@partner.ae / Partner Trade FZCO',
        html: expect.stringContaining('New Lead Captured: RFQ'),
        text: expect.stringContaining('New Lead Captured: RFQ'),
      })
    })

    it('falls back to adminEmail for auto-reply replyTo when OWNER_EMAIL is not set', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_valid_key'
      process.env.ADMIN_EMAIL = 'desk@exvorta.com'
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-id' }, error: null })

      const doc = { id: 'L-201', email: 'trader@swiss.ch' }

      await sendLeadEmails({
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

    it('falls back to operations@{domain} for auto-reply replyTo when neither OWNER_EMAIL nor ADMIN_EMAIL are set', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_valid_key'
      delete process.env.ADMIN_EMAIL
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-id' }, error: null })

      const doc = { id: 'L-202', email: 'trader@swiss.ch' }

      await sendLeadEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      // Admin warning logged
      expect(reportWarning).toHaveBeenCalledWith(
        expect.stringContaining('ADMIN_EMAIL is missing or placeholder')
      )

      // Auto-reply sent with operations@exvorta.com reply-to
      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'trader@swiss.ch',
          replyTo: 'operations@exvorta.com',
        })
      )
    })

    it('skips admin notification when ADMIN_EMAIL is placeholder but sends lead auto-reply', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_valid_key'
      process.env.ADMIN_EMAIL = 'admin@yourdomain.com' // placeholder
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-id' }, error: null })

      const doc = { id: 'L-203', email: 'inbound@domain.com' }

      await sendLeadEmails({
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
      // Only 1 send call for auto-reply; admin notification was skipped without early return
      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'inbound@domain.com',
          replyTo: 'operations@exvorta.com',
        })
      )
    })

    it('reports errors gracefully without crashing the hook when Resend returns an error object', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_valid_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'

      mockSend.mockResolvedValue({
        data: null,
        error: { name: 'validation_error', message: 'Domain unverified' },
      })

      const doc = { id: 'L-204', email: 'unverified@test.com' }

      const result = await sendLeadEmails({
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
        expect.objectContaining({ context: 'sendLeadEmails.autoReply' })
      )
    })

    it('catches and reports unexpected exceptions gracefully', async () => {
      process.env.ENABLE_LEAD_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_valid_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'

      mockSend.mockRejectedValue(new Error('Network offline'))

      const doc = { id: 'L-205', email: 'offline@test.com' }

      const result = await sendLeadEmails({
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
          message: 'Network offline',
        }),
        expect.objectContaining({ context: 'sendLeadEmails.autoReply' })
      )
    })
  })
})
