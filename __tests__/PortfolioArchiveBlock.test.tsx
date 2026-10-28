import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { PortfolioArchiveBlock } from '@/components/blocks/PortfolioArchiveBlock'

describe('PortfolioArchiveBlock (DES-02 Portfolio Strip Pass)', () => {
  it('renders section with semantic heading hierarchy and design tokens', () => {
    const html = renderToString(<PortfolioArchiveBlock />)

    // Main section heading with semantic id and typography tokens
    expect(html).toContain('id="proof-of-execution-heading"')
    expect(html).toContain('font-serif text-headline font-semibold text-obsidian')

    // Eyebrow badges use required mono label tokens
    expect(html).toContain('font-mono text-label uppercase tracking-widest text-muted')

    // Project showcase cards use h3 with serif title tokens
    expect(html).toContain('font-serif text-title font-semibold leading-tight text-obsidian')
    expect(html).toContain('Stonvi')
    expect(html).toContain('Spicevo')
    expect(html).toContain('Nutave')

    // Descriptions use sans-serif and text-muted
    expect(html).toContain('font-sans text-sm text-muted leading-relaxed')

    // Clean showcase cards with border-rule and surface background
    expect(html).toContain('border-rule')
    expect(html).toContain('bg-surface')
    expect(html).toContain('hover:border-rule-strong')

    // Token-based focus-visible styles on interactive elements
    expect(html).toContain('focus-visible:ring-emerald')
    expect(html).toContain('focus-visible:ring-offset-2')
    expect(html).toContain('focus-visible:outline-none')

    // Reduced motion support
    expect(html).toContain('motion-reduce:transition-none')

    // Accessible ARIA roles and labels for tablist and tabs
    expect(html).toContain('role="tablist"')
    expect(html).toContain('role="tab"')
    expect(html).toContain('aria-selected="true"')
    expect(html).toContain('aria-controls="homepage-portfolio-panel"')

    // Metric callouts and sector tags
    expect(html).toContain('Export Volume')
    expect(html).toContain('LIVE INFRASTRUCTURE')
  })

  it('accepts custom projects and preserves data contracts', () => {
    const customProjects = [
      {
        id: 'proj-acme',
        title: 'Acme Global Trade',
        description: 'B2B digital platform for global logistics.',
        industry: 'FINTECH & LOGISTICS',
        volume: '1.2B USD/YR',
        service: 'ENTERPRISE PORTAL',
        linkLabel: 'EXPLORE CASE STUDY',
        linkUrl: '/portfolio/acme',
        imageUrl: '/test.webp',
      },
    ]

    const html = renderToString(
      <PortfolioArchiveBlock
        sectionLabel="Verified Case Studies"
        headline="Proven Platform Infrastructure"
        subtitle="Institutional grade deployments across worldwide trade hubs."
        projects={customProjects}
        ctaLabel="Browse All Studies"
        ctaUrl="/case-studies"
      />
    )

    expect(html).toContain('Verified Case Studies')
    expect(html).toContain('Proven Platform Infrastructure')
    expect(html).toContain('Institutional grade deployments across worldwide trade hubs.')
    expect(html).toContain('Acme Global Trade')
    expect(html).toContain('B2B digital platform for global logistics.')
    expect(html).toContain('FINTECH &amp; LOGISTICS')
    expect(html).toContain('1.2B USD/YR')
    expect(html).toContain('Browse All Studies')
    expect(html).toContain('/case-studies')
  })

  it('renders fullPage mode with case studies directory and tablist', () => {
    const payloadProjects = [
      {
        id: 1,
        title: 'Spicevo Export',
        slug: 'spicevo',
        excerpt: 'Certified organic spice platform for global buyers.',
        clientInfo: {
          industry: 'ORGANIC AGRI',
          volume: '500 MT/YR',
          service: 'NEXT.JS CMS',
        },
        metrics: [
          { label: 'Market', value: '32 Countries' },
          { label: 'Stack', value: 'Next.js 15' },
        ],
      },
    ]

    const html = renderToString(
      <PortfolioArchiveBlock
        fullPage={true}
        projects={payloadProjects}
      />
    )

    expect(html).toContain('Latest')
    expect(html).toContain('Design')
    expect(html).toContain('Works.')
    expect(html).toContain('Spicevo Export')
    expect(html).toContain('Certified organic spice platform for global buyers.')
    expect(html).toContain('role="tablist"')
    expect(html).toContain('role="tab"')
    expect(html).toContain('aria-controls="fullpage-portfolio-panel"')
    expect(html).toContain('/portfolio/spicevo')
    expect(html).toContain('READ CASE STUDY')
  })
})
