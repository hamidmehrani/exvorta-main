import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import type { SeoDefault } from '@/payload-types'
import { getCachedSeoDefaults } from '@/lib/payload-cache'
import { getSiteUrl } from '@/lib/site-url'

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
    seoDefaults?.fallbackDescription ||
    'The definitive digital foundation for elite importers and exporters. Precision-engineered web applications, enterprise CMS, and automated trade workflows.'

  let fallbackOgImageUrl = ''
  if (
    seoDefaults?.defaultOgImage &&
    typeof seoDefaults.defaultOgImage === 'object' &&
    'url' in seoDefaults.defaultOgImage &&
    seoDefaults.defaultOgImage.url
  ) {
    fallbackOgImageUrl = seoDefaults.defaultOgImage.url
  }

  // Determine authoritative base URL (guarantees a public https:// URL in production for crawlers)
  const baseUrl = getSiteUrl()

  const title = args?.title || args?.doc?.meta?.title || fallbackTitle
  const description = args?.description || args?.doc?.meta?.description || fallbackDescription
  const docImage = args?.doc?.meta?.image
  const docImageUrl =
    docImage && typeof docImage === 'object' && typeof docImage.url === 'string'
      ? docImage.url
      : undefined

  const defaultOgPath = args?.url === '/launchpad' ? '/launchpad/opengraph-image' : '/opengraph-image'
  const rawOgImage =
    args?.image ||
    docImageUrl ||
    fallbackOgImageUrl ||
    defaultOgPath

  // Ensure absolute URL with https:// protocol for LinkedIn, Telegram, Twitter, WhatsApp crawlers
  const ogImageUrl = rawOgImage.startsWith('http://') || rawOgImage.startsWith('https://')
    ? rawOgImage
    : `${baseUrl.replace(/\/$/, '')}${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`

  // Ensure single suffix
  const computedTitle = title.includes(fallbackTitle) && title !== fallbackTitle
    ? title
    : title === fallbackTitle
      ? `${fallbackTitle} | Digital Infrastructure for Global Traders`
      : `${title} | ${fallbackTitle}`

  const normalizedPath = args?.url && args.url !== '/'
    ? `/${args.url.replace(/^\/+|\/+$/g, '')}`
    : ''
  const canonicalUrl = `${baseUrl.replace(/\/+$/, '')}${normalizedPath}`

  return {
    title: {
      absolute: computedTitle,
    },
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: computedTitle,
      description,
      url: canonicalUrl,
      siteName: fallbackTitle,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${computedTitle}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: computedTitle,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    metadataBase: new URL(baseUrl),
  }
}
