import React from 'react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/payload-cache', () => ({
  getCachedSitemapCollection: vi.fn().mockResolvedValue([]),
  getCachedRedirects: vi.fn().mockResolvedValue([]),
  getCachedGlobal: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/lib/payload', () => ({
  getPayload: vi.fn().mockResolvedValue({}),
  getPayloadClient: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/actions/submitLead', () => ({
  submitLeadAction: vi.fn(),
}))
vi.mock('@/app/(frontend)/actions/submitRFQ', () => ({
  submitRFQ: vi.fn(),
}))

import { renderToString } from 'react-dom/server'
import SkipToContent from '@/components/legal/SkipToContent'
import PageWrapper from '@/components/layout/PageWrapper'
import HeaderClient from '@/components/layout/HeaderClient'
import FooterContent from '@/components/layout/FooterContent'
import ContactForm from '@/components/forms/ContactForm'
import RFQForm from '@/components/forms/RFQForm'
import ToolsIndexPage from '@/app/(frontend)/tools/page'

describe('WCAG 2.1 AA Accessibility Standards Baseline', () => {
  describe('1. Skip Link and Main Landmark Hierarchy', () => {
    it('SkipToContent renders accessible anchor linking directly to #main-content', () => {
      const html = renderToString(<SkipToContent />)

      expect(html).toContain('href="#main-content"')
      expect(html).toContain('sr-only focus:not-sr-only')
      expect(html).toContain('focus:start-4')
      expect(html).toContain('focus-visible:outline-none')
      expect(html).toContain('focus-visible:ring-2')
      expect(html).toContain('focus-visible:ring-emerald')
      expect(html).toContain('focus-visible:ring-offset-2')
      expect(html).toContain('Skip to main content')
    })

    it('PageWrapper mounts a single <main id="main-content"> landmark wrapper', () => {
      const html = renderToString(
        <PageWrapper>
          <div data-testid="page-inner">Test Content</div>
        </PageWrapper>
      )

      expect(html).toContain('<main id="main-content"')
      expect(html).toContain('Test Content')
      // Ensure only one <main> tag is generated
      const mainMatches = html.match(/<main\b/g)
      expect(mainMatches?.length).toBe(1)
    })
  })

  describe('2. Header and Footer Landmark Hierarchy & ARIA Labels', () => {
    it('HeaderClient renders <header>, primary navigation, and mobile navigation landmarks', () => {
      const links = [
        { link: { label: 'Web', url: '/web' }, id: '1' },
        { link: { label: 'Portfolio', url: '/portfolio' }, id: '2' },
      ]
      const html = renderToString(<HeaderClient navLinks={links} brand={{ name: 'EXVORTA', logoUrl: null }} />)

      expect(html).toContain('<header')
      expect(html).toContain('data-purpose="site-header"')
      expect(html).toContain('<nav aria-label="Primary"')
      expect(html).toContain('<nav aria-label="Mobile"')
      expect(html).toContain('aria-label="EXVORTA home"')
      expect(html).toContain('aria-controls="mobile-menu"')
    })

    it('FooterContent renders <footer> landmark, Footer navigation, and Back to Top skip link', () => {
      const columns = [
        {
          id: 'col-1',
          title: 'Infrastructure',
          links: [{ id: 'link-1', label: 'Web', href: '/web', external: false }],
        },
      ]
      const html = renderToString(<FooterContent columns={columns} brand={{ name: 'EXVORTA', logoUrl: null }} />)

      expect(html).toContain('<footer')
      expect(html).toContain('<nav aria-label="Footer"')
      expect(html).toContain('href="#main-content"')
      expect(html).toContain('Back to top')
      expect(html).toContain('aria-label="EXVORTA home"')
    })
  })

  describe('3. Form Controls & Labels on /contact', () => {
    it('ContactForm renders explicit labels, required indicators, and focus tokens', () => {
      const html = renderToString(<ContactForm />)

      // Explicit labels with htmlFor and corresponding input IDs
      expect(html).toContain('for="name"')
      expect(html).toContain('id="name"')
      expect(html).toContain('for="email"')
      expect(html).toContain('id="email"')
      expect(html).toContain('for="phone"')
      expect(html).toContain('id="phone"')
      expect(html).toContain('for="message"')
      expect(html).toContain('id="message"')

      // Required indicators and aria attributes
      expect(html).toContain('aria-required="true"')
      expect(html).toContain('(required)')

      // Focus ring tokens on form controls
      expect(html).toContain('focus-visible:outline-none')
      expect(html).toContain('focus-visible:ring-2')
      expect(html).toContain('focus-visible:ring-emerald')
      expect(html).toContain('focus-visible:ring-offset-2')

      // Honeypot is completely aria-hidden
      expect(html).toContain('aria-hidden="true"')
      expect(html).toContain('id="contact-bot-field"')

      // Live region for polite status announcements
      expect(html).toContain('aria-live="polite"')
      expect(html).toContain('role="status"')
    })
  })

  describe('4. Form Controls & Labels on /rfq', () => {
    it('RFQForm renders explicit labels, aria-required, aria-labels for selects, and focus tokens', () => {
      const html = renderToString(<RFQForm />)

      // Explicit form control IDs and labels
      expect(html).toContain('for="rfq-name"')
      expect(html).toContain('id="rfq-name"')
      expect(html).toContain('for="rfq-companyName"')
      expect(html).toContain('id="rfq-companyName"')
      expect(html).toContain('for="rfq-email"')
      expect(html).toContain('id="rfq-email"')
      expect(html).toContain('id="rfq-email-hint"')
      expect(html).toContain('aria-describedby="rfq-email-hint"')
      expect(html).toContain('for="rfq-businessType"')
      expect(html).toContain('id="rfq-businessType"')
      expect(html).toContain('aria-label="Business Type"')
      expect(html).toContain('for="rfq-mainMarkets"')
      expect(html).toContain('id="rfq-mainMarkets"')
      expect(html).toContain('for="rfq-message"')
      expect(html).toContain('id="rfq-message"')
      expect(html).toContain('for="rfq-budget"')
      expect(html).toContain('id="rfq-budget"')
      expect(html).toContain('aria-label="Allocated Budget"')

      // Required attributes
      expect(html).toContain('aria-required="true"')

      // Focus indicator tokens
      expect(html).toContain('focus-visible:outline-none')
      expect(html).toContain('focus-visible:ring-2')
      expect(html).toContain('focus-visible:ring-emerald')
      expect(html).toContain('focus-visible:ring-offset-2')

      // Honeypot is aria-hidden
      expect(html).toContain('aria-hidden="true"')
      expect(html).toContain('id="rfq-bot-field"')
    })
  })

  describe('5. Tools Route Structure and Focus Tokens', () => {
    it('ToolsIndexPage renders valid semantic hierarchy and card focus rings', () => {
      const html = renderToString(<ToolsIndexPage />)

      // h1 heading for tools page
      expect(html).toContain('<h1')
      expect(html).toContain('Global Trade Calculators')

      // Card link with focus ring and aria label
      expect(html).toContain('href="/tools/incoterm-cbm"')
      expect(html).toContain('aria-label="Incoterm &amp; CBM Calculator tool"')
      expect(html).toContain('focus-visible:outline-none')
      expect(html).toContain('focus-visible:ring-2')
      expect(html).toContain('focus-visible:ring-emerald')
      expect(html).toContain('focus-visible:ring-offset-2')
    })
  })

  describe('6. Design System Color Contrast Ratios (WCAG 2.1 AA Math)', () => {
    // Relative luminance calculator per W3C WCAG 2.1 formula
    function getRelativeLuminance(r: number, g: number, b: number): number {
      const a = [r, g, b].map((v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
    }

    function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
      const lum1 = getRelativeLuminance(...rgb1)
      const lum2 = getRelativeLuminance(...rgb2)
      const brightest = Math.max(lum1, lum2)
      const darkest = Math.min(lum1, lum2)
      return (brightest + 0.05) / (darkest + 0.05)
    }

    it('Standard text (--color-obsidian #0D0D0D on --color-cream #FAFAF8) exceeds 4.5:1 AA ratio', () => {
      const obsidian: [number, number, number] = [13, 13, 13]
      const cream: [number, number, number] = [250, 250, 248]
      const ratio = getContrastRatio(obsidian, cream)

      expect(ratio).toBeGreaterThan(18) // ~19.1:1 (WCAG AAA standard is 7:1)
    })

    it('Secondary copy (--color-muted 62% obsidian on --color-cream) exceeds 4.5:1 AA ratio', () => {
      // 62% obsidian on cream composite:
      // r = 0.62 * 13 + 0.38 * 250 = 8.06 + 95 = 103
      // g = 0.62 * 13 + 0.38 * 250 = 8.06 + 95 = 103
      // b = 0.62 * 13 + 0.38 * 248 = 8.06 + 94.24 = 102
      const mutedOnCream: [number, number, number] = [103, 103, 102]
      const cream: [number, number, number] = [250, 250, 248]
      const ratio = getContrastRatio(mutedOnCream, cream)

      expect(ratio).toBeGreaterThanOrEqual(4.5) // ~5.5:1
    })

    it('Active UI component accents (--color-emerald #059669 on --color-cream) exceed 3.0:1 UI ratio', () => {
      const emerald: [number, number, number] = [5, 150, 105]
      const cream: [number, number, number] = [250, 250, 248]
      const ratio = getContrastRatio(emerald, cream)

      expect(ratio).toBeGreaterThanOrEqual(3.0) // ~3.6:1
    })

    it('White text and focus rings on obsidian surface exceed 4.5:1 AA ratio', () => {
      const white: [number, number, number] = [255, 255, 255]
      const obsidian: [number, number, number] = [13, 13, 13]
      const ratio = getContrastRatio(white, obsidian)

      expect(ratio).toBeGreaterThan(18) // ~19.8:1
    })

    it('Danger error text (--color-danger #DC2626 on cream) exceeds 4.5:1 AA ratio', () => {
      const danger: [number, number, number] = [220, 38, 38]
      const cream: [number, number, number] = [250, 250, 248]
      const ratio = getContrastRatio(danger, cream)

      expect(ratio).toBeGreaterThanOrEqual(4.5) // ~5.2:1
    })
  })
})
