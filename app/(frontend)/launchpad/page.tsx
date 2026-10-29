import React from 'react'
import type { Metadata } from 'next'
import Link from '@/components/ui/AppLink'
import { generateMeta } from '@/utils/generateMeta'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import ContactForm from '@/components/forms/ContactForm'
import FAQJsonLd from '@/components/seo/FAQJsonLd'

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
    code: '[ ARCHITECTURE // 01 ]',
    badge: 'BILINGUAL EDGE',
    title: 'Custom EN/AR Exporter Site',
    description:
      'Precision-engineered bilingual English and Arabic export platform built for high-trust cross-border trade. Native RTL layout support, lightning-fast edge delivery, and institutional positioning that converts international buyers.',
    specs: [
      { label: 'Framework', value: 'Next.js App Router' },
      { label: 'Typography', value: 'Vazirmatn + Playfair' },
      { label: 'Localization', value: 'Native RTL/LTR' },
      { label: 'Edge TTFB', value: '< 200ms Global' },
    ],
    features: [
      'Bilingual EN/AR architecture with native RTL typography and logical CSS',
      'Container and volume-optimized product catalog showcase',
      'Zero-CDN dependency with self-hosted assets for high-security markets',
      'Verified OpenGraph export metadata and rich schema structured data',
    ],
  },
  {
    index: '02',
    code: '[ COMMERCE // 02 ]',
    badge: 'RFQ AUTOMATION',
    title: 'Embedded RFQ Cart for Container Quotes',
    description:
      'Specialized commercial request-for-quote architecture designed specifically for multi-container volumes, custom Incoterm selections (FOB, CIF, CFR), metric tonnage, and instant institutional inquiry capture.',
    specs: [
      { label: 'Quoting Engine', value: 'FCL & Metric Tonnage' },
      { label: 'Trade Terms', value: 'Incoterms 2020 Rules' },
      { label: 'Routing', value: 'Instant Sales Webhook' },
      { label: 'Integration', value: 'Embeddable Widget' },
    ],
    features: [
      'Multi-item container load and tonnage quote builder',
      'Incoterms 2020 (FOB, CIF, CFR, EXW) and destination port selector',
      'Instant routing to sales desk with qualified trade specifications',
      'Zero-friction distributor capture bypassing manual spreadsheet friction',
    ],
  },
  {
    index: '03',
    code: '[ STEWARDSHIP // 03 ]',
    badge: 'MANAGED OPS',
    title: '12 Months Growth SaaS Management',
    description:
      'Complete operational stewardship included for a full year. We manage dedicated infrastructure, continuous performance optimizations, CRM synchronization, and technical operations so your export desk stays focused on trade execution.',
    specs: [
      { label: 'Infrastructure', value: 'Dedicated Cloud + SSL' },
      { label: 'Availability', value: '99.9% Uptime Telemetry' },
      { label: 'SLA Window', value: '< 24h Turnaround' },
      { label: 'Duration', value: '12 Months Included' },
    ],
    features: [
      'Dedicated enterprise infrastructure and continuous SLA monitoring',
      'Continuous security hardening, dependency updates, and zero-downtime deploys',
      'Dedicated technical steward with 1-business-day turnaround for updates',
      'Lead pipeline verification and automated CRM lead synchronization',
    ],
  },
]

const MILESTONES = [
  {
    step: 'MILESTONE 01',
    duration: 'Sprint 1 · Days 01–07',
    title: 'Core Architecture & Platform Setup',
    description:
      'Rapid delivery and deployment of the custom bilingual EN/AR exporter site foundation, product catalog ingestion, and embedded container-load RFQ quoting cart in a private staging environment.',
    steps: [
      {
        num: '01',
        name: 'Commercial & Catalog Intake',
        desc: 'Technical audit of export product lines, container metrics, packaging specs, and target trading jurisdictions.',
      },
      {
        num: '02',
        name: 'Bilingual Design & RTL Calibration',
        desc: 'Custom English and Arabic typographic engineering using self-hosted Vazirmatn and Institutional Elite layout primitives.',
      },
      {
        num: '03',
        name: 'Embedded RFQ Cart Configuration',
        desc: 'Container-load quoting engine setup with metric tonnage calculations, Incoterms 2020 rules, and destination ports.',
      },
      {
        num: '04',
        name: 'Staging Deployment & Verification',
        desc: 'Interactive client walkthrough on private staging URL with cross-device RTL audit and commercial sign-off.',
      },
    ],
    exitGate: {
      label: 'GATE 01 VERIFICATION',
      criteria: 'Bilingual staging live · RFQ quoting verified · Catalog signed off',
    },
  },
  {
    step: 'MILESTONE 02',
    duration: 'Sprint 2 · Days 08–21',
    title: 'Production Hardening & Growth Handoff',
    description:
      'Apex domain routing, edge security hardening, sales desk notification routing, and seamless onboarding into the 12-month Growth-tier SaaS stewardship program.',
    steps: [
      {
        num: '05',
        name: 'Apex Domain & Edge CDN Provisioning',
        desc: 'Custom domain routing, automated SSL certificate issuance, and sub-second global edge network warmup.',
      },
      {
        num: '06',
        name: 'Multi-Device RTL & Security Audit',
        desc: 'Rigorous cross-browser verification across mobile/desktop viewports and security header hardening.',
      },
      {
        num: '07',
        name: 'Sales Desk Routing & Webhooks',
        desc: 'Commercial email dispatch, webhook notification routing, and test trade inquiry reconciliation.',
      },
      {
        num: '08',
        name: 'Growth SaaS Onboarding & SLA Activation',
        desc: 'Workspace provisioning, technical steward assignment, and activation of 12-month managed operations.',
      },
    ],
    exitGate: {
      label: 'GATE 02 VERIFICATION',
      criteria: '100% Production live · Commercial desk armed · 12-Month SLA active',
    },
  },
]

const QUALIFICATION_CRITERIA = {
  ideal: [
    {
      title: 'Verified Commercial Supply Capacity',
      desc: 'Established manufacturer, producer, or licensed export trading desk with proven supply volume and documentation.',
    },
    {
      title: 'B2B Wholesale & Container Scale',
      desc: 'Organizations transacting in multi-container (FCL), metric tonnage, or full-pallet wholesale quantities.',
    },
    {
      title: 'Strategic Gulf & International Focus',
      desc: 'Exporters targeting GCC, MENA, or global cross-border markets requiring high-trust bilingual English/Arabic presentation.',
    },
    {
      title: 'Transition from Manual Quoting',
      desc: 'Trade desks wanting to eliminate unstructured WhatsApp/PDF quote chaos with automated digital RFQ cart capture.',
    },
    {
      title: 'Zero-Overhead Stewardship Model',
      desc: 'Leadership seeking a turnkey technical partner to handle infrastructure and maintenance without hiring internal IT.',
    },
  ],
  notFit: [
    {
      title: 'Consumer D2C & Retail Ecommerce',
      desc: 'Single-item consumer storefronts, dropshippers, or B2C retail carts without container or tonnage scale.',
    },
    {
      title: 'Speculative or Pre-Production Ventures',
      desc: 'Entities without active manufacturing capacity, export licenses, or verified inventory allocations.',
    },
    {
      title: 'Unpaid Design Competitions / Speculative RFPs',
      desc: 'Organizations seeking speculative pitches rather than deploying proven institutional trade architecture.',
    },
    {
      title: 'Self-Managed Legacy Hosting',
      desc: 'Teams requiring internal cPanel/PHP server management instead of our high-security managed cloud infrastructure.',
    },
    {
      title: 'Unmandated Intermediaries',
      desc: 'Brokers operating without direct factory mandates, verified allocations, or commercial principal status.',
    },
  ],
}

const LAUNCHPAD_FAQS = [
  {
    question: 'What is included in the 2-milestone delivery schedule?',
    answer:
      'Milestone 1 (Day 7) delivers the core bilingual EN/AR exporter platform, custom catalog structure, and embedded container-load RFQ cart in a staging environment. Milestone 2 (Day 21) completes production domain routing, edge security hardening, sales desk notifications, and onboards your team to 12 months of Growth-tier SaaS stewardship.',
  },
  {
    question: 'Do we need internal developers or technical staff to maintain the platform?',
    answer:
      'None. The Launchpad package includes 12 months of managed technical stewardship. Our engineering team handles updates, edge security patches, product catalog additions, and infrastructure maintenance. Your export desk focuses 100% on closing trade volume.',
  },
  {
    question: 'How does the bilingual English and Arabic layout work?',
    answer:
      'Our architecture implements native logical CSS with self-hosted Vazirmatn typography for Arabic and Inter/Playfair Display for English. The layout automatically adapts to true right-to-left (RTL) reading patterns without layout shifts, ensuring international distributor confidence across both Western and Middle Eastern trade desks.',
  },
  {
    question: 'Can the RFQ cart handle custom container volumes, metric tonnage, and Incoterms?',
    answer:
      'Yes. Unlike consumer shopping carts, the Launchpad RFQ engine is custom-built for bulk export trade. It supports metric tonnage inputs, container capacity checks (20ft/40ft FCL), Incoterms 2020 selection (FOB, CIF, CFR, EXW), and global destination port specification.',
  },
  {
    question: 'Who owns the domain, code, and trade inquiry data?',
    answer:
      'You maintain 100% ownership of your domain, brand assets, and customer inquiry data. All leads captured through the RFQ engine are routed directly and securely to your designated commercial desk with zero intermediary lock-in.',
  },
  {
    question: 'What happens after the initial 12 months of managed Growth SaaS?',
    answer:
      'At the end of the 12-month term, you can seamlessly renew managed stewardship at the standard Growth SaaS rate, or transition to autonomous hosting with complete documentation. There are zero penalties, zero lock-in, and zero proprietary runtime dependencies.',
  },
]

export default function LaunchpadPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* ── 00. Hero Section (Obsidian / Dark) ── */}
      <AnimatedSection
        id="hero"
        className="on-dark relative isolate flex min-h-[85vh] w-full flex-col justify-center overflow-hidden bg-obsidian pt-36 pb-20 md:pt-44 md:pb-28 text-start"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <Container>
          <div className="mx-auto max-w-5xl">
            <Reveal y={10} duration={0.5}>
              <div className="eyebrow eyebrow-dark mb-8">
                <span className="eyebrow-index" aria-hidden>
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                [ 01 — THE OFFER SPECIFICATION ]
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
              <p className="mb-10 max-w-3xl text-lede font-light text-muted-dark">
                Purpose-built for modern global trading entities. Transform your export operation into an asynchronous sales machine—capturing, qualifying, and closing international distributor and wholesale inquiries 24/7 across English and Arabic markets without operational drag.
              </p>
            </Reveal>

            <Reveal y={14} delay={0.28}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="#allocation" className="btn-primary min-h-[48px] px-8 py-4 font-semibold">
                  [ SECURE YOUR ALLOCATION ]
                </Link>
                <Link href="#deliverables" className="btn-ghost min-h-[48px] px-8 py-4 font-semibold">
                  [ EXPLORE DELIVERABLES ]
                </Link>
              </div>
            </Reveal>

            {/* Survey strip / Technical Spec Ledger */}
            <Reveal y={14} delay={0.34}>
              <div className="mt-16 border-t border-rule-dark pt-8">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-xs">
                  <div className="border-e border-rule-dark pe-4">
                    <span className="block text-label uppercase text-muted-dark">Program Format</span>
                    <span className="mt-1 block font-medium text-white">Turnkey Export Stack</span>
                  </div>
                  <div className="border-e border-rule-dark pe-4">
                    <span className="block text-label uppercase text-muted-dark">Delivery Cadence</span>
                    <span className="mt-1 block font-medium text-white">21 Days (2 Milestones)</span>
                  </div>
                  <div className="border-e border-rule-dark pe-4">
                    <span className="block text-label uppercase text-muted-dark">Target Markets</span>
                    <span className="mt-1 block font-medium text-white">GCC · MENA · Global</span>
                  </div>
                  <div>
                    <span className="block text-label uppercase text-muted-dark">Allocation Status</span>
                    <span className="mt-1 flex items-center gap-2 font-medium text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                      Active Cohort
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 01. Deliverables Breakdown (What's Included) ── */}
      <AnimatedSection id="deliverables" className="w-full border-b border-rule bg-surface py-24 md:py-32 text-obsidian">
        <Container>
          <SectionHeading
            tone="light"
            index="01"
            eyebrow="SCOPE SPECIFICATION"
            title="Three Core Pillars. One Unified Architecture."
            description="Every asset engineered from raw code for institutional B2B cross-border trade—eliminating third-party plugin fragility and operational drag."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="frame">
            <StaggerContainer
              className="grid grid-cols-1 border border-rule md:grid-cols-3 divide-y divide-rule md:divide-y-0 md:divide-x"
              staggerChildren={0.12}
              delayChildren={0.1}
            >
              {DELIVERABLES.map((item) => (
                <StaggerItem
                  key={item.index}
                  className="group relative flex flex-col bg-surface p-8 transition-all duration-300 hover:bg-cream/40 md:p-10"
                >
                  {/* Top hairline hover sweep */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left rtl:origin-right scale-x-0 bg-emerald transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                  />

                  {/* Header: Blueprint Eyebrow + Verified Badge */}
                  <div className="mb-6 flex items-center justify-between font-mono text-label uppercase">
                    <span className="text-muted tracking-widest">{item.code}</span>
                    <span className="inline-flex items-center gap-1.5 border border-emerald/20 bg-emerald/10 px-2 py-0.5 font-medium text-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden />
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mb-4 font-serif text-2xl font-semibold text-obsidian">
                    {item.title}
                  </h3>
                  <p className="mb-8 text-base font-light leading-relaxed text-muted">
                    {item.description}
                  </p>

                  {/* Cloudflare-style Technical Specification Ledger */}
                  <div className="mb-8 border-y border-rule py-4">
                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      {item.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <span className="block text-label uppercase text-muted">{spec.label}</span>
                          <span className="block font-medium text-obsidian">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verified Feature Checklist */}
                  <ul className="mt-auto space-y-3 font-mono text-xs text-obsidian/90">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span className="text-emerald font-bold shrink-0" aria-hidden>+</span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 02. 2-Milestone Delivery Process Timeline ── */}
      <AnimatedSection id="timeline" className="w-full border-b border-rule bg-cream py-24 md:py-32 text-obsidian">
        <Container>
          <SectionHeading
            tone="light"
            index="02"
            eyebrow="EXECUTION CADENCE"
            title="2-Milestone Delivery Architecture."
            description="A structured 21-day deployment pipeline engineered for velocity and absolute precision—transitioning your export desk from concept to live global inquiry capture."
            className="mb-16 md:mb-20 text-start"
          />

          {/* Summary Cadence Strip */}
          <div className="mb-12 border border-rule bg-surface p-4 font-mono text-xs md:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-rule">
              <div className="pe-4">
                <span className="text-label uppercase text-muted">Total Program Timeline</span>
                <span className="mt-1 block font-serif text-lg font-semibold text-obsidian">21 Calendar Days</span>
              </div>
              <div className="pt-3 sm:pt-0 sm:px-4">
                <span className="text-label uppercase text-muted">Execution Architecture</span>
                <span className="mt-1 block font-mono text-xs font-medium text-obsidian">Sprint 1 (Days 1–7) ➔ Sprint 2 (Days 8–21)</span>
              </div>
              <div className="pt-3 sm:pt-0 sm:ps-4">
                <span className="text-label uppercase text-muted">Governance Guarantee</span>
                <span className="mt-1 flex items-center gap-2 font-mono text-xs font-medium text-emerald">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden />
                  Hard Delivery Gates & Daily Verification
                </span>
              </div>
            </div>
          </div>

          {/* Diamond Milestone Cards Grid */}
          <div className="frame">
            <StaggerContainer
              className="grid grid-cols-1 border border-rule lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-rule bg-surface"
              staggerChildren={0.14}
              delayChildren={0.15}
            >
              {MILESTONES.map((m) => (
                <StaggerItem
                  key={m.step}
                  className="group relative flex flex-col p-8 transition-all duration-300 hover:bg-cream/30 md:p-12"
                >
                  {/* Top hairline hover sweep */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left rtl:origin-right scale-x-0 bg-emerald transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                  />

                  {/* Header: Diamond indicator & phase badge */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4 font-mono text-label uppercase">
                    <div className="flex items-center gap-3">
                      {/* Diamond Milestone Node */}
                      <span
                        aria-hidden
                        className="flex h-4 w-4 shrink-0 rotate-45 items-center justify-center border-2 border-emerald bg-cream transition-transform duration-300 group-hover:scale-110"
                      >
                        <span className="h-1.5 w-1.5 bg-emerald" />
                      </span>
                      <span className="font-semibold text-emerald">[ {m.step} ]</span>
                    </div>
                    <span className="border border-rule px-2.5 py-1 text-muted">{m.duration}</span>
                  </div>

                  <h3 className="mb-3 font-serif text-2xl md:text-3xl font-semibold text-obsidian">
                    {m.title}
                  </h3>
                  <p className="mb-8 text-base font-light leading-relaxed text-muted">
                    {m.description}
                  </p>

                  {/* Step Flow List */}
                  <div className="mb-8 border-t border-rule pt-6">
                    <div className="mb-4 font-mono text-label uppercase tracking-widest text-muted">
                      Step-By-Step Sprint Flow:
                    </div>
                    <ol className="space-y-4">
                      {m.steps.map((st, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-4">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-rule bg-cream font-mono text-[11px] font-semibold text-obsidian">
                            {st.num}
                          </span>
                          <div>
                            <div className="font-mono text-xs font-semibold uppercase text-obsidian">{st.name}</div>
                            <div className="text-xs font-light leading-relaxed text-muted mt-0.5">{st.desc}</div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Exit Gate Specification */}
                  <div className="mt-auto border-t border-rule pt-6">
                    <div className="flex items-center justify-between border border-emerald/20 bg-emerald/5 p-3.5 font-mono text-xs">
                      <span className="text-label uppercase text-emerald font-semibold">{m.exitGate.label}</span>
                      <span className="text-muted text-[11px]">{m.exitGate.criteria}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 03. Who It's For (Target Persona & Qualification Checklist) ── */}
      <AnimatedSection id="qualification" className="w-full border-b border-rule bg-surface py-24 md:py-32 text-obsidian">
        <Container>
          <SectionHeading
            tone="light"
            index="03"
            eyebrow="QUALIFICATION MATRIX"
            title="Target Persona & Eligibility Framework."
            description="Launchpad is engineered exclusively for trade entities operating at volume. We evaluate every applicant against strict operational criteria."
            className="mb-16 md:mb-20 text-start"
          />

          {/* Apollo-Style Audience Persona Taxonomy Strip */}
          <div className="mb-12 border border-rule bg-cream p-4 font-mono text-xs md:p-6">
            <div className="mb-3 font-mono text-label uppercase tracking-widest text-muted">
              Audience Builder Criteria (Target Persona Definition):
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono text-xs">
              <div className="border-e border-rule pe-4">
                <span className="block text-label uppercase text-muted">Primary Sectors</span>
                <span className="mt-1 block font-medium text-obsidian">Agri-Commodities · Chemicals · Metals · Building Materials · FMCG</span>
              </div>
              <div className="border-e border-rule pe-4">
                <span className="block text-label uppercase text-muted">Order Volume</span>
                <span className="mt-1 block font-medium text-obsidian">Container-Load (FCL) · Metric Tonnage · Wholesale Pallets</span>
              </div>
              <div className="border-e border-rule pe-4">
                <span className="block text-label uppercase text-muted">Target Geographies</span>
                <span className="mt-1 block font-medium text-obsidian">GCC & MENA Corridors · South Asia · Europe · Global</span>
              </div>
              <div>
                <span className="block text-label uppercase text-muted">Decision Maker</span>
                <span className="mt-1 block font-medium text-obsidian">Managing Directors · Export Sales Desks · Trade Principals</span>
              </div>
            </div>
          </div>

          {/* Dual-Column Qualification Framework */}
          <div className="frame">
            <div className="grid grid-cols-1 border border-rule lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-rule bg-surface">
              {/* Left Column: Ideal Fit */}
              <div className="p-8 md:p-12">
                <div className="mb-6 flex items-center justify-between font-mono text-label uppercase">
                  <span className="text-emerald font-semibold tracking-wider">[ 01 // QUALIFIED PROFILE ]</span>
                  <span className="inline-flex items-center gap-1.5 border border-emerald/20 bg-emerald/10 px-2 py-0.5 text-emerald">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden />
                    IDEAL CANDIDATE
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-2xl font-semibold text-obsidian">
                  Who Launchpad Is Engineered For
                </h3>
                <p className="mb-8 text-base font-light text-muted">
                  Organizations that meet our operational threshold and derive immediate asymmetric ROI:
                </p>
                <ul className="space-y-4">
                  {QUALIFICATION_CRITERIA.ideal.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span
                        aria-hidden
                        className="flex h-6 w-6 shrink-0 items-center justify-center border border-emerald/30 bg-emerald/10 font-mono text-xs font-bold text-emerald"
                      >
                        ✓
                      </span>
                      <div>
                        <span className="block font-sans text-sm font-semibold text-obsidian">{item.title}</span>
                        <span className="block text-xs font-light leading-relaxed text-muted mt-0.5">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Not a Fit */}
              <div className="p-8 md:p-12 bg-cream/30">
                <div className="mb-6 flex items-center justify-between font-mono text-label uppercase">
                  <span className="text-muted font-semibold tracking-wider">[ 02 // NON-QUALIFYING ]</span>
                  <span className="inline-flex items-center gap-1.5 border border-rule px-2 py-0.5 text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted" aria-hidden />
                    IMMEDIATE PASS
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-2xl font-semibold text-obsidian">
                  Who Should Not Apply
                </h3>
                <p className="mb-8 text-base font-light text-muted">
                  Profiles outside our technical mandate where our architecture is not suited:
                </p>
                <ul className="space-y-4">
                  {QUALIFICATION_CRITERIA.notFit.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span
                        aria-hidden
                        className="flex h-6 w-6 shrink-0 items-center justify-center border border-rule bg-surface font-mono text-xs font-bold text-muted"
                      >
                        ✕
                      </span>
                      <div>
                        <span className="block font-sans text-sm font-semibold text-obsidian">{item.title}</span>
                        <span className="block text-xs font-light leading-relaxed text-muted mt-0.5">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 04. FAQ (Structured Accordion) ── */}
      <AnimatedSection id="faq" className="w-full border-b border-rule bg-cream py-24 md:py-32 text-obsidian">
        <FAQJsonLd questions={LAUNCHPAD_FAQS} />
        <Container>
          <SectionHeading
            tone="light"
            index="04"
            eyebrow="CLARITY & GOVERNANCE"
            title="Frequently Addressed Inquiries."
            description="Direct answers regarding delivery cadence, technical ownership, multilingual capabilities, and our 12-month managed growth commitment."
            className="mb-16 md:mb-20 text-start"
          />

          <div className="mx-auto max-w-4xl border-t border-rule">
            {LAUNCHPAD_FAQS.map((q, i) => (
              <details key={i} className="group border-b border-rule">
                <summary className="flex cursor-pointer list-none items-center justify-between py-7 text-start [&::-webkit-details-marker]:hidden">
                  <div className="flex items-baseline gap-4 sm:gap-6 pe-4">
                    <span className="font-mono text-label text-emerald font-semibold" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-obsidian transition-colors group-hover:text-emerald">
                      {q.question}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="relative flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300 ease-[var(--ease-cinematic)] group-open:rotate-45"
                  >
                    <span className="absolute h-px w-4 bg-obsidian transition-colors group-hover:bg-emerald" />
                    <span className="absolute h-4 w-px bg-obsidian transition-colors group-hover:bg-emerald" />
                  </span>
                </summary>
                <div className="pb-8 ps-8 sm:ps-12 pe-4 text-base sm:text-lg font-light leading-relaxed text-muted">
                  <p>{q.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </AnimatedSection>

      {/* ── 05. Order CTA & Allocation Anchor (Obsidian / Dark) ── */}
      <AnimatedSection id="allocation" className="on-dark relative isolate w-full overflow-hidden bg-obsidian py-24 md:py-32 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <Container>
          <div className="frame frame-dark overflow-hidden border border-rule-dark">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Flagship Anchor, Guarantees & Pricing */}
              <div className="flex flex-col justify-between bg-obsidian p-8 lg:col-span-5 lg:p-12 xl:p-16">
                <div>
                  <div className="eyebrow eyebrow-dark mb-6">
                    <span className="eyebrow-index" aria-hidden>
                      <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                    </span>
                    [ 05 — FLAGSHIP ENGAGEMENT ]
                  </div>

                  <h2 className="mb-6 font-serif text-headline font-semibold text-white">
                    Initiate Your Launchpad.
                  </h2>

                  <p className="mb-8 text-lede font-light text-muted-dark">
                    Secure your delivery milestone allocation. Our architecture team reviews your export product specifications and confirms milestone schedules within one business day.
                  </p>

                  {/* Pricing Summary (Bloom Pattern) */}
                  <div className="mb-8 border border-rule-dark bg-surface/5 p-6 font-mono">
                    <div className="flex items-baseline justify-between border-b border-rule-dark pb-3">
                      <span className="text-label uppercase text-muted-dark">Turnkey Program Investment</span>
                      <span className="font-serif text-2xl font-semibold text-white">$1,500 <span className="font-mono text-xs text-muted-dark">USD</span></span>
                    </div>
                    <div className="pt-3 text-xs text-muted-dark space-y-1.5">
                      <div className="flex justify-between">
                        <span>Milestone 01 Allocation (50%):</span>
                        <span className="text-white">$750 USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Milestone 02 Handoff (50%):</span>
                        <span className="text-white">$750 USD</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-rule-dark text-[11px] text-success">
                        <span>Includes 12 Months Growth SaaS:</span>
                        <span>Covered (Value $1,200/yr)</span>
                      </div>
                    </div>
                  </div>

                  {/* Transparent Guarantees (Bloom Pattern) */}
                  <div className="mb-8 space-y-3 font-mono text-xs text-white/85">
                    <div className="flex items-start gap-3">
                      <span className="text-success shrink-0" aria-hidden>✓</span>
                      <span><strong>21-Day Hard Delivery Guarantee:</strong> Verified exit gates or daily credit schedule.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-success shrink-0" aria-hidden>✓</span>
                      <span><strong>100% IP & Asset Ownership:</strong> Domain, custom code, and lead data belong entirely to you.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-success shrink-0" aria-hidden>✓</span>
                      <span><strong>Dedicated Technical Steward:</strong> Direct concierge SLA with &lt; 24h turnaround for 12 months.</span>
                    </div>
                  </div>
                </div>

                {/* Consultation Routes & Direct Channels */}
                <div className="border-t border-rule-dark pt-8">
                  <h3 className="eyebrow eyebrow-dark mb-4">Direct Consultation Routes</h3>
                  <ul className="divide-y divide-rule-dark font-mono text-xs text-white/80">
                    <li className="flex items-center justify-between py-2.5">
                      <span className="text-muted-dark uppercase text-[11px]">Commercial Email:</span>
                      <span className="text-white">hello@exvorta.com</span>
                    </li>
                    <li className="flex items-center justify-between py-2.5">
                      <span className="text-muted-dark uppercase text-[11px]">Trade Desk HQ:</span>
                      <span className="text-white">Dubai, UAE — Global Reach</span>
                    </li>
                    <li className="flex items-center justify-between py-2.5">
                      <span className="text-muted-dark uppercase text-[11px]">SLA Response:</span>
                      <span className="text-success">&lt; 24 Hours Guaranteed</span>
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/rfq"
                      className="btn-ghost w-full justify-center text-center font-mono text-label"
                    >
                      [ RFQ CART CONSULTATION ]
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Allocation Application Form */}
              <div id="contact" className="flex flex-col justify-center bg-surface p-8 text-obsidian lg:col-span-7 lg:p-12 xl:p-16">
                <div className="mb-8 border-b border-rule pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-label uppercase tracking-widest text-muted">
                      [ ALLOCATION APPLICATION ]
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-label uppercase text-emerald">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" aria-hidden />
                      APPLICATIONS ACTIVE
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-light text-muted">
                    Submit your export specifications below to reserve an upcoming delivery milestone cohort.
                  </p>
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
