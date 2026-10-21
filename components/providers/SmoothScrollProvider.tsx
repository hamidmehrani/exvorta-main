'use client'

import { useEffect, type ReactNode } from 'react'

interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Lenis smooth scrolling, attached as a side effect.
 *
 * Children are rendered in a stable position on every render. (An earlier
 * version swapped between `<>{children}</>` and a dynamically-imported
 * `<ReactLenis>` wrapper, which unmounted the whole page after hydration and
 * re-mounted it once the chunk arrived — a blank flash plus every client
 * component booting twice.) Lenis is only worth its weight for a wheel on a
 * fine pointer, so touch devices and reduced-motion users never load it.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduced) return

    let cancelled = false
    let raf = 0
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null

    const start = () => {
      import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return
        lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
        const loop = (time: number) => {
          lenis?.raf(time)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
      })
    }

    // Not needed for first paint or first input — wait for an idle moment
    // (Safari has no requestIdleCallback, so fall back to a timer).
    const hasIdle = 'requestIdleCallback' in window
    const handle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200)

    return () => {
      cancelled = true
      if (hasIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      cancelAnimationFrame(raf)
      lenis?.destroy()
    }
  }, [])

  return <>{children}</>
}

export default SmoothScrollProvider
