import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMeta } from '@/utils/generateMeta'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import ContactForm from '@/components/forms/ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Digital Exporter Launchpad',
    description:
      'Custom EN/AR exporter site + embedded RFQ cart + 12 months Growth SaaS included, delivered in 2 milestones.',
    url: '/launchpad',
  })
}

const DELIVERABLES = [
  {
    index: '01',
    code: '[ DELIVERABLE 01 ]',
    title: 'Custom EN/AR Exporter Site',
    description:
      'Precision-engineered bilingual English and Arabic export platform built for high-trust cross-border trade. Native RTL layout support, lightning-fast edge delivery, and institutional positioning that converts international buyers.',
    features: [
      'Bilingual EN/AR architecture with native RTL typography',
      'Container and volume-optimized product catalog showcase',
      'Zero-CDN dependency with self-hosted assets for high-security markets',
    ],
  },
  {
    index: '02',
    code: '[ DELIVERABLE 02 ]',
    title: 'Embedded RFQ Cart for Container-Load Quotes',
    description:
      'Specialized commercial request-for-quote architecture designed specifically for multi-container volumes, custom Incoterm selections (FOB, CIF, CFR), metric tonnage, and instant institutional inquiry capture.',
    features: [
      'Multi-item container load and tonnage quote builder',
      'Incoterms 2020 and global destination port selection logic',
      'Instant routing to sales desk with qualified trade specs',
    ],
  },
  {
    index: '03',
    code: '[ DELIVERABLE 03 ]',
    title: '12 Months Growth SaaS Management',
    description:
      'Complete operational stewardship included for a full year. We manage dedicated infrastructure, continuous performance optimizations, CRM synchronization, and technical operations so your export desk stays focused on trade execution.',
    features: [
      'Dedicated enterprise infrastructure and SLA monitoring',
      'Continuous security hardening and zero-downtime updates',
      'Dedicated technical steward with 1-business-day response window',
    ],
  },
]

const MILESTONES = [
  {
    step: 'MILESTONE 01',
    title: 'Bilingual Site & RFQ Cart',
    duration: 'Phase 1 — Launch & Verification',
    description:
      'Rapid delivery and deployment of the custom bilingual EN/AR exporter site and the embedded container-load RFQ quoting cart.',
    deliverables: [
      'Institutional bilingual EN/AR architecture and product catalog',
      'Container-load RFQ quoting engine with custom trade parameters',
      'Production deployment and cross-device RTL verification',
    ],
  },
  {
    step: 'MILESTONE 02',
    title: '12 Months Growth SaaS Onboarding & Deployment',
    duration: 'Phase 2 — Annual Managed Growth',
    description:
      'Seamless onboarding into the Growth-tier SaaS suite, operational pipeline integration, and continuous infrastructure management for 12 months.',
    deliverables: [
      'Growth SaaS workspace onboarding and CRM/lead-routing activation',
      'Performance telemetry, security updates, and SLA stewardship',
      '12 months of fully managed cloud operations and technical support',
    ],
  },
]

export default function LaunchpadPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-obsidian text-cream">
      {/* ── 01. Hero Section ── */}
      <AnimatedSection id="hero" className="on-dark relative isolate flex min-h-[85vh] w-full flex-col justify-center overflow-hidden bg-obsidian pt-36 pb-20 md:pt-44 md:pb-28 text-start">
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
                [ 01 — THE OFFER ]
              </div>
            </Reveal>

            <Reveal y={18} delay={0.08}>
              <h1 className="mb-6 font-serif text-headline font-semibold text-white md:text-display">
                Digital Exporter Launchpad
              </h1>
            </Reveal>

            <Reveal y={14} delay={0.16}>
              <div className="mb-6 inline-flex border border-rule-dark bg-surface/5 px-4 py-2 font-mono text-label uppercase text-success">
                Core Offer: Custom EN/AR exporter site + embedded RFQ cart + 12 months Growth-tier SaaS included, delivered in 2 milestones.
              </div>
            </Reveal>

            <Reveal y={14} delay={0.22}>
              <p className="mb-10 text-lede font-light text-muted-dark">
                Purpose-built for modern global trading entities. Transform your export operation into an asynchronous sales machine—capturing, qualifying, and closing international distributor and wholesale inquiries 24/7 across English and Arabic markets without operational drag.
              </p>
            </Reveal>

            <Reveal y={14} delay={0.28}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="#contact" className="btn-primary min-h-[48px] px-8 py-4 font-semibold">
                  [ SECURE YOUR ALLOCATION ]
                </Link>
                <Link href="#deliverables" className="btn-ghost min-h-[48px] px-8 py-4 font-semibold">
                  [ EXPLORE DELIVERABLES ]
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 02. Deliverables Grid ── */}
      <AnimatedSection id="deliverables" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <SectionHeading
            tone="dark"
            index="02"
            eyebrow="SCOPE SPECIFICATION"
            title="Deliverables Grid"
            description="Three institutional-grade assets unified into a single deployment to modernize your export sales infrastructure."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="frame frame-dark">
            <StaggerContainer
              className="grid grid-cols-1 border border-rule-dark md:grid-cols-3 divide-y divide-rule-dark md:divide-y-0 md:divide-x"
              staggerChildren={0.12}
              delayChildren={0.1}
            >
              {DELIVERABLES.map((item) => (
                <StaggerItem
                  key={item.index}
                  className="group relative flex flex-col bg-surface/5 p-8 transition-colors duration-300 hover:bg-surface/10 md:p-10"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left rtl:origin-right scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                  />
                  <div className="mb-8 flex items-center justify-between font-mono text-label uppercase text-muted-dark">
                    <span>{item.code}</span>
                    <span className="text-success font-semibold">{item.index}</span>
                  </div>
                  <h3 className="mb-4 font-serif text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">
                    {item.description}
                  </p>
                  <ul className="mt-auto space-y-3 border-t border-rule-dark pt-6 font-mono text-xs text-white/80">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span className="text-success shrink-0" aria-hidden>+</span>
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

      {/* ── 03. Timeline / Milestones ── */}
      <AnimatedSection id="timeline" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <SectionHeading
            tone="dark"
            index="03"
            eyebrow="EXECUTION CADENCE"
            title="2 Delivery Milestones"
            description="Structured two-phase execution engineered to get your export operations active swiftly before transitioning into managed annual growth."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="frame frame-dark">
            <StaggerContainer
              className="grid grid-cols-1 border border-rule-dark md:grid-cols-2 divide-y divide-rule-dark md:divide-y-0 md:divide-x"
              staggerChildren={0.14}
              delayChildren={0.15}
            >
              {MILESTONES.map((m) => (
                <StaggerItem
                  key={m.step}
                  className="group relative flex flex-col bg-surface/5 p-8 transition-colors duration-300 hover:bg-surface/10 md:p-12"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left rtl:origin-right scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                  />
                  <div className="mb-8 flex items-center justify-between font-mono text-label uppercase text-muted-dark">
                    <span className="text-success font-semibold">[ {m.step} ]</span>
                    <span>{m.duration}</span>
                  </div>
                  <h3 className="mb-4 font-serif text-2xl font-semibold text-white md:text-3xl">
                    {m.title}
                  </h3>
                  <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">
                    {m.description}
                  </p>
                  <div className="mt-auto border-t border-rule-dark pt-6">
                    <div className="mb-4 font-mono text-label uppercase tracking-widest text-white/50">
                      Included in Milestone:
                    </div>
                    <ul className="space-y-3 font-mono text-xs text-white/80">
                      {m.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-3">
                          <span className="text-success shrink-0" aria-hidden>✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 04. Action / CTA & Direct Channels ── */}
      <AnimatedSection id="contact" className="w-full border-t border-rule-dark py-24 md:py-32">
        <Container>
          <div className="frame frame-dark overflow-hidden border border-rule-dark">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Offer Details & Direct Channels */}
              <div className="on-dark relative isolate flex flex-col justify-between bg-obsidian p-8 lg:col-span-5 lg:p-12 xl:p-16">
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                  <div className="bg-aura-dark absolute inset-0 opacity-60" />
                  <div className="bg-blueprint-grid-dark absolute inset-0" />
                </div>
                <div>
                  <div className="eyebrow eyebrow-dark mb-6">
                    <span className="eyebrow-index" aria-hidden>
                      <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                    </span>
                    [ 04 — ACTION ]
                  </div>
                  <h2 className="mb-6 font-serif text-headline font-semibold text-white">
                    Initiate Your Launchpad.
                  </h2>
                  <p className="mb-10 text-lede font-light text-muted-dark">
                    Secure your delivery milestone allocation. Our architecture team reviews your export product specifications and confirms milestone schedules within one business day.
                  </p>
                </div>

                <div className="border-t border-rule-dark pt-8">
                  <h3 className="eyebrow eyebrow-dark mb-6">Direct Channels</h3>
                  <ul className="divide-y divide-rule-dark font-mono text-sm text-white/80">
                    <li className="flex items-start gap-4 py-3">
                      <span className="text-success font-medium">01.</span>
                      <div>
                        <div className="text-xs uppercase text-muted-dark">Inquiries</div>
                        <span className="text-white">hello@exvorta.com</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 py-3">
                      <span className="text-success font-medium">02.</span>
                      <div>
                        <div className="text-xs uppercase text-muted-dark">Headquarters</div>
                        <span className="text-white">Dubai, UAE — Global Reach</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 py-3">
                      <span className="text-success font-medium">03.</span>
                      <div>
                        <div className="text-xs uppercase text-muted-dark">Response SLA</div>
                        <span className="text-white">&lt; 24 Hours Guaranteed</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="flex flex-col justify-center bg-surface p-8 text-obsidian lg:col-span-7 lg:p-12 xl:p-16">
                <div className="mb-8 border-b border-rule pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-label uppercase tracking-widest text-muted">
                      [ ALLOCATION APPLICATION ]
                    </span>
                    <span className="font-mono text-label uppercase text-emerald">
                      ● APPLICATIONS ACTIVE
                    </span>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </div>
  )
}
