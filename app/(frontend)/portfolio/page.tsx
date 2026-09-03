import React from 'react';
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { PortfolioArchiveBlock } from '@/components/blocks/PortfolioArchiveBlock';
import { getPayloadClient } from '@/lib/payload';
import type { Project } from '@/payload-types';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Portfolio', description: 'Latest Web Design Works. Premium websites and CMS platforms engineered for global exporters.', url: '/portfolio' })
}

export default async function PortfolioArchivePage() {
  const payload = await getPayloadClient();
  
  let projects: Project[] = [];
  try {
    const result = await payload.find({
      collection: 'projects',
      limit: 10,
      depth: 1,
    });
    projects = result.docs as unknown as Project[];
  } catch (error) {
    console.warn('[PortfolioArchivePage] Database not ready, using fallback projects', error);
  }

  let projectsToRender = projects;
  const hasSpicevo = projects.some(p => p.slug === 'spicevo');
  
  if (!projects || projects.length === 0 || !hasSpicevo) {
    projectsToRender = [
      { 
        id: '1', title: 'Spicevo', slug: 'spicevo', excerpt: 'Organic Herbs & Spices Exporter.', 
        clientInfo: { industry: 'ORGANIC HERBS', volume: '480 MT/YR', service: 'WEB DESIGN & CMS' },
        metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] 
      } as unknown as Project,
      { 
        id: '2', title: 'Nutave', slug: 'nutave', excerpt: 'Premium Dried Fruits & Nuts Exporter.', 
        clientInfo: { industry: 'DRIED FRUITS', volume: '650 MT/YR', service: 'E-COMMERCE' },
        metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] 
      } as unknown as Project,
      { 
        id: '3', title: 'Stonvi', slug: 'stonvi', excerpt: 'Ceramic & Building Materials Exporter.', 
        clientInfo: { industry: 'CONSTRUCTION', volume: '2.4M SQM/YR', service: 'B2B PORTAL' },
        metrics: [{label: 'Industry', value: 'Construction'}, {label: 'Stack', value: 'Next.js'}] 
      } as unknown as Project
    ]
  }

  return <PortfolioArchiveBlock projects={projectsToRender} fullPage={true} />;
}
