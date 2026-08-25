import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import type {  Navigation  } from '@/payload-types'
import HeaderClient from './HeaderClient'

export const Header = async () => {
  let navData: Navigation | null = null
  try {
    const payload = await getPayloadClient()
    navData = await payload.findGlobal({
      slug: 'navigation',
      depth: 2,
    }) as Navigation
  } catch (error) {
    console.warn('[Header] CMS navigation unavailable, using fallback', error)
  }

  // Mirrors the design spec header: PORTFOLIO · ECOSYSTEM · THE FIRM
  const fallbackLinks: NonNullable<Navigation['links']> = [
    { link: { type: 'custom', label: 'PORTFOLIO', url: '/portfolio' }, id: 'fallback-1' },
    { link: { type: 'custom', label: 'ECOSYSTEM', url: '/ecosystem' }, id: 'fallback-2' },
    { link: { type: 'custom', label: 'THE FIRM', url: '/about' }, id: 'fallback-3' },
  ]

  const finalNavLinks = navData?.links?.length ? navData.links : fallbackLinks

  return <HeaderClient navLinks={finalNavLinks} />
}

export default Header

