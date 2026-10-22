'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface BrowserFrameProps {
  title: string
  /** Live site URL — powers the URL pill and the "open live" affordance. */
  url?: string
  /** Full-length page capture shown inside the screen (drifts on hover). */
  imageUrl?: string
  /** Chrome colorway — 'dark' for dark page sections, 'light' for light ones. */
  tone?: 'light' | 'dark'
  aspectClass?: string
  /** Preload the capture — set for frames that can be the page's LCP. */
  priority?: boolean
  /** Rendered under the screen (meta rows, captions…). */
  footer?: React.ReactNode
  /**
   * Borderless variant for frames that sit inside a bordered card (the card
   * supplies the outline, so the frame never doubles it with a second tone).
   */
  bare?: boolean
  className?: string
}

/**
 * BrowserFrame — the canonical Exvorta site-presentation frame.
 *
 * A precision browser window: quiet traffic signals, a centered URL pill
 * with lock + live indicator, and a dark screen running a full-length
 * page capture that drifts gently on hover. Deterministic (no iframes),
 * consistent across portfolio cards, the homepage showcase and the
 * case-study heroes.
 */
export function BrowserFrame({
  title,
  url,
  imageUrl,
  tone = 'light',
  aspectClass = 'aspect-[16/10]',
  priority = false,
  footer,
  bare = false,
  className = '',
}: BrowserFrameProps) {
  const dark = tone === 'dark'
  const screenRef = useRef<HTMLDivElement>(null)
  const captureRef = useRef<HTMLDivElement>(null)
  const [scrollDist, setScrollDist] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const liveHref = url || ''
  const host = liveHref.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Measure how far the capture must travel so its bottom edge can land
  // flush with the viewport bottom. The CSS drift caps travel so very tall
  // pages still pan calmly (see .lwframe-capture in globals.css).
  useEffect(() => {
    const measure = () => {
      const screen = screenRef.current
      const img = captureRef.current?.querySelector('img') as HTMLImageElement | null
      if (!screen || !img) return
      const renderedH = img.clientWidth
        ? img.clientHeight || (img.naturalHeight / img.naturalWidth) * img.clientWidth
        : 0
      const dist = Math.max(0, Math.min(renderedH, img.scrollHeight) - screen.clientHeight)
      setScrollDist(dist)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (screenRef.current) ro.observe(screenRef.current)
    if (captureRef.current) ro.observe(captureRef.current)
    return () => ro.disconnect()
  }, [imageUrl])

  return (
    <div
      className={`group/frame relative flex flex-col overflow-hidden ${
        dark
          ? `bg-sidebar ${bare ? '' : 'border border-rule-dark shadow-deep'}`
          : `bg-surface ${bare ? '' : 'border border-rule-strong shadow-lift'}`
      } ${className}`}
    >
      {/* ── Chrome bar ─────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-2.5 px-3 py-2.5 border-b shrink-0 sm:gap-3 sm:px-4 ${
          dark ? 'bg-card border-rule-dark' : 'bg-surface-2 border-rule'
        }`}
      >
        <span className="flex items-center gap-[6px] shrink-0" aria-hidden>
          <span className={`block w-[9px] h-[9px] rounded-full ${dark ? 'bg-white/20' : 'bg-obsidian/15'}`} />
          <span className={`block w-[9px] h-[9px] rounded-full ${dark ? 'bg-white/15' : 'bg-obsidian/10'}`} />
          <span className={`block w-[9px] h-[9px] rounded-full ${dark ? 'bg-white/10' : 'bg-obsidian/[0.07]'}`} />
        </span>

        {/* URL pill — the host must always read in full, so the pill drops its
            live dot on narrow screens instead of truncating the domain. */}
        <div
          className={`flex-1 flex items-center justify-center gap-1.5 min-w-0 rounded-full px-3 py-1 sm:px-3.5 ${
            dark ? 'bg-white/[0.06]' : 'bg-surface/80'
          }`}
        >
          {liveHref && (
            <span className="hidden w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shrink-0 sm:block" aria-hidden />
          )}
          <svg
            className={`w-2.5 h-2.5 shrink-0 ${dark ? 'text-white/60' : 'text-muted'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden
          >
            <path
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span
            className={`font-mono text-micro uppercase truncate ${
              dark ? 'text-white/70' : 'text-muted'
            }`}
          >
            {host || title}
          </span>
        </div>

        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title} in a new tab`}
            className={`shrink-0 inline-flex items-center gap-1 font-mono text-micro uppercase transition-colors ${
              dark ? 'text-white/60 hover:text-white' : 'text-muted hover:text-obsidian'
            }`}
          >
            <span className="hidden sm:inline">Open</span>
            <svg className="w-3 h-3 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>

      {/* ── Screen ─────────────────────────────────────────────────────── */}
      <div ref={screenRef} className={`relative ${aspectClass} overflow-hidden bg-obsidian group`}>
        {imageUrl ? (
          <div
            ref={captureRef}
            className="lwframe-capture absolute inset-x-0 top-0"
            style={{ ['--scroll' as string]: `${scrollDist}px` }}
          >
            <Image
              src={imageUrl}
              alt={`${title} website preview`}
              width={1425}
              height={4000}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
              className={`h-auto w-full transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
              priority={priority}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-card to-obsidian flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-10 border border-rule-dark rounded-[2px] flex items-center justify-center">
              <div className="w-7 h-5 border border-white/20 rounded-[1px]" />
            </div>
            <span className="font-mono text-micro text-white/50 uppercase">
              {title}
            </span>
          </div>
        )}

        {/* Bottom fade — the capture dissolves instead of hard-clipping */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-obsidian/80 via-obsidian/25 to-transparent" />

        {/* Live pill — bottom center on hover */}
        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 inset-x-0 mx-auto w-max z-10 inline-flex items-center gap-2 bg-obsidian/85 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 translate-y-1.5 group-hover/frame:opacity-100 group-hover/frame:translate-y-0 transition-all duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden />
            <span className="font-mono text-micro text-white uppercase whitespace-nowrap">
              Open live site
            </span>
            <svg className="w-2.5 h-2.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>

      {footer}

    </div>
  )
}

export default BrowserFrame
