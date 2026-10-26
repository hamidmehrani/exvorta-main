'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import InfraStackScene from './InfraStackScene'
import type { OverlayRefs } from './InfraStackScene'
import { STACK_MODULES } from './infra-stack-data'
import { readStackColors } from './stack-colors'
import type { StackColors } from './stack-colors'

interface InfraStackCanvasProps {
  progress: MotionValue<number>
  reduced: boolean
  /** First frame has been drawn — the poster can step aside. */
  onReady: () => void
  /** WebGL unavailable or the context was lost — keep showing the poster. */
  onFail: () => void
}

/**
 * The only WebGL surface on the site. Loaded with next/dynamic (ssr:false) from
 * HomeHeroStage, so three.js never touches the main bundle or the server HTML.
 *
 * - renders only while on screen (IntersectionObserver → frameloop)
 * - DPR is capped and drops to 1 if the frame-time watchdog trips
 * - under prefers-reduced-motion it draws a still composition and never loops
 */
export default function InfraStackCanvas({ progress, reduced, onReady, onFail }: InfraStackCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const overlay = useRef<OverlayRefs>({ lines: [], dots: [], labels: [] })

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

  // Window-wide pointer parallax (fine pointers only; the scene reads the ref, no re-renders).
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

  const dprMax = lowQuality ? 1 : compact ? 1.5 : 1.75

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <div className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-cinematic)] ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas
          flat
          dpr={[1, dprMax]}
          frameloop={visible && !reduced ? 'always' : 'demand'}
          camera={{ fov: 32, near: 0.1, far: 60, position: [0, 3, 10] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              onFail()
            })
          }}
        >
          <InfraStackScene
            colors={colors}
            progress={progress}
            pointer={pointer}
            overlay={overlay}
            reduced={reduced}
            compact={compact}
            onReady={handleReady}
            onSlow={() => setLowQuality(true)}
          />
        </Canvas>

        {/* Leader lines — positions are written by the scene every frame. */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {STACK_MODULES.map((m, i) => (
            <g key={m.key}>
              <line
                ref={(el) => { overlay.current.lines[i] = el }}
                strokeWidth={1}
                className={m.live ? 'stroke-success/70' : 'stroke-white/30'}
                style={{ opacity: 0 }}
              />
              <circle
                ref={(el) => { overlay.current.dots[i] = el }}
                r={2.5}
                className={m.live ? 'fill-success' : 'fill-white/70'}
                style={{ opacity: 0 }}
              />
            </g>
          ))}
        </svg>

        {/* Callout labels — translated into place by the scene. */}
        {STACK_MODULES.map((m, i) => (
          <div
            key={m.key}
            ref={(el) => { overlay.current.labels[i] = el }}
            data-active="false"
            style={{ opacity: 0 }}
            className="group absolute start-0 top-0 flex w-[168px] items-start gap-3 font-mono text-label uppercase text-muted-dark will-change-transform data-[active=true]:text-success max-md:w-12"
          >
            <span className="tabular-nums text-white/90 group-data-[active=true]:text-success">{m.index}</span>
            <span className="flex flex-col gap-1.5 max-md:hidden">
              <span>{m.name}</span>
              <span className="flex items-center gap-1.5 text-muted-dark group-data-[active=true]:text-success">
                {m.live && <span className="h-1 w-1 rotate-45 bg-success" />}
                {m.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
