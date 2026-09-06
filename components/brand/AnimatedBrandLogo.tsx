'use client'

import React, { useEffect, useRef, useState } from 'react'

const STYLE_ID = 'brand-logo-motion'
let styleInjected = false

const MOTION_CSS = `
@keyframes brand-logo-in{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes brand-logo-pop{0%{opacity:0;transform:scale(.3)}65%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
@keyframes brand-logo-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
.brand-logo-animated .bl-in,.brand-logo-animated .bl-pop,.brand-logo-animated .bl-pop-pulse{transform-box:fill-box;transform-origin:center}
.brand-logo-animated .bl-in{animation:brand-logo-in .7s cubic-bezier(.22,1,.36,1) both;animation-delay:var(--bl-delay,0s)}
.brand-logo-animated .bl-pop{animation:brand-logo-pop .55s cubic-bezier(.34,1.56,.64,1) both;animation-delay:var(--bl-delay,0s)}
.brand-logo-animated .bl-pop-pulse{animation:brand-logo-pop .55s cubic-bezier(.34,1.56,.64,1) both,brand-logo-pulse 3.4s ease-in-out infinite;animation-delay:var(--bl-delay,0s),calc(var(--bl-delay,0s) + .7s)}
@media (prefers-reduced-motion:reduce){.brand-logo-animated,.brand-logo-animated *{animation:none!important;transition:none!important}}
`

function ensureMotionStyles() {
  if (styleInjected || typeof document === 'undefined') return
  if (!document.getElementById(STYLE_ID)) {
    const tag = document.createElement('style')
    tag.id = STYLE_ID
    tag.textContent = MOTION_CSS
    document.head.appendChild(tag)
  }
  styleInjected = true
}

export interface AnimatedBrandLogoProps {
  /** Rendered box size in px */
  size?: number
  /** Enable entrance + loop animations (default true) */
  animated?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Shared animated wrapper for brand SVG logos.
 *
 * Usage inside children SVG:
 * - `.bl-in`  — fade/scale entrance (main shape)
 * - `.bl-pop` — springy pop entrance (rings/dots)
 * - `.bl-pop-pulse` — pop entrance + infinite subtle pulse (accent dot)
 * - stagger via inline style `--bl-delay` (e.g. '0.18s')
 *
 * All animation is pure CSS (transform/opacity), gated by IntersectionObserver
 * and prefers-reduced-motion. Without the `brand-logo-animated` class every
 * element renders fully visible (no-JS / SSR safe).
 */
export function AnimatedBrandLogo({
  size = 28,
  animated = true,
  className = '',
  children,
}: AnimatedBrandLogoProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    ensureMotionStyles()
  }, [])

  useEffect(() => {
    if (!animated) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [animated])

  useEffect(() => {
    if (!animated || reduced) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '60px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [animated, reduced])

  const play = animated && !reduced && inView

  return (
    <span
      ref={ref}
      className={`brand-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
    >
      <span
        aria-hidden="true"
        className={play ? 'brand-logo-animated' : undefined}
        style={{ display: 'inline-flex', width: size, height: size }}
      >
        {children}
      </span>
    </span>
  )
}

export default AnimatedBrandLogo
