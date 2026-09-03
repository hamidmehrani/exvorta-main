'use client'

import React from 'react'

/**
 * CursorGlow — a soft accent light that trails the pointer on fine-pointer
 * devices. Disabled for touch, reduced-motion and small screens. Pointer
 * updates go straight to the DOM (no re-render per move).
 */
export default function CursorGlow() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = React.useState(false)

  React.useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    if (!fine || reduced || !wide) return
    setEnabled(true)

    let raf = 0
    let tx = -200
    let ty = -200
    let x = tx
    let y = ty

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      raf = 0
      // Lerp for a weighty, physical follow (8% per frame)
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`
      }
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        raf = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[400px] w-[400px] rounded-full opacity-[0.05]"
      style={{
        background: 'radial-gradient(circle, #00FF66 0%, transparent 60%)',
        willChange: 'transform',
      }}
    />
  )
}
