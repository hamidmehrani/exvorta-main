import { getPayloadClient } from './payload';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import type { Config, Page, SeoDefault, Project } from '@/payload-types';

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

export const getCachedProject = cache(unstable_cache(
  async (slug: string) => {
    try {
      const payload = await getPayloadClient();
      const { docs } = await payload.find({
        collection: 'projects',
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      });
      return (docs && docs.length > 0 ? docs[0] : null) as Project | null;
    } catch (e) {
      console.warn(`Failed to fetch project ${slug} - DB tables might be missing`);
      return null;
    }
  },
  ['payload-project'],
  { revalidate: 300, tags: ['projects'] }
));

export const getCachedSeoDefaults = cache(unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient();
      return await payload.findGlobal({
        slug: 'seo-defaults',
      }) as SeoDefault;
    } catch (error: unknown) {
      console.warn('seo_defaults not available, using fallback:', error instanceof Error ? error.message : error)
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

export type GlobalSlug = keyof Config['globals']

/**
 * Cached read of a Payload global.
 *
 * Layout chrome (navigation, footer, site settings…) is read on every page.
 * Hitting the database for each of them per request made every route
 * dynamic and added several round-trips to TTFB. Cached entries are tagged
 * `global-<slug>` and busted by `revalidateGlobal` when an editor publishes.
 * Returns null when the CMS is unreachable so callers can fall back.
 */
export function getCachedGlobal<T>(slug: GlobalSlug, depth = 0): Promise<T | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadClient();
        return (await payload.findGlobal({ slug, depth })) as unknown as T;
      } catch (error) {
        console.warn(`[cms] global "${slug}" unavailable:`, error instanceof Error ? error.message : error);
        return null;
      }
    },
    ['payload-global', slug, String(depth)],
    { revalidate: 300, tags: ['globals', `global-${slug}`] },
  )();
}
