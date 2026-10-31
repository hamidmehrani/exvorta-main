import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  ANALYTICS_EVENTS: {
    CTA_CLICKED: 'cta_clicked',
    QUOTE_BAR_DISMISSED: 'quote_bar_dismissed',
  },
}))

import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'
import {
  StickyQuoteBar,
  isQuoteBarDismissed,
  dismissQuoteBar,
  trackQuoteBarCtaClick,
  bindQuoteBarScroll,
  type ScrollTarget,
} from '@/components/ui/StickyQuoteBar'

class MockLocalStorage implements Storage {
  private store: Record<string, string> = {}

  get length(): number {
    return Object.keys(this.store).length
  }

  clear(): void {
    this.store = {}
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value)
  }
}

describe('StickyQuoteBar component & state engine', () => {
  let mockStorage: MockLocalStorage

  beforeEach(() => {
    vi.clearAllMocks()
    mockStorage = new MockLocalStorage()
  })

  describe('Zero CLS & Accessibility DOM Specification', () => {
    it('renders with Zero CLS fixed positioning and proper accessibility attributes', () => {
      const html = renderToStaticMarkup(React.createElement(StickyQuoteBar))

      // Semantic container and ARIA landmark
      expect(html).toContain('<aside')
      expect(html).toContain('role="region"')
      expect(html).toContain('aria-label="Quote action bar"')

      // Zero CLS contract: fixed at bottom, not pushing document flow
      expect(html).toContain('fixed bottom-0 inset-x-0 z-40')

      // Initial SSR state: translate-y-full opacity-0 pointer-events-none (no layout shift)
      expect(html).toContain('translate-y-full')
      expect(html).toContain('opacity-0')
      expect(html).toContain('pointer-events-none')

      // Motion rules: respects prefers-reduced-motion
      expect(html).toContain('motion-reduce:transition-none')

      // Accessible dismiss button
      expect(html).toContain('aria-label="Dismiss quote bar"')
      expect(html).toContain('type="button"')

      // Default copy and live status indicator
      expect(html).toContain('DESK READY')
      expect(html).toContain('Fixed-scope export platforms &amp; digital infrastructure')
      expect(html).toContain('Confirm architecture &amp; timeline within 24 hours')
      expect(html).toContain('[ REQUEST PROPOSAL ]')
      expect(html).toContain('href="/rfq"')
    })

    it('renders custom props, secondary action, and custom storage key targets', () => {
      const html = renderToStaticMarkup(
        React.createElement(StickyQuoteBar, {
          title: 'Institutional Export Architecture',
          subtitle: 'Fixed-scope delivery. Confirm architecture within 24h.',
          ctaText: '[ REQUEST SCOPE ]',
          ctaHref: '/rfq',
          secondaryText: '[ DIRECT INQUIRY ]',
          secondaryHref: '/contact',
          statusLabel: 'OPERATIONAL',
          storageKey: 'pricing',
          className: 'custom-quote-bar',
        })
      )

      expect(html).toContain('Institutional Export Architecture')
      expect(html).toContain('Fixed-scope delivery. Confirm architecture within 24h.')
      expect(html).toContain('[ REQUEST SCOPE ]')
      expect(html).toContain('href="/rfq"')
      expect(html).toContain('[ DIRECT INQUIRY ]')
      expect(html).toContain('href="/contact"')
      expect(html).toContain('OPERATIONAL')
      expect(html).toContain('custom-quote-bar')
    })
  })

  describe('Dismissal persistence with localStorage', () => {
    it('returns false when storage has no dismissal record', () => {
      expect(isQuoteBarDismissed('pricing', mockStorage)).toBe(false)
      expect(isQuoteBarDismissed('custom_page', mockStorage)).toBe(false)
    })

    it('returns true when page-specific key is marked dismissed', () => {
      mockStorage.setItem('exvorta_quote_bar_dismissed_pricing', 'true')
      expect(isQuoteBarDismissed('pricing', mockStorage)).toBe(true)
      expect(isQuoteBarDismissed('other_page', mockStorage)).toBe(false)
    })

    it('returns true when global key is marked dismissed', () => {
      mockStorage.setItem('exvorta_sticky_quote_dismissed', 'true')
      expect(isQuoteBarDismissed('pricing', mockStorage)).toBe(true)
      expect(isQuoteBarDismissed('any_page', mockStorage)).toBe(true)
    })

    it('persists dismissal in both page-specific and global keys and dispatches QUOTE_BAR_DISMISSED', () => {
      dismissQuoteBar('pricing', mockStorage)

      expect(mockStorage.getItem('exvorta_quote_bar_dismissed_pricing')).toBe('true')
      expect(mockStorage.getItem('exvorta_sticky_quote_dismissed')).toBe('true')

      expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.QUOTE_BAR_DISMISSED, {
        target: 'pricing',
      })
    })

    it('gracefully handles missing storage or exceptions without throwing', () => {
      expect(isQuoteBarDismissed('pricing', undefined)).toBe(false)
      expect(() => dismissQuoteBar('pricing', undefined)).not.toThrow()
      expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.QUOTE_BAR_DISMISSED, {
        target: 'pricing',
      })
    })
  })

  describe('Scroll Threshold & Window Event Binding Contract', () => {
    it('binds passive scroll listener on mount and cleans up on unmount', () => {
      const listeners: Record<string, () => void> = {}
      const targetWindow: ScrollTarget = {
        scrollY: 200,
        addEventListener: vi.fn((type: string, listener: () => void) => {
          listeners[type] = listener
        }),
        removeEventListener: vi.fn((type: string) => {
          delete listeners[type]
        }),
      }

      const onScrolledPastChange = vi.fn()
      const cleanup = bindQuoteBarScroll(targetWindow, 400, onScrolledPastChange)

      // Initial check at scrollY = 200 (<= 400 threshold)
      expect(onScrolledPastChange).toHaveBeenCalledWith(false)
      expect(targetWindow.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
      })

      // Simulate scrolling past threshold
      targetWindow.scrollY = 600
      listeners['scroll']()
      expect(onScrolledPastChange).toHaveBeenCalledWith(true)

      // Simulate scrolling back up
      targetWindow.scrollY = 150
      listeners['scroll']()
      expect(onScrolledPastChange).toHaveBeenCalledWith(false)

      // Unmount cleanup removes scroll listener
      cleanup()
      expect(targetWindow.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
      expect(listeners['scroll']).toBeUndefined()
    })
  })

  describe('Umami Analytics Tracking Dispatch', () => {
    it('dispatches CTA_CLICKED with target="sticky_quote_bar" on primary CTA click', () => {
      trackQuoteBarCtaClick('/rfq', 'pricing', 'primary')

      expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.CTA_CLICKED, {
        target: 'sticky_quote_bar',
        href: '/rfq',
        page: 'pricing',
        action: 'primary',
      })
    })

    it('dispatches CTA_CLICKED with target="sticky_quote_bar" on secondary CTA click', () => {
      trackQuoteBarCtaClick('/contact', 'pricing', 'secondary')

      expect(trackEvent).toHaveBeenCalledWith(ANALYTICS_EVENTS.CTA_CLICKED, {
        target: 'sticky_quote_bar',
        href: '/contact',
        page: 'pricing',
        action: 'secondary',
      })
    })
  })
})
