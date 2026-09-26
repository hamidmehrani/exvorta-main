'use client'

import React from 'react'
import BrowserFrame from './BrowserFrame'

export interface LiveWebsiteFrameProps {
  title: string
  imageUrl?: string
  /** Live site URL for the "open live" affordance (never embedded). */
  liveUrl?: string
  industry?: string
  volume?: string
  service?: string
  slug?: string
  /** Kept for API compatibility. */
  live?: boolean
  /** Extra classes for the outer wrapper */
  className?: string
  priority?: boolean
}

/**
 * LiveWebsiteFrame
 *
 * Portfolio card presentation: the canonical BrowserFrame with a meta
 * ledger beneath the screen (industry / volume / service). The capture
 * drifts gently on hover; the real site is one click away.
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
  priority = false,
}: LiveWebsiteFrameProps) {
  const liveHref = liveUrl || (slug ? `https://${slug}.exvorta.com` : '')

  const metaRows = [
    { label: 'INDUSTRY', value: industry },
    { label: 'VOLUME', value: volume },
    { label: 'SERVICE', value: service },
  ].filter((r) => !!r.value)

  return (
    <BrowserFrame
      title={title}
      url={liveHref || undefined}
      imageUrl={imageUrl}
      tone="light"
      className={className}
      priority={priority}
      footer={
        metaRows.length > 0 ? (
          <div className="bg-white border-t border-black/5 px-4 py-3 space-y-1.5 font-mono text-[9px] uppercase tracking-widest">
            {metaRows.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-gray-400">
                <span>{label}</span>
                <span className="text-black font-medium truncate max-w-[70%]">{value}</span>
              </div>
            ))}
          </div>
        ) : undefined
      }
    />
  )
}

export default LiveWebsiteFrame
