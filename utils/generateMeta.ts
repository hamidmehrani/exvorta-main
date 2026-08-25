import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import type { SeoDefault } from '@/payload-types'
import { getCachedSeoDefaults } from '@/lib/payload-cache'

export interface MetaDocShape {
  meta?: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | number | null
  } | null
}

export type GenerateMetaArgs = {
  doc?: MetaDocShape | null
  title?: string
  description?: string
  image?: string
  url?: string
}

export const generateMeta = async (args?: GenerateMetaArgs): Promise<Metadata> => {
  let seoDefaults: SeoDefault | null = null
  try {
    seoDefaults = await getCachedSeoDefaults()
  } catch (error) {
    console.error('Failed to fetch seo-defaults', error)
  }

  const fallbackTitle = seoDefaults?.fallbackTitle || 'Exvorta'
  const fallbackDescription =
    seoDefaults?.fallbackDescription || 'Enterprise white-labeled foundation engine'

  let fallbackOgImageUrl = ''
  if (
    seoDefaults?.defaultOgImage &&
    typeof seoDefaults.defaultOgImage === 'object' &&
    'url' in seoDefaults.defaultOgImage &&
    seoDefaults.defaultOgImage.url
  ) {
    fallbackOgImageUrl = seoDefaults.defaultOgImage.url
  }

  const title = args?.title || args?.doc?.meta?.title || fallbackTitle
  const description = args?.description || args?.doc?.meta?.description || fallbackDescription
  const docImage = args?.doc?.meta?.image
  const docImageUrl =
    docImage && typeof docImage === 'object' && typeof docImage.url === 'string'
      ? docImage.url
      : undefined
  const ogImage =
    args?.image ||
    docImageUrl ||
    fallbackOgImageUrl

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // Ensure single suffix
  const computedTitle = title.includes(fallbackTitle) && title !== fallbackTitle
    ? title 
    : title === fallbackTitle 
      ? fallbackTitle 
      : `${title} | ${fallbackTitle}`

  return {
    title: {
      absolute: computedTitle,
    },
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
      url: args?.url ? `${baseUrl}${args.url}` : baseUrl,
      siteName: fallbackTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: args?.url ? `${baseUrl}${args.url}` : './',
    },
    metadataBase: new URL(baseUrl),
  }
}
