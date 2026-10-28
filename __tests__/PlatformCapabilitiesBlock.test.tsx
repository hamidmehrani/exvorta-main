import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { PlatformCapabilitiesBlock } from '@/components/blocks/PlatformCapabilitiesBlock'

describe('PlatformCapabilitiesBlock (DES-02 Services Grid Pass)', () => {
  it('renders section with semantic heading hierarchy and design tokens', () => {
    const html = renderToString(<PlatformCapabilitiesBlock />)

    // Main section heading is h2 with required tokens
    expect(html).toContain('id="platform-capabilities-heading"')
    expect(html).toContain('font-serif text-title font-semibold text-obsidian')

    // Eyebrow badges use required mono label tokens
    expect(html).toContain('font-mono text-label uppercase tracking-widest text-muted')

    // Service cards use h3 with required serif tokens
    expect(html).toContain('font-serif text-xl font-medium text-obsidian')
    expect(html).toContain('Edit everything. Yourself.')
    expect(html).toContain('Unlimited languages.')
    expect(html).toContain('Unlimited design revisions.')
    expect(html).toContain('Speed as a sales weapon.')

    // Descriptions use sans and text-muted
    expect(html).toContain('font-sans text-sm text-muted leading-relaxed')

    // Clean service cards with subtle borders and surface background
    expect(html).toContain('border-rule')
    expect(html).toContain('hover:border-rule-strong')
    expect(html).toContain('bg-surface')

    // Token-based focus-visible styles on interactive card elements
    expect(html).toContain('focus-visible:ring-emerald')
    expect(html).toContain('focus-visible:ring-offset-2')
    expect(html).toContain('focus-visible:outline-none')

    // Reduced motion support
    expect(html).toContain('motion-reduce:transition-none')

    // Accessible ARIA labels and roles
    expect(html).toContain('aria-labelledby="platform-capabilities-heading"')
    expect(html).toContain('aria-label="Inquire about Edit everything. Yourself."')
  })

  it('accepts custom capabilities and preserves data contracts', () => {
    const customCaps = [
      {
        title: 'Custom Service Capability',
        desc: 'Custom description for business partners.',
        tag: 'CUSTOM SPEC',
        stat: '99.9%',
        statLabel: 'reliability',
        tier: 'GOLD',
        tags: ['Custom Tag 1', 'Custom Tag 2'],
      },
    ]

    const html = renderToString(
      <PlatformCapabilitiesBlock
        eyebrow="Custom Eyebrow"
        title="Custom Platform Title"
        description="Custom Platform Description"
        capabilities={customCaps}
      />
    )

    expect(html).toContain('Custom Eyebrow')
    expect(html).toContain('Custom Platform Title')
    expect(html).toContain('Custom Platform Description')
    expect(html).toContain('Custom Service Capability')
    expect(html).toContain('Custom Tag 1')
    expect(html).toContain('CUSTOM SPEC')
  })
})
