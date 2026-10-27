'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { SiteBuildPoster } from '@/components/three/SiteBuildPoster'
import { canRunWebGL } from '@/components/three/capability'
import { STAGE_LABELS, activeStep, stageFromProgress } from '@/components/three/site-build-data'
import { useReducedMotion } from '@/lib/animations'

// three.js stays out of the main bundle and the server HTML: the poster SVG is
// the first paint, the canvas is mounted when the section is near and the
// browser is idle.
const SiteBuildCanvas = dynamic(() => import('@/components/three/SiteBuildCanvas'), { ssr: false })

export interface ProcessStageStep {
  label: string
  title: string
  subtitle?: string
  description?: string
}

interface ProcessStageProps {
  steps: ProcessStageStep[]
  /** Section heading (server-rendered by ProcessBlock). */
  children: React.ReactNode
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Process section — a sticky 3D panel that builds one website (blueprint →
 * composed → extruded → deployed to edge nodes) while the CMS steps scroll past
 * beside it. Desktop: steps left, stage right. Mobile: stage sticks to the top,
 * steps scroll beneath it.
 */
export function ProcessStage({ steps, children }: ProcessStageProps) {
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const wide = useRef(false)

  const [mode, setMode] = useState<'poster' | 'webgl'>('poster')
  const [ready, setReady] = useState(false)
  const [near, setNear] = useState(false)
  const [active, setActive] = useState(0)
  const [stage, setStage] = useState(0)

  const count = steps.length
  const progress = useMotionValue(0)
  // The centre of the readable area: viewport middle on desktop, below the sticky stage on phones.
  const { scrollYProgress: wideProgress } = useScroll({ target: list, offset: ['start 50%', 'end 50%'] })
  const { scrollYProgress: narrowProgress } = useScroll({ target: list, offset: ['start 70%', 'end 70%'] })

  useMotionValueEvent(wideProgress, 'change', (v) => {
    if (wide.current) progress.set(v)
  })
  useMotionValueEvent(narrowProgress, 'change', (v) => {
    if (!wide.current) progress.set(v)
  })
  useMotionValueEvent(progress, 'change', (v) => {
    const a = activeStep(v, count)
    const st = Math.round(Math.min(3, Math.max(0, stageFromProgress(v, count))))
    setActive((prev) => (prev === a ? prev : a))
    setStage((prev) => (prev === st ? prev : st))
  })

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => {
      wide.current = mq.matches
      progress.set(mq.matches ? wideProgress.get() : narrowProgress.get())
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [progress, wideProgress, narrowProgress])

  // Only start loading the 3D chunk when the section is close to the viewport.
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '900px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near || !canRunWebGL()) return
    const start = () => setMode('webgl')
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(start, 500)
    return () => window.clearTimeout(id)
  }, [near])

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => {
    setReady(false)
    setMode('poster')
  }, [])

  return (
    <section ref={section} className="on-dark relative isolate w-full border-y border-rule-dark bg-obsidian" data-purpose="process">
      <div aria-hidden className="bg-blueprint-grid-dark pointer-events-none absolute inset-0 -z-10" />

      <div className="container-site pt-24 md:pt-32">{children}</div>

      <div className="container-site relative pb-16 lg:grid lg:grid-cols-12 lg:gap-8 lg:pb-24">
        {/* Sticky 3D stage — `contents` on phones so it sticks against the whole steps run */}
        <div className="contents lg:order-2 lg:col-span-7 lg:block">
          <div className="sticky top-0 z-20 h-[40svh] overflow-hidden border-b border-rule-dark bg-obsidian lg:z-0 lg:h-svh lg:border-b-0 lg:bg-transparent">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_58%_at_50%_52%,color-mix(in_oklab,var(--color-emerald)_18%,transparent),transparent_72%)]"
            />

            {/* Oversized step index, behind the object */}
            <div
              key={active}
              aria-hidden
              className="rise pointer-events-none absolute bottom-10 start-0 font-serif text-mega font-semibold leading-none text-white/[0.06] max-lg:hidden"
            >
              {pad(active + 1)}
            </div>

            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-[var(--ease-cinematic)] ${
                ready ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <SiteBuildPoster className="h-[78%] w-auto max-w-full" />
            </div>

            {mode === 'webgl' && <SiteBuildCanvas progress={progress} steps={count} reduced={reduced} onReady={handleReady} onFail={handleFail} />}

            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-1 pb-4 font-mono text-label uppercase lg:pb-8">
              <ol className="flex items-center gap-2.5">
                {steps.map((s, i) => (
                  <li
                    key={i}
                    className={`h-px transition-all duration-500 ease-[var(--ease-cinematic)] ${i === active ? 'w-14 bg-success' : 'w-8 bg-rule-dark'}`}
                  />
                ))}
              </ol>
              {/* The scene holds one still frame under reduced motion, so the stage tag would lie. */}
              {!reduced && (
                <p className="text-muted-dark">
                  [ <span className="text-success">{STAGE_LABELS[stage]}</span> ]
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div ref={list} className="relative z-10 lg:order-1 lg:col-span-5">
          {steps.map((step, i) => (
            <article
              key={i}
              data-active={active === i}
              className="flex min-h-[60svh] flex-col justify-center py-12 opacity-40 transition-opacity duration-500 ease-[var(--ease-cinematic)] data-[active=true]:opacity-100 lg:min-h-[90svh]"
            >
              <p className="eyebrow eyebrow-dark mb-6">
                <span className="eyebrow-index">{step.label}</span>
              </p>
              <h3 className="mb-4 font-serif text-title font-semibold text-white">{step.title}</h3>
              {step.subtitle && <h4 className="eyebrow eyebrow-dark mb-6 !text-white/80">{step.subtitle}</h4>}
              {step.description && <p className="max-w-md text-lede font-light text-muted-dark">{step.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessStage
