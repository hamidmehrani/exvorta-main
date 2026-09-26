import { getPayloadClient } from './payload';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { Page, SeoDefault, SiteSetting, Analytics, WhatsappConfig, Project } from '@/payload-types';

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

export const getCachedSiteSettings = cache(unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient();
      return (await payload.findGlobal({
        slug: 'site-settings',
      })) as SiteSetting;
    } catch (error: unknown) {
      return { id: 0, siteName: 'Exvorta', enableCookieBanner: false, maintenanceMode: false } as SiteSetting;
    }
  },
  ['payload-site-settings'],
  { revalidate: 300, tags: ['site-settings'] }
));

export const getCachedAnalytics = cache(unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient();
      return (await payload.findGlobal({
        slug: 'analytics',
      })) as Analytics;
    } catch (error: unknown) {
      return { id: 0, gtmId: null, gaId: null } as Analytics;
    }
  },
  ['payload-analytics'],
  { revalidate: 300, tags: ['analytics'] }
));

export const getCachedWhatsappConfig = cache(unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient();
      return (await payload.findGlobal({
        slug: 'whatsapp-config',
      })) as WhatsappConfig;
    } catch (error: unknown) {
      return { id: 0, enableWidget: false, phoneNumber: '', defaultMessage: '' } as unknown as WhatsappConfig;
    }
  },
  ['payload-whatsapp-config'],
  { revalidate: 300, tags: ['whatsapp-config'] }
));

