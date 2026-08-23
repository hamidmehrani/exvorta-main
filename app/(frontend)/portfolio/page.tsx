import React from 'react';
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { PortfolioArchiveBlock } from '@/components/blocks/PortfolioArchiveBlock';
import { getPayloadClient } from '@/lib/payload';
import type { Project } from '@/payload-types';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Portfolio', description: 'Latest Web Design Works. Premium websites and CMS platforms engineered for global exporters.' })
}

export default async function PortfolioArchivePage() {
  const payload = await getPayloadClient();
  
  const { docs: projects } = await payload.find({
    collection: 'projects',
    limit: 10,
    depth: 1,
  });

  let projectsToRender = projects;
  const hasSpicevo = projects.some(p => p.slug === 'spicevo');
  
  if (!hasSpicevo) {
    projectsToRender = [
      { id: '1', title: 'Spicevo', slug: 'spicevo', excerpt: 'Organic Herbs & Spices Exporter.', metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project,
      { id: '2', title: 'Nutave', slug: 'nutave', excerpt: 'Premium Dried Fruits & Nuts Exporter.', metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project,
      { id: '3', title: 'Stonvi', slug: 'stonvi', excerpt: 'Ceramic & Building Materials Exporter.', metrics: [{label: 'Industry', value: 'Construction'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project
    ]
  }

  return <PortfolioArchiveBlock projects={projectsToRender} fullPage={true} />;
}
