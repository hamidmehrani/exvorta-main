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
      <div className="mb-6 flex items-center justify-between border-b border-rule-strong pb-3">
        <span className="eyebrow">FIG. 01 — {title}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow group/visit transition-colors hover:text-obsidian"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" aria-hidden />
          LIVE ↗
        </a>
      </div>

      {/* Crosshairs sit on the frame itself, clear of the caption strip. */}
      <div className="frame">
        <BrowserFrame title={title} url={url} imageUrl={poster} tone="light" />
      </div>
    </div>
  )
}

export default MonitorFrame
