'use client'

import React from 'react'
import { useReducedMotion } from '@/lib/animations'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  /** Scroll speed in pixels per second. */
  speed?: number
  /** Pause the scroll on hover (default true). */
  pauseOnHover?: boolean
}

/**
 * Infinite CSS marquee. Content is duplicated for a seamless loop.
 * Falls back to a static horizontally-scrollable row under reduced motion.
 */
export function Marquee({ children, className = '', speed = 40, pauseOnHover = true }: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className={`overflow-x-auto whitespace-nowrap flex gap-8 ${className}`}>{children}</div>
    )
  }

  const duration = `${1000 / speed}s`
  const playState = pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''

  return (
    <div className={`relative flex overflow-hidden group ${className}`}>
      <div
        aria-hidden={false}
        className={`flex shrink-0 animate-marquee whitespace-nowrap ${playState}`}
        style={{ animationDuration: duration }}
      >
        {children}
      </div>
      {/* Duplicate track positioned after the first for a seamless loop */}
      <div
        aria-hidden
        className={`flex shrink-0 animate-marquee whitespace-nowrap ${playState}`}
        style={{ animationDuration: duration }}
      >
        {children}
      </div>
    </div>
  )
}

export default Marquee
