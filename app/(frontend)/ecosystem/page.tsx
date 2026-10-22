import React from 'react';
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import EcosystemBlock from '@/components/blocks/EcosystemBlock';
import { getPayloadClient } from '@/lib/payload';
import type { Ecosystem } from '@/payload-types';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Ecosystem', description: 'The Exvorta Suite - A Unifying Core for Global Trading Infrastructure.', url: '/ecosystem' })
}

export default async function EcosystemPage() {
  const payload = await getPayloadClient();
  let ecosystemData: Ecosystem | null = null;
  try {
    ecosystemData = await payload.findGlobal({
      slug: 'ecosystem',
    }) as Ecosystem;
  } catch (error) {
    console.warn('[EcosystemPage] CMS unavailable, rendering with design defaults', error);
  }

  return (
    <div className="flex-1 flex flex-col w-full bg-cream">
      {/* Block falls back to design-spec content when data is null */}
      <EcosystemBlock data={ecosystemData ?? undefined} />
    </div>
  );
}

