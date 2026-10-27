'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { Page } from '@/payload-types'
import ExvortaLogo from '@/components/brand/ExvortaLogo'

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
  brand?: { name: string; logoUrl: string | null }
}

const resolveHref = (item: NavLink): string => {
  const refValue = item.link?.reference?.value
  const isRef = item.link?.type === 'reference' && refValue
  if (isRef) {
    if (typeof refValue === 'string' || typeof refValue === 'number') return `/${refValue}`
    return `/${(refValue as { slug?: string }).slug || ''}`
  }
  return item.link?.url || '/'
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ navLinks, brand = { name: 'EXVORTA', logoUrl: null } }) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

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
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobileMenuOpen])

  // Sticky page-level navs (SectionNav) slide up into the header's slot when it hides.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.header = hidden ? 'hidden' : 'shown'
    return () => { delete root.dataset.header }
  }, [hidden])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Close the drawer on navigation and on Escape
  useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobileMenuOpen])

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  const isActive = (href: string) =>
    href !== '/' && (pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-cream transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-cinematic)] ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'border-rule-strong shadow-soft' : 'border-rule'}`}
      data-purpose="site-header"
    >
      <div className="container-site grid h-20 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        {/* Logo */}
        <div className="flex justify-self-start">
          <Link href="/" aria-label={`${brand.name} home`} className="inline-flex min-h-[44px] items-center">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={160}
                height={32}
                priority
                className="h-8 w-auto max-w-[160px] object-contain"
              />
            ) : (
              <ExvortaLogo size={34} />
            )}
          </Link>
        </div>

        {/* Desktop navigation — centred on the page, not on the leftover space */}
        <nav aria-label="Primary" className="hidden min-w-0 items-center gap-10 font-sans text-label font-medium uppercase lg:flex xl:gap-12">
          {navLinks.map((item, idx) => {
            const href = resolveHref(item)
            const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
            const active = isActive(href)
            return (
              <Link
                key={item.id || idx}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                aria-current={active ? 'page' : undefined}
                className={`group relative inline-flex min-h-[44px] items-center whitespace-nowrap transition-colors duration-200 hover:text-obsidian ${
                  active ? 'text-obsidian' : 'text-muted'
                }`}
              >
                {item.link.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-2.5 h-px origin-left transition-transform duration-300 ${
                    active ? 'scale-x-100 bg-emerald' : 'scale-x-0 bg-obsidian group-hover:scale-x-100'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-6 justify-self-end lg:flex">
          <Link href="/login" className="whitespace-nowrap font-mono text-label uppercase text-muted transition-colors hover:text-obsidian">
            CLIENT LOGIN
          </Link>
          <Link href="/rfq" className="btn-primary min-h-[44px] whitespace-nowrap">
            [ START YOUR PROJECT ]
          </Link>
        </div>

        {/* Mobile menu button — shown up to lg so the menu never squeezes */}
        <div className="flex items-center justify-self-end lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center text-obsidian transition-colors hover:text-obsidian/60"
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer — height animates 0fr→1fr; `inert` keeps the
          closed panel out of the tab order and the accessibility tree. */}
      <div
        id="mobile-menu"
        inert={!isMobileMenuOpen}
        className={`grid border-obsidian/10 bg-cream transition-[grid-template-rows,border-color] duration-300 ease-[var(--ease-cinematic)] lg:hidden ${
          isMobileMenuOpen ? 'grid-rows-[1fr] border-t' : 'grid-rows-[0fr] border-t-0'
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Mobile" className="container-site flex max-h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto py-4">
            {navLinks.map((item, idx) => {
              const href = resolveHref(item)
              const isExternal = item.link?.type === 'custom' && item.link?.openInNewTab
              const active = isActive(href)
              return (
                <Link
                  key={item.id || idx}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeMenu}
                  className={`flex min-h-[56px] items-center justify-between border-b border-obsidian/[0.06] text-sm font-medium uppercase tracking-[0.2em] transition-colors ${
                    active ? 'text-obsidian' : 'text-obsidian/75 hover:text-obsidian'
                  }`}
                >
                  {item.link.label}
                  <span aria-hidden className="font-mono text-xs text-muted">{active ? '●' : '→'}</span>
                </Link>
              )
            })}
            <div className="flex flex-col gap-3 pb-4 pt-6">
              <Link href="/login" onClick={closeMenu} className="btn-ghost min-h-[48px]">
                CLIENT LOGIN
              </Link>
              <Link href="/rfq" onClick={closeMenu} className="btn-primary min-h-[48px]">
                [ START YOUR PROJECT ]
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default HeaderClient
