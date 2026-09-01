import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'
import type {  Page, SeoDefault  } from '@/payload-types'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import LivePreviewListener from '@/components/live-preview/LivePreviewListener'

import { getCachedPage } from '@/lib/payload-cache'
import { generateMeta } from '@/utils/generateMeta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!slug || slug.length === 0) {
    return { title: 'Not Found' }
  }
  const rawSlug = slug.join('/')
  const slugMap: Record<string, string> = { 'web': 'exvorta-web', 'firm': 'the-firm', 'about': 'the-firm' }
  const pageSlug = slugMap[rawSlug] || rawSlug

  let pageDoc: Page | null = null
  try {
    pageDoc = await getCachedPage(pageSlug)
    if (!pageDoc && pageSlug === 'exvorta-web') {
      pageDoc = await getCachedPage('web')
    }
    if (!pageDoc && pageSlug === 'the-firm') {
      pageDoc = await getCachedPage('about')
    }
  } catch (error) {
    console.error('Failed to fetch page metadata', error)
  }

  // The layout shell (Suspense for LoadingBar) flushes a 200 before CMS
  // resolution, so notFound() in the body can't change the HTTP status.
  // Keep the not-found UI, but tell crawlers the page doesn't exist.
  const missing = !pageDoc && !['exvorta-web', 'web', 'the-firm', 'about', 'home'].includes(pageSlug)
  if (missing) {
    return {
      title: 'Page Not Found | Exvorta',
      robots: { index: false, follow: false },
    }
  }

  return generateMeta({ doc: pageDoc, url: `/${pageSlug}` })
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  if (!slug || slug.length === 0) {
    notFound()
  }
  const rawSlug = slug.join('/')
  const slugMap: Record<string, string> = { 'web': 'exvorta-web', 'firm': 'the-firm', 'about': 'the-firm' }
  const pageSlug = slugMap[rawSlug] || rawSlug

  if (pageSlug === 'web' || pageSlug === 'exvorta-web') {
    const fallbackPage = {
      id: 999, title: 'exvorta-web', slug: 'exvorta-web',
      layout: [
        { id: 'hero-1', blockType: 'hero', eyebrow: '[ HIGH-PERFORMANCE WEBSITES ]', headline: 'High-Performance Websites.<br/><span class="text-obsidian/40">For Global Traders.</span>', subheadline: 'We build high-performance websites that make global trading companies look like the serious players they are.', primaryCTA: { label: '[ REQUEST A CUSTOM SCOPE ]', url: '/rfq' } },
        { id: 'pg-1', blockType: 'problemStatement', eyebrow: '[ THE CREDIBILITY GAP ]', headline: 'Your business moves millions. Your website looks like a startup.', description: 'International partners judge your reliability...' },
        { id: 'fg-1', blockType: 'featureGrid', theme: 'dark' },
        { id: 'fs-1', blockType: 'featureShowcase', label: '[ ARCHITECTURAL SPECS ]', title: 'Pure Code. Flawless Aesthetics.' },
        { id: 'pr-1', blockType: 'process' },
        { id: 'ps-1', blockType: 'portfolioShowcase' },
        { id: 'caps-1', blockType: 'platformCapabilities' },
        { id: 'cms-control-1', blockType: 'cmsControl' },
        { id: 'pric-1', blockType: 'pricing' },
        { id: 'test-1', blockType: 'testimonialBlock' },
        { id: 'faq-1', blockType: 'faq' },
        { id: 'cta-1', blockType: 'ctaBanner' },
      ]
    } as any
    return <main className="flex-1 flex flex-col w-full bg-[#FAFAF8]"><BlockRenderer blocks={fallbackPage.layout} /></main>
  }

  // Redirect root case studies to portfolio
  if (['spicevo', 'nutave', 'stonvi', 'aurora', 'vanguard'].includes(pageSlug)) {
    const { redirect } = await import('next/navigation');
    redirect(`/portfolio/${pageSlug}`);
  }

  let pageDoc: Page | null = null

  try {
    pageDoc = await getCachedPage(pageSlug)
    if (!pageDoc && pageSlug === 'exvorta-web') {
      pageDoc = await getCachedPage('web')
    }
    if (!pageDoc && pageSlug === 'the-firm') {
      pageDoc = await getCachedPage('about')
    }
  } catch (error) {
    console.error('Error fetching page content', error)
  }

  if (!pageDoc) {
    if (pageSlug === 'exvorta-web' || pageSlug === 'the-firm') {
      pageDoc = { id: 1, title: pageSlug, slug: pageSlug, layout: [] } as any;
    } else {
      notFound()
    }
  }

  let isFallback = !pageDoc || !pageDoc.layout || pageDoc.layout.length === 0
  if (pageDoc?.layout && pageDoc.layout.length < 3 && (pageSlug === 'exvorta-web' || pageSlug === 'the-firm' || pageSlug === 'about')) {
    isFallback = true
  }

  if (isFallback) {
    if (pageSlug === 'the-firm' || pageSlug === 'about') {
      pageDoc!.layout = [
        {
          id: 'hero-firm',
          blockType: 'hero',
          headline: "We Engineer Digital Gravity. <br/><span class=\"text-white/60\">For the World's Most Demanding Trade Entities.</span>",
          eyebrow: "[ THE EXVORTA IDENTITY ]"
        },
        { id: 'thesis-firm', blockType: 'thesis' },
        { id: 'firm-firm', blockType: 'firm' },
        { id: 'founder-firm', blockType: 'founder' },
        { id: 'vision-firm', blockType: 'vision' },
        { id: 'global-firm', blockType: 'globalPresence' },
        { id: 'cta-firm', blockType: 'ctaBanner' }
      ] as any;
    } else if (pageSlug === 'exvorta-web') {
      pageDoc!.layout = [
        {
          id: 'hero-exvorta-web',
          blockType: 'hero',
          eyebrow: '[ HIGH-PERFORMANCE WEBSITES ]',
          headline: 'High-Performance Websites.<br/><span class="text-obsidian/40">For Global Traders.</span>',
          subheadline: 'The institutional standard. Bespoke architecture, flawless aesthetics, and engineered for elite B2B trading companies operating at a global scale.',
          primaryCTA: { label: '[ REQUEST A CUSTOM SCOPE ]', url: '/rfq' },
        },
        { id: 'problem-1', blockType: 'problemStatement', eyebrow: '[ THE PROBLEM ]', headline: 'Without a credible digital presence...', description: 'In global trade...', theme: 'dark' },
        { id: 'problem-2', blockType: 'problemStatement', theme: 'light' },
        { id: 'feature-1', blockType: 'featureShowcase', label: '[ ARCHITECTURAL SPECS ]', title: 'Pure Code. Flawless Aesthetics.' },
        { id: 'process-1', blockType: 'process' },
        { id: 'portfolio-1', blockType: 'portfolioShowcase' },
        { id: 'pricing-1', blockType: 'pricing' },
        { id: 'testimonial-1', blockType: 'testimonialBlock' },
        { id: 'faq-1', blockType: 'faq' }
      ] as any;
    }
  }

  if (pageDoc?.requiresAuth) {
    const payload = await getPayloadClient()
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      return (
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto w-full min-h-[70vh]">
          <div className="text-center p-12 border-2 border-border rounded-none max-w-xl w-full bg-surface">
            <h1 className="text-4xl font-serif font-bold text-text mb-4 tracking-tighter">Restricted Access</h1>
            <p className="text-muted mb-8 text-lg font-mono">This content is for authorized partners only.</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 h-12 rounded-none bg-text text-bg font-mono uppercase font-bold hover:bg-black transition-all duration-200"
            >
              Login to VIP Portal
            </Link>
          </div>
        </main>
      )
    }
  }

  return (
    <main className="flex-1 flex flex-col w-full bg-bg">
      {process.env.NODE_ENV !== 'production' && <LivePreviewListener />}
      {(pageDoc as { layout?: any[] })?.layout && (pageDoc as { layout?: any[] }).layout!.length > 0 ? (
        <BlockRenderer blocks={(pageDoc as { layout: any[] }).layout} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
           <div className="text-muted font-mono uppercase tracking-widest">[ NO BLOCKS CONFIGURED ]</div>
        </div>
      )}
    </main>
  )
}
