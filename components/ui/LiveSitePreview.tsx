'use client'

import React from 'react'
import LiveIframe from './LiveIframe'

export interface LiveSitePreviewProps {
  url: string
  title: string
  poster?: string
  /** 'standalone' renders the dark browser chrome + shadow frame; 'embedded' strips the outer frame for use inside a monitor bezel. */
  variant?: 'standalone' | 'embedded'
  className?: string
  aspectClass?: string
}

/**
 * LiveSitePreview
 *
 * The browser-chrome framed card used on case-study pages — now powered
 * by a real live iframe that smoothly auto-scrolls on hover instead of
 * a static screenshot pan.
 */
export function LiveSitePreview({
  url,
  title,
  poster,
  variant = 'standalone',
  className = '',
  aspectClass = 'aspect-[16/10]',
}: LiveSitePreviewProps) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const standalone = variant === 'standalone'

  return (
    <div
      className={`${standalone ? 'border border-black/20 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]' : ''} ${className}`}
    >
      {standalone && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FAFAF8] border-b border-black/10">
          <span className="font-mono text-[8px] tracking-[0.2em] text-black/30 uppercase truncate">{host}</span>
          <span className="flex-1" />
          <span className="flex items-center gap-1.5" aria-hidden>
            <span className="w-1 h-1 rounded-full bg-black/15" />
            <span className="w-1 h-1 rounded-full bg-black/15" />
            <span className="w-1 h-1 rounded-full bg-black/15" />
          </span>
        </div>
      )}
      <div className={`relative ${aspectClass} overflow-hidden group bg-[#0D0D0D]`}>
        {/* Capture layer is 2.5x the frame so the drift pans real page content;
            --scroll = 150% of frame height (60% of the 250% layer). */}
        <div
          className="lwframe-capture absolute inset-x-0 top-0"
          style={{ height: '250%', ['--scroll' as string]: '150%' }}
        >
          <LiveIframe url={url} title={title} poster={poster} />
        </div>
        {/* Live ribbon — bottom-left, appears on hover */}
        <a
          href={url}
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
      </div>
    </div>
  )
}

export default LiveSitePreview
