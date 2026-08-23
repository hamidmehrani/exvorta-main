'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type {  Page  } from '@/payload-types'

interface NavLink {
  link: {
    type?: "custom" | "reference" | null
    label: string
    reference?: {
      relationTo: "pages"
      value: number | Page
    } | null
    url?: string | null
    openInNewTab?: boolean | null
  }
  id?: string | null
}

interface HeaderClientProps {
  navLinks: NavLink[]
  t: any
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navLinks, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-black/5 bg-cream/90 backdrop-blur-md" data-purpose="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-wide text-obsidian uppercase">
            EXVORTA
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12 text-[11px] font-medium tracking-widest text-obsidian/60 uppercase">
          {navLinks.map((item, idx) => {
            const refValue = item.link?.reference?.value
            const isRef = item.link?.type === 'reference' && refValue
            const href = isRef
              ? `/${typeof refValue === 'string' || typeof refValue === 'number' ? refValue : ((refValue as {slug?: string, id?: string | number})?.slug || (refValue as {slug?: string, id?: string | number})?.id || '')}`
              : (item.link?.url || '#')
            const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
            
            return (
              <Link 
                key={item.id || idx} 
                href={href} 
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="hover:text-obsidian transition-colors relative group"
              >
                {item.link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-obsidian transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link href="/admin" className="mr-6 text-[10px] tracking-[0.2em] font-mono text-black/70 hover:text-black uppercase transition-all">
            CLIENT LOGIN
          </Link>
          <Link href="/rfq" className="bg-obsidian text-cream px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-[#1a1a1a] transition-colors">
            [ REQUEST PROPOSAL ]
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu} 
            className="text-obsidian hover:text-gray-500 focus:outline-none" 
            type="button"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 bg-cream shadow-lg absolute top-full left-0 w-full z-40 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((item, idx) => {
              const refValue = item.link?.reference?.value
              const isRef = item.link?.type === 'reference' && refValue
              const href = isRef
                ? `/${typeof refValue === 'string' || typeof refValue === 'number' ? refValue : ((refValue as {slug?: string, id?: string | number})?.slug || (refValue as {slug?: string, id?: string | number})?.id || '')}`
                : (item.link?.url || '#')
              const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
              
              return (
                <Link 
                  key={item.id || idx} 
                  href={href} 
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="text-sm font-medium tracking-widest text-obsidian uppercase hover:text-obsidian/70 transition-colors duration-200" 
                  onClick={toggleMenu}
                >
                  {item.link.label}
                </Link>
              )
            })}
            <div className="border-t border-black/10 pt-4 flex flex-col gap-4 mt-2">
              <Link href="/admin" className="text-sm font-medium tracking-widest text-obsidian uppercase" onClick={toggleMenu}>
                CLIENT LOGIN
              </Link>
              <Link href="/rfq" className="h-10 inline-flex items-center justify-center bg-obsidian text-cream font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-200" onClick={toggleMenu}>
                [ REQUEST PROPOSAL ]
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default HeaderClient
