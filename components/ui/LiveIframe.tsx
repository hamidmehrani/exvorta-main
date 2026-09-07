'use client'

import React, { useEffect, useState } from 'react'

export interface LiveIframeProps {
  url: string
  title: string
  /** Poster image shown until the live document paints (avoids white flash). */
  poster?: string
  className?: string
}

/**
 * LiveIframe
 *
 * A real, live render of the deployed site inside a non-interactive
 * sandboxed iframe. Pointer events are disabled so card hover stays
 * stable; the frame presents a calm, static view of the site.
 */
export function LiveIframe({ url, title, poster, className = '' }: LiveIframeProps) {
  const [loaded, setLoaded] = useState(false)

  // Safety: if onLoad never fires (blocked, offline), fade the iframe in
  // anyway after a grace period so the poster never hides the frame forever.
  useEffect(() => {
    if (loaded) return
    const t = setTimeout(() => setLoaded(true), 8000)
    return () => clearTimeout(t)
  }, [loaded])

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#0D0D0D] ${className}`}
    >
      {poster && !loaded && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={poster}
          alt={`${title} preview`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      )}
      <iframe
        src={url}
        title={`${title} — live preview`}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full border-0 pointer-events-none select-none transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: '#0D0D0D' }}
      />
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  )
}

export default LiveIframe
