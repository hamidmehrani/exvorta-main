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
    return () => ro.disconnect()
  }, [imageUrl])

  return (
    <div
      className={`group/frame relative flex flex-col overflow-hidden ${
        dark
          ? 'bg-sidebar border border-rule-dark shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]'
          : 'bg-surface border border-rule-strong shadow-lift'
      } ${className}`}
    >
      {/* ── Chrome bar ─────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 border-b shrink-0 ${
          dark ? 'bg-card border-rule-dark' : 'bg-surface-2 border-rule'
        }`}
      >
        <span className="flex items-center gap-[6px] shrink-0" aria-hidden>
          <span className={`block w-[9px] h-[9px] rounded-full ${dark ? 'bg-white/20' : 'bg-black/[0.14]'}`} />
          <span className={`block w-[9px] h-[9px] rounded-full ${dark ? 'bg-white/15' : 'bg-black/[0.10]'}`} />
          <span className={`block w-[9px] h-[9px] rounded-full ${dark ? 'bg-white/10' : 'bg-black/[0.07]'}`} />
        </span>

        {/* URL pill */}
        <div
          className={`flex-1 flex items-center justify-center gap-1.5 min-w-0 rounded-full px-3.5 py-1 ${
            dark ? 'bg-white/[0.06]' : 'bg-white/80'
          }`}
        >
          {liveHref && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden />
          )}
          <svg
            className={`w-2.5 h-2.5 shrink-0 ${dark ? 'text-white/60' : 'text-black/60'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden
          >
            <path
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span
            className={`font-mono text-[10px] tracking-[0.15em] uppercase truncate ${
              dark ? 'text-white/65' : 'text-black/65'
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
            className={`shrink-0 inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
              dark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            OPEN
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
              width={1080}
              height={4000}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
              className={`h-auto w-full transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
              priority={priority}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-card to-obsidian flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-10 border border-white/10 rounded-[2px] flex items-center justify-center">
              <div className="w-7 h-5 border border-white/20 rounded-[1px]" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/25 uppercase">
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 translate-y-1.5 group-hover/frame:opacity-100 group-hover/frame:translate-y-0 transition-all duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
            <span className="font-mono text-[8px] tracking-[0.25em] text-white uppercase whitespace-nowrap">
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
