'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { CaretBlink } from '@/components/ui/terminal-motion'
import { InfraPoster } from '@/components/three/InfraPoster'
import { useStageMount } from '@/components/three/useStageMount'
import { STACK_MODULES, activeFromProgress } from '@/components/three/infra-stack-data'
import { useReducedMotion } from '@/lib/animations'
import { unbracket } from '@/lib/text'

// three.js + R3F stay out of the main bundle and the server HTML: the poster
// SVG is the first paint, the canvas is mounted once the browser is idle.
const InfraStackCanvas = dynamic(() => import('@/components/three/InfraStackCanvas'), { ssr: false })

type RiseStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>
const rise = (i: number): RiseStyle => ({ '--i': i })

interface HomeHeroStageProps {
  eyebrow?: string | null
  headline: string
  subheadline: string
  ctaHref: string
  ctaLabel: string
}

const STATS = [
  { value: '03', label: 'Live deployments' },
  { value: '<1s', label: 'Global load' },
  { value: '100%', label: 'CMS you own' },
] as const

/** Viewports that pin the stage. Mirrors the `pin:` variant in globals.css. */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 701px)'

/**
 * Home hero — "Blueprint Atlas". An obsidian stage with the Exvorta module
 * roadmap as a 3D exploded stack. On desktop the stage pins and scroll drives
 * the explode + a highlight sweep through the five modules; on mobile it is a
 * normal block and the sweep follows the scene through the viewport.
 */
export function HomeHeroStage({ eyebrow, headline, subheadline, ctaHref, ctaLabel }: HomeHeroStageProps) {
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const pinned = useRef(false)

  // Mount the canvas only when the page is idle and the device can take it.
  const { mode, ready, onReady: handleReady, onFail: handleFail } = useStageMount()
  const [active, setActive] = useState(-1)

  const progress = useMotionValue(0)
  const { scrollYProgress: pinnedProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const { scrollYProgress: inlineProgress } = useScroll({ target: scene, offset: ['start 85%', 'end 25%'] })

  useMotionValueEvent(pinnedProgress, 'change', (v) => {
    if (pinned.current) progress.set(v)
  })
  useMotionValueEvent(inlineProgress, 'change', (v) => {
    if (!pinned.current) progress.set(v)
  })
  useMotionValueEvent(progress, 'change', (v) => {
    const next = reduced ? -1 : activeFromProgress(v)
    setActive((prev) => (prev === next ? prev : next))
  })

  // Pinned (sticky) layout on tall desktop viewports, inline everywhere else.
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY)
    const sync = () => {
      pinned.current = mq.matches
      progress.set(mq.matches ? pinnedProgress.get() : inlineProgress.get())
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [progress, pinnedProgress, inlineProgress])

  const current = active >= 0 ? STACK_MODULES[active] : null

  return (
    <section
      ref={section}
      className="on-dark relative isolate bg-obsidian pin:h-[215svh]"
      data-purpose="hero-section"
    >
      <div className="relative flex min-h-svh flex-col overflow-hidden pin:sticky pin:top-0 pin:h-svh">
        {/* Backdrop: blueprint grid + an emerald aura behind the 3D stack */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-blueprint-grid-dark absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_62%_at_70%_52%,color-mix(in_oklab,var(--color-emerald)_20%,transparent),transparent_72%)]" />
        </div>

        {/* Copy */}
        <div className="container-site relative z-10 flex flex-1 flex-col pt-[calc(var(--header-h)+2rem)]">
          <div
            aria-hidden
            className="pointer-events-none absolute end-6 top-[calc(var(--header-h)+1.25rem)] hidden items-center gap-3 font-mono text-label uppercase text-muted-dark md:end-8 lg:flex"
          >
            25.2048° N · 55.2708° E
            <span className="h-px w-8 bg-rule-dark" />
            GCC · Europe · Global
          </div>
          <div className="grid flex-1 items-center lg:grid-cols-12">
            <div className="pb-2 pt-8 lg:col-span-6 lg:py-0">
              <div
                style={rise(0)}
                className="rise mb-8 inline-flex items-center rounded-full border border-rule-dark bg-white/5 px-3.5 py-1.5 font-mono text-label uppercase text-muted-dark"
              >
                <span className="me-2.5 h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden />
                [ {unbracket(eyebrow) || 'ENGINE V1.0 LIVE'} ]
                <CaretBlink className="!h-[0.9em] !w-[0.5em]" />
              </div>

              <StaggerText
                as="h1"
                text={headline}
                stagger={0.07}
                delay={0.05}
                duration={0.8}
                className="mb-8 max-w-3xl font-serif text-headline font-semibold text-white"
              />

              {/* The LCP element: deliberately NOT animated so it paints with the first frame. */}
              <p className="mb-10 max-w-xl text-lede font-light text-muted-dark">{subheadline}</p>

              <div style={rise(3)} className="rise flex flex-col gap-4 sm:flex-row">
                <MagneticButton className="w-full max-w-[18rem] sm:w-auto">
                  <Link className="btn-primary min-h-[52px] w-full px-9 py-4 sm:w-auto" href={ctaHref}>
                    {ctaLabel}
                  </Link>
                </MagneticButton>
                <Link className="btn-ghost min-h-[52px] w-full max-w-[18rem] px-9 py-4 sm:w-auto" href="/portfolio">
                  [ SEE THE PROOF ]
                </Link>
              </div>

              {/* Live read-out of the module the stack is highlighting */}
              <div
                style={rise(5)}
                className="rise mt-12 hidden min-h-[4.25rem] max-w-md border-s border-rule-dark ps-4 lg:block"
              >
                <p className="eyebrow eyebrow-dark mb-2.5">
                  {current ? (
                    <>
                      <span className="text-success">{current.index}</span> / {current.name} · {current.status}
                    </>
                  ) : (
                    'Five modules · one operating layer'
                  )}
                </p>
                <p className="text-sm font-light text-muted-dark">
                  {current ? current.caption : 'Scroll to open the stack and see what we are building.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D stage */}
        <div ref={scene} className="relative z-0 -mt-6 h-[460px] w-full lg:absolute lg:mt-0 lg:inset-y-0 lg:end-0 lg:h-auto lg:w-[60%]">
          <div
            aria-hidden
            style={rise(2)}
            className={`rise pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-[var(--ease-cinematic)] ${
              ready ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <InfraPoster className="h-[84%] w-auto max-w-full lg:-translate-x-[7%]" />
          </div>

          {mode === 'webgl' && <InfraStackCanvas progress={progress} reduced={reduced} onReady={handleReady} onFail={handleFail} />}

        </div>

        {/* Bottom bar: module index (lit by scroll) + proof points */}
        <div className="relative z-10 border-t border-rule-dark bg-obsidian/60">
          <div className="container-site grid lg:grid-cols-12">
            <ol aria-label="Exvorta modules" className="grid grid-cols-5 border-s border-rule-dark lg:col-span-8">
              {STACK_MODULES.map((m, i) => (
                <li
                  key={m.key}
                  aria-current={active === i ? 'true' : undefined}
                  className={`relative border-e border-rule-dark px-3 py-4 font-mono text-label uppercase transition-colors duration-300 lg:px-4 ${
                    active === i ? 'text-success' : 'text-muted-dark'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -top-px h-px origin-left bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] ${
                      active === i ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                  <span className="block tabular-nums text-white/90">{m.index}</span>
                  <span className="mt-1.5 hidden truncate sm:block">{m.name}</span>
                </li>
              ))}
            </ol>
            <ul className="grid grid-cols-3 border-t border-rule-dark lg:col-span-4 lg:border-t-0">
              {STATS.map((s) => (
                <li
                  key={s.label}
                  className="flex flex-col items-center justify-center gap-2 border-rule-dark px-2 py-4 text-center lg:items-start lg:border-e lg:px-5 lg:text-start lg:last:border-e-0"
                >
                  <span className="font-serif text-title font-semibold leading-none text-white">{s.value}</span>
                  <span className="eyebrow eyebrow-dark !leading-tight">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHeroStage
