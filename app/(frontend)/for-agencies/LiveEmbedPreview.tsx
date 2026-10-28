'use client'

import React, { useEffect, useState } from 'react'

export function LiveEmbedPreview() {
  const [height, setHeight] = useState<number>(640)
  const [eventCount, setEventCount] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'rfq-embed-resize' && typeof event.data.height === 'number') {
        setHeight(event.data.height)
        setEventCount((prev) => prev + 1)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="border border-rule bg-surface overflow-hidden">
      {/* Mock Browser Header / Telemetry Bar */}
      <div className="px-4 py-3 bg-surface-2 border-b border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 me-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rule-strong inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-rule-strong inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-rule-strong inline-block" />
          </div>
          <span className="font-mono text-[11px] text-muted truncate">
            https://client-agency-portal.com/quote-request
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald bg-emerald/10 px-2.5 py-1 border border-emerald/20 uppercase tracking-widest font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            postMessage Active: {height}px
          </span>
          {eventCount > 0 && (
            <span className="font-mono text-[10px] text-muted border border-rule px-2 py-1 bg-surface hidden sm:inline-block">
              {eventCount} signal{eventCount === 1 ? '' : 's'}
              {lastUpdated ? ` (${lastUpdated})` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Embedded Iframe Container */}
      <div className="w-full bg-cream transition-[height] duration-200 ease-out">
        <iframe
          id="exvorta-rfq-cart"
          src="/rfq/embed?catalog=example"
          title="Exvorta RFQ Cart Widget Preview"
          style={{
            border: 'none',
            width: '100%',
            height: `${height}px`,
            overflow: 'hidden',
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 border-t border-rule bg-surface-2/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-muted text-start">
        <span>Target: id=&quot;exvorta-rfq-cart&quot;</span>
        <span className="text-emerald">Live auto-resizing via rfq-embed-resize protocol</span>
      </div>
    </div>
  )
}
