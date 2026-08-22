import React from 'react';
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { PortfolioArchiveBlock } from '@/components/blocks/PortfolioArchiveBlock';
import type { Project } from '@/payload-types';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Portfolio', description: 'Latest Web Design Works. Premium websites and CMS platforms engineered for global exporters.' })
}

export default function PortfolioArchivePage() {
  const projects = [
    {
      id: '1',
      title: 'Nutave',
      slug: 'nutave',
      metrics: [
        { label: 'INDUSTRY', value: 'PREMIUM NUTS', id: 'm1' },
        { label: 'STACK', value: 'B2B WEB DEVELOPMENT', id: 'm2' }
      ],
      image: {
        url: '',
        alt: 'Nutave E-Commerce Platform'
      }
    },
    {
      id: '2',
      title: 'Aurora',
      slug: 'aurora',
      clientName: 'Global Commodities Brokerage.',
      tags: ['B2B PLATFORM', 'MARKET DATA', 'SECURE PORTAL'],
      image: {
        url: '',
        alt: 'Aurora Trading Platform'
      }
    },
    {
      id: '3',
      title: 'Vanguard',
      slug: 'vanguard',
      clientName: 'International Logistics & Supply Chain.',
      tags: ['TRACK & TRACE', 'API INTEGRATION', 'COMPLIANCE'],
      image: {
        url: '',
        alt: 'Vanguard Logistics Dashboard'
      }
    }
  ] as unknown as Project[];

  return <PortfolioArchiveBlock projects={projects} fullPage={true} />;
}
