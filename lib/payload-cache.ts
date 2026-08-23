import { getPayloadClient } from './payload';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { Page, SeoDefault } from '@/payload-types';

export const getCachedPage = cache(unstable_cache(
  async (slug: string) => {
    try {
      const payload = await getPayloadClient();
      const { docs } = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      });
      return (docs && docs.length > 0 ? docs[0] : null) as Page | null;
    } catch (e) {
      console.warn(`Failed to fetch page ${slug} - DB tables might be missing`);
      return null;
    }
  },
  ['payload-page'],
  { revalidate: 300, tags: ['pages'] }
));

export const getCachedSeoDefaults = cache(unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient();
      return await payload.findGlobal({
        slug: 'seo-defaults',
      }) as SeoDefault;
    } catch (error: any) {
      console.warn('seo_defaults not available, using fallback:', error.message)
      return {
        fallbackTitle: 'Exvorta',
        fallbackDescription: 'Digital infrastructure for global traders',
        id: 0,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      } as SeoDefault;
    }
  },
  ['payload-seo-defaults'],
  { revalidate: 300, tags: ['seo-defaults'] }
));
