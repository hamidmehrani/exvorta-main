import React from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import { Footer as FooterType } from '@/payload-types'

export const Footer = async () => {
  const currentYear = new Date().getFullYear()
  const t = await getTranslations('Footer')
  
  const payload = await getPayloadClient()
  let footerData: FooterType | null = null
  
  try {
    footerData = await payload.findGlobal({
      slug: 'footer',
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
          <p className="text-sm text-muted max-w-sm leading-relaxed">
            {t('description')}
          </p>
        </div>

        {footerData?.columns?.map((column, colIndex) => (
          <div key={column.id || colIndex}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-3">
              {column.links?.map((link, linkIndex) => (
                <li key={link.id || linkIndex}>
                  <Link href={link.url} className="text-sm text-muted hover:text-text transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {(!footerData?.columns || footerData.columns.length === 0) && (
          <>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                {t('resources')}
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="#" className="text-sm text-muted hover:text-text transition-colors duration-200">
                    {t('documentation')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                {t('system')}
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/admin" className="text-sm text-muted hover:text-text transition-colors duration-200">
                    {t('cmsAdmin')}
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted">
          &copy; {currentYear} {footerData?.copyrightText || t('rights')}
        </span>
        <span className="text-xs text-muted flex items-center gap-1">
          {t('designed')}
        </span>
      </div>
    </footer>
  )
}

export default Footer
