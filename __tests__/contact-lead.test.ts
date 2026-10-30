import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCreate = vi.fn().mockResolvedValue({ id: 'mock-id' })
const mockPayloadClient = {
  create: mockCreate,
}

vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn().mockImplementation(() => Promise.resolve(mockPayloadClient)),
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

import { submitLeadAction, submitLead } from '@/actions/submitLead'

describe('submitLead and submitLeadAction (Contact brief submission)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('defaults source to RFQ and captures all structured brief fields in payload', async () => {
    const formData = new FormData()
    formData.append('email', 'buyer@globaltrade.ae')
    formData.append('company', 'Al-Mansoor Trading LLC')
    formData.append('name', 'Tariq Mansoor')
    formData.append('tradeType', 'Agricultural Commodities & Food')
    formData.append('currentSite', 'https://almansoor-trade.ae')
    formData.append('budgetBand', '$100,000 – $250,000')
    formData.append('timeline', '1 – 3 months')
    formData.append('callPreference', 'Async Review Only (Written engineering scope & quote within 1 business day)')
    formData.append('message', 'Need automated customs broker integration and container tracking across Jebel Ali.')
    formData.append('cf-turnstile-response', 'valid-turnstile-token')

    const result = await submitLeadAction(null, formData)

    expect(result.success).toBe(true)
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith({
      collection: 'leads',
      data: {
        source: 'RFQ',
        email: 'buyer@globaltrade.ae',
        company: 'Al-Mansoor Trading LLC',
        status: 'New',
        payload: {
          name: 'Tariq Mansoor',
          tradeType: 'Agricultural Commodities & Food',
          currentSite: 'https://almansoor-trade.ae',
          budgetBand: '$100,000 – $250,000',
          timeline: '1 – 3 months',
          callPreference: 'Async Review Only (Written engineering scope & quote within 1 business day)',
          message: 'Need automated customs broker integration and container tracking across Jebel Ali.',
        },
      },
    })
  })

  it('rejects honeypot bot-field submission without calling payload create', async () => {
    const formData = new FormData()
    formData.append('email', 'spambot@automated.net')
    formData.append('company', 'Spam Corp')
    formData.append('bot-field', 'I am a spam crawler')

    const result = await submitLeadAction(null, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Spam detected.')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('validates required email format', async () => {
    const formData = new FormData()
    formData.append('email', 'not-a-valid-email')
    formData.append('company', 'Trade Co')

    const result = await submitLeadAction(null, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid email address.')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('rejects invalid Turnstile security token', async () => {
    const formData = new FormData()
    formData.append('email', 'valid@buyer.com')
    formData.append('company', 'Buyer FZCO')
    formData.append('cf-turnstile-response', 'invalid-token')

    const result = await submitLeadAction(null, formData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid security token.')
    expect(mockCreate).not.toHaveBeenCalled()
  })
})
