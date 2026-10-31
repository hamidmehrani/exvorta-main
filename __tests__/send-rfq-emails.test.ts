import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sendRFQEmails,
  buildRFQClientConfirmationHtml,
  buildRFQClientConfirmationText,
  buildRFQAdminNotificationHtml,
  buildRFQAdminNotificationText,
  RFQEmailDoc,
} from '@/payload/collections/FormSubmissions/hooks/sendRFQEmails'
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

describe('sendRFQEmails transactional hook & templates', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Template formatting & design tokens', () => {
    const sampleDoc: RFQEmailDoc = {
      id: 'RFQ-9021',
      name: 'Tariq Mansoor',
      email: 'tariq@gulf-logistics.ae',
      companyName: 'Gulf Logistics Hub PJSC',
      businessType: 'Cross-Border Supply Chain',
      mainMarkets: 'MENA, GCC, Central Asia',
      budget: '$250,000 - $500,000',
      message: 'Need high-throughput institutional settlement ledger integration.',
    }

    it('buildRFQClientConfirmationText outputs plain-text fallback with DIFC footer, REF ID, and no fake SLA promises', () => {
      const text = buildRFQClientConfirmationText(sampleDoc)
      expect(text).toContain('EXVORTA // PROPOSAL DESK')
      expect(text).toContain('REF #RFQ-9021')
      expect(text).toContain('Dear Tariq Mansoor,')
      expect(text).toContain('Your Request for Quotation (RFQ) has been logged')
      expect(text).toContain('ORGANIZATION: Gulf Logistics Hub PJSC')
      expect(text).toContain('BUSINESS TYPE: Cross-Border Supply Chain')
      expect(text).toContain('BUDGET BRACKET: $250,000 - $500,000')
      expect(text).toContain('STATUS: SCOPING & ARCHITECTURE IN REVIEW')
      expect(text).toContain('Dubai International Financial Centre (DIFC) · Dubai, UAE')
      expect(text).toContain('© 2026 EXVORTA GLOBAL ARCHITECTURES. ALL RIGHTS RESERVED.')

      // Ensure NO fake SLA promises
      expect(text).not.toContain('one business day')
      expect(text).not.toContain('1 business day')
      expect(text).not.toContain('24 hours')
    })

    it('buildRFQClientConfirmationText handles missing optional doc fields gracefully', () => {
      const text = buildRFQClientConfirmationText({})
      expect(text).toContain('REF #RFQ')
      expect(text).toContain('Dear Valued Partner,')
      expect(text).toContain('ORGANIZATION: Private Enterprise')
      expect(text).toContain('BUSINESS TYPE: Export / Global Trade')
      expect(text).toContain('BUDGET BRACKET: Standard Tier')
    })

    it('buildRFQClientConfirmationHtml contains Institutional Elite tokens and typography', () => {
      const html = buildRFQClientConfirmationHtml(sampleDoc)
      // Design tokens
      expect(html).toContain('background-color:#FAFAF8')
      expect(html).toContain('background:#FFFFFF')
      expect(html).toContain('color:#0D0D0D')
      expect(html).toContain('border:1px solid #E5E5E0')
      expect(html).toContain('background:#0D0D0D')

      // Typography
      expect(html).toContain('font-family:Georgia,Cambria,serif')
      expect(html).toContain("font-family:'Courier New',Courier,monospace")

      // Metadata & Footer
      expect(html).toContain('REF #RFQ-9021')
      expect(html).toContain('Tariq Mansoor')
      expect(html).toContain('Gulf Logistics Hub PJSC')
      expect(html).toContain('Dubai International Financial Centre (DIFC) · Dubai, UAE')

      // No fake SLA guarantee
      expect(html).not.toContain('one business day')
      expect(html).not.toContain('1 business day')
      expect(html).not.toContain('24 hours')
    })

    it('buildRFQAdminNotificationText formats RFQ fields in structured plain text', () => {
      const identifier = `${sampleDoc.email} / ${sampleDoc.companyName}`
      const text = buildRFQAdminNotificationText(sampleDoc, identifier)

      expect(text).toContain('EXVORTA OS // PROPOSAL INTAKE')
      expect(text).toContain('REF #RFQ-9021')
      expect(text).toContain(`New RFQ: ${identifier}`)
      expect(text).toContain('Submission ID: RFQ-9021')
      expect(text).toContain('Contact Name: Tariq Mansoor')
      expect(text).toContain('Email: tariq@gulf-logistics.ae')
      expect(text).toContain('Company: Gulf Logistics Hub PJSC')
      expect(text).toContain('Business Sector: Cross-Border Supply Chain')
      expect(text).toContain('Target Markets: MENA, GCC, Central Asia')
      expect(text).toContain('Budget Bracket: $250,000 - $500,000')
      expect(text).toContain('Project Brief: Need high-throughput institutional settlement ledger integration.')
      expect(text).toContain(`Target: ${identifier}`)
      expect(text).toContain('Status: Queued for institutional desk review')
    })

    it('buildRFQAdminNotificationHtml formats RFQ fields with design tokens and styling', () => {
      const identifier = `${sampleDoc.email} / ${sampleDoc.companyName}`
      const html = buildRFQAdminNotificationHtml(sampleDoc, identifier)

      expect(html).toContain('background-color:#FAFAF8')
      expect(html).toContain('background:#FFFFFF')
      expect(html).toContain('color:#0D0D0D')
      expect(html).toContain('border:1px solid #E5E5E0')
      expect(html).toContain('font-family:Georgia,Cambria,serif')
      expect(html).toContain("font-family:'Courier New',Courier,monospace")
      expect(html).toContain(`New RFQ: ${identifier}`)
      expect(html).toContain('Gulf Logistics Hub PJSC')
      expect(html).toContain('Cross-Border Supply Chain')
      expect(html).toContain('MENA, GCC, Central Asia')
      expect(html).toContain('$250,000 - $500,000')
      expect(html).toContain('Need high-throughput institutional settlement ledger integration.')
      expect(html).toContain(`mailto:${sampleDoc.email}`)
    })
  })

  describe('sendRFQEmails hook execution & guards', () => {
    it('skips sending when operation is not create', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      const doc = { id: 'RFQ-1', email: 'client@domain.com' }

      const result = await sendRFQEmails({
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

    it('skips sending when ENABLE_RFQ_EMAILS is not true', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'false'
      process.env.RESEND_API_KEY = 're_test_key'
      const doc = { id: 'RFQ-1', email: 'client@domain.com' }

      const result = await sendRFQEmails({
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

    it('logs warning via reportWarning and skips when RESEND_API_KEY is missing or placeholder', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'true'
      process.env.RESEND_API_KEY = 'your_resend_api_key'
      const doc = { id: 'RFQ-1', email: 'client@domain.com' }

      const result = await sendRFQEmails({
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

    it('sends client email with replyTo: ownerEmail and admin email with replyTo: doc.email', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'
      process.env.OWNER_EMAIL = 'desk-lead@exvorta.com'
      process.env.EMAIL_FROM_DOMAIN = 'mail.exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-rfq-1' }, error: null })

      const doc: RFQEmailDoc = {
        id: 'RFQ-500',
        name: 'Sarah Chen',
        email: 'sarah@apex-capital.sg',
        companyName: 'Apex Capital SG',
        businessType: 'Institutional Custody',
        budget: '$100,000+',
      }

      await sendRFQEmails({
        doc,
        operation: 'create',
        req: {} as any,
        previousDoc: doc,
        collection: {} as any,
        context: {},
        data: {},
      })

      expect(mockSend).toHaveBeenCalledTimes(2)

      // 1. Client confirmation
      expect(mockSend).toHaveBeenNthCalledWith(1, {
        from: 'Exvorta <hello@mail.exvorta.com>',
        to: 'sarah@apex-capital.sg',
        replyTo: 'desk-lead@exvorta.com',
        subject: 'Your RFQ has been received — Exvorta',
        html: expect.stringContaining('Your Request for Quotation (RFQ) has been logged'),
        text: expect.stringContaining('EXVORTA // PROPOSAL DESK'),
      })

      // 2. Admin notification
      expect(mockSend).toHaveBeenNthCalledWith(2, {
        from: 'Exvorta OS <system@mail.exvorta.com>',
        to: 'admin@exvorta.com',
        replyTo: 'sarah@apex-capital.sg',
        subject: '[RFQ] sarah@apex-capital.sg / Apex Capital SG — $100,000+',
        html: expect.stringContaining('Apex Capital SG'),
        text: expect.stringContaining('Apex Capital SG'),
      })
    })

    it('falls back to adminEmail for client replyTo when OWNER_EMAIL is not set', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'rfq-desk@exvorta.com'
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-rfq-2' }, error: null })

      const doc = { id: 'RFQ-501', email: 'trader@uae.ae' }

      await sendRFQEmails({
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
          replyTo: 'rfq-desk@exvorta.com',
        })
      )
    })

    it('skips admin email gracefully when ADMIN_EMAIL is missing/placeholder and still dispatches client email', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      delete process.env.ADMIN_EMAIL
      delete process.env.OWNER_EMAIL
      process.env.EMAIL_FROM_DOMAIN = 'exvorta.com'

      mockSend.mockResolvedValue({ data: { id: 'msg-rfq-3' }, error: null })

      const doc = { id: 'RFQ-502', email: 'inbound@institution.com' }

      await sendRFQEmails({
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
          to: 'inbound@institution.com',
          replyTo: 'operations@exvorta.com',
        })
      )
    })

    it('handles Resend API error responses gracefully via reportError without crashing', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'

      mockSend.mockResolvedValue({
        data: null,
        error: { name: 'rate_limited', message: 'Too many requests' },
      })

      const doc = { id: 'RFQ-503', email: 'rate-limit@test.com' }

      const result = await sendRFQEmails({
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
          message: expect.stringContaining('Too many requests'),
        }),
        expect.objectContaining({ context: 'sendRFQEmails.clientReply' })
      )
    })

    it('handles unexpected exceptions thrown during dispatch gracefully via reportError', async () => {
      process.env.ENABLE_RFQ_EMAILS = 'true'
      process.env.RESEND_API_KEY = 're_test_key'
      process.env.ADMIN_EMAIL = 'admin@exvorta.com'

      mockSend.mockRejectedValue(new Error('DNS resolution failed'))

      const doc = { id: 'RFQ-504', email: 'dns-error@test.com' }

      const result = await sendRFQEmails({
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
          message: 'DNS resolution failed',
        }),
        expect.objectContaining({ context: 'sendRFQEmails.clientReply' })
      )
    })
  })
})
