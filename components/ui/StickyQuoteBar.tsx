'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from '@/components/ui/AppLink'
import { Container } from '@/components/ui/Container'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

export interface StickyQuoteBarProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  secondaryText?: string
  secondaryHref?: string
  scrollThreshold?: number
  storageKey?: string
  statusLabel?: string
  className?: string
}

export function isQuoteBarDismissed(storageKey: string, storage?: Storage): boolean {
  if (!storage) return false
  try {
    const pageKey = `exvorta_quote_bar_dismissed_${storageKey}`
    return (
      storage.getItem(pageKey) === 'true' ||
      storage.getItem('exvorta_sticky_quote_dismissed') === 'true'
    )
  } catch {
    return false
  }
}

export function dismissQuoteBar(storageKey: string, storage?: Storage): void {
  if (storage) {
    try {
      storage.setItem(`exvorta_quote_bar_dismissed_${storageKey}`, 'true')
      storage.setItem('exvorta_sticky_quote_dismissed', 'true')
    } catch {
      // Ignore localStorage write errors
    }
  }
  trackEvent(ANALYTICS_EVENTS.QUOTE_BAR_DISMISSED, { target: storageKey })
}

export function trackQuoteBarCtaClick(
  href: string,
  storageKey: string,
  action: 'primary' | 'secondary' = 'primary'
): void {
  trackEvent(ANALYTICS_EVENTS.CTA_CLICKED, {
    target: 'sticky_quote_bar',
    href,
    page: storageKey,
    action,
  })
}

export interface ScrollTarget {
  scrollY: number
  addEventListener: (type: string, listener: () => void, options?: { passive?: boolean }) => void
  removeEventListener: (type: string, listener: () => void) => void
}

export function bindQuoteBarScroll(
  targetWindow: ScrollTarget,
  scrollThreshold: number,
  onScrolledPastChange: (scrolledPast: boolean) => void
): () => void {
  const checkScroll = () => {
    onScrolledPastChange(targetWindow.scrollY > scrollThreshold)
  }

  checkScroll()
  targetWindow.addEventListener('scroll', checkScroll, { passive: true })
  return () => {
    targetWindow.removeEventListener('scroll', checkScroll)
  }
}

export function StickyQuoteBar({
  title = 'Fixed-scope export platforms & digital infrastructure',
  subtitle = 'Confirm architecture & timeline within 24 hours',
  ctaText = '[ REQUEST PROPOSAL ]',
  ctaHref = '/rfq',
  secondaryText,
  secondaryHref,
  scrollThreshold = 400,
  storageKey = 'pricing',
  statusLabel = 'DESK READY',
  className = '',
}: StickyQuoteBarProps) {
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [scrolledPast, setScrolledPast] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && window.localStorage) {
      if (isQuoteBarDismissed(storageKey, window.localStorage)) {
        setDismissed(true)
      }
    }

    if (typeof window !== 'undefined') {
      return bindQuoteBarScroll(window, scrollThreshold, (past) => {
        setScrolledPast(past)
      })
    }
  }, [storageKey, scrollThreshold])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    const storage = typeof window !== 'undefined' ? window.localStorage : undefined
    dismissQuoteBar(storageKey, storage)
  }, [storageKey])

  const handlePrimaryClick = useCallback(() => {
    trackQuoteBarCtaClick(ctaHref, storageKey, 'primary')
  }, [ctaHref, storageKey])

  const handleSecondaryClick = useCallback(() => {
    if (secondaryHref) {
      trackQuoteBarCtaClick(secondaryHref, storageKey, 'secondary')
    }
  }, [secondaryHref, storageKey])

  const isVisible = mounted && !dismissed && scrolledPast

  return (
    <aside
      role="region"
      aria-label="Quote action bar"
      aria-hidden={!isVisible}
      className={`fixed bottom-0 inset-x-0 z-40 px-4 py-3 md:py-3.5 bg-obsidian/95 text-white backdrop-blur-md border-t border-rule-dark transition-all duration-300 ease-out transform motion-reduce:transition-none ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none'
      } ${className}`}
    >
      <Container className="flex items-center justify-between gap-4">
        {/* Left: Status dot + Monospace status + Title & Subtitle */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success shadow-[0_0_6px_var(--color-success)]" />
            </span>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-success hidden sm:inline">
              {statusLabel}
            </span>
          </div>

          <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
            <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-white truncate">
              {title}
            </span>
            {subtitle && (
              <span className="font-mono text-[11px] md:text-xs text-muted-dark truncate hidden lg:inline">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions + Dismiss */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {secondaryText && secondaryHref && (
            <Link
              href={secondaryHref}
              onClick={handleSecondaryClick}
              className="btn-ghost py-1.5 px-3 md:py-2 md:px-4 text-[11px] md:text-xs min-h-[36px] hidden sm:inline-flex"
            >
              {secondaryText}
            </Link>
          )}

          <Link
            href={ctaHref}
            onClick={handlePrimaryClick}
            className="btn-primary py-1.5 px-3.5 md:py-2 md:px-5 text-[11px] md:text-xs min-h-[36px] font-semibold whitespace-nowrap"
          >
            {ctaText}
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss quote bar"
            className="p-1.5 text-muted-dark hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded shrink-0 ms-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Container>
    </aside>
  )
}

export default StickyQuoteBar
