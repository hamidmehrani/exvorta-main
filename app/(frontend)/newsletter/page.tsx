import React from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPayloadClient } from '@/lib/payload'
import type { Post } from '@/payload-types'
import { NewsletterArchive } from '@/components/blocks/NewsletterArchive'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Executive Briefings & Trade Dispatches — Exvorta',
    description:
      'Weekly institutional trade intelligence, regulatory compliance architectures, and macro-settlement analysis across the GCC.',
    url: '/newsletter',
  })
}

export const dynamic = 'force-dynamic'

export default async function NewsletterPage() {
  let posts: Post[] = []

  try {
    const payload = await getPayloadClient()
    let result
    try {
      result = await payload.find({
        collection: 'posts',
        depth: 1,
        limit: 12,
        sort: '-publishedAt',
        where: { _status: { equals: 'published' } } as any,
      })
    } catch {
      // Fallback query in case the database collection uses publishedDate without draft versioning
      result = await payload.find({
        collection: 'posts',
        depth: 1,
        limit: 12,
        sort: '-publishedDate',
      })
    }
    posts = (result?.docs as Post[]) || []
  } catch (error) {
    console.warn('[NewsletterPage] CMS posts unavailable, falling back to empty archive', error)
    posts = []
  }

  return (
    <main className="w-full min-h-screen bg-cream flex flex-col">
      <NewsletterArchive posts={posts} />
    </main>
  )
}
