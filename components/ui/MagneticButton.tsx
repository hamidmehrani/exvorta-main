'use client'

import React, { useRef } from 'react'
import { m as motion, useMotionValue, useSpring, HTMLMotionProps } from "framer-motion"
import { useReducedMotion } from '@/lib/animations'

interface MagneticButtonProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  strength?: number
  /** Stretch to the container (form submit buttons) instead of shrink-wrapping. */
  fullWidth?: boolean
}

export function MagneticButton({
  children,
  className = '',
  strength = 20,
  fullWidth = false,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // MotionValues: mousemove causes zero React re-renders (perf).
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.35 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return

    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()

    x.set(((clientX - (left + width / 2)) / width) * strength)
    y.set(((clientY - (top + height / 2)) / height) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  if (prefersReducedMotion) {
    return <motion.div className={`${fullWidth ? 'block w-full' : ''} ${className}`} {...props}>{children}</motion.div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`relative ${fullWidth ? 'block w-full' : 'inline-block'} cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default MagneticButton;
