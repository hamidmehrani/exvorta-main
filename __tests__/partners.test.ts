import { describe, it, expect } from 'vitest'
import {
  PARTNER_CATEGORIES,
  COMMISSION_TIERS,
  REFERRAL_WORKFLOW,
  PARTNER_BENEFITS,
  PARTNER_FAQS,
  DIRECT_PARTNER_CONTACT,
} from '@/app/(frontend)/partners/partners-data'

describe('Exvorta Partner Program data (GTM Pillar 4)', () => {
  it('defines 3 core target partner categories', () => {
    expect(PARTNER_CATEGORIES).toHaveLength(3)

    const titles = PARTNER_CATEGORIES.map((c) => c.title)
    expect(titles).toContain('Tax Consultants & Corporate Tax Advisors')
    expect(titles).toContain('Clearing Agents & Customs Brokers')
    expect(titles).toContain('Free-Zone Setup & Company Formation Agencies')

    PARTNER_CATEGORIES.forEach((category) => {
      expect(category.id).toBeTruthy()
      expect(category.code).toMatch(/^\[ CATEGORY \d{2} \]$/)
      expect(category.description).toBeTruthy()
      expect(category.referralTriggers.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('demonstrates the 20% revenue share across all Exvorta tiers', () => {
    expect(COMMISSION_TIERS).toHaveLength(4)

    const [starter, growth, enterprise, addons] = COMMISSION_TIERS

    // Starter Platform: $2,500 project value -> $500 partner share (20%), 5-day turnaround
    expect(starter.name).toBe('Starter Platform')
    expect(starter.projectValue).toBe('$2,500')
    expect(starter.partnerShare).toBe('$500')
    expect(starter.rate).toBe('20%')
    expect(starter.turnaround).toContain('5-day')

    // Growth Platform: $5,000 project value -> $1,000 partner share (20%), 10-day turnaround
    expect(growth.name).toBe('Growth Platform')
    expect(growth.projectValue).toBe('$5,000')
    expect(growth.partnerShare).toBe('$1,000')
    expect(growth.rate).toBe('20%')
    expect(growth.turnaround).toContain('10-day')

    // Custom Enterprise / Launchpad: $10,000+ project value -> $2,000+ partner share (20%), milestone-based
    expect(enterprise.name).toBe('Custom Enterprise / Launchpad')
    expect(enterprise.projectValue).toBe('$10,000+')
    expect(enterprise.partnerShare).toBe('$2,000+')
    expect(enterprise.rate).toBe('20%')
    expect(enterprise.turnaround.toLowerCase()).toContain('milestone')

    // Platform Add-ons & Retainers: 20% rev-share on all initial add-on modules
    expect(addons.name).toBe('Platform Add-ons & Retainers')
    expect(addons.rate).toBe('20%')
    expect(addons.description).toContain('20% rev-share')
    expect(addons.scope.length).toBeGreaterThanOrEqual(3)
  })

  it('defines the 4-step referral workflow from introduction to disbursement', () => {
    expect(REFERRAL_WORKFLOW).toHaveLength(4)

    const titles = REFERRAL_WORKFLOW.map((w) => w.title)
    expect(titles).toEqual([
      'Introduction',
      'Architecture & Scoping',
      'Institutional Delivery',
      'Revenue Disbursement',
    ])

    REFERRAL_WORKFLOW.forEach((step, idx) => {
      const stepNumber = String(idx + 1).padStart(2, '0')
      expect(step.step).toBe(stepNumber)
      expect(step.deliverables.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('defines 5+ institutional partner benefits', () => {
    expect(PARTNER_BENEFITS.length).toBeGreaterThanOrEqual(5)

    const titles = PARTNER_BENEFITS.map((b) => b.title)
    expect(titles).toContain('20% Flat Revenue Share')
    expect(titles).toContain('5-10 Day Delivery SLA')
    expect(titles).toContain('Dedicated Partner Concierge')
    expect(titles).toContain('Co-Branded Enablement Collateral')
    expect(titles).toContain('Lifetime Account Attribution')
  })

  it('defines 6 comprehensive FAQs covering core operational aspects', () => {
    expect(PARTNER_FAQS).toHaveLength(6)

    const questions = PARTNER_FAQS.map((faq) => faq.question.toLowerCase())
    const answers = PARTNER_FAQS.map((faq) => faq.answer.toLowerCase())

    // 1. Commission payout schedules
    expect(questions.some((q) => q.includes('payout schedule'))).toBe(true)

    // 2. Payment methods
    expect(questions.some((q) => q.includes('payment methods'))).toBe(true)

    // 3. Client relationship ownership
    expect(questions.some((q) => q.includes('client relationship'))).toBe(true)

    // 4. NDA / confidentiality
    expect(questions.some((q) => q.includes('confidentiality') || q.includes('nda'))).toBe(true)

    // 5. Tracking mechanism
    expect(questions.some((q) => q.includes('tracked') || q.includes('tracking'))).toBe(true)

    // 6. Eligibility requirements
    expect(questions.some((q) => q.includes('eligibility'))).toBe(true)
  })

  it('provides dedicated direct partner contact details with SLA', () => {
    expect(DIRECT_PARTNER_CONTACT.email).toBe('partners@exvorta.com')
    expect(DIRECT_PARTNER_CONTACT.conciergeSla).toBe('< 4 business hours')
  })
})
