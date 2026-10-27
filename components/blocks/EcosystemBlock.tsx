import React from 'react'
import AppLink from '@/components/ui/AppLink'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CtaBand } from '@/components/ui/CtaBand'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import SectionNav from '@/components/ui/SectionNav'
import { EcosystemHero } from '@/components/blocks/EcosystemHero'
import { unbracket } from '@/lib/text'
import type { Ecosystem } from '@/payload-types'

/**
 * /ecosystem — the Exvorta Suite.
 *
 * Section order: hero (3D module explorer) → chapter nav → problem → five module
 * showcases (Web, Docs, Track, CRM, Intel) → vision → roadmap → closing CTA. Tone
 * alternates obsidian / cream so no more than two sections of one tone ever sit
 * together.
 *
 * Server component with two client islands (EcosystemHero, SectionNav); the rest
 * of the motion is CSS-only (`Reveal`, `StaggerText`). The
 * five product mock-ups are decorative (aria-hidden) and fully fluid — secondary
 * panels drop out below `sm` instead of the mock clipping or scrolling.
 */

/* ─── Shared pieces ─────────────────────────────────────────────────────── */

function Diamond() {
  return (
    <span className="eyebrow-index" aria-hidden>
      <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
    </span>
  )
}

/** One status badge style for every module: LIVE (lit) or a quiet neutral. */
function StatusBadge({ children, live = false, dark }: { children: React.ReactNode; live?: boolean; dark: boolean }) {
  const tone = live
    ? dark
      ? 'border-success/50 bg-success-bg text-success'
      : 'border-emerald/40 bg-emerald/10 text-emerald'
    : dark
      ? 'border-rule-dark text-muted-dark'
      : 'border-rule-strong text-obsidian'
  return (
    <span className={`inline-flex items-center gap-2 border px-2.5 py-1.5 font-mono text-label uppercase ${tone}`}>
      {live && <i className="block h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-pulse" aria-hidden />}
      {children}
    </span>
  )
}

/**
 * Product window chrome. The outer `.frame` must not clip (its crosshair marks
 * bleed 6px), so overflow is hidden on the inner box only.
 */
function MockWindow({ tone, url, children }: { tone: 'dark' | 'light'; url: React.ReactNode; children: React.ReactNode }) {
  const dark = tone === 'dark'
  return (
    <Reveal y={32} duration={0.9}>
      <div aria-hidden className={`frame ${dark ? 'frame-dark' : ''}`}>
        <div className={`overflow-hidden border ${dark ? 'border-rule-dark bg-card' : 'border-rule-strong bg-surface shadow-lift'}`}>
          <div
            className={`flex items-center justify-between gap-3 border-b px-4 py-2.5 ${
              dark ? 'border-rule-dark bg-sidebar' : 'border-rule bg-surface-2'
            }`}
          >
            <span className="flex shrink-0 gap-1.5">
              {[0, 1, 2].map((i) => (
                <i key={i} className={`block h-2 w-2 ${dark ? 'bg-white/20' : 'bg-obsidian/15'}`} />
              ))}
            </span>
            <span className={`min-w-0 truncate font-mono text-micro uppercase ${dark ? 'text-muted-dark' : 'text-muted'}`}>{url}</span>
            <span className="hidden w-8 shrink-0 sm:block" />
          </div>
          {children}
        </div>
      </div>
    </Reveal>
  )
}

interface ModuleSectionProps {
  id: string
  index: string
  tone: 'dark' | 'light'
  status: string
  live?: boolean
  title: string
  /** Put the mock on the start side from `lg` up (the DOM order stays text-first for mobile). */
  reverse?: boolean
  cta: { label: string; href: string; variant: 'primary' | 'ghost' }
  mock: React.ReactNode
  children: React.ReactNode
}

function ModuleSection({ id, index, tone, status, live, title, reverse, cta, mock, children }: ModuleSectionProps) {
  const dark = tone === 'dark'
  return (
    <AnimatedSection
      id={id}
      className={`relative w-full border-b py-24 md:py-32 ${dark ? 'on-dark border-rule-dark bg-obsidian text-white' : 'border-rule bg-cream text-obsidian'}`}
    >
      <div className="container-site grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="flex flex-col lg:col-span-5">
          <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className={`eyebrow ${dark ? 'eyebrow-dark' : ''}`}>
              <span className="eyebrow-index">{index}</span>
              Module
            </p>
            <StatusBadge live={live} dark={dark}>
              {status}
            </StatusBadge>
          </div>
          <h2 className={`mb-6 font-serif text-headline font-semibold ${dark ? 'text-white' : 'text-obsidian'}`}>{title}</h2>
          <div className={`space-y-5 text-lede font-light ${dark ? 'text-muted-dark' : 'text-muted'}`}>{children}</div>
          <div className="mt-10 flex">
            <AppLink href={cta.href} className={`${cta.variant === 'primary' ? 'btn-primary' : 'btn-ghost'} min-h-13 w-full px-8 py-4 sm:w-auto`}>
              {cta.label}
            </AppLink>
          </div>
        </div>
        <div className={`lg:col-span-7 ${reverse ? 'lg:order-first' : ''}`}>{mock}</div>
      </div>
    </AnimatedSection>
  )
}

/* ─── Product mock-ups (decorative) ─────────────────────────────────────── */

function WebMock() {
  return (
    <MockWindow tone="dark" url="Exvorta // RAD_VIEWPORT">
      <div className="relative p-4 sm:p-6">
        <div aria-hidden className="bg-blueprint-grid-dark absolute inset-0" />
        <div className="relative space-y-3 sm:space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              ['w-8', 'w-16 bg-success/30'],
              ['w-10', 'w-12 bg-white/10'],
              ['w-6', 'w-14 bg-white/10'],
            ].map(([top, bottom], i) => (
              <div key={i} className="flex h-16 flex-col justify-between border border-rule-dark bg-sidebar p-3 sm:h-20">
                <i className={`block h-1 bg-white/20 ${top}`} />
                <i className={`block h-2 ${bottom}`} />
              </div>
            ))}
          </div>
          <div className="relative h-32 border border-rule-dark bg-sidebar sm:h-44">
            <svg viewBox="0 0 400 100" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full">
              <path d="M0 80 Q 50 20, 100 70 T 200 40 T 300 80 T 400 30" className="stroke-success/60" strokeDasharray="4 2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d="M0 90 Q 70 40, 150 60 T 280 20 T 400 50" className="stroke-white/15" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute start-4 top-4 space-y-2">
              <i className="block h-1 w-24 bg-white/10" />
              <i className="block h-1 w-16 bg-white/5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <i key={i} className="block h-1 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </MockWindow>
  )
}

function DocsMock() {
  const fields: [string, boolean][] = [
    ['Exporter', true],
    ['Consignee', false],
    ['HS Code', false],
    ['Declared Value', false],
    ['Origin Country', false],
  ]
  return (
    <MockWindow tone="light" url="docs.exvorta.com // ALPHA">
      <div className="flex gap-6 overflow-hidden whitespace-nowrap border-b border-rule px-4 pt-4 font-mono text-micro uppercase sm:px-6">
        <span className="border-b border-emerald pb-2 text-emerald">Commercial Invoice</span>
        <span className="pb-2 text-muted">Packing List</span>
        <span className="hidden pb-2 text-muted sm:block">Certificate of Origin</span>
      </div>
      <div className="grid gap-5 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
        <div className="flex flex-col justify-between gap-5">
          <div className="space-y-3">
            {fields.map(([label, filled], i) => (
              <div key={label} className={i > 2 ? 'hidden sm:block' : ''}>
                <div className="mb-1 font-mono text-micro uppercase text-muted">{label}</div>
                <div className="flex h-8 items-center border border-rule-strong bg-surface px-3">
                  {filled && <i className="block h-3 w-1.5 bg-emerald" />}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-obsidian py-3 text-center font-mono text-micro font-bold uppercase text-surface">Generate Document</div>
        </div>

        <div className="relative flex min-h-40 items-center justify-center overflow-hidden border border-rule-strong bg-cream p-5">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="-rotate-45 font-serif text-title font-semibold tracking-widest text-obsidian/5">EXVORTA</span>
          </div>
          <div className="relative w-full space-y-4">
            <i className="block h-2 w-3/4 bg-obsidian/10" />
            <i className="block h-2 w-full bg-obsidian/10" />
            <i className="block h-2 w-5/6 bg-obsidian/10" />
            <i className="block h-2 w-2/3 bg-obsidian/10" />
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="rotate-12 border border-emerald bg-surface px-4 py-2 font-mono text-title font-bold uppercase tracking-widest text-emerald opacity-80">
              <span className="animated-stamp inline-block" />
            </div>
          </div>
        </div>
      </div>
    </MockWindow>
  )
}

function TrackMock() {
  const shipments = [
    { route: 'Dubai → Rotterdam', carrier: 'Maersk', status: 'In Transit', tone: 'border-success/50 text-success', live: true },
    { route: 'Shanghai → Jebel Ali', carrier: 'MSC', status: 'At Customs', tone: 'border-warning/50 text-warning' },
    { route: 'Hamburg → Singapore', carrier: 'DHL', status: 'Delivered', tone: 'border-rule-dark text-muted-dark' },
    { route: 'Mumbai → New York', carrier: 'FedEx', status: 'Loading', tone: 'border-info/60 text-info' },
  ]
  const stages = ['Loaded', 'Shipped', 'In Transit', 'Delivered']
  return (
    <MockWindow tone="dark" url="track.exvorta.com // VESSEL_TRACKER_V2">
      <div className="space-y-4 p-4 font-mono text-micro uppercase text-white/80 sm:space-y-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Active Shipments', '12'],
            ['In Transit', '8'],
            ['Delivered', '47'],
          ].map(([label, value]) => (
            <div key={label} className="border border-rule-dark bg-sidebar p-3">
              <span className="block text-muted-dark">{label}</span>
              <span className="mt-2 block font-serif text-title font-semibold leading-none text-success">{value}</span>
            </div>
          ))}
        </div>

        <ul className="divide-y divide-rule-dark border border-rule-dark bg-sidebar px-3">
          {shipments.map((s) => (
            <li key={s.route} className="flex items-center gap-3 py-3">
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center border ${s.live ? 'border-success' : 'border-rule-dark'}`}>
                <i className={`block h-1 w-1 ${s.live ? 'bg-success' : 'bg-white/40'}`} />
              </span>
              <span className="min-w-0 flex-1 truncate text-white/90">{s.route}</span>
              <span className="hidden text-white/40 sm:inline">{s.carrier}</span>
              <span className={`shrink-0 border px-2 py-0.5 ${s.tone} ${s.live ? 'motion-safe:animate-pulse' : ''}`}>{s.status}</span>
            </li>
          ))}
        </ul>

        <div className="relative">
          <i aria-hidden className="absolute inset-x-0 top-1 block h-px bg-white/10" />
          <i aria-hidden className="absolute start-0 top-1 block h-px w-1/2 bg-success" />
          <ol className="relative grid grid-cols-4">
            {stages.map((stage, i) => (
              <li key={stage} className={`relative pt-5 ${i <= 2 ? 'text-white/80' : 'text-muted-dark'}`}>
                <i
                  aria-hidden
                  className={`absolute start-0 top-0 block h-2 w-2 ${
                    i < 2 ? 'bg-success' : i === 2 ? 'border border-success bg-card motion-safe:animate-pulse' : 'border border-rule-dark bg-card'
                  }`}
                />
                {stage}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </MockWindow>
  )
}

function CrmMock() {
  const accounts = [
    { code: 'NP', name: 'Nova Petrochem', country: 'AE', live: true, active: true },
    { code: 'GL', name: 'Gulf Logistics', country: 'SA', live: true },
    { code: 'AM', name: 'Armada Metals', country: 'DE', live: false },
    { code: 'TS', name: 'TradeSource Co', country: 'CN', live: true },
  ]
  const stages = [
    { label: 'Inquiry', state: 'done', extra: false },
    { label: 'Negotiation', state: 'active', extra: false },
    { label: 'Confirmed', state: 'todo', extra: true },
    { label: 'Shipped', state: 'todo', extra: true },
    { label: 'Paid', state: 'todo', extra: false },
  ]
  return (
    <MockWindow tone="light" url="crm.exvorta.com // RELATIONSHIP_ENGINE">
      <div className="flex">
        <div className="hidden w-44 shrink-0 border-e border-rule-strong bg-cream sm:block">
          <div className="border-b border-rule-strong p-4">
            <div className="flex h-7 items-center gap-2 border border-rule-strong bg-surface px-2">
              <svg className="h-3 w-3 text-obsidian/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <i className="block h-3 w-px bg-emerald" />
            </div>
          </div>
          <ul className="py-2">
            {accounts.map((a) => (
              <li
                key={a.code}
                className={`flex items-center gap-3 px-4 py-3 ${a.active ? 'border-y border-rule-strong bg-surface' : 'opacity-60'}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center border border-rule-strong font-mono text-micro ${a.active ? 'text-emerald' : 'text-obsidian'}`}>
                  {a.code}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate font-mono text-micro uppercase ${a.active ? 'font-bold' : ''}`}>{a.name}</span>
                  <span className="mt-1 flex items-center gap-1.5 font-mono text-micro text-muted">
                    {a.country}
                    <i className={`block h-1.5 w-1.5 ${a.live ? 'bg-emerald' : 'bg-obsidian/20'}`} />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-1 bg-surface">
          <div className="border-b border-rule-strong p-4 sm:p-6">
            <div className="mb-2 font-mono text-micro uppercase text-muted">Nova Petrochem // UAE // Active Buyer</div>
            <div className="flex gap-2 font-mono text-micro">
              <span className="border border-rule-strong px-2 py-0.5">PETROCHEMICAL</span>
              <span className="border border-rule-strong px-2 py-0.5">VERIFIED</span>
            </div>
          </div>
          <div className="space-y-5 p-4 sm:p-6">
            <ol className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {stages.map((s) => (
                <li key={s.label} className={s.extra ? 'hidden sm:block' : ''}>
                  <i
                    className={`mb-2 block h-1 ${s.state === 'done' ? 'bg-emerald' : s.state === 'active' ? 'bg-emerald motion-safe:animate-pulse' : 'bg-obsidian/10'}`}
                  />
                  <span className={`block truncate text-center font-mono text-micro uppercase ${s.state === 'active' ? 'font-bold text-emerald' : 'text-muted'}`}>
                    {s.label}
                  </span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border border-rule-strong border-s-2 border-s-emerald bg-surface p-3 font-mono text-micro">
              <span className="font-bold">Crude Derivative Batch #4471</span>
              <span className="text-muted">$340,000 · Due: 14 Jun</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ['4 Active Deals', 'w-1/2 bg-obsidian/20'],
                ['$1.2M Pipeline', 'w-2/3 bg-obsidian/20'],
                ['2 Docs Pending', 'w-1/3 bg-emerald/60'],
              ].map(([label, bar]) => (
                <div key={label} className="border border-rule-strong p-3">
                  <div className="mb-2 font-mono text-micro uppercase text-muted">{label}</div>
                  <i className={`block h-1 ${bar}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockWindow>
  )
}

function IntelMock() {
  const tickers = [
    { label: 'Crude', delta: '+2.4%', up: true, d: 'M0,15 L10,12 L20,16 L30,5 L40,10 L50,2 L60,8' },
    { label: 'Copper', delta: '-0.8%', up: false, d: 'M0,5 L10,8 L20,4 L30,12 L40,8 L50,18 L60,15' },
    { label: 'LNG', delta: '+1.1%', up: true, d: 'M0,10 L10,15 L20,12 L30,8 L40,14 L50,5 L60,3' },
  ]
  return (
    <MockWindow
      tone="dark"
      url={
        <>
          <i className="me-2 inline-block h-1.5 w-1.5 bg-success align-middle motion-safe:animate-pulse" />
          [INTEL_ALPHA_ACCESS // LIVE NODE_03]
        </>
      }
    >
      <div className="p-4 font-mono text-micro uppercase sm:p-6">
        <div className="relative h-36 border border-rule-dark p-3 sm:h-44 sm:p-4">
          <p className="truncate text-muted-dark">Predictive neural forecast // commodity_aggregate</p>
          <svg viewBox="0 0 400 100" preserveAspectRatio="none" fill="none" className="absolute inset-x-3 bottom-3 top-10 h-auto w-[calc(100%-1.5rem)] sm:inset-x-4 sm:bottom-4 sm:w-[calc(100%-2rem)]">
            <path d="M0,80 C50,75 80,40 150,50 S250,20 300,30" className="stroke-success" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M300,30 Q350,10 400,5" className="stroke-success" strokeDasharray="4 2" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path d="M300,30 Q350,45 400,55" className="stroke-white/25" strokeDasharray="4 2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="absolute end-3 top-1/2 -translate-y-1/2 border border-rule-dark bg-card px-2 py-1 font-bold text-success sm:end-4">+12.4% Est.</span>
        </div>

        <div className="mt-3 flex gap-3 sm:mt-4 sm:gap-4">
          <div className="hidden w-1/3 shrink-0 flex-col border border-rule-dark p-3 sm:flex">
            <span className="mb-2 text-muted-dark">Risk correlation matrix</span>
            <div className="grid min-h-12 flex-1 grid-cols-2 grid-rows-2 gap-1.5">
              <i className="block border border-rule-dark bg-success/20 motion-safe:animate-pulse" />
              <i className="block border border-rule-dark" />
              <i className="block border border-rule-dark bg-danger/20" />
              <i className="block border border-rule-dark bg-success/10 motion-safe:animate-pulse" />
            </div>
          </div>
          <div className="grid flex-1 grid-cols-3 gap-3">
            {tickers.map((t) => (
              <div key={t.label} className="flex min-h-20 flex-col justify-between gap-4 border border-rule-dark p-2.5">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-muted-dark">{t.label}</span>
                  <span className={`font-bold ${t.up ? 'text-success' : 'text-danger'}`}>{t.delta}</span>
                </div>
                <svg className="h-4 w-full opacity-70" viewBox="0 0 60 20" preserveAspectRatio="none" fill="none">
                  <path d={t.d} className={t.up ? 'stroke-success' : 'stroke-danger'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 hidden justify-end gap-4 text-muted-dark sm:flex">
          <span>[AI MODEL: ACTIVE // LATENCY &lt;5MS]</span>
          <span className="motion-safe:animate-pulse">[SIGNAL_ACQUISITION_PULSE]</span>
        </div>
      </div>
    </MockWindow>
  )
}

/* ─── Chapter nav ───────────────────────────────────────────────────────── */

const CHAPTERS = [
  { id: 'product-web', label: 'Web' },
  { id: 'product-docs', label: 'Docs' },
  { id: 'product-track', label: 'Track' },
  { id: 'product-crm', label: 'CRM' },
  { id: 'product-intel', label: 'Intel' },
  { id: 'ecosystem-vision', label: 'Vision' },
  { id: 'ecosystem-roadmap', label: 'Roadmap' },
] as const

/* ─── Roadmap data ──────────────────────────────────────────────────────── */

const PHASES = [
  {
    phase: 'Phase 0 // Active',
    title: 'Exvorta Web',
    description: 'Foundation established. Deploying hardcoded, high-velocity digital architectures for tier-one trade entities globally.',
    state: 'active',
  },
  {
    phase: 'Phase 1 // Q3 2026',
    title: 'Docs & Track Modules',
    description:
      'Releasing the zero-trust document data room (Docs) and the real-time supply chain visibility dashboard (Track) to our existing infrastructure partners.',
    state: 'next',
  },
  {
    phase: 'Phase 2 // Q1 2027',
    title: 'Exvorta CRM',
    description: 'Rolling out the first relationship architecture engineered explicitly for international trade desks, integrating KYC and broker networks.',
    state: 'planned',
  },
  {
    phase: 'Phase 3 // Q3 2027',
    title: 'Exvorta Intel',
    description: 'Deploying the institutional-grade market intelligence terminal for predictive commodity forecasting and risk correlation.',
    state: 'planned',
  },
  {
    phase: 'Phase 4 // 2028',
    title: 'The Exvorta Suite',
    description: 'Complete modular synthesis. All individual products seamlessly converge into the unified global trade operating system.',
    state: 'planned',
  },
] as const

const NODE_STYLE: Record<(typeof PHASES)[number]['state'], string> = {
  active: 'border-emerald bg-emerald',
  next: 'border-obsidian bg-obsidian',
  planned: 'border-obsidian bg-cream',
}

/* ─── Block ─────────────────────────────────────────────────────────────── */

export function EcosystemBlock({ data }: { data?: Ecosystem }) {
  const hero = data?.hero || {
    eyebrow: '[ THE EXVORTA SUITE ]',
    title: 'A Unifying Core',
    subtitle: 'for Global Trade.',
    description: 'One integrated operating system connecting your web presence, documents, logistics, and intelligence.',
    badge: 'SUITE',
  }
  const problem = data?.problem || {
    eyebrow: '[ THE FRAGMENTATION PROBLEM ]',
    title: 'Trade runs on scattered tools.',
    description: 'WhatsApp threads, Excel sheets, and email chains. Your operations deserve better infrastructure.',
  }
  const vision = data?.vision || {
    badge: '[ THE VISION ]',
    title: 'One trade OS.',
    subtitle: 'Every workflow.',
    description: 'The Exvorta Suite unifies every product into a single, seamless platform for global traders.',
  }
  const roadmap = data?.roadmap || {
    eyebrow: '[ ROADMAP ]',
    title: 'The Master Plan',
  }
  const cta = data?.cta || {
    eyebrow: '[ GET STARTED ]',
    title: 'Ready to upgrade your trade infrastructure?',
    subtitle: 'Two ways to begin.',
    description: 'Request a web proposal or join the waitlist for the Exvorta Suite.',
    primaryCtaText: '[ REQUEST PROPOSAL ]',
    secondaryCtaText: '[ JOIN SOFTWARE WAITLIST ]',
    disclaimer: '* Web proposals are subject to capacity constraints.',
  }

  return (
    <div className="pt-(--header-h)">
      {/* The DRAFT → READY stamp in the Docs mock. `content` flips discretely. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes stamp-toggle {
          0%, 45% { content: "DRAFT"; opacity: 1; }
          50% { opacity: 0; }
          55%, 100% { content: "READY"; opacity: 1; }
        }
        .animated-stamp::before { content: "DRAFT"; animation: stamp-toggle 6s infinite; }
        @media (prefers-reduced-motion: reduce) { .animated-stamp::before { animation: none; } }
      `,
        }}
      />

      {/* ═══ Hero: 3D module explorer ═══ */}
      <EcosystemHero
        eyebrow={unbracket(hero.eyebrow)}
        title={hero.title || ''}
        subtitle={hero.subtitle || ''}
        description={hero.description || ''}
        primary={{ label: cta.secondaryCtaText || '[ JOIN SOFTWARE WAITLIST ]', href: '/waitlist' }}
        secondary={{ label: cta.primaryCtaText || '[ REQUEST PROPOSAL ]', href: '/rfq' }}
      />

      <SectionNav label="On this page" items={CHAPTERS} />

      {/* ═══ Problem ═══ */}
      <AnimatedSection id="ecosystem-problem" className="relative isolate w-full border-b border-rule bg-cream py-24 md:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>
        <div className="container-site">
          <SectionHeading align="center" eyebrow={unbracket(problem.eyebrow)} title={problem.title || ''} description={problem.description} />
        </div>
      </AnimatedSection>

      {/* ═══ Modules ═══ */}
      <ModuleSection
        id="product-web"
        index="01"
        tone="dark"
        live
        status="Live"
        title="Exvorta Web."
        cta={{ label: '[ VIEW ARCHITECTURE ]', href: '/web', variant: 'primary' }}
        mock={<WebMock />}
      >
        <p>
          Bespoke digital architecture for global trading entities. We replace fragile templates with hardcoded, high-performance web infrastructure
          designed entirely for institutional authority and tier-one lead acquisition.
        </p>
      </ModuleSection>

      <ModuleSection
        id="product-docs"
        index="02"
        tone="light"
        reverse
        status="Closed Beta"
        title="Exvorta Docs."
        cta={{ label: '[ REQUEST BETA ACCESS ]', href: '/waitlist', variant: 'ghost' }}
        mock={<DocsMock />}
      >
        <p>
          Trade documents generated in seconds. Commercial invoices, packing lists, and certificates of origin — auto-built from a single data entry.
          No formatting errors. No customs delays.
        </p>
        <p className="border-s border-emerald ps-4 text-base text-muted">Currently available exclusively to active Exvorta Web clients.</p>
      </ModuleSection>

      <ModuleSection
        id="product-track"
        index="03"
        tone="dark"
        status="Alpha"
        title="Exvorta Track."
        cta={{ label: '[ REQUEST ALPHA ACCESS ]', href: '/waitlist', variant: 'ghost' }}
        mock={<TrackMock />}
      >
        <p>
          Real-time, verifiable visibility into your global trade pipeline. Exvorta Track moves asset tracking from static spreadsheets to a dynamic,
          hardened data ecosystem, connecting directly with major global carriers and freight forwarders.
        </p>
      </ModuleSection>

      <ModuleSection
        id="product-crm"
        index="04"
        tone="light"
        reverse
        status="Coming Soon"
        title="Exvorta CRM."
        cta={{ label: '[ JOIN THE WAITLIST ]', href: '/waitlist', variant: 'ghost' }}
        mock={<CrmMock />}
      >
        <p>
          Manage every buyer and supplier relationship in one place. Deal pipelines, document history, follow-up reminders — built specifically for how
          traders actually work.
        </p>
      </ModuleSection>

      <ModuleSection
        id="product-intel"
        index="05"
        tone="dark"
        status="Coming Soon"
        title="Exvorta Intel."
        cta={{ label: '[ JOIN THE WAITLIST ]', href: '/waitlist', variant: 'ghost' }}
        mock={<IntelMock />}
      >
        <p>
          Intuition does not scale. Exvorta Intel processes millions of global trade data points into actionable, predictive commodity forecasting and
          supply chain risk analysis.
        </p>
        <p className="text-base">
          Monitor macro-economic shifts, track competitor vessel routes, and analyze real-time pricing arbitrage across global ports—all from a single
          executive terminal.
        </p>
      </ModuleSection>

      {/* ═══ Vision ═══ */}
      <AnimatedSection id="ecosystem-vision" className="on-dark relative isolate w-full overflow-hidden border-b border-rule-dark bg-obsidian py-24 text-center md:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>
        <div className="container-site flex flex-col items-center">
          <p className="eyebrow eyebrow-dark mb-8 justify-center">
            <Diamond />
            {unbracket(vision.badge)}
          </p>
          <StaggerText
            as="h2"
            text={`${vision.title} <br/> <span class="text-muted-dark">${vision.subtitle}</span>`}
            unit="chars"
            stagger={0.024}
            duration={0.8}
            mode="inView"
            className="mx-auto mb-8 max-w-5xl font-serif text-display font-semibold text-white"
          />
          <Reveal y={14} delay={0.2}>
            <p className="mx-auto mb-14 max-w-3xl text-lede font-light text-muted-dark">{vision.description}</p>
          </Reveal>
          <Reveal y={14} delay={0.3} className="w-full">
            <ol aria-label="Suite modules" className="mx-auto grid w-full max-w-xl grid-cols-5 divide-x divide-rule-dark border border-rule-dark font-mono text-label uppercase text-muted-dark">
              {['Web', 'Docs', 'Track', 'CRM', 'Intel'].map((item) => (
                <li key={item} className="py-3 text-center">
                  {item}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal y={14} delay={0.4}>
            <div className="mt-12">
              <AppLink href="/waitlist" className="btn-primary min-h-13 px-10 py-4">
                {cta.secondaryCtaText || '[ JOIN SOFTWARE WAITLIST ]'}
              </AppLink>
            </div>
          </Reveal>
        </div>
      </AnimatedSection>

      {/* ═══ Roadmap ═══ */}
      <AnimatedSection id="ecosystem-roadmap" className="w-full border-b border-rule bg-cream py-24 md:py-32">
        <div className="container-site grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow={unbracket(roadmap.eyebrow)} title={roadmap.title || ''} />
            </div>
          </div>

          <StaggerContainer as="ol" staggerChildren={0.14} delayChildren={0.15} className="relative border-s border-rule-strong lg:col-span-7">
            {PHASES.map((p, i) => {
              const active = p.state === 'active'
              return (
                <StaggerItem as="li" key={p.title} className={`group relative ps-10 md:ps-14 ${i === PHASES.length - 1 ? '' : 'pb-14 md:pb-16'}`}>
                  <span
                    aria-hidden
                    className={`absolute start-0 top-1 z-10 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border transition-transform duration-500 group-hover:scale-125 rtl:translate-x-1/2 ${NODE_STYLE[p.state]}`}
                  />
                  <p className={`eyebrow mb-3 ${active ? 'text-emerald' : p.state === 'next' ? 'text-obsidian' : ''}`}>{p.phase}</p>
                  <h3 className="mb-3 font-serif text-title font-semibold text-obsidian">{p.title}</h3>
                  <p className="max-w-xl text-base font-light leading-relaxed text-muted">{p.description}</p>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </AnimatedSection>

      {/* ═══ Closing CTA ═══ */}
      <CtaBand
        id="ecosystem-cta"
        tone="dark"
        eyebrow={unbracket(cta.eyebrow) || undefined}
        headline={
          <StaggerText
            as="span"
            text={`${cta.title} <br/> <span class="text-muted-dark">${cta.subtitle}</span>`}
            unit="words"
            stagger={0.08}
            duration={0.75}
            mode="inView"
          />
        }
        description={cta.description}
        primary={{ label: cta.primaryCtaText || '[ UPGRADE WEB ARCHITECTURE ]', href: '/rfq' }}
        secondary={{ label: '[ SEE THE LIVE PROOF ]', href: '/portfolio' }}
        footnote={cta.disclaimer || undefined}
      />
    </div>
  )
}

export default EcosystemBlock
