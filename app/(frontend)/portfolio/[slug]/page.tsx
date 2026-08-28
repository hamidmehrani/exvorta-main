import React from 'react';
import { getPayloadClient } from '@/lib/payload';
import { ProjectSingleLayout } from '@/components/blocks/ProjectSingleLayout';
import { notFound } from 'next/navigation';
import type { Project } from '@/payload-types';
import type { Metadata } from 'next';
import { generateMeta } from '@/utils/generateMeta';

// Content is managed dynamically in the Payload admin panel,
// so this route must render per-request instead of being pre-rendered at build time.
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  let project: Project | null = null;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'projects',
      where: {
        slug: {
          equals: resolvedParams.slug,
        },
      },
      limit: 1,
    });
    project = docs?.[0] as Project;
  } catch (error) {
    console.error(`Failed to fetch project meta for slug: ${resolvedParams.slug}`, error);
  }

  return generateMeta({ doc: { meta: { title: project?.title } }, url: `/portfolio/${resolvedParams.slug}` })
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'projects',
      limit: 100,
    });

    return docs.map((doc) => ({
      slug: doc.slug,
    }));
  } catch (error) {
    console.warn('[Project generateStaticParams] DB not ready, skipping pre-render', error);
    return [];
  }
}

export default async function ProjectSinglePage({ params }: Props) {
  const resolvedParams = await params;
  const payload = await getPayloadClient();
  
  let project: Project | null = null;
  
  try {
    const { docs } = await payload.find({
      collection: 'projects',
      where: {
        slug: {
          equals: resolvedParams.slug,
        },
      },
      depth: 1,
      limit: 1,
    });
    
    if (docs && docs.length > 0) {
      project = docs[0] as Project;
    }
  } catch (error) {
    console.error(`Failed to fetch project with slug: ${resolvedParams.slug}`, error);
  }

  if (!project) {
    if (resolvedParams.slug === 'spicevo') {
      project = { id: '1', title: 'Spicevo', slug: 'spicevo', heroBgColor: '#FAFAF8', accentColor: '#059669', excerpt: 'Organic Herbs & Spices Exporter.', metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project;
    } else if (resolvedParams.slug === 'nutave') {
      project = { id: '2', title: 'Nutave', slug: 'nutave', heroBgColor: '#3B2314', accentColor: '#C8922A', excerpt: 'Premium Dried Fruits & Nuts Exporter.', metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project;
    } else if (resolvedParams.slug === 'stonvi') {
      project = { id: '3', title: 'Stonvi', slug: 'stonvi', heroBgColor: '#F4F6F7', accentColor: '#2C3E50', excerpt: 'Ceramic & Building Materials Exporter.', metrics: [{label: 'Industry', value: 'Construction'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project;
    } else {
      notFound();
    }
  }

  let breadcrumbsHtml = '';
  try {
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://exvorta.com' },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://exvorta.com/portfolio' },
        { '@type': 'ListItem', position: 3, name: project.title, item: `https://exvorta.com/portfolio/${resolvedParams.slug}` },
      ],
    };
    breadcrumbsHtml = JSON.stringify(breadcrumbList);
  } catch (error) {
    console.error('Breadcrumbs error:', error);
  }

  return (
    <>
      {breadcrumbsHtml && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbsHtml }} />
      )}
      <ProjectSingleLayout project={project} />
    </>
  );
}
