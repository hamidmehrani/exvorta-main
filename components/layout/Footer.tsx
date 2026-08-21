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
    <footer className="w-full border-t border-border bg-surface py-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-bg font-bold text-lg">
              B
            </div>
            <span className="text-lg font-bold tracking-tight text-text uppercase">
              Boilerplate
            </span>
          </div>
            A boilerplate built for speed and scale.
        </div>

        {footerData?.columns?.map((column, colIndex) => (
          <div key={column.id || colIndex}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-3">
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
                      className="text-sm text-muted hover:text-text transition-colors duration-200"
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

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted">
          &copy; {currentYear} {footerData?.copyrightText || 'All rights reserved.'}
        </span>
        <span className="text-xs text-muted flex items-center gap-1">
          Designed & Built with passion
        </span>
      </div>
    </footer>
  )
}

