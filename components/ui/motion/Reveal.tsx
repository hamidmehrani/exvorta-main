'use client'

import React from 'react'
import { m } from 'framer-motion'
import { easings, useReducedMotion } from '@/lib/animations'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Seconds before the reveal starts. */
  delay?: number
  duration?: number
  y?: number
  /** Trigger once when scrolled into view. Defaults to true. */
  once?: boolean
}

export function Reveal({ children, className = '', delay = 0, duration = 0.6, y = 24, once = true }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <m.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: shouldReduceMotion ? 0.2 : duration, delay, ease: easings.cinematic }}
      className={className}
    >
      {children}
    </m.div>
  )
}

export default Reveal
