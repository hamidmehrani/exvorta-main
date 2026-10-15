'use client'
import React from 'react'
import type { Page } from '@/payload-types'
import Link from 'next/link'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useReducedMotion } from '@/lib/animations'
import { unbracket } from '@/lib/text'
import dynamic from 'next/dynamic'
import { Scanline } from '@/components/ui/terminal-motion'
import { CaretBlink } from '@/components/ui/terminal-motion'

// 638-line interactive panel below the fold: client-only + not part of the
// main bundle so the hero LCP stays fast. The placeholder reserves the
// panel's measured height (644px mobile / 608px ≥ md) so its arrival doesn't
// shove the footer around (that was the page's only layout shift).
const ExvortaOsPanel = dynamic(
  () => import('@/components/blocks/ExvortaOsPanel').then((mod) => mod.ExvortaOsPanel),
  { ssr: false, loading: () => <div className="mt-20 h-[644px] md:h-[608px]" aria-hidden="true" /> },
)

type HeroBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

type RiseStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>
/** Staggered above-the-fold entrance — CSS only (see .rise in globals.css). */
const rise = (i: number): RiseStyle => ({ '--i': i })

export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
  const prefersReducedMotion = useReducedMotion()

  const isWebHero = props.eyebrow?.includes('HIGH-PERFORMANCE') || props.headline?.includes('High-Performance') || props.eyebrow?.includes('WEBSITES')
  const isAboutHero = props.headline?.includes('Gravity') || props.eyebrow?.includes('IDENTITY') || props.headline?.includes('Digital Gravity')

  if (isAboutHero) {
    return (
      <section className="relative flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-obsidian px-6 py-40 text-center" id="hero">
        {/* ambient aura — a gradient, not a 130px blur filter (far cheaper to paint) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_38%,color-mix(in_oklab,var(--color-emerald)_9%,transparent),transparent_70%)]"
        />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
          <span style={rise(0)} className="rise mb-10 block font-mono text-[10px] uppercase tracking-[0.4em] text-white/60">
            {props.eyebrow || '[ THE EXVORTA IDENTITY ]'}
          </span>
          <h1
            style={rise(1)}
            className="rise mx-auto mb-10 max-w-5xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-[5.5rem]"
            dangerouslySetInnerHTML={{ __html: props.headline || 'We Engineer Digital Gravity.<br/><span class="text-white/60">For the World\'s Most Demanding Trade Entities.</span>' }}
          />
          <p style={rise(2)} className="rise mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/60 md:text-xl">
            {props.subheadline || 'Exvorta is a boutique digital architecture firm. We exist strictly to close the credibility gap between your monumental physical trading velocity and your online infrastructure.'}
          </p>
          <div style={rise(3)} className="rise mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">[ DUBAI · GLOBAL REACH ]</div>
        </div>
      </section>
    )
  }

  if (isWebHero) {
    return (
      <section className="relative mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
        {/* Status Pill */}
        <div style={rise(0)} className="rise relative z-10 mb-10 flex items-center gap-2 border border-black/5 bg-black/[0.03] px-4 py-1.5">
          <span className="inline-flex h-1.5 w-1.5 bg-emerald" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            {props.eyebrow || '[ EXVORTA WEB ]'}
          </span>
        </div>

        {/* Monumental Headline */}
        <h1
          style={rise(1)}
          className="rise relative z-10 mb-8 font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
          dangerouslySetInnerHTML={{ __html: props.headline || '<span class="block text-obsidian">High-Performance Websites.</span>\n<span class="block text-obsidian/80">For Global Traders.</span>' }}
        />

        {/* Strategic Sub-headline */}
        <p style={rise(2)} className="rise relative z-10 mb-12 max-w-2xl font-sans text-sm leading-relaxed text-muted md:text-base">
          {props.subheadline || 'We build high-performance websites that make global trading companies look like the serious players they are.'}
        </p>

        {/* Dual CTA Buttons */}
        <div style={rise(3)} className="rise relative z-10 mb-16 flex flex-col items-center gap-4 sm:flex-row">
          <Link className="btn-primary min-h-[48px] px-10 py-4 font-semibold" href={props.primaryCTA?.url || '/rfq'}>
            {props.primaryCTA?.label || '[ START YOUR PROJECT ]'}
          </Link>
          <Link className="btn-ghost min-h-[48px] px-10 py-4 font-semibold" href="/portfolio">
            [ VIEW RECENT PROJECTS ]
          </Link>
        </div>

        {/* Legal Micro-copy */}
        <div className="absolute inset-x-0 bottom-12 hidden px-6 sm:block">
          <div className="mx-auto flex max-w-4xl items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-obsidian/50">
            <span>[ ENGINEERED FOR SPEED ]</span>
            <span>[ GLOBAL B2B READY ]</span>
            <span>[ ON-TIME DELIVERY ]</span>
          </div>
        </div>
      </section>
    )
  }

  // Home hero
  const headline = props.headline || 'Digital Infrastructure<br/>for Global Traders'
  const ctaHref = props.primaryCTA?.url && props.primaryCTA.url !== '#' ? props.primaryCTA.url : '/rfq'

  return (
    <div className="w-full" data-purpose="hero">
      <section className="relative overflow-hidden pb-24 pt-32 md:pb-40" data-purpose="hero-section">
        {/* Ambient background: soft emerald aura + fine blueprint grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,color-mix(in_oklab,var(--color-emerald)_14%,transparent),transparent_72%)]" />
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="mx-auto mb-20 max-w-4xl text-center">
            <div style={rise(0)} className="rise mb-8 inline-flex items-center justify-center rounded-full border border-obsidian/10 bg-white/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
              <span className="me-2 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" aria-hidden />
              [ {unbracket(props.eyebrow) || 'ENGINE V1.0 LIVE'} ]
              <CaretBlink className="!h-[0.9em] !w-[0.5em]" />
            </div>
            <StaggerText
              as="h1"
              text={headline}
              stagger={0.07}
              delay={0.05}
              duration={0.8}
              className="mb-8 font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-obsidian md:text-7xl lg:text-[84px]"
            />
            {/* The LCP element: deliberately NOT animated so it paints with the first frame. */}
            <p className="mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-muted md:text-lg">
              {props.subheadline || 'Websites that make institutional buyers take you seriously — built for exporters who compete on trust, not price. See the proof: three live deployments, one standard.'}
            </p>
            <div style={rise(3)} className="rise">
              <MagneticButton>
                <Link className="btn-primary min-h-[48px] px-8 py-4" href={ctaHref}>
                  {props.primaryCTA?.label || '[ START YOUR PROJECT ]'}
                </Link>
              </MagneticButton>
            </div>
            <ul style={rise(4)} className="rise mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {['3 live deployments', '<1s global load', 'CMS you own'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rotate-45 bg-emerald" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Dashboard Preview */}
          <Scanline>
            <ExvortaOsPanel prefersReducedMotion={prefersReducedMotion} />
          </Scanline>
        </div>
      </section>
      <div className="flex justify-center py-12" data-purpose="social-proof-anchor">
        <p className="max-w-xl text-center font-sans text-xs uppercase leading-relaxed tracking-[0.2em] text-muted">
          Elevating digital infrastructure for modern trading firms across the GCC and Europe.
        </p>
      </div>
    </div>
  )
}

export default HeroBlock
