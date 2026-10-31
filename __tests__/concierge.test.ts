import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'

const { mockCreate, mockPayloadClient } = vi.hoisted(() => {
  const mockCreate = vi.fn().mockResolvedValue({ id: 'mock-concierge-lead-id' })
  const mockPayloadClient = {
    create: mockCreate,
  }
  return { mockCreate, mockPayloadClient }
})

vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn().mockImplementation(() => Promise.resolve(mockPayloadClient)),
  getPayload: vi.fn().mockResolvedValue(mockPayloadClient),
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  verifyTurnstile: vi.fn().mockImplementation(async (token?: string) => {
    if (token === 'invalid-token') return false
    return true
  }),
}))

vi.mock('@/lib/error-reporting', () => ({
  reportError: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers({ 'x-forwarded-for': '127.0.0.1' })),
}))

import { submitLeadAction } from '@/actions/submitLead'
import { STATIC_ROUTES } from '@/app/sitemap'
import ConciergePage, { generateMetadata } from '@/app/(frontend)/concierge/page'
import ConciergeIntakeForm from '@/components/forms/ConciergeIntakeForm'

describe('Concierge 24-Hour Freight Audit (CONV-04)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form submission contract via submitLeadAction', () => {
    it('captures structured concierge intake parameters and sets source=RFQ, auditType=24h-concierge', async () => {
      const formData = new FormData()
      formData.append('source', 'RFQ')
      formData.append('auditType', '24h-concierge')
      formData.append('fullName', 'Tariq Al-Mansoor')
      formData.append('email', 'tariq@mansoor-logistics.com')
      formData.append('company', 'Al-Mansoor Trading FZE')
      formData.append('phone', '+971 50 123 4567')
      formData.append('tradeLane', 'East Asia / China → UAE / GCC')
      formData.append('freightMode', 'Ocean FCL (Full Container Load)')
      formData.append('monthlyVolume', '20–50 shipments/mo')
      formData.append('auditFocus', 'Full Comprehensive 3-Pillar Audit (Recommended)')
      formData.append(
        'shipmentsOverview',
        '2x 40ft HC Ningbo to Jebel Ali ($2,450/box + $380 BAF), 1x 20ft Mumbai to Dammam'
      )
      formData.append(
        'secureDocumentLink',
        'https://drive.google.com/drive/folders/sample-confidential-concierge'
      )
      formData.append('cf-turnstile-response', 'valid-turnstile-token')

      const result = await submitLeadAction(null, formData)

      expect(result.success).toBe(true)
      expect(mockCreate).toHaveBeenCalledTimes(1)
      expect(mockCreate).toHaveBeenCalledWith({
        collection: 'leads',
        data: {
          source: 'RFQ',
          email: 'tariq@mansoor-logistics.com',
          company: 'Al-Mansoor Trading FZE',
          status: 'New',
          payload: {
            auditType: '24h-concierge',
            fullName: 'Tariq Al-Mansoor',
            phone: '+971 50 123 4567',
            tradeLane: 'East Asia / China → UAE / GCC',
            freightMode: 'Ocean FCL (Full Container Load)',
            monthlyVolume: '20–50 shipments/mo',
            auditFocus: 'Full Comprehensive 3-Pillar Audit (Recommended)',
            shipmentsOverview:
              '2x 40ft HC Ningbo to Jebel Ali ($2,450/box + $380 BAF), 1x 20ft Mumbai to Dammam',
            secureDocumentLink:
              'https://drive.google.com/drive/folders/sample-confidential-concierge',
          },
        },
      })
    })

    it('rejects honeypot bot-field submissions', async () => {
      const formData = new FormData()
      formData.append('source', 'RFQ')
      formData.append('auditType', '24h-concierge')
      formData.append('email', 'crawler@botnet.org')
      formData.append('company', 'BotNet LLC')
      formData.append('bot-field', 'Automated submission trigger')

      const result = await submitLeadAction(null, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Spam detected.')
      expect(mockCreate).not.toHaveBeenCalled()
    })

    it('validates required corporate email format', async () => {
      const formData = new FormData()
      formData.append('source', 'RFQ')
      formData.append('email', 'invalid-email-string')
      formData.append('company', 'Test Corp')

      const result = await submitLeadAction(null, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address.')
      expect(mockCreate).not.toHaveBeenCalled()
    })
  })

  describe('Page Metadata & Static Sitemap', () => {
    it('generates institutional metadata with correct title, description and canonical URL', async () => {
      const meta = await generateMetadata()
      const titleStr =
        typeof meta.title === 'object' && meta.title && 'absolute' in meta.title
          ? meta.title.absolute
          : String(meta.title)
      expect(titleStr).toContain('Concierge 24-Hour Freight Audit')
      expect(meta.description).toContain('Send your last 3 shipments')
    })

    it('registers /concierge in the sitemap static routes registry', () => {
      const conciergeRoute = STATIC_ROUTES.find((r) => r.path === '/concierge')
      expect(conciergeRoute).toBeDefined()
      expect(conciergeRoute?.priority).toBe(0.8)
      expect(conciergeRoute?.changeFrequency).toBe('weekly')
    })
  })

  describe('Component Rendering', () => {
    it('renders ConciergeIntakeForm successfully with all required inputs and hidden inputs', () => {
      const html = renderToString(React.createElement(ConciergeIntakeForm))

      // Hidden fields
      expect(html).toContain('name="source" value="RFQ"')
      expect(html).toContain('name="auditType" value="24h-concierge"')
      expect(html).toContain('name="bot-field"')

      // Form input fields
      expect(html).toContain('name="fullName"')
      expect(html).toContain('name="email"')
      expect(html).toContain('name="company"')
      expect(html).toContain('name="phone"')
      expect(html).toContain('name="tradeLane"')
      expect(html).toContain('name="freightMode"')
      expect(html).toContain('name="monthlyVolume"')
      expect(html).toContain('name="auditFocus"')
      expect(html).toContain('name="shipmentsOverview"')
      expect(html).toContain('name="secureDocumentLink"')

      // Submit button text
      expect(html).toContain('TRANSMIT 24-HOUR AUDIT INTAKE')
    })

    it('renders ConciergePage with all 6 required sections and structured data', () => {
      const html = renderToString(React.createElement(ConciergePage))

      // Hero
      expect(html).toContain('Send Your Last 3 Shipments. Get a 24-Hour Forensic Audit.')
      expect(html).toContain('[ GTM PILLAR 02 // 24-HOUR CONCIERGE AUDIT ]')
      expect(html).toContain('Guaranteed 24-Hour Turnaround • Zero Disruption')

      // Three Pillars
      expect(html).toContain('Rate Benchmark &amp; Margin Leakage')
      expect(html).toContain('GCC Customs &amp; Tariff Compliance')
      expect(html).toContain('Demurrage &amp; Detention Exposure')

      // 3 Steps
      expect(html).toContain('Submit Shipment Parameters')
      expect(html).toContain('24-Hour Deep Forensic Scan')
      expect(html).toContain('Video Dossier &amp; Preloaded Workspace')

      // Intake form anchor
      expect(html).toContain('id="intake-form"')

      // Security guarantee
      expect(html).toContain('Enterprise Zero-Trust Confidentiality')
      expect(html).toContain('Never shared with third parties')

      // FAQs
      expect(html).toContain('Frequently Asked Questions')
      expect(html).toContain('What documents should I submit for the 24-hour audit?')

      // JSON-LD scripts
      expect(html).toContain('application/ld+json')
      expect(html).toContain('FAQPage')
      expect(html).toContain('Freight & Customs Forensic Audit')
    })
  })
})
