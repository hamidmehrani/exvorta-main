'use client'

import React, { useRef, useEffect } from 'react'
import { useReducedMotion } from '@/lib/animations'

interface GsapContext {
  revert: () => void
}

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  /** Max travel in px. Element drifts from +y to -y across the viewport. */
  speed?: number
}

/**
 * Scroll parallax driven by GSAP ScrollTrigger (scrubbed).
 * The only sanctioned use of GSAP in this codebase.
 */
export function Parallax({ children, className = '', speed = 32 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !ref.current || speed === 0) return
    let ctx: GsapContext | undefined
    let cancelled = false

    Promise.all([
      import('gsap').then(m => m.gsap || m.default),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger || m.default),
    ])
      .then(([gsap, ScrollTrigger]) => {
        if (cancelled || !gsap || !ScrollTrigger || !ref.current) return
        gsap.registerPlugin(ScrollTrigger)
        ctx = gsap.context(() => {
          gsap.fromTo(
            ref.current,
            { y: speed },
            {
              y: -speed,
              ease: 'none',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            },
          )
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [prefersReducedMotion, speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default Parallax
