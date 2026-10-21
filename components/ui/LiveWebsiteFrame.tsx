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
  /** Preload the capture (above-the-fold cards). */
  priority?: boolean
  /** Extra classes for the outer wrapper */
  className?: string
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
  priority,
  className = '',
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
      priority={priority}
      className={className}
      footer={
        metaRows.length > 0 ? (
          <dl className="space-y-2 border-t border-rule bg-surface px-5 py-4 font-mono text-label uppercase">
            {metaRows.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 text-muted">
                <dt>{label}</dt>
                <dd className="max-w-[70%] truncate text-end font-medium text-obsidian">{value}</dd>
              </div>
            ))}
          </dl>
        ) : undefined
      }
    />
  )
}

export default LiveWebsiteFrame
