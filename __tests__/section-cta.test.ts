import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  ANALYTICS_EVENTS: {
    CTA_CLICKED: 'cta_clicked',
    QUOTE_BAR_DISMISSED: 'quote_bar_dismissed',
  },
}))

import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'
import { SectionCtaBand } from '@/components/ui/SectionCtaBand'

describe('SectionCtaBand component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders default content, titles, and accessibility attributes', () => {
    const html = renderToStaticMarkup(React.createElement(SectionCtaBand))

    // Accessibility attributes
    expect(html).toContain('role="region"')
    expect(html).toContain('aria-label="Ready to deploy institutional digital infrastructure?"')

    // Default typography and copy
    expect(html).toContain('INFRASTRUCTURE ENGAGEMENT')
    expect(html).toContain('Ready to deploy institutional digital infrastructure?')
    expect(html).toContain('Deterministic fixed-scope export platforms')

    // Buttons
    expect(html).toContain('[ REQUEST PROPOSAL ]')
    expect(html).toContain('href="/rfq"')
    expect(html).toContain('[ EXPLORE CAPABILITIES ]')
    expect(html).toContain('href="/pricing"')

    // Default tone (dark) and frame crosshair styling
    expect(html).toContain('on-dark')
    expect(html).toContain('bg-obsidian')
    expect(html).toContain('frame-dark')
    expect(html).toContain('btn-primary')
    expect(html).toContain('btn-ghost')
  })

  it('renders with custom props, tone="light", and compact=true', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionCtaBand, {
        id: 'custom-cta',
        tone: 'light',
        eyebrow: 'CUSTOM EYEBROW',
        headline: 'Custom Headline For Testing',
        description: 'Custom description for testing purpose.',
        primaryCta: { label: '[ PROCEED NOW ]', href: '/custom-rfq' },
        secondaryCta: { label: '[ READ DOCS ]', href: '/docs' },
        compact: true,
      })
    )

    expect(html).toContain('id="custom-cta"')
    expect(html).toContain('aria-label="Custom Headline For Testing"')
    expect(html).toContain('CUSTOM EYEBROW')
    expect(html).toContain('Custom Headline For Testing')
    expect(html).toContain('Custom description for testing purpose.')
    expect(html).toContain('[ PROCEED NOW ]')
    expect(html).toContain('href="/custom-rfq"')
    expect(html).toContain('[ READ DOCS ]')
    expect(html).toContain('href="/docs"')

    // Light tone classes
    expect(html).toContain('bg-surface text-obsidian')
    expect(html).toContain('border-rule bg-cream')
  })

  it('renders with tone="surface"', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionCtaBand, {
        tone: 'surface',
      })
    )
    expect(html).toContain('bg-surface/5')
    expect(html).toContain('frame-dark')
  })

  it('dispatches analytics CTA_CLICKED event when CTAs are triggered', () => {
    const tree = SectionCtaBand({
      trackingTarget: 'custom_cta_target',
      primaryCta: { label: '[ TEST PRIMARY ]', href: '/test-primary' },
      secondaryCta: { label: '[ TEST SECONDARY ]', href: '/test-secondary' },
    })

    // Find interactive elements with onClick
    const findWithProp = (node: unknown, prop: string): Array<{ props: Record<string, unknown> }> => {
      let results: Array<{ props: Record<string, unknown> }> = []
      if (!node || typeof node !== 'object') return results
      const candidate = node as { props?: Record<string, unknown> }
      if (candidate.props && candidate.props[prop] !== undefined) {
        results.push({ props: candidate.props })
      }
      if (candidate.props && candidate.props.children) {
        React.Children.forEach(candidate.props.children, (child) => {
          results = results.concat(findWithProp(child, prop))
        })
      }
      return results
    }

    const clickables = findWithProp(tree, 'onClick')
    expect(clickables.length).toBeGreaterThanOrEqual(2)

    // Trigger primary CTA click
    const primaryLink = clickables.find((c) => c.props.href === '/test-primary')
    expect(primaryLink).toBeDefined()
    ;(primaryLink?.props.onClick as () => void)()

    expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.CTA_CLICKED, {
      target: 'custom_cta_target',
      href: '/test-primary',
      label: '[ TEST PRIMARY ]',
      type: 'primary',
    })

    // Trigger secondary CTA click
    const secondaryLink = clickables.find((c) => c.props.href === '/test-secondary')
    expect(secondaryLink).toBeDefined()
    ;(secondaryLink?.props.onClick as () => void)()

    expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.CTA_CLICKED, {
      target: 'custom_cta_target',
      href: '/test-secondary',
      label: '[ TEST SECONDARY ]',
      type: 'secondary',
    })
  })
})
