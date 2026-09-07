'use client'

import { useCallback, useRef } from 'react'

/**
 * useLiveScroll
 *
 * Cross-origin-safe hover-scroll controller for live preview iframes.
 * The framed site (any *.exvorta.com deployment with the preview-scroll
 * receiver script installed) listens for `exvorta:scroll` messages and
 * animates its own window with a rAF ease-in-out — native rendering,
 * no CSS hacks, no image captures, no bugs.
 */
export function useLiveScroll(url?: string) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const hoveredRef = useRef(false)
  const loadedRef = useRef(false)

  const send = useCallback(
    (y: number | 'bottom', duration: number) => {
      const win = frameRef.current?.contentWindow
      if (!win || !url) return
      try {
        win.postMessage({ type: 'exvorta:scroll', y, duration }, new URL(url).origin)
      } catch {
        /* invalid URL — silently ignore */
      }
    },
    [url],
  )

  const scrollIn = useCallback(() => {
    hoveredRef.current = true
    if (loadedRef.current) send('bottom', 7000)
  }, [send])

  const scrollOut = useCallback(() => {
    hoveredRef.current = false
    if (loadedRef.current) send(0, 4000)
  }, [send])

  const markLoaded = useCallback(() => {
    loadedRef.current = true
    // If the pointer was already over the card before load finished,
    // honour the intent instead of leaving the frame stuck at the top.
    if (hoveredRef.current) send('bottom', 7000)
  }, [send])

  return { frameRef, scrollIn, scrollOut, markLoaded }
}
