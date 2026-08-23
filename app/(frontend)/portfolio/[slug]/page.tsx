import React from 'react';
import { getPayloadClient } from '@/lib/payload';
import { ProjectSingleLayout } from '@/components/blocks/ProjectSingleLayout';
import { notFound } from 'next/navigation';
import type { Project } from '@/payload-types';
import type { Metadata } from 'next';
import { generateMeta } from '@/utils/generateMeta';

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
  const payload = await getPayloadClient();
  try {
    const { docs } = await payload.find({
      collection: 'projects',
      limit: 100,
    });

    return docs.map((doc) => ({
      slug: doc.slug,
    }));
  } catch (error) {
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
      project = { id: '1', title: 'Spicevo', slug: 'spicevo', heroBgColor: '#FAFAF8', accentColor: '#7A2E2E', excerpt: 'Organic Herbs & Spices Exporter.', metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project;
    } else if (resolvedParams.slug === 'nutave') {
      project = { id: '2', title: 'Nutave', slug: 'nutave', heroBgColor: '#2B1A0E', accentColor: '#C69A3A', excerpt: 'Premium Dried Fruits & Nuts Exporter.', metrics: [{label: 'Industry', value: 'Agriculture'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project;
    } else if (resolvedParams.slug === 'stonvi') {
      project = { id: '3', title: 'Stonvi', slug: 'stonvi', heroBgColor: '#F4F6F7', accentColor: '#5C6E7A', excerpt: 'Ceramic & Building Materials Exporter.', metrics: [{label: 'Industry', value: 'Construction'}, {label: 'Stack', value: 'Next.js'}] } as unknown as Project;
    } else {
      notFound();
    }
  }

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://exvorta.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: 'https://exvorta.com/portfolio',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `https://exvorta.com/portfolio/${resolvedParams.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <ProjectSingleLayout project={project} />
    </>
  );
}
