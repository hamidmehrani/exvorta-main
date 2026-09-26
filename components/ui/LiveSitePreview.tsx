'use client'

import React from 'react'
import BrowserFrame from './BrowserFrame'

export interface LiveSitePreviewProps {
  url: string
  title: string
  poster?: string
  priority?: boolean
  /** Kept for API compatibility — both variants render the canonical frame. */
  variant?: 'standalone' | 'embedded'
  className?: string
  aspectClass?: string
}

/**
 * LiveSitePreview
 *
 * The case-study hero frame. Presents the deployed site inside the
 * canonical BrowserFrame (dark tone for dark page sections) running a
 * full-length page capture that drifts gently on hover — deterministic,
 * no iframe jank, one click to the real thing.
 */
export function LiveSitePreview({
  url,
  title,
  poster,
  priority = false,
  className = '',
  aspectClass = 'aspect-[16/10]',
}: LiveSitePreviewProps) {
  return (
    <BrowserFrame
      title={title}
      url={url}
      imageUrl={poster}
      priority={priority}
      tone="dark"
      aspectClass={aspectClass}
      className={className}
    />
  )
}

export default LiveSitePreview
