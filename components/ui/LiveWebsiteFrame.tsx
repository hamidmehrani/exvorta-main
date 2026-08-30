'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface LiveWebsiteFrameProps {
  title: string
  imageUrl?: string
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
 * A portfolio card component that simulates a live website preview.
 * On hover, the screenshot "scrolls" downward to reveal the full page —
 * achieved via a CSS transform translateY on the image.
 *
 * Browser chrome: 3 traffic-light dots + "[ LIVE PREVIEW ]" mono label.
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
  const hasImage = !!imageUrl

  return (
    <div
      className={`relative flex flex-col overflow-hidden bg-[#0D0D0D] border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] group ${className}`}
    >
      {/* ── Browser Chrome ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F0EFED] border-b border-black/8 shrink-0">
        {/* Traffic lights */}
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] block" />
        {/* URL bar */}
        <div className="flex-1 mx-2 bg-white/70 rounded-sm px-2 py-0.5 flex items-center justify-center">
          <span className="font-mono text-[9px] tracking-[0.15em] text-black/40 uppercase">
            {slug ? `${slug}.com` : '[ LIVE PREVIEW ]'}
          </span>
        </div>
      </div>

      {/* ── Screenshot with scroll simulation ─────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0D0D0D]">
        {hasImage ? (
          <Image
            src={imageUrl!}
            alt={`${title} website preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top w-full transition-transform duration-[6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:translateY(calc(-100%_+_400px))]"
          />
        ) : (
          /* Branded placeholder when no image is available */
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
              <div className="w-6 h-6 border border-white/20" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-white/20 uppercase">
              [ NO PREVIEW ]
            </span>
          </div>
        )}
        {/* Hover scanline sweeping down over the preview */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/0 via-white/10 to-white/0 opacity-0 -translate-y-full group-hover:opacity-100 group-hover:animate-[framescan_2.4s_ease-in-out_infinite]" />
        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ── Meta strip ─────────────────────────────────────────────────────── */}
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
