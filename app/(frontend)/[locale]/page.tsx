import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayloadClient()

  let pageDoc: any = null
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
      locale: locale as any,
      limit: 1,
    })
    pageDoc = docs[0]
  } catch (error) {
    console.error('Failed to fetch home page metadata', error)
  }

  if (!pageDoc?.meta) return {}

  const meta = pageDoc.meta
  return {
    ...(meta.title && { title: meta.title }),
    ...(meta.description && { description: meta.description }),
    openGraph: {
      ...(meta.title && { title: meta.title }),
      ...(meta.description && { description: meta.description }),
    },
    twitter: {
      ...(meta.title && { title: meta.title }),
      ...(meta.description && { description: meta.description }),
    },
  }
}

export default async function HomePage() {
  const t = await getTranslations('HomePage')
  let dbStatus = 'Configuration Ready'

  try {
    const payload = await getPayloadClient()
    if (payload) {
      dbStatus = 'Connected & Verified'
    }
  } catch {
    // Expected to fall back to dev config if URI not loaded, which is normal
    dbStatus = 'Configuration Ready (Offline)'
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-4xl mx-auto text-center">
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

      {/* Integration Verification Cards */}
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
    </main>
  )
}
