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
  { ssr: false, loading: () => <div className="h-[644px] md:h-[608px]" aria-hidden="true" /> },
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
      <section className="on-dark relative isolate flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-obsidian px-6 py-40 text-center" id="hero">
        <div aria-hidden className="bg-blueprint-grid-dark pointer-events-none absolute inset-0 -z-10" />
        {/* ambient aura — a gradient, not a 130px blur filter (far cheaper to paint) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_38%,color-mix(in_oklab,var(--color-emerald)_9%,transparent),transparent_70%)]"
        />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
          <span style={rise(0)} className="rise eyebrow eyebrow-dark mb-10">
            {props.eyebrow || '[ THE EXVORTA IDENTITY ]'}
          </span>
          <h1
            style={rise(1)}
            className="rise mx-auto mb-10 max-w-5xl font-serif text-display font-semibold text-white"
            dangerouslySetInnerHTML={{ __html: props.headline || 'We Engineer Digital Gravity.<br/><span class="text-white/60">For the World\'s Most Demanding Trade Entities.</span>' }}
          />
          <p style={rise(2)} className="rise mx-auto mt-6 max-w-2xl font-sans text-lede font-light text-muted-dark">
            {props.subheadline || 'Exvorta is a boutique digital architecture firm. We exist strictly to close the credibility gap between your monumental physical trading velocity and your online infrastructure.'}
          </p>
          <div style={rise(3)} className="rise eyebrow eyebrow-dark mt-16">[ DUBAI · GLOBAL REACH ]</div>
        </div>
      </section>
    )
  }

  if (isWebHero) {
    return (
      <section className="rails relative isolate flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_55%_65%_at_50%_0%,color-mix(in_oklab,var(--color-emerald)_14%,transparent),transparent_72%)]" />
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>
        {/* Status Pill */}
        <div style={rise(0)} className="rise relative z-10 mb-10 inline-flex items-center justify-center rounded-full border border-rule-strong bg-surface/70 px-3.5 py-1.5 font-mono text-label uppercase text-muted">
          <span className="me-2.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" aria-hidden />
          [ {unbracket(props.eyebrow) || 'EXVORTA WEB'} ]
        </div>

        {/* Monumental Headline */}
        <h1
          style={rise(1)}
          className="rise relative z-10 mb-8 font-serif text-display font-semibold"
          dangerouslySetInnerHTML={{ __html: props.headline || '<span class="block text-obsidian">High-Performance Websites.</span>\n<span class="block text-obsidian/80">For Global Traders.</span>' }}
        />

        {/* Strategic Sub-headline */}
        <p style={rise(2)} className="rise relative z-10 mb-12 max-w-2xl font-sans text-lede font-light text-muted">
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
          <div className="mx-auto flex max-w-4xl items-center justify-between font-mono text-label uppercase text-muted">
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
      <section className="rails relative isolate overflow-hidden pb-16 pt-24 md:pb-24 md:pt-28" data-purpose="hero-section">
        {/* Ambient background: emerald aura + visible blueprint grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_55%_65%_at_50%_0%,color-mix(in_oklab,var(--color-emerald)_16%,transparent),transparent_72%)]" />
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>

        {/* Survey strip: coordinates + reach, blueprint-style (decorative) */}
        <div
          aria-hidden
          style={rise(0)}
          className="rise container-site mb-12 hidden items-center justify-between font-mono text-label uppercase text-muted lg:flex"
        >
          <span className="flex items-center gap-3">
            <span className="h-px w-8 bg-rule-strong" />
            25.2048° N · 55.2708° E
          </span>
          <span className="flex items-center gap-3">
            GCC · Europe · Global
            <span className="h-px w-8 bg-rule-strong" />
          </span>
        </div>

        {/* Same 24px mobile gutter as .container-site so the hero lines up with every section below it. */}
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
          {/* Hero Content */}
          <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
            <div style={rise(0)} className="rise mb-8 inline-flex items-center justify-center rounded-full border border-rule-strong bg-surface/70 px-3.5 py-1.5 font-mono text-label uppercase text-muted">
              <span className="me-2.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" aria-hidden />
              [ {unbracket(props.eyebrow) || 'ENGINE V1.0 LIVE'} ]
              <CaretBlink className="!h-[0.9em] !w-[0.5em]" />
            </div>
            <StaggerText
              as="h1"
              text={headline}
              stagger={0.07}
              delay={0.05}
              duration={0.8}
              className="mb-8 font-serif text-display font-semibold text-obsidian"
            />
            {/* The LCP element: deliberately NOT animated so it paints with the first frame. */}
            <p className="mx-auto mb-10 max-w-2xl text-lede font-light text-muted">
              {props.subheadline || 'Websites that make institutional buyers take you seriously — built for exporters who compete on trust, not price. See the proof: three live deployments, one standard.'}
            </p>
            <div style={rise(3)} className="rise flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton className="w-full max-w-[18rem] sm:w-auto">
                <Link className="btn-primary min-h-[52px] w-full px-9 py-4 sm:w-auto" href={ctaHref}>
                  {props.primaryCTA?.label || '[ START YOUR PROJECT ]'}
                </Link>
              </MagneticButton>
              <Link className="btn-ghost min-h-[52px] w-full max-w-[18rem] px-9 py-4 sm:w-auto" href="/portfolio">
                [ SEE THE PROOF ]
              </Link>
            </div>
            <ul
              style={rise(4)}
              className="rise mx-auto mt-14 grid max-w-3xl grid-cols-1 border-y border-rule sm:grid-cols-3"
            >
              {[
                { value: '03', label: 'Live deployments' },
                { value: '<1s', label: 'Global load' },
                { value: '100%', label: 'CMS you own' },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline justify-center gap-3 border-b border-rule px-4 py-4 last:border-b-0 sm:flex-col sm:items-center sm:gap-1.5 sm:border-b-0 sm:border-e sm:last:border-e-0"
                >
                  <span className="font-serif text-title font-semibold leading-none text-obsidian">{item.value}</span>
                  <span className="eyebrow">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Dashboard Preview — crosshair-framed product window */}
          <div className="frame mx-auto max-w-[1400px]">
            <Scanline>
              <ExvortaOsPanel prefersReducedMotion={prefersReducedMotion} />
            </Scanline>
          </div>
        </div>
      </section>

      {/* Reach strip */}
      <div className="border-y border-rule bg-surface" data-purpose="social-proof-anchor">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-7 text-center md:flex-row md:text-start">
          <p className="eyebrow max-w-xl !leading-relaxed">
            Elevating digital infrastructure for modern trading firms across the GCC and Europe.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-label uppercase text-obsidian" aria-label="Regions served">
            {['MENA & Gulf', 'Europe & UK', 'Asia Pacific'].map((region) => (
              <li key={region} className="flex items-center gap-2.5">
                <span className="h-1 w-1 rotate-45 bg-emerald" aria-hidden />
                {region}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HeroBlock
