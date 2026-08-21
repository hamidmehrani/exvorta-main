import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { RichTextArticle } from '@/components/blocks/RichTextArticle';
import { generateMeta } from '@/utils/generateMeta';

export const dynamic = 'force-dynamic';

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  
  const postsData = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const post = postsData.docs[0];

  if (!post) {
    return {
      title: 'Not Found | Exvorta',
    };
  }

  return generateMeta({ doc: { meta: { title: post.title, description: post.title } }, url: `/insights/${slug}` })
}

export default async function SingleInsightPage({ params }: Args) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  
  const postsData = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const post = postsData.docs[0];

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedDate || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: typeof post.author === 'object' && post.author ? ('name' in post.author ? post.author.name : 'Exvorta') : 'Exvorta',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Exvorta',
      logo: {
        '@type': 'ImageObject',
        url: 'https://exvorta.com/logo.png', // Fallback URL, assuming default
      },
    },
    image: typeof post.coverImage === 'object' && post.coverImage ? post.coverImage.url : undefined,
  };

  return (
    <main className="w-full flex-grow bg-[#FCFAF8] pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RichTextArticle post={post} />
    </main>
  );
}
