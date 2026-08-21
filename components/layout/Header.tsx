import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import { Navigation } from '@/payload-types'
import HeaderClient from './HeaderClient'

export const Header = async () => {
  const payload = await getPayloadClient()
  
  let navData: Navigation | null = null
  try {
    navData = await payload.findGlobal({
      slug: 'navigation',
      depth: 2,
    }) as Navigation
  } catch (error) {
    console.error('Error fetching navigation data', error)
  }

  const translations = {
    features: 'Features',
    collections: 'Collections',
    docs: 'Docs',
    admin: 'Admin',
  }

  return <HeaderClient navLinks={navData?.links || []} t={translations} />
}

export default Header
