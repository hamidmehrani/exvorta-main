'use client'

import React, { useRef } from 'react'
import { m as motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  /** Max tilt in degrees. */
  maxTilt?: number
  /** Show an emerald glow border on hover. */
  glow?: boolean
}

/**
 * 3D tilt card driven by framer-motion MotionValues (no React re-renders).
 * Disabled automatically for touch/coarse pointers via CSS media queries.
 */
export function TiltCard({ children, className = '', maxTilt = 8, glow = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const spring = { stiffness: 200, damping: 25, mass: 0.5 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)

  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt])
  const glowX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glowY = useTransform(sy, [0, 1], ['0%', '100%'])
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]: string[]) =>
      `radial-gradient(400px circle at ${x} ${y}, rgba(5,150,105,0.08), transparent 65%)`,
  )

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="group/tilt [perspective:1200px]">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative transition-shadow duration-300 group-hover/tilt:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ${
          glow ? 'group-hover/tilt:ring-1 group-hover/tilt:ring-emerald' : ''
        } ${className ?? ''}`}
      >
        {children}
        {glow && !prefersReducedMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
            style={{ background: glowBackground }}
          />
        )}
      </motion.div>
    </div>
  )
}

export default TiltCard
