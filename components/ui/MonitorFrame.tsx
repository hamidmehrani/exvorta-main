'use client'

import React from 'react'
import BrowserFrame from './BrowserFrame'

export interface MonitorFrameProps {
  url: string
  title: string
  poster?: string
  className?: string
}

/**
 * MonitorFrame
 *
 * Editorial presentation of a deployed site on light sections: a quiet
 * drawing-index caption strip above the canonical BrowserFrame. No stands,
 * no bezels, no hardware theatrics — just the work, framed like a plate
 * in a design annual.
 */
export function MonitorFrame({ url, title, poster, className = '' }: MonitorFrameProps) {
  return (
    <div className={`select-none ${className}`}>
      {/* Caption strip — above the frame, like a drawing index */}
      <div className="flex items-center justify-between gap-3 border-b border-black/15 pb-3 mb-6">
        <span className="font-mono text-[9px] tracking-[0.15em] sm:tracking-[0.3em] text-black/40 uppercase truncate min-w-0">
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

      <BrowserFrame title={title} url={url} imageUrl={poster} tone="light" />
    </div>
  )
}

export default MonitorFrame
