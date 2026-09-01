import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import type { Footer as FooterType } from '@/payload-types'
import FooterClient from './FooterClient'

interface FooterLinkItem {
  link?: {
    type?: 'custom' | 'reference' | null
    label?: string
    url?: string | null
    openInNewTab?: boolean | null
    reference?: {
      relationTo: string
      value: number | string | { slug?: string; id?: number | string } | null
    } | null
  }
  id?: string | null
}

export type FooterColumn = {
  id?: string | null
  title?: string
  links: Array<{ id?: string | null; label?: string; href: string; external: boolean }>
}

export default async function Footer() {
  let footerData: FooterType | null = null
  const brand: { name: string; logoUrl: string | null } = { name: 'EXVORTA', logoUrl: null }

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings?.siteName) brand.name = settings.siteName.toUpperCase()
    if (settings?.logo && typeof settings.logo === 'object' && settings.logo.url) {
      brand.logoUrl = settings.logo.url
    }
  } catch {
    // keep text fallback
  }

  try {
    const payload = await getPayloadClient()
    footerData = await payload.findGlobal({
      slug: 'footer',
      depth: 2,
    }) as FooterType
  } catch (error) {
    console.warn('[Footer] CMS footer unavailable, using fallback', error)
  }

  const fallbackColumns: NonNullable<FooterType['columns']> = [
    {
      id: 'col-1',
      title: 'WHAT WE BUILD',
      links: [
        { id: 'link-1-1', link: { type: 'custom', label: 'Exvorta Web', url: '/web' } },
        { id: 'link-1-2', link: { type: 'custom', label: 'Ecosystem', url: '/ecosystem' } },
        { id: 'link-1-3', link: { type: 'custom', label: 'Portfolio', url: '/portfolio' } },
      ],
    },
    {
      id: 'col-2',
      title: 'WHY EXVORTA',
      links: [
        { id: 'link-2-1', link: { type: 'custom', label: 'The Firm', url: '/about' } },
        { id: 'link-2-2', link: { type: 'custom', label: 'Join Waitlist', url: '/waitlist' } },
        { id: 'link-2-3', link: { type: 'custom', label: 'Contact Us', url: '/contact' } },
      ],
    },
    {
      id: 'col-3',
      title: 'GET STARTED',
      links: [
        { id: 'link-3-1', link: { type: 'custom', label: 'Start Your Project', url: '/rfq' } },
        { id: 'link-3-2', link: { type: 'custom', label: 'Privacy Policy', url: '/legal#privacy' } },
        { id: 'link-3-3', link: { type: 'custom', label: 'Terms of Service', url: '/legal#terms' } },
      ],
    },
  ]

  const rawColumns = (footerData?.columns?.length ? footerData.columns : fallbackColumns) as unknown as Array<{
    id?: string | null
    title?: string
    links?: FooterLinkItem[] | null
  }>

  const columns: FooterColumn[] = rawColumns.map((column) => ({
    id: column.id,
    title: column.title,
    links: (column.links || [])
      .map((item) => {
        const link = item.link
        if (!link) return null
        const refValue = link.reference?.value
        let href = link.url || ''
        if (link.type === 'reference' && refValue && typeof refValue === 'object') {
          href = refValue.slug ? `/${refValue.slug}` : ''
        }
        if (!href || href === '#') return null
        return {
          id: item.id,
          label: link.label,
          href,
          external: link.type === 'custom' && Boolean(link.openInNewTab),
        }
      })
      .filter((l): l is NonNullable<typeof l> => Boolean(l)),
  }))

  return <FooterClient columns={columns} brand={brand} />
}
