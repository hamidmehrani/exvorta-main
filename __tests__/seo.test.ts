import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'

vi.mock('@/lib/payload-cache', () => ({
  getCachedSitemapCollection: vi.fn().mockResolvedValue([]),
  getCachedRedirects: vi.fn().mockResolvedValue([]),
  getCachedGlobal: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/lib/payload', () => ({
  getPayload: vi.fn().mockResolvedValue({}),
}))

import { STATIC_ROUTES, ROBOTS_DISALLOWED } from '@/app/sitemap'
import robots from '@/app/robots'
import ServiceSchema, { buildServiceJsonLd } from '@/components/seo/ServiceSchema'
import FAQJsonLd from '@/components/seo/FAQJsonLd'
import OpenGraphImage, {
  alt as rootOgAlt,
  size as rootOgSize,
  contentType as rootOgContentType,
} from '@/app/(frontend)/opengraph-image'
import LaunchpadOpenGraphImage, {
  alt as launchpadOgAlt,
  size as launchpadOgSize,
  contentType as launchpadOgContentType,
} from '@/app/(frontend)/launchpad/opengraph-image'

function extractJsonLd(html: string): Record<string, unknown> {
  const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)
  if (!match) throw new Error(`No JSON-LD script tag found in HTML: ${html}`)
  return JSON.parse(match[1])
}

describe('SEO Technical Pack', () => {
  describe('STATIC_ROUTES contract (app/sitemap.ts)', () => {
    it('includes all required routes from docs/CONTRACTS.md', () => {
      const requiredRoutes = [
        '/',
        '/web',
        '/launchpad',
        '/portfolio',
        '/ecosystem',
        '/insights',
        '/about',
        '/contact',
        '/rfq',
        '/waitlist',
        '/legal',
      ]

      const normalizedPaths = STATIC_ROUTES.map((route) => (route.path === '' ? '/' : route.path))

      for (const requiredRoute of requiredRoutes) {
        expect(
          normalizedPaths,
          `Expected STATIC_ROUTES to include route: ${requiredRoute}`
        ).toContain(requiredRoute)
      }
    })

    it('defines valid priorities and changeFrequency values for all static routes', () => {
      const validFrequencies = new Set([
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
      ])

      for (const route of STATIC_ROUTES) {
        expect(route.priority).toBeGreaterThanOrEqual(0)
        expect(route.priority).toBeLessThanOrEqual(1.0)
        expect(validFrequencies.has(route.changeFrequency as string)).toBe(true)
      }
    })

    it('does not include any disallowed path in static marketing routes', () => {
      for (const route of STATIC_ROUTES) {
        expect(ROBOTS_DISALLOWED.has(route.path)).toBe(false)
      }
    })
  })

  describe('ROBOTS_DISALLOWED crawl directives (app/sitemap.ts & app/robots.ts)', () => {
    it('correctly marks /admin, /login, /api as disallowed', () => {
      expect(ROBOTS_DISALLOWED.has('/admin')).toBe(true)
      expect(ROBOTS_DISALLOWED.has('/login')).toBe(true)
      expect(ROBOTS_DISALLOWED.has('/api')).toBe(true)
    })

    it('robots.ts serves valid disallow rules containing protected routes', async () => {
      const robotsConfig = await robots()
      expect(robotsConfig).toBeDefined()
      expect(robotsConfig.rules).toBeDefined()

      const rules = Array.isArray(robotsConfig.rules)
        ? robotsConfig.rules[0]
        : robotsConfig.rules

      expect(rules?.userAgent).toBe('*')
      const disallowRules = Array.isArray(rules?.disallow)
        ? rules?.disallow
        : [rules?.disallow]

      expect(disallowRules).toContain('/admin')
      expect(disallowRules).toContain('/login')
      expect(disallowRules.some((rule) => rule === '/api' || rule === '/api/')).toBe(true)
    })
  })

  describe('ServiceSchema JSON-LD component', () => {
    it('renders valid Schema.org Service JSON-LD script tag', () => {
      const element = React.createElement(ServiceSchema, {
        name: 'Web Infrastructure',
        description: 'Precision digital infrastructure for global traders',
      })
      const html = renderToStaticMarkup(element)

      expect(html).toContain('type="application/ld+json"')
      const json = extractJsonLd(html)
      expect(json['@context']).toBe('https://schema.org')
      expect(json['@type']).toBe('Service')
      expect(json.name).toBe('Web Infrastructure')
      expect(json.description).toBe('Precision digital infrastructure for global traders')
      expect(json.provider).toEqual({
        '@type': 'Organization',
        name: 'Exvorta',
      })
    })

    it('supports custom providerName, serviceType, url, and offers', () => {
      const element = React.createElement(ServiceSchema, {
        name: 'Trade Platform Engineering',
        description: 'Custom cross-border trade platforms',
        providerName: 'Exvorta Global',
        serviceType: 'SoftwareEngineering',
        url: 'https://exvorta.com/web',
        offers: [
          {
            price: '15000',
            priceCurrency: 'USD',
            url: 'https://exvorta.com/rfq',
          },
        ],
      })
      const html = renderToStaticMarkup(element)

      const json = extractJsonLd(html)
      expect(json['@type']).toBe('Service')
      expect(json.name).toBe('Trade Platform Engineering')
      expect(json.provider).toEqual({
        '@type': 'Organization',
        name: 'Exvorta Global',
      })
      expect(json.serviceType).toBe('SoftwareEngineering')
      expect(json.url).toBe('https://exvorta.com/web')
      expect(json.offers).toEqual([
        {
          '@type': 'Offer',
          price: '15000',
          priceCurrency: 'USD',
          url: 'https://exvorta.com/rfq',
        },
      ])
    })

    it('supports ProfessionalService type and single offer object', () => {
      const json = buildServiceJsonLd({
        name: 'Export Advisory',
        description: 'Strategic market entry and technical compliance',
        type: 'ProfessionalService',
        offers: {
          price: '5000',
          priceCurrency: 'USD',
        },
      })

      expect(json['@type']).toBe('ProfessionalService')
      expect(json.offers).toEqual({
        '@type': 'Offer',
        price: '5000',
        priceCurrency: 'USD',
      })
    })

    it('renders null when required props are empty', () => {
      const element = React.createElement(ServiceSchema, {
        name: '',
        description: '',
      })
      const html = renderToStaticMarkup(element)
      expect(html).toBe('')
    })
  })

  describe('FAQJsonLd component', () => {
    it('renders valid Schema.org FAQPage JSON-LD structure', () => {
      const questions = [
        {
          question: 'What is Exvorta Launchpad?',
          answer: 'A turnkey exporter trade platform delivered in 2 milestones.',
        },
        {
          question: 'Does it support bilingual RTL?',
          answer: 'Yes, native English and Arabic typography is supported.',
        },
      ]

      const element = React.createElement(FAQJsonLd, { questions })
      const html = renderToStaticMarkup(element)
      expect(html).toContain('type="application/ld+json"')

      const json = extractJsonLd(html)
      expect(json['@context']).toBe('https://schema.org')
      expect(json['@type']).toBe('FAQPage')
      expect(Array.isArray(json.mainEntity)).toBe(true)
      expect(json.mainEntity).toHaveLength(2)

      const entities = json.mainEntity as Array<{
        '@type': string
        name: string
        acceptedAnswer: { '@type': string; text: string }
      }>

      expect(entities[0]).toEqual({
        '@type': 'Question',
        name: 'What is Exvorta Launchpad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A turnkey exporter trade platform delivered in 2 milestones.',
        },
      })
    })

    it('renders null when questions array is empty or undefined', () => {
      const element = React.createElement(FAQJsonLd, { questions: [] })
      expect(renderToStaticMarkup(element)).toBe('')
    })
  })

  describe('OpenGraph dynamic images metadata configuration', () => {
    it('root opengraph-image exports valid Route Segment Config and renders ImageResponse', () => {
      expect(rootOgAlt).toBe('Exvorta — Digital Infrastructure for Global Traders')
      expect(rootOgSize).toEqual({ width: 1200, height: 630 })
      expect(rootOgContentType).toBe('image/png')

      const response = OpenGraphImage()
      expect(response).toBeDefined()
      expect(response.status).toBe(200)
    })

    it('launchpad opengraph-image exports valid Route Segment Config and renders ImageResponse', () => {
      expect(launchpadOgAlt).toBe(
        'Exvorta Launchpad — Trade Platform for Emerging Exporters'
      )
      expect(launchpadOgSize).toEqual({ width: 1200, height: 630 })
      expect(launchpadOgContentType).toBe('image/png')

      const response = LaunchpadOpenGraphImage()
      expect(response).toBeDefined()
      expect(response.status).toBe(200)
    })
  })
})
