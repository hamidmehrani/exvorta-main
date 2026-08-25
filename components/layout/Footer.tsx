import React from 'react'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import type {  Footer as FooterType  } from '@/payload-types'

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

export default async function Footer() {
  let footerData: FooterType | null = null

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
      title: 'THE ECOSYSTEM',
      links: [
        { id: 'link-1-1', link: { type: 'custom', label: 'Exvorta Web', url: '/web' } },
        { id: 'link-1-2', link: { type: 'custom', label: 'Ecosystem', url: '/ecosystem' } },
        { id: 'link-1-3', link: { type: 'custom', label: 'Portfolio', url: '/portfolio' } },
      ],
    },
    {
      id: 'col-2',
      title: 'COMPANY',
      links: [
        { id: 'link-2-1', link: { type: 'custom', label: 'The Firm', url: '/about' } },
        { id: 'link-2-2', link: { type: 'custom', label: 'Insights', url: '/insights' } },
        { id: 'link-2-3', link: { type: 'custom', label: 'Contact Us', url: '/contact' } },
      ],
    },
    {
      id: 'col-3',
      title: 'LEGAL & ACCESS',
      links: [
        { id: 'link-3-1', link: { type: 'custom', label: 'Request Proposal', url: '/rfq' } },
        { id: 'link-3-2', link: { type: 'custom', label: 'Privacy Policy', url: '/legal#privacy' } },
        { id: 'link-3-3', link: { type: 'custom', label: 'Terms of Service', url: '/legal#terms' } },
      ],
    },
  ]

  const finalColumns =
    (footerData?.columns?.length ? footerData.columns : fallbackColumns) as unknown as Array<{
      id?: string | null
      title?: string
      links?: FooterLinkItem[] | null
    }>

  const resolveHref = (item: FooterLinkItem): string => {
    const link = item.link
    if (!link) return '#'
    const refValue = link.reference?.value
    if (link.type === 'reference' && refValue && typeof refValue === 'object') {
      return refValue.slug ? `/${refValue.slug}` : '#'
    }
    return link.url || '#'
  }

  return (
    <footer className="w-full bg-[#FAFAF8] border-t border-black/10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-obsidian uppercase mb-6 block">
              EXVORTA
            </Link>
            <p className="text-xs text-obsidian/40 leading-relaxed font-light max-w-xs">
              The definitive digital foundation for elite global traders. Precision-engineered in Dubai, UAE.
            </p>
          </div>

          {finalColumns.map((column, colIndex) => (
            <div key={column.id || colIndex}>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-obsidian mb-6">
                {column.title}
              </h4>
              <ul className="space-y-4 text-[11px] text-obsidian/60">
                {column.links?.map((item, linkIndex) => {
                  const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
                  return (
                    <li key={item.id || linkIndex}>
                      <Link
                        href={resolveHref(item)}
                        className="hover:text-obsidian transition-colors"
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                      >
                        {item.link?.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-black/5 pt-12 text-center">
          <p className="text-[10px] tracking-widest text-obsidian/30 uppercase">© 2026 Exvorta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
