import React from 'react'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Footer as FooterType } from '@/payload-types'

export default async function Footer() {
  const currentYear = new Date().getFullYear()
  const payload = await getPayloadClient()
  let footerData: FooterType | null = null
  
  try {
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
      title: 'Company',
      links: [
        { id: 'link-1-1', link: { type: 'custom', label: 'About', url: '/' } },
        { id: 'link-1-2', link: { type: 'custom', label: 'Services', url: '/ecosystem' } },
        { id: 'link-1-3', link: { type: 'custom', label: 'Process', url: '/#process' } },
        { id: 'link-1-4', link: { type: 'custom', label: 'Contact', url: '/rfq' } },
      ],
    },
    {
      id: 'col-2',
      title: 'Work',
      links: [
        { id: 'link-2-1', link: { type: 'custom', label: 'Portfolio', url: '/portfolio' } },
        { id: 'link-2-2', link: { type: 'custom', label: 'Case Studies', url: '/portfolio' } },
        { id: 'link-2-3', link: { type: 'custom', label: 'Insights', url: '/insights' } },
      ],
    },
    {
      id: 'col-3',
      title: 'Legal',
      links: [
        { id: 'link-3-1', link: { type: 'custom', label: 'Privacy Policy', url: '/legal/privacy' } },
        { id: 'link-3-2', link: { type: 'custom', label: 'Terms of Service', url: '/legal/terms' } },
        { id: 'link-3-3', link: { type: 'custom', label: 'Cookie Policy', url: '/legal/cookies' } },
      ],
    },
  ]

  const finalColumns = footerData?.columns?.length ? footerData.columns : fallbackColumns

  return (
    <footer className="w-full border-t border-border-dark bg-obsidian py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-cream uppercase mb-2 block">
              EXVORTA
            </Link>
            <p className="text-xs text-cream/40 leading-relaxed font-light max-w-xs">
              Digital infrastructure for global traders
            </p>
          </div>

          {finalColumns.map((column, colIndex) => (
            <div key={column.id || colIndex}>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-cream mb-6">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-4 text-[11px] text-cream/60">
                {column.links?.map((item, linkIndex) => {
                  const refValue = item.link?.reference?.value
                  const isRef = item.link?.type === 'reference' && refValue
                  const href = isRef
                    ? `/${typeof refValue === 'string' || typeof refValue === 'number' ? refValue : ((refValue as {slug?: string, id?: string | number})?.slug || (refValue as {slug?: string, id?: string | number})?.id || '')}`
                    : (item.link?.url || '#')
                  const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
                  return (
                    <li key={item.id || linkIndex}>
                      <a 
                        href={href} 
                        className="hover:text-cream transition-colors duration-200 block"
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {item.link?.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border-dark pt-12 text-center">
          <p className="text-[10px] tracking-widest text-cream/30 uppercase">
            © 2026 Exvorta — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
