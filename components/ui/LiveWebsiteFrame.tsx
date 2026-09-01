'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface LiveWebsiteFrameProps {
  title: string
  imageUrl?: string
  /** Live site URL for the "open live" affordance (never embedded). */
  liveUrl?: string
  industry?: string
  volume?: string
  service?: string
  slug?: string
  /** Extra classes for the outer wrapper */
  className?: string
}

/**
 * LiveWebsiteFrame
 *
 * A portfolio card that presents the project as a cinema-framed desktop
 * screenshot with a slow scroll-on-hover reveal — clean, deterministic,
 * no iframe bleed. The real site is one click away via the status bar.
 */
export function LiveWebsiteFrame({
  title,
  imageUrl,
  liveUrl,
  industry,
  volume,
  service,
  slug,
  className = '',
}: LiveWebsiteFrameProps) {
  const screenRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [scrollDist, setScrollDist] = useState(0)
  const [copied, setCopied] = useState(false)

  // Measure exactly how far the capture must travel so its bottom edge
  // lands flush with the viewport bottom — no overshoot, no undershoot.
  useEffect(() => {
    const measure = () => {
      const screen = screenRef.current
      const img = imgRef.current
      if (!screen || !img) return
      const dist = Math.max(0, img.scrollHeight - screen.clientHeight)
      setScrollDist(dist)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (screenRef.current) ro.observe(screenRef.current)
    if (imgRef.current) ro.observe(imgRef.current)
    return () => ro.disconnect()
  }, [imageUrl])
  const liveHref = liveUrl || (slug ? `https://${slug}.exvorta.com` : '')
  const host = liveHref.replace(/^https:\/\//, '')
  const hasImage = !!imageUrl

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(liveHref)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard unavailable — silently ignore */ }
  }

  return (
    <div
      className={`relative flex flex-col overflow-hidden bg-[#0D0D0D] border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] group ${className}`}
    >
      {/* ── Monitor chrome ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F0EFED] border-b border-black/8 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] block" />
        <div className="flex-1 mx-2 bg-white/70 rounded-sm px-2 py-0.5 flex items-center justify-center gap-1.5 min-w-0">
          {liveHref && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden />
          )}
          <span className="font-mono text-[9px] tracking-[0.15em] text-black/40 uppercase truncate">
            {host || '[ LIVE PREVIEW ]'}
          </span>
        </div>
        {liveHref && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={copyUrl}
              aria-label={`Copy ${title} URL`}
              className="w-5 h-5 rounded-sm border border-black/10 text-black/40 hover:text-black hover:border-black/30 flex items-center justify-center transition-colors"
            >
              {copied ? (
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="11" height="11" rx="1.5" strokeWidth="2" stroke="currentColor" fill="none" />
                  <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${title} live site`}
              className="w-5 h-5 rounded-sm border border-black/10 text-black/40 hover:text-black hover:border-black/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* ── Screen: slow scroll-on-hover reveal of the real page capture ─── */}
      <div ref={screenRef} className="relative aspect-[4/3] overflow-hidden bg-[#0D0D0D]">
        {hasImage ? (
          <div
            ref={imgRef}
            className="lwframe-capture absolute inset-x-0 top-0"
            style={{
              height: 'max(100%, 133%)',
              ['--scroll' as string]: `${scrollDist}px`,
              transitionDuration: `${Math.min(7000, Math.max(2500, scrollDist * 12))}ms`,
            }}
          >
            <Image
              src={imageUrl!}
              alt={`${title} website preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top"
              priority={false}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
              <div className="w-6 h-6 border border-white/20" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-white/25 uppercase">[ NO PREVIEW ]</span>
          </div>
        )}
        {/* Live ribbon — bottom-left, appears on hover */}
        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
            <span className="font-mono text-[8px] tracking-[0.2em] text-white uppercase">LIVE — OPEN SITE</span>
            <svg className="w-2.5 h-2.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
        {/* Hover scanline sweeping down over the preview */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/0 via-white/10 to-white/0 opacity-0 -translate-y-full group-hover:opacity-100 group-hover:animate-[framescan_2.4s_ease-in-out_infinite]" />
        {/* Subtle vignette overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      {/* ── Meta strip ────────────────────────────────────────────────────── */}
      {(industry || volume || service) && (
        <div className="bg-white border-t border-black/5 px-4 py-3 space-y-1.5 font-mono text-[9px] uppercase tracking-widest">
          {industry && (
            <div className="flex justify-between text-gray-400">
              <span>INDUSTRY</span>
              <span className="text-black font-medium">{industry}</span>
            </div>
          )}
          {volume && (
            <div className="flex justify-between text-gray-400">
              <span>VOLUME</span>
              <span className="text-black font-medium">{volume}</span>
            </div>
          )}
          {service && (
            <div className="flex justify-between text-gray-400">
              <span>SERVICE</span>
              <span className="text-black font-medium">{service}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LiveWebsiteFrame
