import React from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPayloadClient } from '@/lib/payload'
import type { Post } from '@/payload-types'
import { InsightsArchive } from '@/components/blocks/InsightsArchive'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Insights & News', description: 'Trade Intelligence. Every week.', url: '/insights' })
}

export const dynamic = 'force-dynamic'

export default async function InsightsPage() {
  let posts: Post[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      limit: 50,
      sort: '-publishedDate',
    })
    posts = result.docs
  } catch (error) {
    console.warn('[InsightsPage] CMS posts unavailable, rendering archive in baseline mode', error)
  }

  return (
    <div className="w-full flex-grow bg-white">
      <InsightsArchive posts={posts} />
    </div>
  )
}
