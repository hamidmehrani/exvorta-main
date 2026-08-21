import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import type { SiteSetting, SocialLink } from '@/payload-types'

export default async function OrganizationSchema() {
  const payload = await getPayloadClient()

  let siteSettings: SiteSetting | null = null
  let socialLinks: SocialLink | null = null

  try {
    siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })
    socialLinks = await payload.findGlobal({
      slug: 'social-links',
    })
  } catch (error) {
    console.error('Failed to fetch globals for OrganizationSchema', error)
  }

  const siteName = siteSettings?.siteName || 'Agency Boilerplate'
  let logoUrl = ''

  if (siteSettings?.logo && typeof siteSettings.logo === 'object' && 'url' in siteSettings.logo) {
    logoUrl = siteSettings.logo.url as string
  }

  const sameAs = (socialLinks?.links || []).map(link => link.url).filter(Boolean) as string[]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: process.env.NEXT_PUBLIC_SERVER_URL || '',
    logo: logoUrl || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
