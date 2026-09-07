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
 * An editorial, architectural presentation of a deployed site — thin
 * hairline ink frame, quiet mono caption strip and a flat drafting-table
 * stand. Matches the brand's Swiss B&W design language: no gloss, no
 * glow, no consumer-hardware theatrics.
 */
export function MonitorFrame({ url, title, poster, className = '' }: MonitorFrameProps) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className={`select-none ${className}`}>
      {/* Caption strip — above the frame, like a drawing index */}
      <div className="flex items-center justify-between border-b border-black/15 pb-3 mb-6">
        <span className="font-mono text-[9px] tracking-[0.3em] text-black/40 uppercase">
          FIG. 01 — {title}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/visit inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-black/40 uppercase hover:text-black transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          LIVE ↗
        </a>
      </div>

      {/* Frame — flat hairline ink border, quiet shadow */}
      <div className="relative border border-black/20 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] group">
        {/* Minimal chrome bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/10 bg-[#FAFAF8]">
          <span className="font-mono text-[8px] tracking-[0.2em] text-black/30 uppercase truncate">
            {host}
          </span>
          <span className="flex-1" />
          <span className="flex items-center gap-1.5" aria-hidden>
            <span className="w-1 h-1 rounded-full bg-black/15" />
            <span className="w-1 h-1 rounded-full bg-black/15" />
            <span className="w-1 h-1 rounded-full bg-black/15" />
          </span>
        </div>

        {/* Screen — static, calm live view */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0D0D0D]">
          <LiveSitePreview url={url} title={title} poster={poster} variant="embedded" />
        </div>
      </div>

      {/* Stand — two quiet drafting lines */}
      <div className="mx-auto w-px h-10 bg-black/25" aria-hidden />
      <div className="mx-auto w-40 h-px bg-black/25" aria-hidden />
    </div>
  )
}

export default MonitorFrame
