import React from 'react';
import { Metadata } from 'next';
import { generateMeta } from '@/utils/generateMeta';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { notFound } from 'next/navigation';
import { InsightsArchive } from '@/components/blocks/InsightsArchive';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Insights & News', description: 'Trade Intelligence. Every week.' })
}

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  notFound();
  const payload = await getPayload({ config: configPromise });
  
  const postsData = await payload.find({
    collection: 'posts',
    limit: 50,
    sort: '-publishedDate',
  });

  return (
    <main className="w-full flex-grow bg-white">
      <InsightsArchive posts={postsData.docs} />
    </main>
  );
}
