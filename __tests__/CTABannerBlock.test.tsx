import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { CTABannerBlock } from '@/components/blocks/CTABannerBlock'

describe('CTABannerBlock (DES-02 Closing CTA Banner Pass)', () => {
  it('renders section with Shopify closing CTA banner pattern and required design tokens', () => {
    const html = renderToString(<CTABannerBlock />)

    // Main section heading is h2 with required font-serif tokens
    expect(html).toContain('id="cta-banner-heading"')
    expect(html).toContain('font-serif text-3xl font-semibold text-obsidian leading-tight md:text-4xl')
    expect(html).toContain('Align your digital infrastructure')

    // Supporting copy uses font-sans and text-muted
    expect(html).toContain('font-sans text-muted text-base leading-relaxed md:text-lg')
    expect(html).toContain('Stop allowing generic architecture to dilute your market authority')

    // Eyebrow badge uses blueprint label tokens
    expect(html).toContain('font-mono text-label uppercase tracking-widest text-muted')
    expect(html).toContain('INITIATE PARTNERSHIP')

    // Clean container styling using tokenized surfaces and borders
    expect(html).toContain('border-rule')
    expect(html).toContain('bg-surface')
    expect(html).toContain('text-obsidian')
    expect(html).toContain('frame')

    // Primary action button aligned with design system primitives
    expect(html).toContain('btn-primary')
    expect(html).toContain('REQUEST A PROPOSAL')
    expect(html).toContain('href="/rfq"')

    // Secondary action link/button aligned with design system primitives
    expect(html).toContain('btn-ghost')
    expect(html).toContain('EXPLORE ARCHITECTURE')
    expect(html).toContain('href="/web"')

    // WCAG-AA token-based focus-visible styles on interactive buttons and links
    expect(html).toContain('focus-visible:outline-none')
    expect(html).toContain('focus-visible:ring-2')
    expect(html).toContain('focus-visible:ring-emerald')
    expect(html).toContain('focus-visible:ring-offset-2')

    // Trust microcopy and guarantees with emerald status indicators
    expect(html).toContain('bg-emerald/10 text-emerald')
    expect(html).toContain('Direct Partner Review')
    expect(html).toContain('Guaranteed 24-Hour SLA')
    expect(html).toContain('Zero Lock-in Architecture')
    expect(html).toContain('Response within 24 hours · Enterprise NDA protected')

    // Semantic and accessible attributes
    expect(html).toContain('aria-labelledby="cta-banner-heading"')
    expect(html).toContain('aria-label="REQUEST A PROPOSAL"')
    expect(html).toContain('aria-label="EXPLORE ARCHITECTURE"')
    expect(html).toContain('aria-label="Institutional guarantees"')

    // Reduced motion support
    expect(html).toContain('motion-reduce:transition-none')

    // Motion and animation primitives (Reveal and AnimatedSection)
    expect(html).toContain('data-reveal=""')
  })

  it('accepts custom props and preserves data contracts', () => {
    const customGuarantees = [
      { text: 'Custom 12h SLA', id: 'custom-sla' },
      { text: 'Full Source Code Transfer', id: 'custom-ip' },
    ]

    const html = renderToString(
      <CTABannerBlock
        eyebrow="[ CUSTOM ENGAGEMENT ]"
        headline="Accelerate institutional market execution."
        description="Bespoke engineering engagements structured around your procurement requirements."
        primaryCTA={{ label: '[ SCHEDULE TECHNICAL AUDIT ]', url: '/contact' }}
        secondaryCTA={{ label: '[ DOWNLOAD ARCHITECTURE BRIEF ]', url: '/specs' }}
        guarantees={customGuarantees}
        subtext="[ Direct CTO review within 12 hours ]"
      />
    )

    // Unbracketed labels
    expect(html).toContain('CUSTOM ENGAGEMENT')
    expect(html).not.toContain('[ CUSTOM ENGAGEMENT ]')

    // Custom headline and description
    expect(html).toContain('Accelerate institutional market execution.')
    expect(html).toContain('Bespoke engineering engagements structured around your procurement requirements.')

    // Custom primary and secondary CTAs
    expect(html).toContain('SCHEDULE TECHNICAL AUDIT')
    expect(html).toContain('href="/contact"')
    expect(html).toContain('DOWNLOAD ARCHITECTURE BRIEF')
    expect(html).toContain('href="/specs"')

    // Custom guarantees and subtext
    expect(html).toContain('Custom 12h SLA')
    expect(html).toContain('Full Source Code Transfer')
    expect(html).toContain('Direct CTO review within 12 hours')
    expect(html).not.toContain('[ Direct CTO review within 12 hours ]')
  })

  it('handles HTML headline safely and converts newlines to breaks', () => {
    const htmlWithBr = renderToString(
      <CTABannerBlock headline={'Institutional scale.<br/>Global presence.'} />
    )
    expect(htmlWithBr).toContain('Institutional scale.<br/>Global presence.')

    const htmlWithNewline = renderToString(
      <CTABannerBlock headline={'Line one\nLine two'} />
    )
    expect(htmlWithNewline).toContain('Line one<br />Line two')
  })

  it('supports hiding secondaryCTA and guarantees when explicitly passed as null', () => {
    const html = renderToString(
      <CTABannerBlock
        secondaryCTA={null}
        guarantees={null}
        subtext={null}
      />
    )

    expect(html).toContain('REQUEST A PROPOSAL')
    expect(html).not.toContain('btn-ghost')
    expect(html).not.toContain('aria-label="Institutional guarantees"')
    expect(html).not.toContain('Response within 24 hours · Enterprise NDA protected')
  })
})
