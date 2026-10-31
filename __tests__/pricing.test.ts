import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/payload-cache', () => ({
  getCachedSitemapCollection: vi.fn().mockResolvedValue([]),
  getCachedRedirects: vi.fn().mockResolvedValue([]),
  getCachedGlobal: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/lib/payload', () => ({
  getPayload: vi.fn().mockResolvedValue({}),
}))

import {
  PRICING_PACKAGES,
  ADD_ONS,
  LAUNCHPAD_FEATURE,
  SAAS_TEASER,
  PRICING_FAQS,
  DIRECT_CHANNELS,
} from '@/app/(frontend)/pricing/pricing-data'
import { STATIC_ROUTES } from '@/app/sitemap'

describe('Pricing route data & commercial contracts', () => {
  it('defines 3 distinct commercial tiers with required deliverables', () => {
    expect(PRICING_PACKAGES).toHaveLength(3)

    const [starter, growth, enterprise] = PRICING_PACKAGES
    expect(starter.id).toBe('starter')
    expect(starter.price).toBe('$1,500')
    expect(starter.turnaround).toBe('5 business days')
    expect(starter.deliverables.length).toBeGreaterThanOrEqual(4)
    expect(starter.cta.href).toBe('/rfq')

    expect(growth.id).toBe('growth')
    expect(growth.price).toBe('$3,000')
    expect(growth.featured).toBe(true)
    expect(growth.turnaround).toBe('10 business days')
    expect(growth.deliverables.length).toBeGreaterThanOrEqual(5)
    expect(growth.cta.href).toBe('/rfq')

    expect(enterprise.id).toBe('enterprise')
    expect(enterprise.price).toBe('Custom')
    expect(enterprise.cta.href).toBe('/contact')
    expect(enterprise.whatsappCta?.href).toContain('wa.me')
    expect(enterprise.whatsappCta?.href).toContain('Enterprise')
  })

  it('defines modular add-ons including Arabic RTL and container quoting', () => {
    expect(ADD_ONS).toHaveLength(3)
    const addOnIds = ADD_ONS.map((a) => a.id)
    expect(addOnIds).toContain('arabic-rtl')
    expect(addOnIds).toContain('container-rfq')
    expect(addOnIds).toContain('managed-saas')

    ADD_ONS.forEach((addon) => {
      expect(addon.title).toBeTruthy()
      expect(addon.features.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('defines the dual-milestone Launchpad specification', () => {
    expect(LAUNCHPAD_FEATURE.milestones).toHaveLength(2)
    expect(LAUNCHPAD_FEATURE.milestones[0].step).toBe('MILESTONE 01')
    expect(LAUNCHPAD_FEATURE.milestones[1].step).toBe('MILESTONE 02')
    expect(LAUNCHPAD_FEATURE.cta.href).toBe('/launchpad')
  })

  it('defines SaaS teaser modules and waitlist CTA', () => {
    expect(SAAS_TEASER.modules.length).toBe(4)
    expect(SAAS_TEASER.cta.href).toBe('/waitlist')
  })

  it('provides comprehensive commercial FAQs and direct channels', () => {
    expect(PRICING_FAQS.length).toBeGreaterThanOrEqual(5)
    PRICING_FAQS.forEach((faq) => {
      expect(faq.question).toBeTruthy()
      expect(faq.answer).toBeTruthy()
    })
    expect(DIRECT_CHANNELS.length).toBeGreaterThanOrEqual(3)
    const waChannel = DIRECT_CHANNELS.find((ch) => ch.label.toLowerCase().includes('whatsapp'))
    expect(waChannel).toBeDefined()
    expect(waChannel?.href).toContain('wa.me')
  })

  it('registers /pricing in sitemap STATIC_ROUTES with priority 0.8', () => {
    const pricingRoute = STATIC_ROUTES.find((r) => r.path === '/pricing')
    expect(pricingRoute).toBeDefined()
    expect(pricingRoute?.priority).toBe(0.8)
    expect(pricingRoute?.changeFrequency).toBe('weekly')
  })
})
