import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMeta } from '@/utils/generateMeta'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import FAQJsonLd from '@/components/seo/FAQJsonLd'
import {
  PRICING_PACKAGES,
  ADD_ONS,
  LAUNCHPAD_FEATURE,
  SAAS_TEASER,
  PRICING_FAQS,
  DIRECT_CHANNELS,
  type PricingPackage,
  type PricingAddOn,
  type PricingFaq,
} from './pricing-data'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Pricing & Packages — Exvorta',
    description:
      'Fixed-cost digital exporter platforms, custom Launchpad milestones, and managed trade infrastructure.',
    url: '/pricing',
  })
}

export {
  PRICING_PACKAGES,
  ADD_ONS,
  LAUNCHPAD_FEATURE,
  SAAS_TEASER,
  PRICING_FAQS,
  DIRECT_CHANNELS,
}

export default function PricingPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-obsidian text-cream">
      {/* ── 01. Hero Section ── */}
      <AnimatedSection
        id="hero"
        className="on-dark relative isolate flex min-h-[85vh] w-full flex-col justify-center overflow-hidden bg-obsidian pt-36 pb-20 md:pt-44 md:pb-28 text-start"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <Container>
          <div className="mx-auto max-w-4xl">
            <Reveal y={10} duration={0.5}>
              <div className="eyebrow eyebrow-dark mb-8">
                <span className="eyebrow-index" aria-hidden>
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                [ 01 — COMMERCIAL INFRASTRUCTURE ]
              </div>
            </Reveal>

            <Reveal y={18} delay={0.08}>
              <h1 className="mb-6 font-serif text-headline font-semibold text-white md:text-display">
                Predictable Pricing. Institutional Execution.
              </h1>
            </Reveal>

            <Reveal y={14} delay={0.16}>
              <div className="mb-6 inline-flex border border-rule-dark bg-surface/5 px-4 py-2 font-mono text-label uppercase text-success">
                Commercial Tiers: Transparent Fixed-Scope Digital Exporter Platforms &amp; Custom Launchpad Milestones.
              </div>
            </Reveal>

            <Reveal y={14} delay={0.22}>
              <p className="mb-10 text-lede font-light text-muted-dark">
                Engineered for cross-border exporters, commodity brokers, and industrial manufacturers seeking fixed-scope, high-conversion digital platforms. Deploy deterministic web infrastructure without scope ambiguity or licensing lock-ins.
              </p>
            </Reveal>

            <Reveal y={14} delay={0.28}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="#packages" className="btn-primary min-h-[48px] px-8 py-4 font-semibold">
                  [ EXPLORE PACKAGES ]
                </Link>
                <Link href="#launchpad" className="btn-ghost min-h-[48px] px-8 py-4 font-semibold">
                  [ LAUNCHPAD SPEC ]
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 02. Web Packages Section ── */}
      <AnimatedSection id="packages" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <SectionHeading
            tone="dark"
            index="02"
            eyebrow="COMMERCIAL TIERS"
            title="Web Packages"
            description="Three distinct commercial tiers engineered to match your volume, market complexity, and compliance requirements."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="frame frame-dark">
            <StaggerContainer
              className="grid grid-cols-1 border border-rule-dark lg:grid-cols-3 divide-y divide-rule-dark lg:divide-y-0 lg:divide-x"
              staggerChildren={0.12}
              delayChildren={0.1}
            >
              {PRICING_PACKAGES.map((pkg: PricingPackage) => (
                <StaggerItem
                  key={pkg.id}
                  className={`group relative flex flex-col p-8 transition-colors duration-300 md:p-10 ${
                    pkg.featured
                      ? 'bg-surface/10 ring-1 ring-success/30'
                      : 'bg-surface/5 hover:bg-surface/10'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-0.5 origin-left rtl:origin-right bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] ${
                      pkg.featured ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />

                  {/* Header & Badges */}
                  <div className="mb-6 flex items-center justify-between font-mono text-label uppercase">
                    <span className="text-muted-dark">{pkg.code}</span>
                    {pkg.badge && (
                      <span className="border border-success/40 bg-success/15 px-2.5 py-0.5 font-semibold text-success">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 font-serif text-2xl font-semibold text-white md:text-3xl">
                    {pkg.name}
                  </h3>

                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl">
                      {pkg.price}
                    </span>
                    {pkg.priceDetail && (
                      <span className="font-mono text-xs uppercase text-muted-dark">
                        {pkg.priceDetail}
                      </span>
                    )}
                  </div>

                  {/* Turnaround Guarantee Badge */}
                  <div className="mb-6 inline-flex items-center gap-2 border border-rule-dark bg-surface/5 px-3 py-1.5 font-mono text-xs text-white/90">
                    <span className="text-success" aria-hidden>⚡</span>
                    <span>Turnaround: <strong className="font-semibold text-white">{pkg.turnaround}</strong></span>
                  </div>

                  <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">
                    {pkg.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="mt-auto border-t border-rule-dark pt-6">
                    <div className="mb-4 font-mono text-label uppercase tracking-widest text-white/50">
                      Included Deliverables:
                    </div>
                    <ul className="space-y-3 font-mono text-xs text-white/85">
                      {pkg.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-3">
                          <span className="text-success shrink-0 font-semibold" aria-hidden>✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 pt-6 border-t border-rule-dark">
                      <Link
                        href={pkg.cta.href}
                        className={`w-full min-h-[44px] ${
                          pkg.featured ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        {pkg.cta.label}
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 03. Add-Ons Grid ── */}
      <AnimatedSection id="addons" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <SectionHeading
            tone="dark"
            index="03"
            eyebrow="MODULAR EXTENSIONS"
            title="Add-Ons Grid"
            description="Modular functional upgrades tailored for multi-region trade corridors, complex quote builders, and persistent infrastructure maintenance."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="frame frame-dark">
            <StaggerContainer
              className="grid grid-cols-1 border border-rule-dark md:grid-cols-3 divide-y divide-rule-dark md:divide-y-0 md:divide-x"
              staggerChildren={0.12}
              delayChildren={0.1}
            >
              {ADD_ONS.map((addon: PricingAddOn) => (
                <StaggerItem
                  key={addon.id}
                  className="group relative flex flex-col bg-surface/5 p-8 transition-colors duration-300 hover:bg-surface/10 md:p-10"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left rtl:origin-right scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                  />
                  <div className="mb-8 flex items-center justify-between font-mono text-label uppercase text-muted-dark">
                    <span>{addon.code}</span>
                    <span className="text-success font-semibold">MODULAR</span>
                  </div>
                  <h3 className="mb-4 font-serif text-2xl font-semibold text-white">
                    {addon.title}
                  </h3>
                  <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">
                    {addon.description}
                  </p>
                  <ul className="mt-auto space-y-3 border-t border-rule-dark pt-6 font-mono text-xs text-white/80">
                    {addon.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span className="text-success shrink-0 font-semibold" aria-hidden>+</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 04. Launchpad Feature Card ── */}
      <AnimatedSection id="launchpad" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <SectionHeading
            tone="dark"
            index="04"
            eyebrow="TURNKEY DUAL-MILESTONE"
            title="Launchpad Integration"
            description="The flagship turnkey deployment model engineered for international exporters seeking an all-in-one execution roadmap."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="frame frame-dark overflow-hidden border border-rule-dark bg-surface/5 p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="mb-4 inline-flex items-center gap-2 border border-success/40 bg-success/15 px-3 py-1 font-mono text-label uppercase text-success">
                  <span>{LAUNCHPAD_FEATURE.code}</span>
                </div>
                <h3 className="mb-4 font-serif text-3xl font-semibold text-white md:text-4xl">
                  {LAUNCHPAD_FEATURE.title}
                </h3>
                <p className="mb-6 font-mono text-sm text-success">
                  {LAUNCHPAD_FEATURE.subtitle}
                </p>
                <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">
                  {LAUNCHPAD_FEATURE.description}
                </p>

                <Link
                  href={LAUNCHPAD_FEATURE.cta.href}
                  className="btn-primary min-h-[48px] px-8 py-4 font-semibold"
                >
                  {LAUNCHPAD_FEATURE.cta.label}
                </Link>
              </div>

              <div className="space-y-6 lg:col-span-6">
                {LAUNCHPAD_FEATURE.milestones.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="border border-rule-dark bg-obsidian/60 p-6 md:p-8"
                  >
                    <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase">
                      <span className="text-success font-semibold">[ {m.step} ]</span>
                      <span className="text-muted-dark">{m.duration}</span>
                    </div>
                    <h4 className="mb-4 font-serif text-xl font-semibold text-white">
                      {m.title}
                    </h4>
                    <ul className="space-y-2 font-mono text-xs text-white/80">
                      {m.deliverables.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2.5">
                          <span className="text-success shrink-0" aria-hidden>✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 05. SaaS Teaser Card ── */}
      <AnimatedSection id="saas" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <div className="frame frame-dark overflow-hidden border border-rule-dark bg-surface/5 p-8 md:p-12 lg:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex border border-rule-dark bg-surface/10 px-4 py-2 font-mono text-label uppercase text-success">
                {SAAS_TEASER.badge}
              </div>

              <h2 className="mb-6 font-serif text-3xl font-semibold text-white md:text-4xl">
                {SAAS_TEASER.title}
              </h2>

              <p className="mb-10 text-base md:text-lg font-light leading-relaxed text-muted-dark">
                {SAAS_TEASER.description}
              </p>

              {/* Modules Grid */}
              <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-start">
                {SAAS_TEASER.modules.map((mod, modIdx) => (
                  <div
                    key={modIdx}
                    className="border border-rule-dark bg-obsidian/70 p-5 transition-colors hover:border-success/50"
                  >
                    <div className="font-mono text-xs font-semibold uppercase text-success">
                      0{modIdx + 1} {'//'} {mod.name}
                    </div>
                    <div className="mt-1 font-sans text-sm text-muted-dark">
                      {mod.role}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={SAAS_TEASER.cta.href}
                className="btn-primary min-h-[48px] px-8 py-4 font-semibold"
              >
                {SAAS_TEASER.cta.label}
              </Link>
            </div>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 06. FAQ Band ── */}
      <AnimatedSection id="faq" className="w-full border-t border-rule-dark py-24 md:py-32">
        <FAQJsonLd questions={PRICING_FAQS.map((q: PricingFaq) => ({ question: q.question, answer: q.answer }))} />
        <Container>
          <SectionHeading
            tone="dark"
            index="05"
            eyebrow="COMMERCIAL CLARITY"
            title="Procurement FAQ"
            description="Transparent answers to core institutional questions regarding engagement structures, IP governance, and delivery guarantees."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="mx-auto max-w-4xl border-t border-rule-dark">
            {PRICING_FAQS.map((faq: PricingFaq, fIdx: number) => (
              <details
                key={fIdx}
                className="group border-b border-rule-dark py-6 text-start"
                open={fIdx === 0}
              >
                <summary className="flex cursor-pointer items-start justify-between gap-6 list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-label text-success" aria-hidden>
                      0{fIdx + 1}
                    </span>
                    <span className="font-serif text-xl font-semibold leading-snug text-white transition-colors group-hover:text-white/80 md:text-2xl">
                      {faq.question}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300 ease-[var(--ease-cinematic)] group-open:rotate-45"
                  >
                    <span className="absolute h-px w-full bg-white" />
                    <span className="absolute h-full w-px bg-white" />
                  </span>
                </summary>
                <div className="pt-4 ps-9 md:ps-11">
                  <p className="max-w-3xl text-base md:text-lg font-light leading-relaxed text-muted-dark">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 07. Bottom CTA & Direct Channels ── */}
      <AnimatedSection id="contact" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <div className="frame frame-dark overflow-hidden border border-rule-dark">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Direct Inquiries Thesis & Channels */}
              <div className="on-dark relative isolate flex flex-col justify-between bg-obsidian p-8 lg:col-span-6 lg:p-12 xl:p-16 text-start">
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                  <div className="bg-aura-dark absolute inset-0 opacity-60" />
                  <div className="bg-blueprint-grid-dark absolute inset-0" />
                </div>
                <div>
                  <div className="eyebrow eyebrow-dark mb-6">
                    <span className="eyebrow-index" aria-hidden>
                      <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                    </span>
                    [ 06 — PROPOSAL ]
                  </div>
                  <h2 className="mb-6 font-serif text-headline font-semibold text-white">
                    Initiate Your Export Infrastructure.
                  </h2>
                  <p className="mb-10 text-lede font-light text-muted-dark">
                    Select your commercial tier or submit custom trade specifications. Our engineering desk verifies your requirements and delivers your architecture confirmation within one business day.
                  </p>
                </div>

                <div className="border-t border-rule-dark pt-8">
                  <h3 className="eyebrow eyebrow-dark mb-6">Direct Channels</h3>
                  <ul className="divide-y divide-rule-dark font-mono text-sm text-white/80">
                    {DIRECT_CHANNELS.map((ch: (typeof DIRECT_CHANNELS)[number]) => (
                      <li key={ch.index} className="flex items-start gap-4 py-3">
                        <span className="text-success font-medium">{ch.index}</span>
                        <div>
                          <div className="text-xs uppercase text-muted-dark">{ch.label}</div>
                          <span className="text-white">{ch.value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Direct Action Buttons & Institutional Protocol */}
              <div className="flex flex-col justify-between bg-surface/5 p-8 lg:col-span-6 lg:p-12 xl:p-16 text-start border-t border-rule-dark lg:border-t-0 lg:border-s">
                <div>
                  <div className="mb-6 font-mono text-label uppercase tracking-widest text-muted-dark">
                    [ COMMERCIAL DISPATCH ]
                  </div>
                  <h3 className="mb-4 font-serif text-2xl font-semibold text-white md:text-3xl">
                    Immediate Engagement Routing
                  </h3>
                  <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">
                    Direct your firm to our structured RFQ engine for container and product catalog specifications, or open direct dialogue with our lead architects.
                  </p>

                  <div className="space-y-4 border-t border-rule-dark pt-8">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link
                        href="/rfq"
                        className="btn-primary min-h-[48px] px-8 py-4 font-semibold flex-1 text-center"
                      >
                        [ INITIATE RFQ ]
                      </Link>
                      <Link
                        href="/contact"
                        className="btn-ghost min-h-[48px] px-8 py-4 font-semibold flex-1 text-center"
                      >
                        [ DIRECT CONTACT ]
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-12 border-t border-rule-dark pt-6 font-mono text-xs text-muted-dark">
                  <div className="flex items-center gap-2 text-success mb-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-success" />
                    <span>SYSTEM DISPATCH: OPERATIONAL</span>
                  </div>
                  <p>
                    All RFQ submissions and direct inquiries route directly through authenticated server actions with zero third-party leak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </div>
  )
}
