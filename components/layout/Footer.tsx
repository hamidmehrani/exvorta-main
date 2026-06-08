import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('Footer')

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

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
            {t('resources')}
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a href="#" className="text-sm text-muted hover:text-text transition-colors duration-200">
                {t('documentation')}
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted hover:text-text transition-colors duration-200">
                {t('guides')}
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-muted hover:text-text transition-colors duration-200">
                {t('apiReference')}
              </a>
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
            <li>
              <Link href="/api/pages" className="text-sm text-muted hover:text-text transition-colors duration-200">
                {t('restApi')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted">
          &copy; {currentYear} {t('rights')}
        </span>
        <span className="text-xs text-muted flex items-center gap-1">
          {t('designed')}
        </span>
      </div>
    </footer>
  )
}

export default Footer
