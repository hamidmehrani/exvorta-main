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

export default function ToolsHubPage() {
  const jsonLd = buildToolsItemListJsonLd(TOOLS_CATALOG)

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
              <p className="text-lede font-light text-muted-dark max-w-2xl mx-auto mb-10 leading-relaxed">
                Precision-engineered trade calculators, compliant document generators, and regulatory verification tools built for high-velocity international commerce.
              </p>
            </Reveal>

            {/* Metrics / Trust Ribbon */}
            <Reveal y={14} delay={0.18}>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-rule-dark max-w-3xl mx-auto">
                {TRUST_RIBBON_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-emerald"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── 02. Tools Catalog Section ── */}
      <main className="py-20 md:py-28 border-b border-rule">
        <Container>
          {/* Live Utilities Grid */}
          <div className="mb-20">
            <SectionHeading
              eyebrow="DEPLOYED UTILITIES"
              title="Live Production Tools"
              description="Unrestricted, deterministic calculators and compliance generators with instant browser export and zero paywalls."
              className="mb-12"
              tone="light"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LIVE_TOOLS.map((tool: ToolItem) => (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between border border-rule bg-surface p-6 md:p-8 transition-colors hover:border-obsidian/30"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                        {tool.category}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-0.5 border border-emerald/30 bg-emerald/10 text-emerald">
                        {tool.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold text-obsidian mb-3">
                      {tool.name}
                    </h3>

                    <p className="text-muted text-sm leading-relaxed mb-6">
                      {tool.description}
                    </p>
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
              className="mb-12"
              tone="light"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROADMAP_TOOLS.map((tool: ToolItem) => (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between border border-rule bg-surface p-6 md:p-8 transition-colors hover:border-obsidian/30"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                        {tool.category}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-0.5 border border-warning/40 bg-warning/10 text-warning">
                        {tool.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold text-obsidian mb-3">
                      {tool.name}
                    </h3>

                    <p className="text-muted text-sm leading-relaxed mb-6">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-rule">
                    <AppLink
                      href={tool.url}
                      className="inline-flex items-center font-mono text-xs uppercase tracking-widest font-semibold text-muted hover:text-obsidian transition-colors"
                    >
                      {tool.actionLabel}
                    </AppLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>

      {/* ── 03. Institutional Philosophy ("Why Free") ── */}
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
                  className="border border-rule bg-surface p-6 md:p-8"
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

      {/* ── 04. Tools Waitlist / Email Capture Band ── */}
      <ToolsWaitlistBand />
    </div>
  )
}
