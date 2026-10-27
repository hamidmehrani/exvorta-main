'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MutableRefObject, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { readStackColors } from './stack-colors'
import type { StackColors } from './stack-colors'

/** What a scene gets from its stage. */
export interface StageContext {
  colors: StackColors
  /** Phones / narrow canvases: fewer particles, lower DPR cap. */
  compact: boolean
  reduced: boolean
  /** Window-wide pointer, -1…1 (fine pointers only; stays 0 otherwise). Read in useFrame, never causes renders. */
  pointer: MutableRefObject<{ x: number; y: number }>
  /** Call once the first frame is on screen — the poster steps aside. */
  onReady: () => void
  /** Frame-time watchdog tripped — the stage lowers DPR. */
  onSlow: () => void
}

interface StageCanvasProps {
  reduced: boolean
  /** First frame drawn (fires once). */
  onReady: () => void
  /** WebGL context lost — keep showing the poster. */
  onFail: () => void
  camera?: { fov: number; position: [number, number, number] }
  /** The R3F scene. Rendered inside <Canvas>. */
  children: (ctx: StageContext) => ReactNode
  /** DOM drawn over the canvas (callouts, leader lines). Fades in with the first frame. */
  overlay?: ReactNode
}

/**
 * The single WebGL surface wrapper every 3D section on the site uses. Loaded
 * with next/dynamic (ssr:false) by its section, so three.js never touches the
 * main bundle or the server HTML.
 *
 * - draws only while on screen (IntersectionObserver → frameloop)
 * - DPR is capped and drops to 1 if the frame-time watchdog trips
 * - under prefers-reduced-motion it draws a still composition and never loops
 * - colours come from the design tokens (see stack-colors.ts)
 */
export default function StageCanvas({ reduced, onReady, onFail, camera, children, overlay }: StageCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const [colors] = useState<StackColors>(() => readStackColors())
  const [visible, setVisible] = useState(true)
  const [compact, setCompact] = useState(false)
  const [lowQuality, setLowQuality] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || compact || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, compact])

  const handleReady = useCallback(() => {
    setReady(true)
    onReady()
  }, [onReady])
  const handleSlow = useCallback(() => setLowQuality(true), [])

  const dprMax = lowQuality ? 1 : compact ? 1.5 : 1.75
  const cam = camera ?? { fov: 32, position: [0, 3, 10] as [number, number, number] }

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <div className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-cinematic)] ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas
          flat
          dpr={[1, dprMax]}
          frameloop={visible && !reduced ? 'always' : 'demand'}
          camera={{ fov: cam.fov, near: 0.1, far: 60, position: cam.position }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              onFail()
            })
          }}
        >
          {children({ colors, compact, reduced, pointer, onReady: handleReady, onSlow: handleSlow })}
        </Canvas>
        {overlay}
      </div>
    </div>
  )
}
