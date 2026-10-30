import React from 'react'
import type { Metadata } from 'next'
import Link from '@/components/ui/AppLink'
import { generateMeta } from '@/utils/generateMeta'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  PARTNER_CATEGORIES,
  COMMISSION_TIERS,
  REFERRAL_WORKFLOW,
  PARTNER_BENEFITS,
  PARTNER_FAQS,
  COMMISSION_HIGHLIGHTS,
  DIRECT_PARTNER_CONTACT,
} from './partners-data'
import { PartnerApplicationForm } from './PartnerApplicationForm'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Partner Program | 20% Revenue Share | Exvorta',
    description:
      'GTM Pillar 4: Channel partner alliance for tax consultants, clearing agents, and free-zone setup agencies. 20% recurring revenue share on referred export systems.',
    url: '/partners',
  })
}

export default function PartnersPage() {
  const partnerJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://exvorta.com/partners#webpage',
        url: 'https://exvorta.com/partners',
        name: 'Partner Program | 20% Revenue Share | Exvorta',
        description:
          'GTM Pillar 4: Channel partner alliance for tax consultants, clearing agents, and free-zone setup agencies. 20% recurring revenue share on referred export systems.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://exvorta.com/#website',
          name: 'Exvorta',
          url: 'https://exvorta.com',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://exvorta.com/partners#faq',
        mainEntity: PARTNER_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  }

  const primaryTiers = COMMISSION_TIERS.slice(0, 3)
  const expansionTier = COMMISSION_TIERS[3]

  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(partnerJsonLd) }}
      />

      {/* ─── 01. Hero Section ──────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="on-dark relative isolate flex min-h-[85vh] w-full flex-col justify-center overflow-hidden bg-obsidian text-paper pt-36 pb-20 md:pt-44 md:pb-28 text-start"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="eyebrow eyebrow-dark mb-6">
              <span className="eyebrow-index" aria-hidden>
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
              <span>[ GTM PILLAR 04 // CHANNEL PARTNER ALLIANCE ]</span>
            </div>

            <h1 className="mb-6 font-serif text-headline font-semibold text-paper md:text-display">
              20% Revenue Share. Institutional Delivery for Your Export Clients.
            </h1>

            <p className="mb-10 max-w-3xl text-lede font-light text-muted-dark leading-relaxed">
              A high-trust channel alliance engineered for tax consultants, clearing agents, and free-zone setup agencies. Equip your cross-border trade clients with verified export platforms, automated Incoterms RFQ engines, and native bilingual architectures — while securing guaranteed 20% recurring revenue share on every referred deployment.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-16">
              <Link href="#apply" className="btn-primary">
                [ ESTABLISH ALLIANCE ]
              </Link>
              <Link href="#commission" className="btn-ghost">
                [ VIEW COMMISSION LEDGER ]
              </Link>
            </div>

            {/* 4 Key Stats */}
            <div className="grid grid-cols-2 gap-6 border-t border-rule-dark pt-10 sm:grid-cols-4">
              {COMMISSION_HIGHLIGHTS.map((stat, idx) => (
                <div key={idx} className="border-s border-rule-dark ps-4">
                  <div className="font-mono text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-emerald font-semibold">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <p className="mt-1 text-xs text-muted-dark leading-relaxed">
                      {stat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 02. Audience Section (#audience) ─────────────────────────────────────── */}
      <section id="audience" className="w-full border-b border-rule bg-cream py-24 md:py-32 text-start">
        <Container>
          <SectionHeading
            eyebrow="[ AUDIENCE // WHO IT'S FOR ]"
            title="Three Pillars of Cross-Border Trade Advisory"
            description="Advisory practices across the UAE and GCC guide exporters through tax, customs, and corporate structuring. Exvorta provides the turnkey digital infrastructure their clients require to transact in global markets."
          />

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {PARTNER_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col justify-between border border-rule bg-surface p-8 shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-rule pb-4 mb-6">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                      {cat.code}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                    {cat.subtitle}
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-obsidian mb-4">
                    {cat.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted mb-8">
                    {cat.description}
                  </p>
                </div>

                <div className="border-t border-rule pt-6">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-obsidian font-semibold mb-3">
                    [ KEY REFERRAL TRIGGERS ]
                  </div>
                  <ul className="space-y-2.5 text-xs text-muted">
                    {cat.referralTriggers.map((trigger, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="text-emerald font-mono select-none">▸</span>
                        <span>{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 03. Commission Section (#commission) ─────────────────────────────────── */}
      <section id="commission" className="w-full border-b border-rule bg-surface-2 py-24 md:py-32 text-start">
        <Container>
          <SectionHeading
            eyebrow="[ COMMERCIALS // 20% REV-SHARE LEDGER ]"
            title="Transparent, Plain-Language Compensation"
            description="Exvorta operates on a deterministic 20% revenue-share model. Every completed client project yields immediate, uncapped commission remitted within Net-15 post-settlement via electronic wire."
          />

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {primaryTiers.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col justify-between border border-rule bg-surface p-8 shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-rule pb-4 mb-6">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                      {tier.code}
                    </span>
                    <span className="border border-rule px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                      {tier.turnaround}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-obsidian mb-4">
                    {tier.name}
                  </h3>

                  <div className="mb-6 flex items-baseline justify-between rounded bg-surface-2 p-4 border border-rule">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Project Investment
                      </div>
                      <div className="font-mono text-2xl font-bold text-obsidian">
                        {tier.projectValue}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-emerald font-semibold">
                        20% Partner Share
                      </div>
                      <div className="font-mono text-2xl font-bold text-emerald">
                        {tier.partnerShare}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-muted mb-8">
                    {tier.description}
                  </p>
                </div>

                <div className="border-t border-rule pt-6">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-obsidian font-semibold mb-3">
                    [ INCLUDED DELIVERY SCOPE ]
                  </div>
                  <ul className="space-y-2.5 text-xs text-muted">
                    {tier.scope.map((item, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="text-emerald font-mono select-none">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons & Retainers Callout */}
          {expansionTier && (
            <div className="mt-8 border border-rule bg-surface p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                    {expansionTier.code}
                  </span>
                  <span className="text-muted font-mono text-xs">·</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {expansionTier.name}
                  </span>
                </div>
                <h4 className="font-serif text-xl font-semibold text-obsidian mb-2">
                  Ongoing Retainers & Custom Module Expansions
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  {expansionTier.description}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end shrink-0">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">Partner Commission</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-emerald">{expansionTier.partnerShare}</span>
                <span className="font-mono text-[11px] text-muted mt-1">{expansionTier.turnaround}</span>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ─── 04. Workflow Section (#workflow) ─────────────────────────────────────── */}
      <section id="workflow" className="w-full border-b border-rule bg-cream py-24 md:py-32 text-start">
        <Container>
          <SectionHeading
            eyebrow="[ PROTOCOL // 4-STEP WORKFLOW ]"
            title="From Client Introduction to Payout"
            description="A deterministic 4-stage operational sequence ensuring zero friction for your advisory practice. We manage technical scoping, deployment, and SLA commitments directly."
          />

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {REFERRAL_WORKFLOW.map((step) => (
              <div
                key={step.step}
                className="flex flex-col justify-between border border-rule bg-surface p-6 shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-rule pb-3 mb-4">
                    <span className="font-mono text-xs font-bold text-emerald">
                      {step.code}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {step.duration}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-obsidian mb-2">
                    {step.title}
                  </h3>

                  <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-4">
                    Lead: {step.actor}
                  </div>

                  <p className="text-xs leading-relaxed text-muted mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="border-t border-rule pt-4">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-obsidian font-semibold mb-2">
                    [ DELIVERABLES ]
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-muted">
                    {step.deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald font-mono select-none">▸</span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 05. Benefits Section (#benefits) ─────────────────────────────────────── */}
      <section id="benefits" className="w-full border-b border-rule bg-surface py-24 md:py-32 text-start">
        <Container>
          <SectionHeading
            eyebrow="[ VALUE STACK // PARTNER ASSURANCES ]"
            title="Institutional Velocity With Zero Execution Risk"
            description="Engineered to safeguard your client relationships and brand equity. Institutional SLAs, bilateral NDAs, and lifetime partner account attribution are locked into every contract."
          />

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_BENEFITS.map((benefit) => (
              <div
                key={benefit.id}
                className="border border-rule bg-cream p-8 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-rule pb-4 mb-6">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold">
                      {benefit.code}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      {benefit.highlight}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-obsidian mb-3">
                    {benefit.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 06. Application Form Section (#apply) ────────────────────────────────── */}
      <section id="apply" className="w-full border-b border-rule bg-cream py-24 md:py-32 text-start">
        <Container>
          <SectionHeading
            eyebrow="[ APPLICATION // JOIN THE CHANNEL ALLIANCE ]"
            title="Establish Your Firm's Partner Agreement"
            description="Submit your advisory practice details to initiate onboarding. Partner codes and bilateral referral agreements are provisioned within 4 business hours."
          />

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Direct Partner Desk Details */}
            <div className="lg:col-span-5 flex flex-col justify-between border border-rule bg-surface p-8 shadow-soft">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-emerald font-semibold mb-6">
                  <span className="h-2 w-2 rounded-full bg-emerald" />
                  <span>[ DIRECT PARTNER CONCIERGE ]</span>
                </div>

                <h3 className="font-serif text-2xl font-semibold text-obsidian mb-4">
                  {DIRECT_PARTNER_CONTACT.desk}
                </h3>

                <p className="text-sm text-muted leading-relaxed mb-6">
                  For immediate introductions, high-volume referral partnerships, or bespoke agency white-label arrangements, contact our partner directors directly.
                </p>

                <div className="space-y-4 border-t border-rule pt-6 font-mono text-xs">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-muted">
                      Direct Email Desk
                    </span>
                    <a
                      href={`mailto:${DIRECT_PARTNER_CONTACT.email}`}
                      className="text-sm font-semibold text-obsidian hover:text-emerald transition-colors"
                    >
                      {DIRECT_PARTNER_CONTACT.email}
                    </a>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-muted">
                      Concierge Response SLA
                    </span>
                    <span className="text-sm font-semibold text-obsidian">
                      {DIRECT_PARTNER_CONTACT.conciergeSla}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-muted">
                      Channel Focus
                    </span>
                    <span className="text-xs text-muted">
                      {DIRECT_PARTNER_CONTACT.channel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-rule pt-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-obsidian font-semibold mb-2">
                  [ GOVERNANCE & PRIVACY ]
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  All referral communications and client briefings are protected under bilateral NDAs. Exvorta never solicits tax, customs, or legal services.
                </p>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="lg:col-span-7 border border-rule bg-surface p-8 sm:p-10 shadow-soft">
              <div className="mb-6 border-b border-rule pb-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-obsidian font-semibold">
                  [ PARTNER ACCREDITATION FORM ]
                </div>
                <p className="text-xs text-muted mt-1">
                  Complete all required fields below. Your accreditation pack will be issued promptly.
                </p>
              </div>

              <PartnerApplicationForm />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 07. FAQ Section (#faq) ──────────────────────────────────────────────── */}
      <section id="faq" className="w-full bg-surface-2 py-24 md:py-32 text-start">
        <Container>
          <SectionHeading
            eyebrow="[ ACCREDITATION // FREQUENTLY ASKED QUESTIONS ]"
            title="Partner Protocol & Governance"
            description="Institutional guidelines, payout terms, and relationship governance governing the Exvorta Partner Network."
          />

          <div className="mt-16 mx-auto max-w-4xl space-y-4">
            {PARTNER_FAQS.map((faq, fIdx) => (
              <details
                key={fIdx}
                className="group border border-rule bg-surface p-6 shadow-soft transition-colors open:bg-cream"
              >
                <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-semibold text-obsidian list-none">
                  <span>{faq.question}</span>
                  <span className="ms-4 font-mono text-sm text-emerald transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted border-t border-rule pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
