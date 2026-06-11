'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import LanguageSwitcher from '../ui/LanguageSwitcher'

interface HeaderClientProps {
  navLinks: Array<{ label: string; url: string; id?: string | null }>
  t: {
    features: string
    collections: string
    docs: string
    admin: string
  }
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navLinks, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

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
          {navLinks.map((link, idx) => (
            <Link key={link.id || idx} href={link.url} className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200">
              {link.label}
            </Link>
          ))}
          {navLinks.length === 0 && (
            <>
              <a href="#" className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200">
                {t.features}
              </a>
              <a href="#" className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200">
                {t.collections}
              </a>
              <a href="#" className="text-sm font-medium text-muted hover:text-accent transition-colors duration-200">
                {t.docs}
              </a>
            </>
          )}
          <div className="border-s border-border ps-6 flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/admin" className="px-4 h-9 inline-flex items-center justify-center rounded-md border border-border text-text hover:bg-surface-2 text-sm font-medium transition-all duration-200">
              {t.admin}
            </Link>
          </div>
        </nav>

        <button onClick={toggleMenu} className="md:hidden text-text hover:text-accent transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-bg shadow-lg absolute top-full left-0 w-full z-40 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link, idx) => (
              <Link key={link.id || idx} href={link.url} className="text-base font-medium text-text hover:text-accent transition-colors duration-200" onClick={toggleMenu}>
                {link.label}
              </Link>
            ))}
            {navLinks.length === 0 && (
              <>
                <a href="#" className="text-base font-medium text-text hover:text-accent transition-colors duration-200">
                  {t.features}
                </a>
                <a href="#" className="text-base font-medium text-text hover:text-accent transition-colors duration-200">
                  {t.collections}
                </a>
                <a href="#" className="text-base font-medium text-text hover:text-accent transition-colors duration-200">
                  {t.docs}
                </a>
              </>
            )}
            <div className="border-t border-border pt-4 flex flex-col gap-4">
              <LanguageSwitcher />
              <Link href="/admin" className="h-10 inline-flex items-center justify-center rounded-md bg-primary text-bg font-medium transition-all duration-200" onClick={toggleMenu}>
                {t.admin}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default HeaderClient
