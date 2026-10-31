import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/payload-cache', () => ({
  getCachedSitemapCollection: vi.fn().mockResolvedValue([]),
  getCachedRedirects: vi.fn().mockResolvedValue([]),
  getCachedGlobal: vi.fn().mockResolvedValue(null),
  getCachedSeoDefaults: vi.fn().mockResolvedValue({
    fallbackTitle: 'Exvorta',
    fallbackDescription: 'Digital Infrastructure for Global Traders',
  }),
}))

vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn().mockResolvedValue({
    find: vi.fn().mockResolvedValue({ docs: [] }),
  }),
}))

vi.mock('@/actions/submitWaitlist', () => ({
  submitWaitlist: vi.fn().mockResolvedValue({ success: true }),
}))

import { NewsletterSignup } from '@/components/blocks/NewsletterSignup'
import {
  NewsletterArchive,
  NewsletterArchiveEmptyState,
  NewsletterMetricsStrip,
  NewsletterPostCard,
} from '@/components/blocks/NewsletterArchive'
import { generateMetadata, default as NewsletterPage } from '@/app/(frontend)/newsletter/page'
import { STATIC_ROUTES } from '@/app/sitemap'
import type { Post } from '@/payload-types'

describe('Newsletter Signup & Archive Implementation (CONV-10)', () => {
  describe('NewsletterSignup Component', () => {
    it('renders default light variant with required elements', () => {
      const html = renderToStaticMarkup(<NewsletterSignup />)
      expect(html).toContain('CADENCE: THURSDAY 08:00 GST')
      expect(html).toContain('DISPATCH: TRADE COMPLIANCE &amp; MACRO')
      expect(html).toContain('ENTER CORPORATE EMAIL ADDRESS...')
      expect(html).toContain('[ SUBSCRIBE ]')
      expect(html).toContain('bg-surface')
      expect(html).toContain('border-rule')
      expect(html).toContain('id="newsletter-signup-email"')
      expect(html).toContain('type="email"')
      expect(html).toContain('required')
    })

    it('renders dark variant with dark surface styles', () => {
      const html = renderToStaticMarkup(<NewsletterSignup variant="dark" />)
      expect(html).toContain('bg-obsidian')
      expect(html).toContain('text-white')
      expect(html).toContain('border-rule-dark')
    })
  })

  describe('NewsletterArchive Component', () => {
    it('renders hero, metrics strip, and empty state when posts array is empty', () => {
      const html = renderToStaticMarkup(<NewsletterArchive posts={[]} />)
      // Hero verification
      expect(html).toContain('EXVORTA EXECUTIVE BRIEFINGS')
      expect(html).toContain('Institutional Trade Intelligence.')
      expect(html).toContain('Delivered weekly.')
      expect(html).toContain('Comprehensive macro analysis')

      // Metrics strip verification
      expect(html).toContain('Weekly on Thursday 08:00 GST')
      expect(html).toContain('GCC Trade, Settlement, Audits')
      expect(html).toContain('Institutional &amp; Sovereign')

      // Empty state verification
      expect(html).toContain('00 // ARCHIVE_INDEXING')
      expect(html).toContain('Next Dispatch Queued')
      expect(html).toContain('upcoming executive briefing transmits this Thursday')
    })

    it('renders dispatch cards when posts are provided', () => {
      const samplePosts: Post[] = [
        {
          id: 1,
          title: 'GCC Cross-Border Settlement Protocols 2026',
          slug: 'gcc-cross-border-settlement-protocols-2026',
          publishedDate: '2026-10-15T08:00:00.000Z',
          updatedAt: '2026-10-15T08:00:00.000Z',
          createdAt: '2026-10-15T08:00:00.000Z',
          category: {
            id: 10,
            name: 'Settlement Architecture',
            slug: 'settlement',
            updatedAt: '2026-10-15T08:00:00.000Z',
            createdAt: '2026-10-15T08:00:00.000Z',
          },
          content: {
            root: {
              type: 'root',
              direction: 'ltr',
              format: 'start',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  children: [
                    {
                      type: 'text',
                      version: 1,
                      text: 'Detailed analysis of bilateral clearing mechanisms and foreign exchange liquidity corridors across the UAE and Saudi Arabia.',
                    },
                  ],
                },
              ],
            },
          },
        },
      ]

      const html = renderToStaticMarkup(<NewsletterArchive posts={samplePosts} />)
      expect(html).toContain('GCC Cross-Border Settlement Protocols 2026')
      expect(html).toContain('/insights/gcc-cross-border-settlement-protocols-2026')
      expect(html).toContain('SETTLEMENT ARCHITECTURE')
      expect(html).toContain('Detailed analysis of bilateral clearing mechanisms')
      expect(html).toContain('[ READ DISPATCH ]')
      expect(html).not.toContain('00 // ARCHIVE_INDEXING')
    })
  })

  describe('Newsletter Page Route & Metadata', () => {
    it('generates institutional metadata for /newsletter', async () => {
      const meta = await generateMetadata()
      expect(meta.title).toEqual({
        absolute: 'Executive Briefings & Trade Dispatches — Exvorta',
      })
      expect(meta.description).toContain(
        'Weekly institutional trade intelligence, regulatory compliance architectures'
      )
      expect(meta.alternates?.canonical).toMatch(/\/newsletter$/)
      expect(meta.openGraph?.url).toMatch(/\/newsletter$/)
      expect((meta.twitter as { card?: string })?.card).toBe('summary_large_image')
    })

    it('renders page server component gracefully with empty posts fallback', async () => {
      const PageJsx = await NewsletterPage()
      const html = renderToStaticMarkup(PageJsx)
      expect(html).toContain('Institutional Trade Intelligence.')
      expect(html).toContain('Next Dispatch Queued')
    })

    it('includes /newsletter in STATIC_ROUTES sitemap configuration', () => {
      const newsletterRoute = STATIC_ROUTES.find((r) => r.path === '/newsletter')
      expect(newsletterRoute).toBeDefined()
      expect(newsletterRoute?.priority).toBe(0.8)
      expect(newsletterRoute?.changeFrequency).toBe('weekly')
    })
  })
})
