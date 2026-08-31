import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import type { SiteSetting, SocialLink } from '@/payload-types'

export default async function OrganizationSchema() {
  let siteSettings: SiteSetting | null = null
  let socialLinks: SocialLink | null = null

  try {
    const payload = await getPayloadClient()
    siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })
    socialLinks = await payload.findGlobal({
      slug: 'social-links',
    })
  } catch (error) {
    console.error('Failed to fetch globals for OrganizationSchema', error)
    return null
  }

  const siteName = siteSettings?.siteName || 'Agency Boilerplate'
  let logoUrl = ''

  if (siteSettings?.logo && typeof siteSettings.logo === 'object' && 'url' in siteSettings.logo) {
    logoUrl = siteSettings.logo.url as string
  }

  const sameAs = (socialLinks?.links || []).map(link => link.url).filter(Boolean) as string[]
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

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
