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
  const pageSlug = slug.join('/')

  let pageDoc: Page | null = null
  try {
    pageDoc = await getCachedPage(pageSlug)
  } catch (error) {
    console.error('Failed to fetch home page metadata', error)
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
  const pageSlug = slug.join('/')
  let pageDoc: Page | null = null

  try {
    pageDoc = await getCachedPage(pageSlug)
  } catch (error) {
    console.error('Error fetching page content', error)
  }

  if (!pageDoc) {
    notFound()
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
