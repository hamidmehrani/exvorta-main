'use client'

import React, { useRef, useEffect } from 'react'
import type { gsap as GSAPType } from 'gsap'
import { useReducedMotion } from '@/lib/animations'

interface SectionRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: React.ElementType
  staggerDelay?: number
  distance?: number
  duration?: number
}

export function SectionReveal({
  children,
  as: Component = 'section',
  className = '',
  staggerDelay = 0.1,
  distance = 60,
  duration = 0.8,
  ...props
}: SectionRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return
    let ctx: any;
    Promise.all([
      import('gsap').then(m => m.gsap || m.default),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger || m.default)
    ]).then(([gsap, ScrollTrigger]) => {
      if (!gsap || !ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger)

      const elements = containerRef.current!.children
      if (!elements.length) return

      ctx = gsap.context(() => {
        gsap.fromTo(
          elements,
          {
            y: distance,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration,
            ease: 'power3.out',
            stagger: staggerDelay,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
            },
          }
        )
      })
    })

    return () => {
      ctx?.revert()
    }
  }, [prefersReducedMotion, distance, duration, staggerDelay])

  if (prefersReducedMotion) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    )
  }

  return (
    <Component ref={containerRef} className={className} {...props}>
      {children}
    </Component>
  )
}

export default SectionReveal
