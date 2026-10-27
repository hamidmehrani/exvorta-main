'use client'

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useMotionValue } from 'framer-motion'
import AppLink from '@/components/ui/AppLink'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import { InfraPoster } from '@/components/three/InfraPoster'
import { useStageMount } from '@/components/three/useStageMount'
import { STACK_MODULES, progressForModule } from '@/components/three/infra-stack-data'
import { useReducedMotion } from '@/lib/animations'

// three.js + R3F stay out of the main bundle and the server HTML: the poster
// SVG is the first paint, the canvas is mounted once the browser is idle.
const InfraStackCanvas = dynamic(() => import('@/components/three/InfraStackCanvas'), { ssr: false })

type RiseStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>
const rise = (i: number): RiseStyle => ({ '--i': i })

/** Where each stack module lives further down this page. */
const ANCHORS: Record<string, string> = {
  web: '#product-web',
  docs: '#product-docs',
  crm: '#product-crm',
  intel: '#product-intel',
  suite: '#ecosystem-vision',
}

/** Auto-advance interval for the module sweep. */
const AUTOPLAY_MS = 4200

interface EcosystemHeroProps {
  eyebrow: string
  title: string
  subtitle: string
  description: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

/**
 * /ecosystem hero — the module stack as an explorer. The stack opens once the
 * canvas is up, then lights each module in turn; tapping a tab takes over and
 * stops the autoplay. No scroll-coupling, so the page below reads normally.
 * Without WebGL (or under reduced motion) the poster stays and the tabs still
 * switch the read-out underneath.
 */
export function EcosystemHero({ eyebrow, title, subtitle, description, primary, secondary }: EcosystemHeroProps) {
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const progress = useMotionValue(0)
  const { mode, ready, onReady, onFail } = useStageMount()

  const [index, setIndex] = useState(-1)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Open the stack and light the first module once the first frame is up.
  useEffect(() => {
    if (!ready || reduced) return
    const id = window.setTimeout(() => setIndex((i) => (i < 0 ? 0 : i)), 900)
    return () => window.clearTimeout(id)
  }, [ready, reduced])

  // Autoplay sweep: only while visible, never under reduced motion, until the visitor takes over.
  useEffect(() => {
    if (!auto || !ready || reduced || !inView || index < 0) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % STACK_MODULES.length), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [auto, ready, reduced, inView, index])

  useEffect(() => {
    progress.set(index < 0 ? 0 : progressForModule(index))
  }, [index, progress])

  const pick = (i: number) => {
    setAuto(false)
    setIndex(i)
  }

  const current = index >= 0 ? STACK_MODULES[index] : null

  return (
    <section ref={section} id="ecosystem-hero" className="on-dark relative isolate overflow-hidden border-b border-rule-dark bg-obsidian">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-blueprint-grid-dark absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_62%_at_72%_46%,color-mix(in_oklab,var(--color-emerald)_20%,transparent),transparent_72%)]" />
      </div>

      <div className="container-site grid items-center gap-4 pb-6 pt-14 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:pb-10">
        <div className="lg:col-span-5">
          <p style={rise(0)} className="rise eyebrow eyebrow-dark mb-8 !leading-relaxed">
            <span className="eyebrow-index" aria-hidden>
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            {eyebrow}
          </p>
          <StaggerText
            as="h1"
            text={`${title} <br/> <span class="text-muted-dark">${subtitle}</span>`}
            unit="chars"
            stagger={0.024}
            duration={0.8}
            className="mb-8 max-w-xl font-serif text-headline font-semibold text-white"
          />
          {/* Static paint: the LCP text is never animated. */}
          <p className="mb-10 max-w-lg text-lede font-light text-muted-dark">{description}</p>
          <div style={rise(3)} className="rise flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <AppLink href={primary.href} className="btn-primary min-h-[52px] w-full whitespace-nowrap px-6 py-4 sm:w-auto sm:px-8">
              {primary.label}
            </AppLink>
            <AppLink href={secondary.href} className="btn-ghost min-h-[52px] w-full whitespace-nowrap px-6 py-4 sm:w-auto sm:px-8">
              {secondary.label}
            </AppLink>
          </div>
        </div>

        {/* 3D stage */}
        <div className="relative h-[440px] w-full sm:h-[520px] lg:col-span-7 lg:h-[620px]">
          <div
            aria-hidden
            style={rise(2)}
            className={`rise pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-[var(--ease-cinematic)] ${
              ready ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <InfraPoster className="h-[84%] w-auto max-w-full" />
          </div>
          {mode === 'webgl' && <InfraStackCanvas progress={progress} reduced={reduced} onReady={onReady} onFail={onFail} />}
        </div>
      </div>

      {/* Module explorer: tabs + read-out */}
      <div className="relative z-10 border-t border-rule-dark bg-obsidian/60">
        <div className="container-site">
          <ol aria-label="Exvorta modules" className="grid grid-cols-5 border-s border-rule-dark">
            {STACK_MODULES.map((m, i) => {
              const on = index === i
              return (
                <li key={m.key} className="relative border-e border-rule-dark">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`${m.name} — ${m.status}`}
                    onClick={() => pick(i)}
                    onFocus={() => setAuto(false)}
                    className={`block min-h-14 w-full px-3 py-4 text-start font-mono text-label uppercase transition-colors duration-300 hover:text-white motion-reduce:transition-none lg:px-4 ${
                      on ? 'text-success' : 'text-muted-dark'
                    }`}
                  >
                    <span className="block tabular-nums text-white/90">{m.index}</span>
                    <span className="mt-1.5 hidden truncate sm:block">{m.name}</span>
                  </button>
                  {/* Top rule: fills over the autoplay interval, solid once the visitor drives. */}
                  <span
                    key={on ? `on-${auto}` : 'off'}
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 -top-px h-px origin-left bg-success ${
                      on ? (auto && !reduced ? 'animate-[fill-x_4200ms_linear_forwards]' : 'scale-x-100') : 'scale-x-0'
                    }`}
                  />
                </li>
              )
            })}
          </ol>

          <div className="flex min-h-[7.5rem] flex-col justify-center gap-3 border-s border-rule-dark py-5 ps-5 sm:min-h-[5.5rem] sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <p className="eyebrow eyebrow-dark mb-2">
                {current ? (
                  <>
                    <span className="text-success">{current.index}</span> / {current.name} · {current.status}
                  </>
                ) : (
                  'Five modules · one operating layer'
                )}
              </p>
              <p className="text-sm font-light text-muted-dark">
                {current ? current.caption : 'Choose a module to see what it does.'}
              </p>
            </div>
            {current && (
              <AppLink
                href={ANCHORS[current.key]}
                className="group inline-flex shrink-0 items-center gap-3 self-start font-mono text-label uppercase text-success transition-[gap] duration-300 hover:gap-5 motion-reduce:transition-none sm:self-auto"
              >
                Open module
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 5v14m-6-6l6 6 6-6" />
                </svg>
              </AppLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EcosystemHero
