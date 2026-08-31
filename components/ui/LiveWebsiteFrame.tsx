'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface LiveWebsiteFrameProps {
  title: string
  imageUrl?: string
  /** Live site to embed in the monitor (iframe). Falls back to imageUrl. */
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
 * A portfolio card that renders the client's ACTUAL live website inside a
 * monitor frame via iframe (if the site allows framing), with an interactive
 * scroll-on-hover simulation. Falls back to a static screenshot when the
 * embed is blocked or no liveUrl is given.
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
  const embedUrl = liveUrl || (slug ? `https://${slug}.exvorta.com` : '')
  const [embedOk, setEmbedOk] = useState<boolean | null>(null) // null = probing
  const frameRef = useRef<HTMLIFrameElement>(null)
  const probeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!embedUrl) return
    setEmbedOk(null)
    // X-Frame-Options/CSP blocks fire onload with an empty/blocked document.
    // Heuristic: if the iframe hasn't signalled load within 6s, treat as blocked.
    let loaded = false
    const onLoad = () => {
      loaded = true
      try {
        // cross-origin access throws — that's fine, means it loaded a real page
        void frameRef.current?.contentWindow?.length
        setEmbedOk(true)
      } catch {
        setEmbedOk(true)
      }
    }
    const el = frameRef.current
    el?.addEventListener('load', onLoad)
    probeTimer.current = setTimeout(() => {
      if (!loaded) setEmbedOk(false)
    }, 6000)
    return () => {
      el?.removeEventListener('load', onLoad)
      if (probeTimer.current) clearTimeout(probeTimer.current)
    }
  }, [embedUrl])

  const showEmbed = !!embedUrl && embedOk !== false

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
          {showEmbed && embedOk === true && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden />
          )}
          <span className="font-mono text-[9px] tracking-[0.15em] text-black/40 uppercase truncate">
            {showEmbed ? embedUrl.replace(/^https:\/\//, '') : '[ LIVE PREVIEW ]'}
          </span>
        </div>
        {showEmbed && (
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title} live site`}
            className="shrink-0 w-5 h-5 rounded-sm border border-black/10 text-black/40 hover:text-black hover:border-black/30 flex items-center justify-center transition-colors"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>

      {/* ── Screen ────────────────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0D0D0D]">
        {showEmbed ? (
          <>
            <iframe
              ref={frameRef}
              src={embedUrl}
              title={`${title} — live website preview`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              className="absolute inset-0 w-full h-full border-0 bg-white"
            />
            {/* blocking probe overlay while we can't confirm the embed rendered */}
            {embedOk === null && (
              <div className="absolute inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/30 uppercase">Connecting…</span>
              </div>
            )}
          </>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} website preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top w-full transition-transform duration-[6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:translateY(calc(-100%_+_400px))]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
              <div className="w-6 h-6 border border-white/20" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-white/20 uppercase">[ NO PREVIEW ]</span>
          </div>
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
