import React from 'react'
import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import AppLink from '@/components/ui/AppLink'
import { Reveal } from '@/components/ui/Reveal'
import ToolsWaitlistBand from '@/components/blocks/ToolsWaitlistBand'
import { buildLocaleAlternates } from '@/lib/locale'
import {
  TOOLS_CATALOG,
  LIVE_TOOLS,
  ROADMAP_TOOLS,
  TRUST_RIBBON_ITEMS,
  WHY_FREE_PILLARS,
  buildToolsItemListJsonLd,
  type ToolItem,
} from './tools-data'

export const metadata: Metadata = {
  title: 'Export & Trade Utilities Hub | Exvorta',
  description:
    'Institutional export engineering utilities: Incoterm & CBM calculators, trade documentation generators, and regulatory readiness checkers for global trade.',
  alternates: buildLocaleAlternates('/tools', 'en'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Export & Trade Utilities Hub | Exvorta',
    description:
      'Institutional export engineering utilities: Incoterm & CBM calculators, trade documentation generators, and regulatory readiness checkers for global trade.',
    url: '/tools',
    siteName: 'Exvorta',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Export & Trade Utilities Hub | Exvorta',
        type: 'image/png',
      },
    ],
  },
}

export {
  TOOLS_CATALOG,
  LIVE_TOOLS,
  ROADMAP_TOOLS,
  TRUST_RIBBON_ITEMS,
  WHY_FREE_PILLARS,
  buildToolsItemListJsonLd,
}

const CATEGORY_TABS = [
  'All Utilities',
  'Freight & Logistics',
  'Compliance & Customs',
  'Cost & Margins',
  'Documentation',
] as const

export default function ToolsHubPage() {
  const jsonLd = buildToolsItemListJsonLd()

  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* JSON-LD ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 01. Hero Section (Institutional Dark) ── */}
      <section className="relative isolate overflow-hidden bg-obsidian text-paper pt-32 pb-20 md:pt-40 md:pb-28 border-b border-rule-dark">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Reveal y={10} duration={0.5}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-6 inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rotate-45 bg-emerald inline-block" aria-hidden="true" />
                [ SYS_INDEX // UTILITIES_ENGINE ]
              </p>
            </Reveal>

            <Reveal y={18} delay={0.06}>
              <h1 className="font-serif text-headline font-semibold text-paper mb-6">
                Engineering Tools for Global Export Operations
              </h1>
            </Reveal>

            <Reveal y={14} delay={0.12}>
              <p className="text-lede font-light text-muted-dark max-w-3xl mx-auto mb-10 leading-relaxed">
                Precision-engineered trade calculators, compliance engines, and cost-modeling utilities built for high-velocity international commerce.
              </p>
            </Reveal>

            {/* Metrics / Trust Ribbon */}
            <Reveal y={14} delay={0.18}>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-rule-dark max-w-3xl mx-auto">
                {TRUST_RIBBON_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-emerald rounded-[4px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4 text-xs font-mono text-muted-dark">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-emerald rounded-full" aria-hidden="true" />
                  Zero Authentication Required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-emerald rounded-full" aria-hidden="true" />
                  Client-Side Calculations
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-emerald rounded-full" aria-hidden="true" />
                  Incoterms 2020 Compliant
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-emerald rounded-full" aria-hidden="true" />
                  Updated for 2026 Mandates
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── 02. Tools Catalog Section ── */}
      <main className="py-20 md:py-28 border-b border-rule">
        <Container>
          {/* Category Filter Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-rule pb-4">
            {CATEGORY_TABS.map((tab, idx) => (
              <span
                key={tab}
                className={
                  idx === 0
                    ? 'px-3.5 py-1.5 text-xs font-mono font-medium rounded-[4px] bg-obsidian text-paper border border-obsidian cursor-default'
                    : 'px-3.5 py-1.5 text-xs font-mono font-medium rounded-[4px] bg-surface text-muted border border-rule hover:text-obsidian hover:border-obsidian/30 transition-colors cursor-default'
                }
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Live Utilities Grid (Mobbin Ref Cofounder 10/10) */}
          <div className="mb-20">
            <SectionHeading
              eyebrow="DEPLOYED UTILITIES"
              title="Live Production Tools"
              description="Unrestricted, deterministic calculators and compliance generators with instant browser export and zero paywalls."
              className="mb-10"
              tone="light"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LIVE_TOOLS.map((tool: ToolItem) => (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between rounded-[4px] border border-rule bg-surface p-6 md:p-8 hover:border-obsidian/40 hover:bg-surface-2 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                        {tool.category}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-0.5 border border-emerald/30 bg-emerald/10 text-emerald rounded-[4px] inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald inline-block animate-pulse" aria-hidden="true" />
                        {tool.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold text-obsidian mb-3">
                      {tool.name}
                    </h3>

                    <p className="text-muted text-sm leading-relaxed mb-5">
                      {tool.description}
                    </p>

                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-xs text-obsidian/70 bg-cream/80 border border-rule px-2 py-0.5 rounded-[4px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-rule flex flex-col gap-2">
                    <AppLink
                      href={tool.url}
                      className="inline-flex items-center font-mono text-xs uppercase tracking-widest font-semibold text-obsidian hover:text-emerald transition-colors"
                    >
                      {tool.actionLabel}
                    </AppLink>

                    {tool.altUrl && (
                      <AppLink
                        href={tool.altUrl}
                        className="inline-flex items-center font-mono text-xs uppercase tracking-wider text-muted hover:text-obsidian transition-colors"
                      >
                        [ {tool.altUrlLabel} -&gt; ]
                      </AppLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Roadmap Modules */}
          <div>
            <SectionHeading
              eyebrow="UNDER ACTIVE ENGINEERING"
              title="Roadmap &amp; Clearance Checkers"
              description="Cross-border compliance engines scheduled for deployment across GCC, European, and North African trade corridors."
              className="mb-10"
              tone="light"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ROADMAP_TOOLS.map((tool: ToolItem) => (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between rounded-[4px] border border-rule bg-surface p-6 md:p-8 hover:border-obsidian/40 hover:bg-surface-2 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                        {tool.category}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-0.5 border border-warning/30 bg-warning/10 text-warning rounded-[4px]">
                        {tool.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold text-obsidian mb-3">
                      {tool.name}
                    </h3>

                    <p className="text-muted text-sm leading-relaxed mb-5">
                      {tool.description}
                    </p>

                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-xs text-obsidian/70 bg-cream/80 border border-rule px-2 py-0.5 rounded-[4px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-rule">
                    <a
                      href="#tools-waitlist"
                      className="inline-flex items-center font-mono text-xs uppercase tracking-widest font-semibold text-muted hover:text-obsidian transition-colors"
                    >
                      {tool.actionLabel}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct module route indexing for crawler discovery */}
          <span className="sr-only">
            Direct routes: <AppLink href="/tools/freight-density">Freight Density</AppLink>{' '}
            <AppLink href="/tools/incoterms-matrix">Incoterms Matrix</AppLink>
          </span>
        </Container>
      </main>

      {/* ── 03. Institutional Philosophy ("Why Free" Trust Architecture - Mobbin Ref Semrush 8/10) ── */}
      <section className="w-full bg-surface-2 border-b border-rule py-20 md:py-28">
        <Container>
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              eyebrow="TRANSPARENT FOUNDATION"
              title="Why Our Trade Utilities Are Free & Public"
              description="Enterprise international supply chains demand absolute calculation transparency, auditable math, and frictionless technical evaluation."
              align="center"
              tone="light"
              className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {WHY_FREE_PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  className="rounded-[4px] border border-rule bg-surface p-6 md:p-8 hover:border-obsidian/40 hover:bg-surface-2 transition-all duration-200"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald mb-3 block">
                    [ PRINCIPLE {pillar.index} ]
                  </span>
                  <h4 className="font-serif text-xl font-semibold text-obsidian mb-3">
                    {pillar.title}
                  </h4>
                  <p className="text-muted text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 04. Tools Waitlist / Email Capture Band (Mobbin Ref Shopify 9/10) ── */}
      <ToolsWaitlistBand />
    </div>
  )
}
