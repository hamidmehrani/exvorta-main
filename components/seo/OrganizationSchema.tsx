import React from 'react'
import { getPayloadClient } from '@/lib/payload'

export default async function OrganizationSchema() {
  const payload = await getPayloadClient()

  let siteSettings: any = null
  let socialLinks: any = null

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

  if (siteSettings?.logo && typeof siteSettings.logo === 'object' && siteSettings.logo.url) {
    logoUrl = siteSettings.logo.url
  }

  const sameAs = socialLinks?.links?.map((link: any) => link.url) || []

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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
