import React from 'react'
import { getCachedGlobal } from '@/lib/payload-cache'
import type { SiteSetting, SocialLink } from '@/payload-types'

import { getSiteUrl } from '@/lib/site-url'

const FALLBACK_SITE_NAME = 'Exvorta'
const FALLBACK_SITE_URL = 'https://exvorta.com'

export default async function OrganizationSchema() {
  const [siteSettings, socialLinks] = await Promise.all([
    getCachedGlobal<SiteSetting>('site-settings'),
    getCachedGlobal<SocialLink>('social-links'),
  ])

  const siteName = siteSettings?.siteName || FALLBACK_SITE_NAME
  let logoUrl = ''

  if (siteSettings?.logo && typeof siteSettings.logo === 'object' && 'url' in siteSettings.logo) {
    logoUrl = siteSettings.logo.url as string
  }

  const sameAs = (socialLinks?.links || []).map(link => link.url).filter(Boolean) as string[]
  const siteUrl = getSiteUrl() || FALLBACK_SITE_URL

  const graph = [
    {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: logoUrl || undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
    },
    {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graph,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
