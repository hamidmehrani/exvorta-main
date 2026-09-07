'use client'

import React from 'react'
import LiveSitePreview from './LiveSitePreview'

export interface MonitorFrameProps {
  url: string
  title: string
  poster?: string
  className?: string
}

/**
 * MonitorFrame
 *
 * A professional desktop-monitor presentation: slim dark bezel, brushed
 * stand, weighted base, ambient screen glow and a soft desk reflection.
 * The screen renders a live, hover-scrollable view of the deployed site.
 */
export function MonitorFrame({ url, title, poster, className = '' }: MonitorFrameProps) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className={`select-none ${className}`}>
      <div className="relative">
        {/* Ambient screen glow */}
        <div aria-hidden className="absolute -inset-8 bg-black/25 blur-3xl rounded-[48px] -z-10" />

        {/* Bezel */}
        <div className="relative rounded-[16px] bg-gradient-to-b from-[#1E1E1E] to-[#0B0B0B] p-[10px] ring-1 ring-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]">
          {/* Screen */}
          <div className="relative rounded-[9px] overflow-hidden bg-black ring-1 ring-black/70">
            <LiveSitePreview url={url} title={title} poster={poster} variant="embedded" />
          </div>

          {/* Chin */}
          <div className="h-8 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
            <span className="font-mono text-[8px] tracking-[0.35em] text-white/25 uppercase truncate">
              {host} — LIVE
            </span>
          </div>
        </div>

        {/* Stand */}
        <div className="mx-auto w-28 h-14 [clip-path:polygon(22%_0,78%_0,100%_100%,0_100%)] bg-gradient-to-b from-[#161616] to-[#0A0A0A]" />
        <div className="mx-auto w-60 h-[10px] rounded-full bg-[#0E0E0E] ring-1 ring-white/10 shadow-[0_24px_40px_-14px_rgba(0,0,0,0.7)]" />

        {/* Desk reflection */}
        <div
          aria-hidden
          className="mx-auto mt-3 h-24 w-3/4 bg-gradient-to-b from-white/[0.06] to-transparent blur-md [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        />
      </div>
    </div>
  )
}

export default MonitorFrame
