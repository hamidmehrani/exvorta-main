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
    console.error('Error fetching footer data', error)
  }

  return (
    <footer className="w-full border-t border-border-dark bg-obsidian py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-cream uppercase mb-2 block">
              EXVORTA
            </Link>
            <p className="text-xs text-cream/40 leading-relaxed font-light max-w-xs">
              The definitive digital foundation for elite global traders. Precision-engineered in Dubai, UAE.
            </p>
          </div>

          {footerData?.columns?.map((column, colIndex) => (
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
            &copy; {currentYear} {footerData?.copyrightText || 'Exvorta. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
