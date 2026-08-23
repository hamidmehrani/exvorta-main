'use client'

import React, { useRef, useEffect } from 'react'
import type { gsap as GSAPType } from 'gsap'
import { useReducedMotion } from '@/lib/animations'

interface AnimatedHeadlineProps {
  text: string
  as?: React.ElementType
  className?: string
  delay?: number
}

// Lightweight React text splitter for GSAP
function splitText(text: string) {
  return text.split(' ').map((word, wordIndex) => (
    <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
      {word.split('').map((char, charIndex) => (
        <span
          key={charIndex}
          className="inline-block character"
          style={{ transformOrigin: '50% 100%' }}
        >
          {char}
        </span>
      ))}
    </span>
  ))
}

export function AnimatedHeadline({
  text,
  as: Component = 'h2',
  className = '',
  delay = 0,
}: AnimatedHeadlineProps) {
  const containerRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const node = containerRef.current
    if (prefersReducedMotion || !node) return
    let ctx: any;
    Promise.all([
      import('gsap').then(m => m.gsap || m.default),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger || m.default)
    ]).then(([gsap, ScrollTrigger]) => {
      if (!gsap || !ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger)

      const chars = node.querySelectorAll('.character')
      
      ctx = gsap.context(() => {
        gsap.fromTo(
          chars,
          {
            y: '100%',
            opacity: 0,
            rotateX: -90,
          },
          {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: {
              each: 0.02,
            },
            delay,
            scrollTrigger: {
              trigger: node,
              start: 'top 85%',
            },
          }
        )
      })
    })

    return () => {
      ctx?.revert()
    }
  }, [prefersReducedMotion, delay])

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>
  }

  return (
    <Component
      ref={containerRef}
      className={`${className} overflow-hidden`}
      style={{ perspective: '1000px' }}
    >
      {splitText(text)}
    </Component>
  )
}

export default AnimatedHeadline;
