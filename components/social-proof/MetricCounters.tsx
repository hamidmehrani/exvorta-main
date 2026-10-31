'use client'

import React from 'react'
import { CountUp } from '@/components/ui/CountUp'
import {
  defaultSocialProofConfig,
  type MetricCounterItem,
} from '@/lib/social-proof/social-proof-data'

export interface MetricCountersProps {
  items?: MetricCounterItem[]
  columns?: 2 | 3 | 4
  tone?: 'light' | 'dark'
  className?: string
}

export function MetricCounters({
  items = defaultSocialProofConfig.counters,
  columns = 4,
  tone = 'light',
  className = '',
}: MetricCountersProps) {
  if (!items || items.length === 0) {
    return null
  }

  const dark = tone === 'dark'

  const columnClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`w-full ${className}`}>
      <div className={`grid gap-px border ${dark ? 'border-rule-dark bg-rule-dark' : 'border-rule bg-rule'} ${columnClass}`}>
        {items.map((item) => {
          const formattedValue = `${item.prefix || ''}${item.value}${item.suffix || ''}`
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between p-6 sm:p-8 transition-colors ${
                dark
                  ? 'bg-charcoal/80 hover:bg-charcoal'
                  : 'bg-surface hover:bg-surface-2'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {item.placeholder ? (
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${dark ? 'text-muted-dark' : 'text-muted'}`}>
                    {item.placeholderLabel || '[BENCHMARK / TARGET]'}
                  </span>
                ) : (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald" />
                )}
              </div>

              <div className="mt-8">
                <div
                  className={`font-mono text-3xl sm:text-4xl font-semibold tabular-nums tracking-tight ${
                    dark ? 'text-white' : 'text-obsidian'
                  }`}
                >
                  <CountUp value={formattedValue} duration={1.8} />
                </div>
                <div
                  className={`mt-3 font-mono text-xs uppercase tracking-wider ${
                    dark ? 'text-muted-dark' : 'text-muted'
                  }`}
                >
                  {item.label}
                </div>
                {item.description && (
                  <p
                    className={`mt-2 text-xs font-light leading-relaxed ${
                      dark ? 'text-muted-dark/80' : 'text-muted'
                    }`}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetricCounters
