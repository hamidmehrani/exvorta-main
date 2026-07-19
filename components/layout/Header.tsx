import React from 'react'
import { getTranslations } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import { Navigation } from '@/payload-types'
import HeaderClient from './HeaderClient'

export const Header = async () => {
  const t = await getTranslations('Header')
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
    features: t('features'),
    collections: t('collections'),
    docs: t('docs'),
    admin: t('admin'),
  }

  return <HeaderClient navLinks={navData?.links || []} t={translations} />
}

export default Header
