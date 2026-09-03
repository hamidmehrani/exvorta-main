'use client'

/**
 * Exvorta terminal motion kit — "System Scan"
 * ──────────────────────────────────────────────────────────────────────
 * The Exvorta identity is an operating system for traders. These primitives
 * make surfaces feel like monitored hardware: a scanline sweeps a panel once
 * on entry, data blocks boot with a flicker, and status rows decode via
 * MonoLabel. Monochrome green (#00FF66) accents only.
 */

import React, { useEffect, useState, useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'

/**
 * Scanline — a single green line sweeps top→bottom across the wrapped panel
 * once when it enters the viewport. Subtle (opacity 0.15); purely decorative.
 */
export function Scanline({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      {inView && !reduced && (
        <m.span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,255,102,0.55), transparent)',
            boxShadow: '0 0 12px 1px rgba(0,255,102,0.25)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: ['0%', '100%'], opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.1, ease: 'easeInOut', times: [0, 0.5, 1] }}
        />
      )}
    </div>
  )
}

/**
 * BootBlock — content flickers on like a CRT powering up: three rapid
 * opacity dips then solid. Use on stat panels / code blocks above the fold.
 */
export function BootBlock({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <m.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: [0, 1, 0.25, 1, 0.7, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay, times: [0, 0.2, 0.35, 0.55, 0.75, 1], ease: 'linear' }}
    >
      {children}
    </m.div>
  )
}

/**
 * CaretBlink — terminal caret for inline status text. Pure CSS animation;
 * respects reduced motion via media query in globals.
 */
export function CaretBlink({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`terminal-caret inline-block w-[0.55em] h-[1em] align-text-bottom ms-1 ${className}`}
    />
  )
}
