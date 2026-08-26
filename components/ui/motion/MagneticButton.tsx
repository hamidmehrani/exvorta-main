'use client'

import React, { useRef } from 'react'
import { m as motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion'
import { useReducedMotion } from '@/lib/animations'

interface MagneticButtonProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  className?: string
  /** Max pull distance in px. */
  strength?: number
}

/**
 * Magnetic hover effect: the element is pulled toward the cursor.
 * Uses MotionValues so mousemove causes zero React re-renders.
 */
export function MagneticButton({ children, className = '', strength = 14, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    x.set(((e.clientX - (left + width / 2)) / width) * strength * 2)
    y.set(((e.clientY - (top + height / 2)) / height) * strength * 2)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={prefersReducedMotion ? undefined : { x: sx, y: sy }}
      className={`inline-block ${className ?? ''}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default MagneticButton
