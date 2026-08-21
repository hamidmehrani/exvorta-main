'use client'

import React, { useState } from 'react'
import type { Page } from '@/payload-types'

interface Nava {
  id?: string | null
  link: {
    type?: 'reference' | 'custom' | null
    reference?: {
      relationTo: 'pages'
      value: string | number | Page
    } | null
    url?: string | null
    label: string
    openInNewTab?: boolean | null
  }
}

interface HeaderClientProps {
  navLinks: Nava[]
  t: {
    features: string
    collections: string
    docs: string
    admin: string
  }
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navLinks, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${hasScrolled ? 'bg-surface/80 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-bg font-bold text-lg group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-text">Boilerplate</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item, idx) => {
            const refValue = item.link.reference?.value;
            const isRef = item.link.type === 'reference' && refValue;
            const href = isRef 
              ? `/${typeof refValue === 'string' || typeof refValue === 'number' ? refValue : (refValue as {slug?: string, id?: string | number})?.slug || (refValue as {slug?: string, id?: string | number})?.id || ''}`
              : (item.link.url || '#');
            const isExternal = item.link.type === 'custom' && item.link.openInNewTab;
            
            return (
              <a 
                key={item.id || idx}
                href={href}
                className="text-sm font-medium text-muted hover:text-text transition-colors relative group"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {item.link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-sm font-medium text-text hover:text-primary transition-colors">
            Log in
          </a>
          <a href="/register" className="px-5 py-2.5 rounded-md bg-primary text-bg text-sm font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </a>
        </div>

        <button 
          className="md:hidden flex flex-col gap-1.5 p-2 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`w-6 h-0.5 bg-text transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-text transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-text transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-surface z-40 flex flex-col pt-24 px-6 pb-6 animate-in slide-in-from-top-full duration-300">
            <nav className="flex flex-col gap-6 text-2xl font-bold mb-auto">
            {navLinks.map((item, idx) => {
              const refValue = item.link.reference?.value
              const isRef = item.link.type === 'reference' && refValue
              const href = isRef
                ? `/${typeof refValue === 'string' || typeof refValue === 'number' ? refValue : (refValue as {slug?: string, id?: string | number})?.slug || (refValue as {slug?: string, id?: string | number})?.id || ''}`
                : (item.link.url || '#')
              const isExternal = item.link.type === 'custom' && item.link.openInNewTab
              return (
                <a 
                  key={item.id || idx} 
                  href={href} 
                  className="text-base font-medium text-text hover:text-accent transition-colors duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {item.link.label}
                </a>
              )
            })}
            <div className="border-t border-border pt-4 flex flex-col gap-4">
              <a href="/admin" className="h-10 inline-flex items-center justify-center rounded-md bg-primary text-bg font-medium transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                {t.admin}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default HeaderClient
