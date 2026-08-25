import React from 'react';
import { Metadata } from 'next';
import { generateMeta } from '@/utils/generateMeta';
import { getPayloadClient } from '@/lib/payload';
import type { Post } from '@/payload-types';
import { InsightsArchive } from '@/components/blocks/InsightsArchive';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Insights & News', description: 'Trade Intelligence. Every week.' })
}

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  let posts: Post[] = [];

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'posts',
      limit: 50,
      sort: '-publishedDate',
    });
    posts = result.docs;
  } catch (error) {
    console.error('[InsightsPage] Failed to fetch posts, rendering archive without data', error);
  }

  return (
    <main className="w-full flex-grow bg-white">
      <InsightsArchive posts={posts} />
    </main>
  );
}
