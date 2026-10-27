import React from 'react'
import type { Project } from '@/payload-types'
import AppLink from '@/components/ui/AppLink'
import Image from 'next/image'
import BrowserFrame from '@/components/ui/BrowserFrame'
import CountUp from '@/components/ui/CountUp'
import SectionNav from '@/components/ui/SectionNav'
import TiltFrame from '@/components/ui/TiltFrame'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { getCaseStudy, CASE_STUDIES, type CaseStudyData } from '@/components/blocks/case-study-data'

/*
 * Case-study page. Obsidian ⇄ tinted rhythm, blueprint primitives throughout.
 *
 * Each project carries its own identity (accent + section tint). The accent is
 * set once on the page root as CSS variables and consumed through the
 * `accent` / `accent-ink` / `accent-lift` colour tokens:
 *   - accent       fills, rules, buttons, glows
 *   - accent-ink   small text on light/tinted surfaces (accent darkened to AA)
 *   - accent-lift  small text + numerals on obsidian (accent lifted to AA)
 */

// Payload `Projects` collection defaults. A value equal to the default means
// "never customised", so the case study's own theme must win.
const COLLECTION_DEFAULT_ACCENT = '#059669'
const COLLECTION_DEFAULT_TINT = '#FAFAF8'

type ThemeVars = React.CSSProperties & Record<`--${string}`, string>

function hexToRgb(value: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Relative luminance of the obsidian token — used to pick the legible label
// colour for an accent-filled button.
const OBSIDIAN_LUMINANCE = 0.004

function labelOnAccent(accent: string): 'text-obsidian' | 'text-white' {
  const rgb = hexToRgb(accent)
  if (!rgb) return 'text-white'
  const l = luminance(rgb)
  const withWhite = 1.05 / (l + 0.05)
  const withObsidian = (l + 0.05) / (OBSIDIAN_LUMINANCE + 0.05)
  return withObsidian >= withWhite ? 'text-obsidian' : 'text-white'
}

/** Section tints sit under obsidian text — a dark tint falls back to the default cream. */
function lightTint(value: string): string {
  const rgb = hexToRgb(value)
  return rgb && luminance(rgb) < 0.3 ? COLLECTION_DEFAULT_TINT : value
}

function pickThemeValue(known: boolean, cms: string | null | undefined, authoritative: string, collectionDefault: string) {
  const value = cms?.trim()
  if (!value) return authoritative
  if (known && value.toLowerCase() === collectionDefault.toLowerCase()) return authoritative
  return value
}

const rise = (i: number) => ({ '--i': i }) as React.CSSProperties

const LG_COLS: Record<number, string> = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

function Icon({ d, className = 'h-3 w-3' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d={d} />
    </svg>
  )
}
const ARROW_OUT = 'M7 17L17 7M7 7h10v10'
const ARROW_BACK = 'M19 12H5m6-6l-6 6 6 6'
const ARROW_NEXT = 'M5 12h14m-6-6l6 6-6 6'
const CHECK = 'M5 12.5l4.5 4.5L19 7.5'

/** The diamond-led blueprint label (same marker `SectionHeading` uses). */
function Eyebrow({ children, dark = false, className = '' }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <p className={`eyebrow ${dark ? 'eyebrow-dark' : ''} ${className}`}>
      <span className="eyebrow-index" aria-hidden>
        <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
      </span>
      {children}
    </p>
  )
}

export function ProjectThemedLayout({ project }: { project?: Project }) {
  const slug = project?.slug || 'spicevo'
  const known = getCaseStudy(slug)

  // Authoritative teardown data for known deployments; CMS fields override when set.
  const cs: CaseStudyData = known || {
    title: project?.title || 'Project',
    domain: `${slug}.exvorta.com`,
    url: `https://${slug}.exvorta.com`,
    tagline: project?.excerpt || 'Custom deployment by Exvorta.',
    category: 'Digital Infrastructure',
    excerpt: project?.excerpt || 'A precision-engineered web presence for global trade.',
    heroBg: project?.heroBgColor || COLLECTION_DEFAULT_TINT,
    accent: project?.accentColor || COLLECTION_DEFAULT_ACCENT,
    stats: [],
    certifications: [],
    products: [],
    metrics: [],
  }

  const accent = pickThemeValue(!!known, project?.accentColor, cs.accent, COLLECTION_DEFAULT_ACCENT)
  const tint = lightTint(pickThemeValue(!!known, project?.heroBgColor, cs.heroBg, COLLECTION_DEFAULT_TINT))
  const onAccent = labelOnAccent(accent)

  const theme: ThemeVars = {
    '--case-accent': accent,
    '--case-accent-ink': `color-mix(in oklab, ${accent} 62%, var(--color-obsidian))`,
    '--case-accent-lift': `color-mix(in oklab, ${accent} 55%, white)`,
    '--eyebrow-accent': 'var(--case-accent-ink)',
    '--eyebrow-accent-dark': 'var(--case-accent-lift)',
  }

  const cmsHero =
    project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url ? project.heroImage.url : null
  const capture = cmsHero || cs.capture || cs.heroImage

  const liveUrl = project?.liveUrl || cs.url
  const metrics: { label: string; value: string }[] =
    project?.metrics && project.metrics.length > 0
      ? project.metrics.map((mm) => ({ label: mm.label || '', value: mm.value || '' }))
      : cs.metrics
  const excerpt = project?.excerpt || cs.excerpt
  const liveName = cs.domain.replace('.exvorta.com', '').toUpperCase()

  const next = (() => {
    const keys = Object.keys(CASE_STUDIES)
    const idx = keys.findIndex((k) => slug.toLowerCase().includes(k))
    const nextKey = keys[(idx + 1 + keys.length) % keys.length] || keys[0]
    const entry = CASE_STUDIES[nextKey]
    return entry && entry.title !== cs.title ? { key: nextKey, ...entry } : null
  })()

  const chapters = [
    { id: 'the-brief', label: 'Brief' },
    ...(cs.products.length > 0 ? [{ id: 'what-we-shipped', label: 'Shipped' }] : []),
    { id: 'own-the-panel', label: 'Ownership' },
    { id: 'next-steps', label: 'Next steps' },
  ]
  const productCols = LG_COLS[Math.min(Math.max(cs.products.length, 1), 4)]
  const accentButton = `btn-primary min-h-[52px] w-full bg-accent px-6 py-4 sm:w-auto sm:px-10 ${onAccent}`

  return (
    <div className="bg-obsidian text-white" style={theme}>
      {/* ═══════════════ HERO: editorial split + live frame ═══════════════ */}
      <section className="on-dark relative isolate overflow-hidden border-b border-rule-dark bg-obsidian pb-24 pt-36 md:pb-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* Aura takes the project accent instead of the brand emerald. */}
          <div className="bg-aura-dark absolute inset-0" style={{ '--color-emerald': 'var(--case-accent)' } as ThemeVars} />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <div className="container-site">
          <div className="rise mb-12 flex flex-wrap items-center gap-x-6 gap-y-3" style={rise(0)}>
            <AppLink href="/portfolio" className="eyebrow eyebrow-dark gap-2 text-accent-lift transition-opacity hover:opacity-80">
              <Icon d={ARROW_BACK} />
              All case studies
            </AppLink>
            <span className="eyebrow eyebrow-dark">{cs.category}</span>
          </div>

          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Left: brand story */}
            <div className="flex flex-col lg:col-span-5">
              <div className="rise mb-8" style={rise(1)}>
                <Eyebrow dark>Case study — {cs.title}</Eyebrow>
              </div>
              <h1 className="rise font-serif text-display font-semibold text-white" style={rise(2)}>
                {cs.title}
              </h1>
              <p className="rise mt-6 font-serif text-title font-semibold text-accent-lift" style={rise(3)}>
                {cs.tagline}
              </p>
              <p className="rise mt-6 max-w-lg text-base font-light leading-relaxed text-muted-dark" style={rise(4)}>
                {excerpt}
              </p>

              {/* Live deployment CTA — the proof */}
              <div className="rise mt-10" style={rise(5)}>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={accentButton}>
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                  </span>
                  Visit live — {liveName}
                  <Icon d={ARROW_OUT} />
                </a>
              </div>

              {/* Metrics ledger */}
              {metrics.length > 0 && (
                <div className="rise frame frame-dark mt-14 w-full divide-y divide-rule-dark border border-rule-dark" style={rise(6)}>
                  {metrics.map((metric, i) => (
                    <div key={i} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <span className="eyebrow eyebrow-dark shrink-0">{metric.label}</span>
                      <span className="font-mono text-label uppercase text-white sm:text-end">{metric.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: browser-framed live capture */}
            <Reveal className="lg:col-span-7" y={32} duration={0.9} delay={0.15}>
              <TiltFrame>
                <div className="frame frame-dark">
                  <BrowserFrame title={cs.title} url={liveUrl} imageUrl={capture} tone="dark" priority />
                </div>
              </TiltFrame>
              <p className="eyebrow eyebrow-dark mt-8 flex justify-center text-center">
                Fig. 01 — Live deployment — {cs.domain}
              </p>
            </Reveal>
          </div>

          {/* Impact stats band */}
          {cs.stats.length > 0 && (
            <Reveal className="mt-24" y={24}>
              <div className="frame frame-dark grid grid-cols-1 divide-y divide-rule-dark border border-rule-dark md:grid-cols-3 md:divide-x md:divide-y-0">
                {cs.stats.map((s, i) => (
                  <div key={i} className="px-8 py-10 text-center md:py-12">
                    <div className="font-serif text-headline font-semibold text-accent-lift">
                      <CountUp value={s.value} duration={1.6} />
                    </div>
                    <p className="eyebrow eyebrow-dark mt-3">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <SectionNav label="On this page" tone="accent" items={chapters} />

      {/* ═══════════════ 01 · THE BRIEF — why they needed us ═══════════════ */}
      <section className="border-b border-rule py-24 text-obsidian md:py-32" style={{ backgroundColor: tint }} id="the-brief">
        <div className="container-site">
          <SectionHeading index="01" eyebrow="The brief" title={cs.brief?.headline || 'A commodity product. A non-commodity buyer.'} />

          <StaggerContainer className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16" staggerChildren={0.12} delayChildren={0.05}>
            <StaggerItem className="lg:col-span-5">
              <p className="text-lede font-light text-muted">
                {cs.brief?.intro ||
                  `${cs.title} competes in a market where every offer looks identical — same fairs, same price lists, same PDFs. The buyer's real question is never "what do you sell" but "can I trust this container to arrive exactly as specified."`}
              </p>
            </StaggerItem>
            <StaggerItem className="lg:col-span-7">
              <div className="frame grid grid-cols-1 border border-rule-strong bg-surface sm:grid-cols-2">
                <div className="border-b border-rule p-6 sm:border-b-0 sm:border-e md:p-8">
                  <p className="eyebrow mb-4">The problem</p>
                  <p className="text-base leading-relaxed text-muted">
                    {cs.brief?.problem ||
                      'Credibility gap: institutional buyers judged the company by a website that undersold its certifications, capacity, and compliance depth.'}
                  </p>
                </div>
                <div className="border-t-2 border-accent bg-accent/5 p-6 sm:border-t-0 sm:border-s-0 md:p-8">
                  <p className="eyebrow mb-4 text-accent-ink">The Exvorta answer</p>
                  <p className="text-base leading-relaxed text-obsidian">
                    {cs.brief?.answer ||
                      'A spec-grade web presence: every claim verifiable, every certificate one click away, every product documented like an architectural submittal.'}
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ 02 · WHAT WE SHIPPED — capabilities ═══════════════ */}
      {cs.products.length > 0 && (
        <section className="on-dark border-b border-rule-dark bg-obsidian py-24 md:py-32" id="what-we-shipped">
          <div className="container-site">
            <SectionHeading tone="dark" index="02" eyebrow="What we shipped" title="Built to close deals, not just to look good." />

            <StaggerContainer
              className={`frame mt-14 grid grid-cols-1 border-s border-t border-rule-dark md:grid-cols-2 ${productCols}`}
              staggerChildren={0.1}
              delayChildren={0.05}
            >
              {cs.products.map((p, i) => (
                <StaggerItem
                  key={i}
                  className={`group relative border-b border-e border-rule-dark bg-sidebar p-8 md:p-10 ${
                    cs.products.length % 2 === 1 && i === cs.products.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent-lift transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
                  <p className="eyebrow eyebrow-dark mb-8">
                    <span className="eyebrow-index">{String(i + 1).padStart(2, '0')}</span>
                    Range
                  </p>
                  <h3 className="font-serif text-2xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-4 text-base font-light leading-relaxed text-muted-dark">{p.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Certifications ledger */}
            {cs.certifications.length > 0 && (
              <Reveal className="mt-16" y={20}>
                <div className="frame divide-y divide-rule-dark border border-rule-dark">
                  <p className="eyebrow eyebrow-dark flex px-6 py-4 leading-relaxed">Compliance front-and-center — verified claims, zero inflation</p>
                  {cs.certifications.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 font-mono text-label uppercase text-white">
                      <Icon d={CHECK} className="h-3.5 w-3.5 shrink-0 text-accent-lift" />
                      {c}
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════ 03 · YOU OWN THE PANEL (CMS control) ═══════════════ */}
      <section className="border-b border-rule bg-surface py-24 text-obsidian md:py-32" id="own-the-panel">
        <div className="container-site">
          <StaggerContainer className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20" staggerChildren={0.1}>
            <StaggerItem className="lg:col-span-5">
              <SectionHeading index="03" eyebrow="You own it" title="No developer required. Ever." />
              <p className="mt-8 text-base font-light leading-relaxed text-muted">
                {cs.title} runs on a custom CMS panel we engineered. From your own browser you can add products, upload
                certificates, publish news, change hero copy, swap imagery — anything, in seconds, without touching a line
                of code.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  'Add / edit products & spec sheets',
                  'Upload certificates & compliance docs',
                  'Update copy, imagery and hero sections',
                  'Full multilingual-ready content model',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-muted">
                    <Icon d={CHECK} className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-ink" />
                    {item}
                  </li>
                ))}
              </ul>
              <AppLink
                href="/web"
                className="group mt-10 inline-flex items-center gap-3 border-b border-accent pb-2 font-mono text-label uppercase text-accent-ink transition-[gap] duration-300 hover:gap-5 motion-reduce:transition-none"
              >
                See what else comes standard
                <Icon d={ARROW_NEXT} />
              </AppLink>
            </StaggerItem>

            <StaggerItem className="lg:col-span-7">
              {/* Admin panel mock */}
              <div className="frame">
                <div className="overflow-hidden border border-rule-dark bg-sidebar shadow-lift">
                  <div className="flex items-center gap-2 border-b border-rule-dark bg-obsidian px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/15" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                    <span className="ms-3 truncate font-mono text-micro text-muted-dark">{cs.domain}/admin — YOUR PANEL</span>
                  </div>
                  <div className="flex">
                    <div className="flex w-12 shrink-0 flex-col items-center gap-4 border-e border-rule-dark bg-obsidian py-5 md:w-14">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span key={i} className={`h-4 w-4 border md:h-5 md:w-5 ${i === 1 ? 'border-accent bg-accent' : 'border-rule-dark'}`} />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 p-4 md:p-6">
                      <div className="mb-6 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="eyebrow eyebrow-dark mb-2">Content operations</p>
                          <p className="truncate font-serif text-xl font-semibold text-white">Everything editable</p>
                        </div>
                        <span className={`shrink-0 bg-accent px-3 py-1.5 font-mono text-micro uppercase ${onAccent}`}>+ New</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          ['Products', '24 items'],
                          ['Certifications', '9 documents'],
                          ['News & stories', '6 published'],
                          ['Page sections', 'drag & drop'],
                          ['Media library', 'unlimited'],
                        ].map(([label, meta]) => (
                          <div key={label} className="flex items-center justify-between gap-3 border border-rule-dark bg-obsidian px-3 py-3 md:px-4">
                            <span className="truncate font-mono text-micro uppercase text-white">{label}</span>
                            <span className="hidden font-mono text-micro text-muted-dark sm:inline">{meta}</span>
                            <span className="shrink-0 whitespace-nowrap font-mono text-micro uppercase text-accent-lift">[ Edit ]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ Testimonial (when available) ═══════════════ */}
      {cs.testimonial && (
        <section className="on-dark border-b border-rule-dark bg-obsidian py-24 md:py-32">
          <div className="container-site">
            <Reveal className="mx-auto max-w-4xl text-center" y={24}>
              <span aria-hidden className="block font-serif text-8xl font-semibold leading-none text-accent-lift">“</span>
              <blockquote>
                <p className="font-serif text-title font-semibold text-white">{cs.testimonial.quote}</p>
              </blockquote>
              <p className="eyebrow mt-10 flex justify-center text-accent-lift">{cs.testimonial.author}</p>
              <p className="eyebrow eyebrow-dark mt-3 flex justify-center">{cs.testimonial.role}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══════════════ Final CTA: two doors ═══════════════ */}
      <section id="next-steps" className="relative isolate overflow-hidden border-b border-rule py-24 text-obsidian md:py-32" style={{ backgroundColor: tint }}>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>
        <div className="container-site">
          <div className="frame mx-auto max-w-5xl border border-rule px-4 py-16 text-center sm:px-6 md:px-16 md:py-24">
            <Reveal y={14}>
              <Eyebrow className="mb-8 justify-center">Next steps</Eyebrow>
            </Reveal>
            <Reveal y={18} delay={0.06}>
              <h2 className="mx-auto max-w-4xl font-serif text-headline font-semibold text-obsidian">Judge the work yourself.</h2>
            </Reveal>
            <Reveal y={14} delay={0.14}>
              <p className="mx-auto mt-8 max-w-2xl text-lede font-light text-muted">
                Explore the live deployment — or let&apos;s build the same standard of digital infrastructure for your trade
                operation.
              </p>
            </Reveal>
            <Reveal y={14} delay={0.22}>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={accentButton}>
                  View live site
                  <Icon d={ARROW_OUT} />
                </a>
                <AppLink href="/rfq" className="btn-ghost min-h-[52px] w-full px-6 py-4 sm:w-auto sm:px-10">
                  [ Request a similar build ]
                </AppLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ Next case study ═══════════════ */}
      {next && (
        <AppLink
          href={`/portfolio/${next.key}`}
          className="on-dark group block bg-obsidian py-20 transition-colors hover:bg-sidebar motion-reduce:transition-none md:py-24"
        >
          <div className="container-site grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-6">
              <p className="eyebrow eyebrow-dark mb-5">Next case study</p>
              <p className="font-serif text-headline font-semibold text-white">{next.title}</p>
              <p className="eyebrow eyebrow-dark mt-4">{next.category}</p>
              <div className="mt-10">
                <span className="inline-flex items-center gap-3 font-mono text-label uppercase text-muted-dark transition-all duration-300 group-hover:gap-5 group-hover:text-accent-lift motion-reduce:transition-none">
                  View case study
                  <Icon d={ARROW_NEXT} />
                </span>
              </div>
            </div>
            {next.capture && (
              <div className="md:col-span-6">
                <div className="frame frame-dark">
                  <div className="relative aspect-[16/10] overflow-hidden border border-rule-dark bg-sidebar">
                    <Image
                      src={next.capture}
                      alt={`${next.title} website preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="object-cover object-top transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/70 to-transparent" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </AppLink>
      )}
    </div>
  )
}

export default ProjectThemedLayout
