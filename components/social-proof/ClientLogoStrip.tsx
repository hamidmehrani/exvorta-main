'use client'

import React from 'react'
import { Marquee } from '@/components/ui/motion/Marquee'
import {
  defaultSocialProofConfig,
  type ClientLogoItem,
} from '@/lib/social-proof/social-proof-data'

export interface ClientLogoStripProps {
  items?: ClientLogoItem[]
  speed?: number
  pauseOnHover?: boolean
  tone?: 'light' | 'dark'
  className?: string
}

export function ClientLogoStrip({
  items = defaultSocialProofConfig.logos,
  speed = 30,
  pauseOnHover = true,
  tone = 'light',
  className = '',
}: ClientLogoStripProps) {
  if (!items || items.length === 0) {
    return null
  }

  const dark = tone === 'dark'

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <Marquee speed={speed} pauseOnHover={pauseOnHover} className="py-2">
        <div className="flex items-center gap-4 sm:gap-6 pe-4 sm:pe-6">
          {items.map((item) => {
            const isPlaceholder = item.placeholder || !item.logoUrl

            if (isPlaceholder) {
              return (
                <div
                  key={item.id}
                  className={`flex shrink-0 min-w-[240px] max-w-[280px] flex-col justify-between rounded border border-dashed px-4 py-3 transition-colors ${
                    dark
                      ? 'border-rule-dark bg-charcoal/40 hover:border-emerald/40'
                      : 'border-rule bg-surface/90 hover:border-emerald/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider">
                    <span className={dark ? 'text-muted-dark' : 'text-muted'}>
                      {item.placeholderLabel || `[ SLOT: ${item.name} ]`}
                    </span>
                    {item.tier && (
                      <span className="font-semibold text-emerald">
                        {item.tier}
                      </span>
                    )}
                  </div>
                  <div
                    className={`mt-1 truncate font-mono text-xs font-medium ${
                      dark ? 'text-white' : 'text-obsidian'
                    }`}
                  >
                    {item.name}
                  </div>
                  <div
                    className={`mt-0.5 truncate text-[10px] ${
                      dark ? 'text-muted-dark' : 'text-muted'
                    }`}
                  >
                    {item.industry}
                  </div>
                </div>
              )
            }

            return (
              <div
                key={item.id}
                className={`flex h-[72px] shrink-0 min-w-[180px] items-center justify-center rounded border px-6 py-3 transition-colors ${
                  dark
                    ? 'border-rule-dark bg-charcoal/40 hover:border-white/30'
                    : 'border-rule bg-surface hover:border-obsidian/30'
                }`}
              >
                {item.websiteUrl ? (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center opacity-80 transition-opacity hover:opacity-100"
                    title={item.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="max-h-8 max-w-[140px] object-contain filter grayscale transition-all hover:grayscale-0"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="max-h-8 max-w-[140px] object-contain filter grayscale transition-all hover:grayscale-0"
                    loading="lazy"
                  />
                )}
              </div>
            )
          })}
        </div>
      </Marquee>
    </div>
  )
}

export default ClientLogoStrip
