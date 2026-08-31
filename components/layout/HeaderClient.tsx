'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { m as motion, AnimatePresence, useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import type { Page } from '@/payload-types'
import { easings, useAnimationLevel } from '@/lib/animations'

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
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navLinks }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const animationLevel = useAnimationLevel()
  const prefersReducedMotion = useFramerReducedMotion()

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      // Never hide while the mobile menu is open or near the top of the page
      if (y < 80 || isMobileMenuOpen) {
        setHidden(false)
      } else if (y > lastY + 4) {
        setHidden(true)
      } else if (y < lastY - 4) {
        setHidden(false)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobileMenuOpen])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [isMobileMenuOpen])

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  const resolveHref = (item: NavLink): string => {
    const refValue = item.link?.reference?.value
    const isRef = item.link?.type === 'reference' && refValue
    if (isRef) {
      if (typeof refValue === 'string' || typeof refValue === 'number') return `/${refValue}`
      return `/${(refValue as { slug?: string }).slug || ''}`
    }
    return item.link?.url || '/'
  }

  const renderLinks = (onClick?: () => void) =>
    navLinks.map((item, idx) => {
      const href = resolveHref(item)
      const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
      return (
        <motion.div
          key={item.id || idx}
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * idx + 0.1, ease: easings.cinematic }}
        >
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            onClick={onClick}
            className="hover:text-obsidian transition-colors relative group"
          >
            {item.link.label}
            <span aria-hidden className="absolute -bottom-2 left-0 w-0 h-[1px] bg-obsidian transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </motion.div>
      )
    })

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: easings.cinematic }}
      className={`fixed top-0 left-0 right-0 z-50 glass-panel border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? 'bg-cream/85 backdrop-blur-lg border-black/10 shadow-[0_1px_20px_rgba(0,0,0,0.04)]' : 'bg-transparent border-transparent'
      }`}
      data-purpose="site-header"
    >
      <div className="container-site h-20 flex items-center justify-between gap-4 lg:gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-wide text-obsidian uppercase">
            EXVORTA
          </Link>
        </div>

        {/* Desktop Navigation — full nav only at lg+; below that the drawer handles it */}
        <nav className="hidden lg:flex items-center gap-12 text-[11px] font-medium tracking-widest text-obsidian/60 uppercase min-w-0">
          {renderLinks()}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link href="/login" className="text-[10px] tracking-[0.2em] font-mono text-black/70 hover:text-black uppercase transition-all whitespace-nowrap">
            CLIENT LOGIN
          </Link>
          <Link href="/rfq" className="btn-primary min-h-[44px] whitespace-nowrap">
            [ START YOUR PROJECT ]
          </Link>
        </div>

        {/* Mobile menu button — shown up to lg so the menu never squeezes */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="w-11 h-11 flex items-center justify-center text-obsidian hover:text-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-obsidian"
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: easings.cinematic }}
            className="lg:hidden border-t border-black/5 bg-cream absolute top-full left-0 w-full z-40 overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navLinks.map((item, idx) => {
                const href = resolveHref(item)
                const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.04 * idx, ease: easings.cinematic }}
                  >
                    <Link
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="block py-2 text-sm font-medium tracking-widest text-obsidian uppercase hover:text-obsidian/70 transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      {item.link.label}
                    </Link>
                  </motion.div>
                )
              })}
              <div className="border-t border-black/10 pt-4 flex flex-col gap-4 mt-2">
                <Link href="/login" className="py-2 text-sm font-medium tracking-widest text-obsidian uppercase" onClick={closeMenu}>
                  CLIENT LOGIN
                </Link>
                <Link href="/rfq" className="min-h-[44px] inline-flex items-center justify-center btn-primary" onClick={closeMenu}>
                  [ START YOUR PROJECT ]
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default HeaderClient
