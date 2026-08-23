'use client'

import React from 'react'
import { useReducedMotion } from '@/lib/animations'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: number // pixels per second
}

export function Marquee({ children, className = '', speed = 40 }: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion()

  // We use CSS animations for performance
  // Duration is calculated based on an arbitrary wide width (e.g., 1000px) divided by speed
  // A true robust implementation would measure the DOM node width, but for a simple component,
  // we can use a hardcoded duration or let CSS variables handle it.
  
  if (prefersReducedMotion) {
    return (
      <div className={`overflow-x-auto whitespace-nowrap flex gap-8 ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div className={`relative flex overflow-hidden group ${className}`}>
      <div 
        className="flex shrink-0 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${1000 / speed}s` }}
      >
        {children}
      </div>
      {/* Duplicate for seamless loop */}
      <div 
        className="flex shrink-0 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] absolute top-0"
        style={{ animationDuration: `${1000 / speed}s`, left: '100%' }}
      >
        {children}
      </div>
    </div>
  )
}

export default Marquee;
