import React from 'react'
import type { Navigation, SiteSetting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/payload-cache'
import HeaderClient from './HeaderClient'

export const Header = async () => {
  const [navData, settings] = await Promise.all([
    getCachedGlobal<Navigation>('navigation', 2),
    getCachedGlobal<SiteSetting>('site-settings'),
  ])

  const brand: { name: string; logoUrl: string | null } = { name: 'EXVORTA', logoUrl: null }
  if (settings?.siteName) brand.name = settings.siteName.toUpperCase()
  if (settings?.logo && typeof settings.logo === 'object' && settings.logo.url) {
    brand.logoUrl = settings.logo.url
  }

  // Sales-psychology nav: what it is → proof → who we are.
  const fallbackLinks: NonNullable<Navigation['links']> = [
    { link: { type: 'custom', label: 'EXVORTA WEB', url: '/web' }, id: 'fallback-1' },
    { link: { type: 'custom', label: 'PORTFOLIO', url: '/portfolio' }, id: 'fallback-2' },
    { link: { type: 'custom', label: 'ECOSYSTEM', url: '/ecosystem' }, id: 'fallback-3' },
    { link: { type: 'custom', label: 'THE FIRM', url: '/about' }, id: 'fallback-4' },
  ]

  const finalNavLinks = navData?.links?.length ? navData.links : fallbackLinks

  return <HeaderClient navLinks={finalNavLinks} brand={brand} />
}

export default Header
