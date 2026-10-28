import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { TestimonialBlock } from '@/components/blocks/TestimonialBlock'

describe('TestimonialBlock (DES-02 Testimonials & Proof Band Pass)', () => {
  it('renders section with Uxcel pattern and required design tokens', () => {
    const html = renderToString(<TestimonialBlock />)

    // Heading hierarchy and tokens
    expect(html).toContain('id="testimonial-heading"')
    expect(html).toContain('font-serif text-title font-semibold text-obsidian')
    expect(html).toContain('Loved by leaders from world-class export enterprises')

    // Star rating indicator
    expect(html).toContain('aria-label="5 out of 5 stars rating"')
    expect(html).toContain('4.9 / 5.0')
    expect(html).toContain('40+ Enterprise Deployments')

    // Eyebrow blueprint label
    expect(html).toContain('THE MARKET CONSENSUS')

    // Quote copy in font-serif text-lg text-obsidian
    expect(html).toContain('font-serif text-lg leading-relaxed text-obsidian')

    // Author names in font-medium text-obsidian
    expect(html).toContain('font-medium text-obsidian')
    expect(html).toContain('Emre Vural')

    // Roles and companies in font-mono text-label uppercase tracking-widest text-muted
    expect(html).toContain('font-mono text-label uppercase tracking-widest text-muted')
    expect(html).toContain('Managing Director · Stonvi Ceramics')

    // Card borders, surface background, and hover states
    expect(html).toContain('border-rule')
    expect(html).toContain('hover:border-rule-strong')
    expect(html).toContain('bg-surface')
    expect(html).toContain('card-elite')

    // Metric badges on quote cards
    expect(html).toContain('+185% INQUIRIES')
    expect(html).toContain('BRC GRADE A')
    expect(html).toContain('text-emerald bg-emerald/10 border border-emerald/20')

    // Semantic markup: blockquote, cite, figure, figcaption
    expect(html).toContain('<blockquote')
    expect(html).toContain('<cite')
    expect(html).toContain('<figure')
    expect(html).toContain('<figcaption')

    // Verified badge
    expect(html).toContain('VERIFIED')

    // Interactive controls with token-based focus-visible styles
    expect(html).toContain('focus-visible:outline-none')
    expect(html).toContain('focus-visible:ring-2')
    expect(html).toContain('focus-visible:ring-emerald')
    expect(html).toContain('focus-visible:ring-offset-2')
    expect(html).toContain('aria-label="Previous testimonials"')
    expect(html).toContain('aria-label="Next testimonials"')

    // Reduced motion support
    expect(html).toContain('motion-reduce:transition-none')

    // Proof band with verified enterprise partner logos
    expect(html).toContain('AUDITED ENTERPRISE NETWORKS &amp; GLOBAL TRADE PARTNERS')
    expect(html).toContain('aria-label="Verified enterprise client: Stonvi"')
    expect(html).toContain('aria-label="Verified enterprise client: Spicevo"')
    expect(html).toContain('aria-label="Verified enterprise client: Nutave"')
    expect(html).toContain('aria-label="Verified enterprise client: Deloitte"')
    expect(html).toContain('aria-label="Verified enterprise client: Paysafe"')
    expect(html).toContain('aria-label="Verified enterprise client: Vercel Edge"')

    // Institutional Zero-Risk Guarantee
    expect(html).toContain('The Zero-Risk Standard')
    expect(html).toContain('The Exvorta Partners')
    expect(html).toContain('INSTITUTIONAL COMMITMENT')
  })

  it('accepts custom manual testimonials and preserves existing data contracts', () => {
    const customTestimonials = [
      {
        id: 'custom-1',
        quote: 'Custom institutional feedback on procurement pipeline and design fidelity.',
        author: 'Alexander Sterling',
        role: 'Chief Procurement Officer',
        company: 'Apex Global Trade',
        metric: '100% SLA COMPLIANCE',
        avatar: '/avatars/sterling.jpg',
      },
    ]

    const html = renderToString(
      <TestimonialBlock
        eyebrow="[ CUSTOM PROOF ]"
        sectionTitle="Custom Client Consensus"
        subtitle="Custom Subtitle Describing Audit"
        manualTestimonials={customTestimonials}
        guaranteeTitle="Custom Guarantee"
        guaranteeText="Custom guarantee commitment terms."
        guaranteeSignature="Board of Directors"
        ratingScore="5.0 / 5.0"
        ratingCount="100+ Reviews"
      />
    )

    expect(html).toContain('CUSTOM PROOF')
    expect(html).toContain('Custom Client Consensus')
    expect(html).toContain('Custom Subtitle Describing Audit')
    expect(html).toContain('Custom institutional feedback on procurement pipeline and design fidelity.')
    expect(html).toContain('Alexander Sterling')
    expect(html).toContain('Chief Procurement Officer · Apex Global Trade')
    expect(html).toContain('100% SLA COMPLIANCE')
    expect(html).toContain('alt="Portrait of Alexander Sterling"')
    expect(html).toContain('Custom Guarantee')
    expect(html).toContain('Custom guarantee commitment terms.')
    expect(html).toContain('Board of Directors')
    expect(html).toContain('5.0 / 5.0')
    expect(html).toContain('100+ Reviews')
  })

  it('accepts custom proof logos when provided', () => {
    const customLogos = [
      { name: 'CustomCorp', category: 'Global Logistics' },
      { name: 'TradePartners', category: 'Trade Finance' },
    ]

    const html = renderToString(<TestimonialBlock proofLogos={customLogos} />)

    expect(html).toContain('aria-label="Verified enterprise client: CustomCorp"')
    expect(html).toContain('aria-label="Verified enterprise client: TradePartners"')
    expect(html).toContain('CustomCorp')
    expect(html).toContain('TradePartners')
  })

  it('updates Stanford credibility testimonial when custom quote prop is provided', () => {
    const html = renderToString(
      <TestimonialBlock
        quote="92% of enterprise procurement officers verify supplier credentials online before initiating an RFP."
        quoteAuthor="Harvard Business Review and Supply Chain Lab"
      />
    )

    expect(html).toContain(
      '92% of enterprise procurement officers verify supplier credentials online before initiating an RFP.'
    )
    expect(html).toContain('Harvard Business Review and Supply Chain Lab')
  })
})
