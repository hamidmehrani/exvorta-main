import React from 'react'
import type { Metadata } from 'next'
import Link from '@/components/ui/AppLink'
import { generateMeta } from '@/utils/generateMeta'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import ServiceSchema from '@/components/seo/ServiceSchema'
import FAQJsonLd from '@/components/seo/FAQJsonLd'
import ConciergeIntakeForm from '@/components/forms/ConciergeIntakeForm'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Concierge 24-Hour Freight Audit | Exvorta',
    description:
      'Send your last 3 shipments (CI, PL, BL) for a complimentary 24-hour forensic audit. Uncover carrier margin leakage, customs demurrage risks, and tariff optimizations.',
    url: '/concierge',
  })
}

const FORENSIC_PILLARS = [
  {
    pillarId: '01',
    code: '[ PILLAR 01 // FREIGHT BENCHMARK ]',
    badge: 'RATE LEAKAGE',
    title: 'Rate Benchmark & Margin Leakage',
    description:
      'Ocean and air baseline rates cross-referenced against Drewry World Container Index, Shanghai Containerized Freight Index (SCFI), and Platts benchmark data. We pinpoint unannounced carrier surcharge creep and forwarder margin inflation.',
    checks: [
      'Baseline ocean/air rates indexed against Drewry & SCFI spot freight averages',
      'Granular carrier surcharge forensic breakdown (BAF, CAF, PSS, GRI, EBS)',
      'Hidden forwarder currency markup & documentation fee reconciliation',
      'Volume-tier discount validation and freight contract rate gap analysis',
    ],
  },
  {
    pillarId: '02',
    code: '[ PILLAR 02 // CUSTOMS & TARIFF ]',
    badge: 'GCC COMPLIANCE',
    title: 'GCC Customs & Tariff Compliance',
    description:
      'Deep regulatory audit grounded in the Common GCC Customs Law and UAE Federal Customs Authority standards. We audit your Harmonized System (HS) classifications to eliminate duty overpayment and mitigate clearance delays.',
    checks: [
      '6-digit to 8/10-digit GCC HS code classification accuracy verification',
      'Free Trade Agreement (FTA) & CEPA preferential duty tariff validation',
      'Rules of Origin documentation audit to safeguard duty-free exemptions',
      'Strategic tariff reclassification potential under GCC customs regulations',
    ],
  },
  {
    pillarId: '03',
    code: '[ PILLAR 03 // PORT EXPOSURE ]',
    badge: 'DWELL & DEMURRAGE',
    title: 'Demurrage & Detention Exposure',
    description:
      'Granular free-time analysis across major GCC discharge terminals (Jebel Ali, Khalifa Port, Dammam, Jeddah). We identify detention exposure risks and audit terminal handling charges against official port authority tariffs.',
    checks: [
      'Carrier line free-time terms evaluated against actual discharge dwell times',
      'Port storage and container detention fee exposure risk modeling',
      'Terminal Handling Charges (THC) and gate fee reconciliation',
      'Actionable detention avoidance protocols for commercial trade desks',
    ],
  },
] as const

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    timeline: 'T+0h · Intake & Ingestion',
    title: 'Submit Shipment Parameters',
    description:
      'Provide origin, destination, container metrics, and forwarder rates through our secure intake form, or paste a link to your last 3 shipments (Commercial Invoices, Packing Lists, Bills of Lading / Air Waybills).',
    deliverable: 'Commercial Intake Logged & 24h SLA Active',
  },
  {
    step: '02',
    timeline: 'T+6h · Algorithmic Analysis',
    title: '24-Hour Deep Forensic Scan',
    description:
      'Our trade audit desk cross-references your rates against global Drewry/SCFI indices, audits HS classifications against Common GCC Customs Law, and models port demurrage exposure.',
    deliverable: '100-Point Export Index Diagnostic Computed',
  },
  {
    step: '03',
    timeline: 'T+24h · Executive Delivery',
    title: 'Video Dossier & Preloaded Workspace',
    description:
      'Receive a confidential executive video walkthrough teardown by a senior trade architect, an itemized PDF savings report, and a preloaded Exvorta digital workspace configured for your trade lanes.',
    deliverable: 'Private Video Teardown + Digital Workspace',
  },
] as const

const FAQ_ITEMS = [
  {
    question: 'What documents should I submit for the 24-hour audit?',
    answer:
      'We recommend submitting details or documents for your last 3 completed shipments on any primary trade lane. The ideal bundle includes: Commercial Invoice (CI), Packing List (PL), and Bill of Lading (B/L) or Air Waybill (AWB). You are welcome to redact supplier or customer names; we only require origins, destinations, container volumes, line items, HS codes, and line-item rate charges.',
  },
  {
    question: 'How is the 24-hour turnaround guaranteed?',
    answer:
      'Once your shipment parameters and documents or cloud link are logged, our Dubai trade desk initiates audit processing immediately. Your private video teardown and structured report are delivered to your corporate email within 24 business hours (GST / UTC+4).',
  },
  {
    question: 'Is there any fee or commitment for the concierge audit?',
    answer:
      'Zero fee and zero commitment. The 24-hour forensic audit is complimentary under Exvorta GTM Pillar 02. It serves as an institutional proof-of-work diagnostic. You retain all findings, rate comparisons, and tariff recommendations regardless of whether you engage Exvorta for ongoing trade infrastructure.',
  },
  {
    question: 'How is my confidential trade and pricing data protected?',
    answer:
      'Exvorta operates under Enterprise Zero-Trust principles. All data is encrypted via TLS 1.3 in transit and at rest, governed by strict confidentiality non-disclosure. No client documents or proprietary pricing details are ever stored in public repositories or shared with third-party carriers or competitors.',
  },
  {
    question: 'What if our documents are stored in Dropbox, Google Drive, or OneDrive?',
    answer:
      'Simply paste the read-only cloud share link directly into the intake form. Alternatively, after submitting the intake form, reply directly to your confirmation email attaching the PDF files.',
  },
  {
    question: 'What deliverables will I receive within 24 hours?',
    answer:
      'You receive an executive video walkthrough teardown by a senior trade architect detailing your top 3 friction points, an itemized PDF diagnostic score against the 100-Point Export Index, and an invite to a preloaded Exvorta workspace tailored to your trade corridors.',
  },
]

export default function ConciergePage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* JSON-LD Schemas */}
      <ServiceSchema
        name="Concierge 24-Hour Freight Audit"
        description="Send your last 3 shipments (CI, PL, BL) for a complimentary 24-hour forensic audit. Uncover carrier margin leakage, customs demurrage risks, and tariff optimizations."
        serviceType="Freight & Customs Forensic Audit"
        url="/concierge"
        offers={{
          price: 0,
          priceCurrency: 'USD',
          description: 'Complimentary 24-Hour Forensic Audit & Executive Dossier',
        }}
      />
      <FAQJsonLd questions={FAQ_ITEMS} />

      {/* ─── 01. Hero Section (Obsidian Dark Theme) ───────────────────────────────── */}
      <section
        id="hero"
        className="on-dark relative isolate flex min-h-[85vh] w-full flex-col justify-center overflow-hidden bg-obsidian text-paper pt-36 pb-20 md:pt-44 md:pb-28 text-start"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0 opacity-40" />
        </div>

        <Container>
          <div className="mx-auto max-w-5xl">
            {/* Eyebrow */}
            <div className="eyebrow eyebrow-dark mb-6">
              <span className="eyebrow-index" aria-hidden>
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
              <span>[ GTM PILLAR 02 // 24-HOUR CONCIERGE AUDIT ]</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 font-serif text-headline font-semibold text-paper md:text-display">
              Send Your Last 3 Shipments. Get a 24-Hour Forensic Audit.
            </h1>

            {/* Subtitle */}
            <p className="mb-8 max-w-3xl text-lede font-light text-muted-dark leading-relaxed">
              We benchmark your carrier rates, audit your customs classifications, and identify hidden
              demurrage leaks — delivered in a private executive video dossier and preloaded workspace. Zero
              cost, zero commitment.
            </p>

            {/* SLA Guarantee Badge & CTA Action */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link href="#intake-form" className="btn-primary">
                [ COMMENCE 24H INTAKE ]
              </Link>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-[4px] border border-emerald/30 bg-emerald/10 font-mono text-xs text-emerald tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
                </span>
                <span>Guaranteed 24-Hour Turnaround • Zero Disruption</span>
              </div>
            </div>

            {/* Key Metrics Ledger */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-rule-dark pt-8 font-mono">
              <div className="border-s border-rule-dark ps-4">
                <span className="block text-[10px] uppercase tracking-widest text-muted-dark">SLA Window</span>
                <span className="text-xl sm:text-2xl font-bold text-paper">&lt; 24 Hours</span>
                <span className="block text-[10px] text-emerald mt-0.5">Dubai Desk (GST / UTC+4)</span>
              </div>
              <div className="border-s border-rule-dark ps-4">
                <span className="block text-[10px] uppercase tracking-widest text-muted-dark">Diagnostic Depth</span>
                <span className="text-xl sm:text-2xl font-bold text-paper">100-Point Index</span>
                <span className="block text-[10px] text-muted-dark mt-0.5">Drewry & SCFI Baselines</span>
              </div>
              <div className="border-s border-rule-dark ps-4">
                <span className="block text-[10px] uppercase tracking-widest text-muted-dark">Forensic Scope</span>
                <span className="text-xl sm:text-2xl font-bold text-paper">3 Core Pillars</span>
                <span className="block text-[10px] text-muted-dark mt-0.5">Rates • Customs • Demurrage</span>
              </div>
              <div className="border-s border-rule-dark ps-4">
                <span className="block text-[10px] uppercase tracking-widest text-muted-dark">Fee & Obligation</span>
                <span className="text-xl sm:text-2xl font-bold text-paper">$0 / Complimentary</span>
                <span className="block text-[10px] text-emerald mt-0.5">Zero Lock-in Contract</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 02. Three-Pillar Forensic Scope ───────────────────────────────────────── */}
      <section id="scope" className="py-20 md:py-28 border-b border-rule bg-cream">
        <Container>
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="[ SYSTEM AUDIT PARAMETERS ]"
              index="01"
              title="Three-Pillar Forensic Audit Framework"
              description="Every submitted shipment bundle is systematically analyzed against global carrier indices, GCC customs jurisprudence, and terminal tariff schedules."
              className="mb-14"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FORENSIC_PILLARS.map((pillar) => (
                <div
                  key={pillar.pillarId}
                  className="flex flex-col justify-between border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm hover:border-obsidian/40 transition-colors"
                >
                  <div>
                    {/* Pillar Header */}
                    <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                        {pillar.code}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-emerald/10 text-emerald uppercase font-semibold">
                        {pillar.badge}
                      </span>
                    </div>

                    {/* Pillar Title */}
                    <h3 className="font-serif text-xl font-semibold text-obsidian mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    {/* Forensic Checks */}
                    <div className="border-t border-rule pt-4">
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-obsidian font-semibold mb-3">
                        Diagnostic Verification:
                      </span>
                      <ul className="space-y-2">
                        {pillar.checks.map((chk, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted leading-snug">
                            <svg
                              className="h-3.5 w-3.5 text-emerald shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{chk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 03. How It Works (3-Step Pipeline) ────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-28 border-b border-rule bg-surface-2">
        <Container>
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="[ 24-HOUR PIPELINE PROTOCOL ]"
              index="02"
              title="How the Concierge Audit Operates"
              description="A deterministic 3-step turnaround engineered to give supply chain leaders full commercial clarity without disrupting daily trade operations."
              className="mb-14"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="relative flex flex-col justify-between border border-rule bg-surface p-6 sm:p-8 rounded-[4px] shadow-sm"
                >
                  <div>
                    {/* Step Number & Timeline */}
                    <div className="flex items-center justify-between border-b border-rule pb-3 mb-6">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-obsidian bg-obsidian text-paper font-mono text-xs font-bold">
                        {step.step}
                      </span>
                      <span className="font-mono text-[10px] text-emerald uppercase tracking-wider font-semibold">
                        {step.timeline}
                      </span>
                    </div>

                    {/* Step Title & Description */}
                    <h3 className="font-serif text-lg font-semibold text-obsidian mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Output Deliverable */}
                  <div className="border-t border-rule pt-4 mt-auto">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
                      Deliverable Milestone:
                    </span>
                    <span className="font-mono text-xs font-semibold text-obsidian">
                      {step.deliverable}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 04. Intake Form Section ──────────────────────────────────────────────── */}
      <section id="intake-form" className="py-20 md:py-28 border-b border-rule bg-cream">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="[ SECURE INTAKE // DUBAI DESK ]"
              index="03"
              title="Initiate Your 24-Hour Forensic Audit"
              description="Provide parameters for your last 3 shipments below. You may paste a cloud document share link or reply to your email confirmation with attached PDFs."
              className="mb-10"
            />

            {/* Document Guidance Info Card */}
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-rule bg-surface p-5 rounded-[4px] font-mono text-xs text-muted">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald text-[11px] font-bold">
                  ✓
                </span>
                <div>
                  <strong className="text-obsidian block uppercase">1. Commercial Invoice</strong>
                  <span className="text-[11px]">Unit values, Incoterms, currency.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald text-[11px] font-bold">
                  ✓
                </span>
                <div>
                  <strong className="text-obsidian block uppercase">2. Packing List</strong>
                  <span className="text-[11px]">Gross/net weights, CBM, packaging.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald text-[11px] font-bold">
                  ✓
                </span>
                <div>
                  <strong className="text-obsidian block uppercase">3. Bill of Lading / AWB</strong>
                  <span className="text-[11px]">Port of loading/discharge, rates.</span>
                </div>
              </div>
            </div>

            {/* Client Form Component */}
            <ConciergeIntakeForm />
          </div>
        </Container>
      </section>

      {/* ─── 05. Confidentiality & Security Guarantee ─────────────────────────────── */}
      <section id="security" className="py-16 md:py-20 border-b border-rule bg-surface">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="border border-rule bg-surface-2 p-6 sm:p-10 rounded-[4px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-obsidian text-paper">
                    <svg className="h-5 w-5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-emerald font-semibold block">
                      [ INSTITUTIONAL SECURITY ASSURANCE ]
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-obsidian">
                      Enterprise Zero-Trust Confidentiality
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                  AES-256 • TLS 1.3 • STRICT NDA
                </span>
              </div>

              <p className="text-sm text-muted leading-relaxed mb-6">
                All trade data is encrypted in transit and at rest. Covered by strict non-disclosure. Never shared with
                third parties, forwarders, or competing carriers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-rule pt-4 text-xs font-mono text-muted">
                <div>
                  <strong className="text-obsidian block uppercase tracking-wider mb-1">
                    Zero Public Exposure
                  </strong>
                  No client trade documentation ever enters the public code tree or search engine indices.
                </div>
                <div>
                  <strong className="text-obsidian block uppercase tracking-wider mb-1">
                    Redaction Welcome
                  </strong>
                  Commercial names and sensitive counterparty data can be redacted without affecting audit precision.
                </div>
                <div>
                  <strong className="text-obsidian block uppercase tracking-wider mb-1">
                    Automatic Purge
                  </strong>
                  Documents can be purged from audit systems upon completion upon written request.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 06. FAQ Section ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28 bg-cream">
        <Container>
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="[ CONCIERGE PROTOCOL FAQ ]"
              index="04"
              title="Frequently Asked Questions"
              description="Common inquiries regarding our 24-hour freight audit mechanics, data security, and diagnostic deliverables."
              className="mb-14"
            />

            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-rule bg-surface p-6 rounded-[4px] shadow-sm text-start"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-emerald pt-0.5">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-semibold text-obsidian mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Card */}
            <div className="mt-14 border border-rule bg-surface-2 p-8 rounded-[4px] text-center flex flex-col items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald font-semibold mb-2">
                [ READY TO COMMENCE? ]
              </span>
              <h3 className="font-serif text-2xl font-semibold text-obsidian mb-3">
                Send Your Last 3 Shipments Now
              </h3>
              <p className="text-sm text-muted max-w-lg mb-6 leading-relaxed">
                Receive your private 24-hour video audit dossier and preloaded workspace. Zero cost, zero commitment.
              </p>
              <Link href="#intake-form" className="btn-primary">
                [ COMMENCE 24H INTAKE ]
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
