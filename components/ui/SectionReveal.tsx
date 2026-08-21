'use client'

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
    gsap.registerPlugin(ScrollTrigger)

    const elements = containerRef.current.children
    if (!elements.length) return

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

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill()
      })
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
