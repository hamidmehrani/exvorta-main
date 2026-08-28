'use client'

import React, { useRef } from 'react'
import { m as motion, useScroll, useSpring, useTransform } from 'framer-motion'

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  /** Max travel in px. Element drifts from +y to -y across the viewport. */
  speed?: number
}

/**
 * Scroll parallax driven by framer-motion useScroll (scrubbed via spring).
 * Zero re-renders: MotionValues pass straight to style.
 */
export function Parallax({ children, className = '', speed = 32 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Spring smooths the scrub for a weighted, premium feel
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 })
  const y = useTransform(smooth, [0, 1], [speed, -speed])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

export default Parallax
