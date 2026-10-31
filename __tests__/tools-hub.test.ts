import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/payload-cache', () => ({
  getCachedSitemapCollection: vi.fn().mockResolvedValue([]),
  getCachedRedirects: vi.fn().mockResolvedValue([]),
  getCachedGlobal: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/lib/payload', () => ({
  getPayload: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/actions/submitWaitlist', () => ({
  submitWaitlist: vi.fn().mockResolvedValue({ success: true, error: null }),
}))

import {
  metadata,
  TOOLS_CATALOG,
  LIVE_TOOLS,
  ROADMAP_TOOLS,
  TRUST_RIBBON_ITEMS,
  WHY_FREE_PILLARS,
  buildToolsItemListJsonLd,
  default as ToolsHubPage,
} from '@/app/(frontend)/tools/page'
import ToolsWaitlistBand from '@/components/blocks/ToolsWaitlistBand'
import { STATIC_ROUTES } from '@/app/sitemap'
import { buildLocaleAlternates } from '@/lib/locale'

function extractJsonLd(html: string): Record<string, unknown> {
  const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)
  if (!match) throw new Error(`No JSON-LD script tag found in HTML: ${html}`)
  return JSON.parse(match[1])
}

describe('TOOL-7 Tools Hub (/tools) Implementation', () => {
  describe('Metadata & SEO specifications', () => {
    it('exports metadata conforming to institutional trade hub specifications', () => {
      expect(metadata.title).toBe('Export & Trade Utilities Hub | Exvorta')
      expect(metadata.description).toBe(
        'Institutional export engineering utilities: Incoterm & CBM calculators, trade documentation generators, and regulatory readiness checkers for global trade.'
      )
    })

    it('exports bidirectional hreflang alternates conforming to Section 4 contracts', () => {
      const expectedAlternates = buildLocaleAlternates('/tools', 'en')
      expect(metadata.alternates).toEqual(expectedAlternates)
      expect(metadata.alternates?.canonical).toBe('/tools')
      expect(metadata.alternates?.languages?.['en']).toBe('/tools')
      expect(metadata.alternates?.languages?.['ar']).toBe('/tools/ar')
      expect(metadata.alternates?.languages?.['x-default']).toBe('/tools')
    })

    it('generates clean OpenGraph metadata', () => {
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBe('Export & Trade Utilities Hub | Exvorta')
      expect(metadata.openGraph?.url).toBe('/tools')
      expect(metadata.openGraph?.siteName).toBe('Exvorta')
    })
  })

  describe('Tool catalog completeness (Live vs Roadmap)', () => {
    it('defines exactly 6 tools in the official catalog', () => {
      expect(TOOLS_CATALOG).toHaveLength(6)
    })

    it('defines exactly 3 live tools with direct production links and actions', () => {
      expect(LIVE_TOOLS).toHaveLength(3)

      const incoterm = LIVE_TOOLS.find((t) => t.id === 'incoterm-cbm')
      expect(incoterm).toBeDefined()
      expect(incoterm?.name).toBe('Incoterm & CBM Logistics Calculator')
      expect(incoterm?.url).toBe('/tools/incoterm-cbm')
      expect(incoterm?.altUrl).toBe('/tools/incoterm-cbm/ar')
      expect(incoterm?.category).toBe('LOGISTICS & FREIGHT')
      expect(incoterm?.status).toBe('live')
      expect(incoterm?.statusLabel).toBe('[ LIVE TOOL ]')
      expect(incoterm?.actionLabel).toBe('[ LAUNCH CALCULATOR -> ]')

      const docgen = LIVE_TOOLS.find((t) => t.id === 'docs-generator')
      expect(docgen).toBeDefined()
      expect(docgen?.name).toBe('Commercial Export Documentation Generator')
      expect(docgen?.url).toBe('/tools/docs-generator')
      expect(docgen?.category).toBe('TRADE COMPLIANCE')
      expect(docgen?.status).toBe('live')
      expect(docgen?.statusLabel).toBe('[ LIVE TOOL ]')
      expect(docgen?.actionLabel).toBe('[ LAUNCH GENERATOR -> ]')

      const rfq = LIVE_TOOLS.find((t) => t.id === 'rfq-builder')
      expect(rfq).toBeDefined()
      expect(rfq?.name).toBe('RFQ Cart & Spec Builder')
      expect(rfq?.url).toBe('/rfq')
      expect(rfq?.category).toBe('COMMERCIAL SPEC')
      expect(rfq?.status).toBe('live')
      expect(rfq?.statusLabel).toBe('[ LIVE TOOL ]')
      expect(rfq?.actionLabel).toBe('[ OPEN SPEC BUILDER -> ]')
    })

    it('defines exactly 3 roadmap tools with notify actions and waitlist hooks', () => {
      expect(ROADMAP_TOOLS).toHaveLength(3)

      const hs = ROADMAP_TOOLS.find((t) => t.id === 'hs-converter')
      expect(hs).toBeDefined()
      expect(hs?.name).toBe('GCC HS 8→12-Digit Tariff Converter')
      expect(hs?.url).toBe('/waitlist?tool=hs-converter')
      expect(hs?.category).toBe('CUSTOMS & TARIFFS')
      expect(hs?.status).toBe('roadmap')
      expect(hs?.statusLabel).toBe('[ ROADMAP ]')
      expect(hs?.actionLabel).toBe('[ NOTIFY ON LAUNCH -> ]')

      const readiness = ROADMAP_TOOLS.find((t) => t.id === 'readiness-checker')
      expect(readiness).toBeDefined()
      expect(readiness?.name).toBe('Egypt ACI & KSA SABER Readiness Checker')
      expect(readiness?.url).toBe('/waitlist?tool=readiness-checker')
      expect(readiness?.category).toBe('REGULATORY CLEARANCE')
      expect(readiness?.status).toBe('roadmap')
      expect(readiness?.statusLabel).toBe('[ ROADMAP ]')
      expect(readiness?.actionLabel).toBe('[ NOTIFY ON LAUNCH -> ]')

      const einvoicing = ROADMAP_TOOLS.find((t) => t.id === 'einvoicing')
      expect(einvoicing).toBeDefined()
      expect(einvoicing?.name).toBe('UAE E-Invoicing (PINT-AE) Assessment')
      expect(einvoicing?.url).toBe('/waitlist?tool=einvoicing')
      expect(einvoicing?.category).toBe('DIGITAL INVOICING')
      expect(einvoicing?.status).toBe('roadmap')
      expect(einvoicing?.statusLabel).toBe('[ ROADMAP ]')
      expect(einvoicing?.actionLabel).toBe('[ NOTIFY ON LAUNCH -> ]')
    })
  })

  describe('ItemList JSON-LD Schema Validity', () => {
    it('produces a valid schema.org ItemList with WebApplication elements', () => {
      const schema = buildToolsItemListJsonLd(TOOLS_CATALOG)

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('ItemList')
      expect(schema.name).toBe('Exvorta Trade Utilities & Export Engineering Tools')
      expect(schema.itemListElement).toHaveLength(6)

      schema.itemListElement.forEach((item) => {
        expect(item['@type']).toBe('WebApplication')
        expect(typeof item.name).toBe('string')
        expect(item.name.length).toBeGreaterThan(0)
        expect(typeof item.description).toBe('string')
        expect(item.description.length).toBeGreaterThan(0)
        expect(typeof item.url).toBe('string')
        expect(item.url.startsWith('/')).toBe(true)
        expect(item.applicationCategory).toBeDefined()
        expect(item.operatingSystem).toBe('All')
        expect(item.offers).toEqual({
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        })
      })
    })
  })

  describe('Page Component & Static Markup Rendering', () => {
    it('renders the complete Tools Hub page with hero, catalog, trust section, and JSON-LD', () => {
      const html = renderToStaticMarkup(React.createElement(ToolsHubPage))

      // Hero content
      expect(html).toContain('SYS_INDEX // UTILITIES_ENGINE')
      expect(html).toContain('Engineering Tools for Global Export Operations')
      expect(html).toContain('Precision-engineered trade calculators')

      // Trust Ribbon
      TRUST_RIBBON_ITEMS.forEach((ribbon) => {
        expect(html).toContain(ribbon)
      })

      // Live and Roadmap Tools presence
      TOOLS_CATALOG.forEach((tool) => {
        expect(html).toContain(tool.name)
        expect(html).toContain(tool.category.replace('&', '&amp;'))
        expect(html).toContain(tool.statusLabel)
      })

      // Institutional "Why Free" Section
      expect(html).toContain('Why Our Trade Utilities Are Free &amp; Public')
      WHY_FREE_PILLARS.forEach((pillar) => {
        expect(html).toContain(pillar.title)
        expect(html).toContain(pillar.description)
      })

      // Embedded JSON-LD script matches schema specification
      const parsedJsonLd = extractJsonLd(html)
      expect(parsedJsonLd['@context']).toBe('https://schema.org')
      expect(parsedJsonLd['@type']).toBe('ItemList')
      expect(parsedJsonLd.name).toBe('Exvorta Trade Utilities & Export Engineering Tools')
      expect(Array.isArray(parsedJsonLd.itemListElement)).toBe(true)
      expect((parsedJsonLd.itemListElement as unknown[]).length).toBe(6)
    })

    it('renders the ToolsWaitlistBand with accessible corporate email input', () => {
      const html = renderToStaticMarkup(React.createElement(ToolsWaitlistBand))
      expect(html).toContain('Stay Ahead of Regional Trade Mandates')
      expect(html).toContain('type="email"')
      expect(html).toContain('id="tools-hub-email"')
      expect(html).toContain('[ REQUEST ACCESS ]')
    })
  })

  describe('Sitemap static route registration (app/sitemap.ts)', () => {
    it('includes /tools with priority 0.9 and weekly changeFrequency', () => {
      const toolsRoute = STATIC_ROUTES.find((r) => r.path === '/tools')
      expect(toolsRoute).toBeDefined()
      expect(toolsRoute?.priority).toBe(0.9)
      expect(toolsRoute?.changeFrequency).toBe('weekly')
    })

    it('includes /tools/docs-generator with priority 0.8 and monthly changeFrequency', () => {
      const docgenRoute = STATIC_ROUTES.find((r) => r.path === '/tools/docs-generator')
      expect(docgenRoute).toBeDefined()
      expect(docgenRoute?.priority).toBe(0.8)
      expect(docgenRoute?.changeFrequency).toBe('monthly')
    })
  })
})
