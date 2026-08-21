import React from 'react';
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import EcosystemBlock from '@/components/blocks/EcosystemBlock';
import { getPayloadClient } from '@/lib/payload';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Ecosystem', description: 'The Exvorta Suite - A Unifying Core for Global Trading Infrastructure.' })
}

export default async function EcosystemPage() {
  const payload = await getPayloadClient();
  let ecosystemData = null;
  try {
    ecosystemData = await payload.findGlobal({
      slug: 'ecosystem',
    });
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex-1 flex flex-col w-full bg-brand-cream">
      {ecosystemData && <EcosystemBlock data={ecosystemData as any} />}
    </div>
  );
}
