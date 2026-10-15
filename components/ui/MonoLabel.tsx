'use client'

import React, { useEffect, useRef } from 'react'

export interface MonoLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  as?: React.ElementType
}

const GLYPHS = '░▒▓█▄▀+*&^%$#@!'
const DURATION = 420

/**
 * Blueprint label. Plain string labels "decode" once as they scroll into view
 * (design system: status rows decode via MonoLabel).
 *
 * The effect rewrites the existing text node's value from requestAnimationFrame,
 * so React never re-renders per frame and no animation library is loaded. (It
 * used to pull GSAP + ScrollTrigger into every page and call setState on every
 * tick for every label.) The server HTML always contains the real text.
 */
export function MonoLabel({ children, as: Component = 'div', className = '', ...props }: MonoLabelProps) {
  const ref = useRef<HTMLElement>(null)
  const original = typeof children === 'string' ? children : ''

  useEffect(() => {
    const el = ref.current
    const node = el?.firstChild
    if (!el || !original || node?.nodeType !== Node.TEXT_NODE) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const text = node as Text
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION)
        const revealed = Math.floor(progress * original.length)
        text.nodeValue =
          progress >= 1
            ? original
            : original
                .split('')
                .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
                .join('')
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect()
          run()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      text.nodeValue = original
    }
  }, [original])

  return (
    <Component ref={ref} className={`mono-label ${className}`} suppressHydrationWarning {...props}>
      {children}
    </Component>
  )
}

export default MonoLabel
