import React from 'react'
import { Link } from '@/i18n/routing'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'
import { Page, SeoDefault } from '@/payload-types'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import LivePreviewListener from '@/components/live-preview/LivePreviewListener'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayloadClient()

  let pageDoc: Page | null = null
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
      locale: locale as "en" | "ar" | "fa",
      limit: 1,
    })
    if (docs && docs.length > 0) {
      pageDoc = docs[0] as Page
    }
  } catch (error) {
    console.error('Failed to fetch home page metadata', error)
  }

  let seoDefaults: SeoDefault | null = null
  try {
    seoDefaults = await payload.findGlobal({
      slug: 'seo-defaults',
      locale: locale as "en" | "ar" | "fa",
    }) as SeoDefault
  } catch {}

  const meta = pageDoc?.meta || {}
  const title = meta.title || seoDefaults?.fallbackTitle || 'Exvorta Boilerplate'
  const description = meta.description || seoDefaults?.fallbackDescription || ''
  
  let ogImageUrl = ''
  if (seoDefaults?.defaultOgImage && typeof seoDefaults.defaultOgImage === 'object' && seoDefaults.defaultOgImage.url) {
    ogImageUrl = seoDefaults.defaultOgImage.url
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('HomePage')
  let dbStatus = 'Configuration Ready'

  let pageDoc: Page | null = null

  try {
    const payload = await getPayloadClient()
    if (payload) {
      dbStatus = 'Connected & Verified'
      const { docs } = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: 'home' },
        },
        locale: locale as "en" | "ar" | "fa",
        limit: 1,
      })
      if (docs && docs.length > 0) {
        pageDoc = docs[0] as Page
      }
    }
  } catch {
    dbStatus = 'Configuration Ready (Offline)'
  }

  if (pageDoc?.requiresAuth) {
    const payload = await getPayloadClient()
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      return (
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto w-full min-h-[70vh]">
          <div className="text-center p-12 border border-border rounded shadow-2xl max-w-xl w-full bg-surface">
            <svg className="w-16 h-16 text-danger mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-4xl font-bold text-text mb-4 tracking-tighter">Restricted Access</h1>
            <p className="text-muted mb-8 text-lg">This content is for authorized partners only.</p>
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center justify-center px-8 h-12 rounded-lg bg-primary text-bg font-semibold hover:bg-primary/90 transition-all duration-200"
            >
              Login to VIP Portal
            </Link>
          </div>
        </main>
      )
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto w-full">
      <LivePreviewListener />
      {pageDoc?.blocks && pageDoc.blocks.length > 0 ? (
        <BlockRenderer blocks={pageDoc.blocks} />
      ) : (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface-2 text-muted text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t('status')}
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text mb-6">
            {t('title')}
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed mb-12">
            {t('description')}
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-start mb-16">
            <div className="p-6 rounded-xl border border-border bg-surface hover:border-accent/30 transition-all duration-350 flex flex-col gap-3">
              <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                {t('database')}
              </div>
              <div className="text-2xl font-bold text-text">
                {t('neon')}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                <span className="text-xs text-muted">{t('adapterStatus')}</span>
                <span className="text-xs font-semibold text-accent">
                  {dbStatus}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-surface hover:border-accent/30 transition-all duration-350 flex flex-col gap-3">
              <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                {t('storage')}
              </div>
              <div className="text-2xl font-bold text-text">
                {t('cloudinary')}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                <span className="text-xs text-muted">{t('adapterStatus')}</span>
                <span className="text-xs font-semibold text-accent">
                  {t('enabled')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin"
              className="w-full sm:w-auto px-8 h-12 inline-flex items-center justify-center rounded-lg bg-primary text-bg hover:bg-primary/90 font-semibold transition-all duration-200"
            >
              {t('accessAdmin')}
            </Link>
            <Link
              href="/api/pages"
              className="w-full sm:w-auto px-8 h-12 inline-flex items-center justify-center rounded-lg border border-border hover:bg-surface text-text font-semibold transition-all duration-200"
            >
              {t('exploreApi')}
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
