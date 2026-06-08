import React from 'react'
import Link from 'next/link'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export const Header: React.FC = () => {
  const t = useTranslations('Header')

  return (
    <header className="w-full border-b border-border bg-bg/85 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-bg font-bold text-lg">
            B
          </div>
          <span className="text-lg font-bold tracking-tight text-text uppercase">
            Boilerplate
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200">
            {t('features')}
          </a>
          <a href="#" className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200">
            {t('collections')}
          </a>
          <a href="#" className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200">
            {t('docs')}
          </a>
          <div className="border-s border-border ps-6 flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/admin" className="px-4 h-9 inline-flex items-center justify-center rounded-md border border-border text-text hover:bg-surface-2 text-sm font-medium transition-all duration-200">
              {t('admin')}
            </Link>
          </div>
        </nav>

        <button className="md:hidden text-text hover:text-accent transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
