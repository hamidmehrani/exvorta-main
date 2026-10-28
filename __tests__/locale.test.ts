import { describe, it, expect, vi } from 'vitest'
import fs from 'fs'
import path from 'path'

vi.mock('@/lib/payload-cache', () => ({
  getCachedSitemapCollection: vi.fn().mockResolvedValue([]),
  getCachedRedirects: vi.fn().mockResolvedValue([]),
  getCachedGlobal: vi.fn().mockResolvedValue(null),
  getCachedSeoDefaults: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/lib/payload', () => ({
  getPayload: vi.fn().mockResolvedValue({}),
  getPayloadClient: vi.fn().mockResolvedValue({}),
}))

import {
  ARABIC_MIRROR_PAIRS,
  buildLocaleAlternates,
  validateLocaleAlternates,
  normalizeEnPath,
  getArPathForEnPath,
} from '@/lib/locale'
import { STATIC_ROUTES, ROBOTS_DISALLOWED } from '@/app/sitemap'
import sitemap from '@/app/sitemap'
import { generateMetadata as generateEnIncotermMetadata } from '@/app/(frontend)/tools/incoterm-cbm/page'
import { generateMetadata as generateArIncotermMetadata } from '@/app/(frontend)/tools/incoterm-cbm/ar/page'

describe('PLAT-12: Arabic Locale Architecture & Internationalization Contract', () => {
  describe('Bidirectional hreflang alternates contract', () => {
    it('defines the required route pairs: / <-> /ar, /tools <-> /tools/ar, /pricing <-> /pricing/ar, and /tools/incoterm-cbm <-> /tools/incoterm-cbm/ar', () => {
      const expectedPairs = [
        { en: '/', ar: '/ar' },
        { en: '/tools', ar: '/tools/ar' },
        { en: '/pricing', ar: '/pricing/ar' },
        { en: '/tools/incoterm-cbm', ar: '/tools/incoterm-cbm/ar' },
      ]

      for (const expected of expectedPairs) {
        const found = ARABIC_MIRROR_PAIRS.find(
          (p) => p.en === expected.en && p.ar === expected.ar
        )
        expect(
          found,
          `Expected ARABIC_MIRROR_PAIRS to contain ${expected.en} <-> ${expected.ar}`
        ).toBeDefined()
      }
    })

    describe.each(ARABIC_MIRROR_PAIRS)(
      'Route pair: $en <-> $ar',
      ({ en, ar }) => {
        it(`builds compliant English metadata alternates for ${en}`, () => {
          const enAlternates = buildLocaleAlternates(en, 'en')

          expect(enAlternates.canonical).toBe(en)
          expect(enAlternates.languages.en).toBe(en)
          expect(enAlternates.languages.ar).toBe(ar)
          expect(enAlternates.languages['x-default']).toBe(en)

          expect(
            validateLocaleAlternates(enAlternates, {
              canonical: en,
              en,
              ar,
            })
          ).toBe(true)
        })

        it(`builds compliant Arabic metadata alternates for ${ar}`, () => {
          const arAlternates = buildLocaleAlternates(en, 'ar')

          expect(arAlternates.canonical).toBe(ar)
          expect(arAlternates.languages.en).toBe(en)
          expect(arAlternates.languages.ar).toBe(ar)
          expect(arAlternates.languages['x-default']).toBe(en)

          expect(
            validateLocaleAlternates(arAlternates, {
              canonical: ar,
              en,
              ar,
            })
          ).toBe(true)
        })

        it(`enforces bidirectional reciprocal symmetry between ${en} and ${ar}`, () => {
          const enAlternates = buildLocaleAlternates(en, 'en')
          const arAlternates = buildLocaleAlternates(en, 'ar')

          // English page alternates must point to Arabic page
          expect(enAlternates.languages.ar).toBe(arAlternates.canonical)
          // Arabic page alternates must point to English page
          expect(arAlternates.languages.en).toBe(enAlternates.canonical)
          // Both must agree on x-default being the English canonical
          expect(enAlternates.languages['x-default']).toBe(en)
          expect(arAlternates.languages['x-default']).toBe(en)
          // Languages map must be identical in content across both
          expect(enAlternates.languages).toEqual(arAlternates.languages)
        })
      }
    )

    describe('Helper normalization and edge cases', () => {
      it('handles root route variations ("/", "", "///")', () => {
        expect(normalizeEnPath('/')).toBe('/')
        expect(normalizeEnPath('')).toBe('/')
        expect(normalizeEnPath('///')).toBe('/')
        expect(getArPathForEnPath('/')).toBe('/ar')
        expect(getArPathForEnPath('')).toBe('/ar')
      })

      it('normalizes paths with redundant slashes and trailing slashes', () => {
        expect(normalizeEnPath('/tools/')).toBe('/tools')
        expect(normalizeEnPath('pricing')).toBe('/pricing')
        expect(normalizeEnPath('//tools/incoterm-cbm///')).toBe(
          '/tools/incoterm-cbm'
        )
      })

      it('extracts base English path if Arabic mirror path is passed accidentally', () => {
        expect(normalizeEnPath('/tools/ar')).toBe('/tools')
        expect(normalizeEnPath('/ar')).toBe('/')
        expect(normalizeEnPath('ar')).toBe('/')
        expect(getArPathForEnPath('/tools/ar')).toBe('/tools/ar')
        expect(buildLocaleAlternates('/tools/ar', 'ar').canonical).toBe(
          '/tools/ar'
        )
      })
    })

    describe('Live page metadata verification: /tools/incoterm-cbm and /tools/incoterm-cbm/ar', () => {
      it('English Incoterm & CBM page declares metadata alternates matching the contract', async () => {
        const metadata = await generateEnIncotermMetadata()
        expect(metadata).toBeDefined()
        expect(metadata.alternates).toBeDefined()

        const alternates = metadata.alternates as {
          canonical: string
          languages: { en: string; ar: string; 'x-default': string }
        }

        expect(alternates.canonical).toBe('/tools/incoterm-cbm')
        expect(alternates.languages.en).toBe('/tools/incoterm-cbm')
        expect(alternates.languages.ar).toBe('/tools/incoterm-cbm/ar')
        expect(alternates.languages['x-default']).toBe('/tools/incoterm-cbm')
      })

      it('Arabic Incoterm & CBM page declares metadata alternates matching the contract', async () => {
        const metadata = await generateArIncotermMetadata()
        expect(metadata).toBeDefined()
        expect(metadata.alternates).toBeDefined()

        const alternates = metadata.alternates as {
          canonical: string
          languages: { en: string; ar: string; 'x-default': string }
        }

        expect(alternates.canonical).toBe('/tools/incoterm-cbm/ar')
        expect(alternates.languages.en).toBe('/tools/incoterm-cbm')
        expect(alternates.languages.ar).toBe('/tools/incoterm-cbm/ar')
        expect(alternates.languages['x-default']).toBe('/tools/incoterm-cbm')
      })

      it('confirms reciprocal symmetry between live English and Arabic Incoterm pages', async () => {
        const enMeta = await generateEnIncotermMetadata()
        const arMeta = await generateArIncotermMetadata()

        const enAlternates = enMeta.alternates as {
          canonical: string
          languages: { en: string; ar: string; 'x-default': string }
        }
        const arAlternates = arMeta.alternates as {
          canonical: string
          languages: { en: string; ar: string; 'x-default': string }
        }

        expect(enAlternates.languages.ar).toBe(arAlternates.canonical)
        expect(arAlternates.languages.en).toBe(enAlternates.canonical)
        expect(enAlternates.languages['x-default']).toBe(enAlternates.canonical)
        expect(arAlternates.languages['x-default']).toBe(enAlternates.canonical)
        expect(enAlternates.languages).toEqual(arAlternates.languages)
      })
    })
  })

  describe('Sitemap route consistency for Arabic static routes', () => {
    it('confirms Arabic static routes are registered in STATIC_ROUTES (app/sitemap.ts)', () => {
      const arabicRoutes = STATIC_ROUTES.filter((r) => r.path.endsWith('/ar'))

      expect(
        arabicRoutes.length,
        'Expected at least one Arabic static route registered in STATIC_ROUTES'
      ).toBeGreaterThanOrEqual(1)

      const incotermAr = arabicRoutes.find(
        (r) => r.path === '/tools/incoterm-cbm/ar'
      )
      expect(
        incotermAr,
        'Expected /tools/incoterm-cbm/ar to be registered in STATIC_ROUTES'
      ).toBeDefined()
      expect(incotermAr?.priority).toBe(0.8)
      expect(incotermAr?.changeFrequency).toBe('monthly')
    })

    it('verifies every registered Arabic static route has its English counterpart in STATIC_ROUTES', () => {
      const arabicRoutes = STATIC_ROUTES.filter((r) => r.path.endsWith('/ar'))
      const allPaths = new Set(STATIC_ROUTES.map((r) => r.path))

      for (const arRoute of arabicRoutes) {
        const baseEnPath = arRoute.path.replace(/\/ar$/, '') || ''
        expect(
          allPaths.has(baseEnPath),
          `Expected STATIC_ROUTES to contain base English route "${baseEnPath}" for Arabic route "${arRoute.path}"`
        ).toBe(true)
      }
    })

    it('verifies all registered Arabic static routes have valid priority and changeFrequency', () => {
      const validFrequencies = new Set([
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
      ])

      const arabicRoutes = STATIC_ROUTES.filter((r) => r.path.endsWith('/ar'))
      for (const route of arabicRoutes) {
        expect(route.priority).toBeGreaterThanOrEqual(0)
        expect(route.priority).toBeLessThanOrEqual(1.0)
        expect(validFrequencies.has(route.changeFrequency as string)).toBe(true)
      }
    })

    it('ensures no registered Arabic static routes are disallowed in robots.txt', () => {
      const arabicRoutes = STATIC_ROUTES.filter((r) => r.path.endsWith('/ar'))
      for (const route of arabicRoutes) {
        expect(ROBOTS_DISALLOWED.has(route.path)).toBe(false)
      }
    })

    it('resolves registered Arabic static routes when sitemap() executes', async () => {
      const entries = await sitemap()
      const arEntries = entries.filter((e) => e.url.endsWith('/ar'))

      expect(arEntries.length).toBeGreaterThanOrEqual(1)
      const incotermEntry = arEntries.find((e) =>
        e.url.includes('/tools/incoterm-cbm/ar')
      )
      expect(incotermEntry).toBeDefined()
      expect(incotermEntry?.priority).toBe(0.8)
      expect(incotermEntry?.changeFrequency).toBe('monthly')
      expect(incotermEntry?.lastModified).toBeDefined()
    })
  })

  describe('RTL & Logical CSS architecture compliance', () => {
    it('verifies app/(frontend)/tools/incoterm-cbm/ar/page.tsx mounts dir="rtl" and lang="ar"', () => {
      const arPagePath = path.join(
        process.cwd(),
        'app/(frontend)/tools/incoterm-cbm/ar/page.tsx'
      )
      const content = fs.readFileSync(arPagePath, 'utf-8')

      expect(content).toContain('dir="rtl"')
      expect(content).toContain('lang="ar"')
    })

    it('verifies app/(frontend)/tools/incoterm-cbm/ar/page.tsx avoids non-logical horizontal spacing utilities', () => {
      const arPagePath = path.join(
        process.cwd(),
        'app/(frontend)/tools/incoterm-cbm/ar/page.tsx'
      )
      const content = fs.readFileSync(arPagePath, 'utf-8')

      // Ensure no physical margin/padding/border utilities are used in classNames
      expect(content).not.toMatch(/className="[^"]*\b(pl-|pr-|ml-|mr-|border-l-|border-r-)\w+[^"]*"/)
    })
  })
})
