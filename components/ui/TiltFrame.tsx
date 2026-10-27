'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'

interface TiltFrameProps {
  children: ReactNode
  /** Maximum tilt in degrees at the edge of the frame. */
  max?: number
  className?: string
}

/**
 * Pointer-driven perspective tilt for a showcase frame. Fine pointers only
 * (touch, pen and reduced-motion users get the flat frame); the pose is written
 * as CSS variables so pointer moves never re-render React.
 */
export default function TiltFrame({ children, max = 4, className = '' }: TiltFrameProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const set = (rx: number, ry: number) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty('--rx', `${rx.toFixed(2)}deg`)
      ref.current?.style.setProperty('--ry', `${ry.toFixed(2)}deg`)
    })
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    set(-py * max * 2, px * max * 2)
  }

  return (
    <div className={`[perspective:1600px] ${className}`} onPointerMove={onMove} onPointerLeave={() => set(0, 0)}>
      <div
        ref={ref}
        className="transition-transform duration-500 ease-[var(--ease-cinematic)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:transition-none"
      >
        {children}
      </div>
    </div>
  )
}
