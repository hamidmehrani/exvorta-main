'use client'

import { useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import StageCanvas from './StageCanvas'
import InfraStackScene from './InfraStackScene'
import type { OverlayRefs } from './InfraStackScene'
import { STACK_MODULES } from './infra-stack-data'

interface InfraStackCanvasProps {
  progress: MotionValue<number>
  reduced: boolean
  /** First frame has been drawn — the poster can step aside. */
  onReady: () => void
  /** WebGL unavailable or the context was lost — keep showing the poster. */
  onFail: () => void
}

/** Hero stage: the module stack, its leader lines and its callout labels. */
export default function InfraStackCanvas({ progress, reduced, onReady, onFail }: InfraStackCanvasProps) {
  const overlay = useRef<OverlayRefs>({ lines: [], dots: [], labels: [] })

  return (
    <StageCanvas
      reduced={reduced}
      onReady={onReady}
      onFail={onFail}
      overlay={
        <>
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
        </>
      }
    >
      {(ctx) => <InfraStackScene {...ctx} progress={progress} overlay={overlay} />}
    </StageCanvas>
  )
}
