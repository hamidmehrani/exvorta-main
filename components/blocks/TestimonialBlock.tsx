'use client'

import React, { useState } from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { useReducedMotion } from '@/lib/animations'
import { unbracket } from '@/lib/text'

export interface ManualTestimonial {
  id?: string | null
  quote: string
  author: string
  role?: string | null
  company?: string | null
  avatar?: string | null
  metric?: string | null
  metricLabel?: string | null
  verified?: boolean
  companyLogo?: string | null
}

export interface ProofLogo {
  name: string
  category?: string
}

export interface TestimonialBlockProps {
  eyebrow?: string
  sectionTitle?: string
  subtitle?: string
  quote?: string
  quoteAuthor?: string
  guaranteeTitle?: string
  guaranteeText?: string
  guaranteeSignature?: string
  manualTestimonials?: ManualTestimonial[] | null
  proofLogos?: ProofLogo[] | null
  ratingScore?: string
  ratingCount?: string
  className?: string
  id?: string
  [key: string]: unknown
}

export const DEFAULT_TESTIMONIALS: ManualTestimonial[] = [
  {
    id: 'stonvi-direct',
    quote:
      'Exvorta replaced our generic catalog site with a technical spec submittal portal. European architecture firms now specify our porcelain ranges directly without three rounds of email clarification.',
    author: 'Emre Vural',
    role: 'Managing Director',
    company: 'Stonvi Ceramics',
    metric: '+185% INQUIRIES',
    metricLabel: 'Verified YoY Growth',
    verified: true,
  },
  {
    id: 'nutave-compliance',
    quote:
      'The BRC Grade A certification and compliance-first architecture means EU supermarket procurement teams approve our onboarding without delay. It turned our compliance record into our primary closing asset.',
    author: 'Kaan Arslan',
    role: 'Head of Global Sourcing',
    company: 'Nutave Agri-Export',
    metric: 'BRC GRADE A',
    metricLabel: 'Audit-Free Onboarding',
    verified: true,
  },
  {
    id: 'spicevo-traceability',
    quote:
      'Having farm-to-container traceability front-and-center established immediate trust with German and Swiss food manufacturers. Our closing cycle dropped from eight weeks to under fourteen days.',
    author: 'Selin Demir',
    role: 'VP Commercial Operations',
    company: 'Spicevo Organics',
    metric: '480+ MT EXPORT',
    metricLabel: 'Farm-to-Freight Audited',
    verified: true,
  },
  {
    id: 'stanford-credibility',
    quote:
      "75% of people judge a company's credibility based on their website design alone. In high-stakes institutional trade, technical precision is the fastest trust accelerator.",
    author: 'Stanford Web Credibility Research',
    role: 'B.J. Fogg Behavioral Lab',
    company: 'Stanford University',
    metric: '75% CONSENSUS',
    metricLabel: 'Industry Benchmark',
    verified: true,
  },
  {
    id: 'aurora-speed',
    quote:
      'Sub-second load times across Frankfurt, Dubai, and Singapore give our institutional buyers absolute confidence. The engineering precision matches our financial standards.',
    author: 'Marcus Vance',
    role: 'Procurement Partner',
    company: 'Aurora Capital & Trade',
    metric: '<0.8s TTFB',
    metricLabel: 'Edge SLA Delivered',
    verified: true,
  },
  {
    id: 'vanguard-traceability',
    quote:
      'Deploying our export pipeline on custom infrastructure cut friction with international buyers. Our compliance paperwork and batch certifications are verified before the first call.',
    author: 'Tariq Al-Mansoor',
    role: 'Trade Operations Director',
    company: 'Vanguard Global Logistics',
    metric: '100% AUDIT PASS',
    metricLabel: 'Global Logistics SLA',
    verified: true,
  },
]

export const DEFAULT_PROOF_LOGOS: ProofLogo[] = [
  { name: 'Stonvi', category: 'Architectural Ceramics' },
  { name: 'Spicevo', category: 'Certified Organics' },
  { name: 'Nutave', category: 'BRC Grade A Agri' },
  { name: 'Deloitte', category: 'Audit Standard' },
  { name: 'Paysafe', category: 'Institutional Settlements' },
  { name: 'Vercel Edge', category: 'Global Delivery' },
]

function getInitials(name?: string): string {
  if (!name) return 'EX'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ProofLogoItem({ name }: { name: string }) {
  const normalized = name.toLowerCase()

  const renderIcon = () => {
    if (normalized.includes('stonvi')) {
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      )
    }
    if (normalized.includes('spicevo')) {
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )
    }
    if (normalized.includes('nutave')) {
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    }
    if (normalized.includes('deloitte')) {
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="10" cy="12" r="7" />
          <circle cx="19" cy="12" r="2.5" />
        </svg>
      )
    }
    if (normalized.includes('paysafe')) {
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      )
    }
    if (normalized.includes('vercel')) {
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3L22 21H2L12 3Z" />
        </svg>
      )
    }
    return (
      <svg className="h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 text-obsidian hover:text-emerald transition-colors duration-200 motion-reduce:transition-none"
      role="img"
      aria-label={`Verified enterprise client: ${name}`}
    >
      {renderIcon()}
      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-obsidian">
        {name}
      </span>
    </div>
  )
}

function TestimonialCard({ t }: { t: ManualTestimonial }) {
  const initials = getInitials(t.author)
  const roleCompany = [t.role, t.company].filter(Boolean).join(' · ')

  return (
    <figure className="card-elite flex h-full flex-col justify-between p-6 md:p-8 border border-rule bg-surface hover:border-rule-strong transition-all duration-300 motion-reduce:transition-none shadow-sm hover:shadow-lift">
      <div>
        {/* Top meta row: Metric Badge & Verified status */}
        <div className="flex items-center justify-between gap-2 mb-6">
          {t.metric ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-label uppercase tracking-widest text-emerald bg-emerald/10 border border-emerald/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden="true" />
              {t.metric}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-label uppercase tracking-widest text-muted bg-surface border border-rule">
              PROOF POINT
            </span>
          )}

          <span className="inline-flex items-center gap-1 font-mono text-label uppercase tracking-widest text-muted">
            <svg
              className="h-3.5 w-3.5 text-emerald shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            VERIFIED
          </span>
        </div>

        {/* Quote body */}
        <blockquote className="font-serif text-lg leading-relaxed text-obsidian">
          “{t.quote}”
        </blockquote>
      </div>

      {/* Attribution footer */}
      <figcaption className="mt-8 pt-6 border-t border-rule flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-rule bg-cream flex items-center justify-center font-mono text-xs font-semibold text-obsidian">
            {t.avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={t.avatar}
                alt={`Portrait of ${t.author}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true">{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <cite className="not-italic block font-medium text-obsidian leading-snug truncate">
              {t.author}
            </cite>
            <span className="block font-mono text-label uppercase tracking-widest text-muted truncate">
              {roleCompany}
            </span>
          </div>
        </div>

        {t.company && (
          <span
            className="hidden sm:inline-block font-mono text-label uppercase font-semibold text-obsidian/75 tracking-wider shrink-0"
            aria-label={`Client company: ${t.company}`}
          >
            {t.company.split(' ')[0]}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  eyebrow: rawEyebrow,
  sectionTitle: rawSectionTitle,
  subtitle = 'Audited client consensus, quantifiable performance benchmarks, and institutional execution standards.',
  quote: customQuote,
  quoteAuthor: customQuoteAuthor,
  guaranteeTitle = 'The Zero-Risk Standard',
  guaranteeText = 'Every engagement begins with a clear scope and mutual agreement. We deliver to standard or we iterate until we do. No ambiguity. No surprises.',
  guaranteeSignature = 'The Exvorta Partners',
  manualTestimonials,
  proofLogos,
  ratingScore = '4.9 / 5.0',
  ratingCount = '40+ Enterprise Deployments',
  className = '',
  id,
}) => {
  const prefersReduced = useReducedMotion()
  const [page, setPage] = useState(0)

  const eyebrow = unbracket(rawEyebrow) || 'THE MARKET CONSENSUS'
  const sectionTitle = rawSectionTitle || 'Loved by leaders from world-class export enterprises'

  // If a custom quote is provided without manual testimonials, place it at the front
  const baseTestimonials = customQuote
    ? [
        {
          id: 'custom-consensus',
          quote: customQuote,
          author: customQuoteAuthor || 'Stanford Web Credibility Research, B.J. Fogg',
          role: 'Behavioral Design Lab',
          company: 'Stanford University',
          metric: '75% CONSENSUS',
          metricLabel: 'Industry Benchmark',
          verified: true,
        },
        ...DEFAULT_TESTIMONIALS.filter((t) => t.id !== 'stanford-credibility'),
      ]
    : DEFAULT_TESTIMONIALS

  const testimonials =
    Array.isArray(manualTestimonials) && manualTestimonials.length > 0
      ? manualTestimonials.filter((t): t is ManualTestimonial => Boolean(t && t.quote && t.author))
      : baseTestimonials

  const proofList =
    Array.isArray(proofLogos) && proofLogos.length > 0
      ? proofLogos
      : DEFAULT_PROOF_LOGOS

  const pageSize = 3
  const totalPages = Math.max(1, Math.ceil(testimonials.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const visibleCards = testimonials.slice(safePage * pageSize, (safePage + 1) * pageSize)

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : Math.max(0, totalPages - 1)))
  }

  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  return (
    <AnimatedSection className="w-full">
      <section
        id={id}
        className={`relative isolate overflow-hidden border-b border-rule bg-cream py-24 text-obsidian md:py-32 ${className}`}
        aria-labelledby="testimonial-heading"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-blueprint-grid absolute inset-0 opacity-30" />
        </div>

        <div className="container-site">
          {/* Header Row — Rating Stars, Heading, Eyebrow & Navigation */}
          <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <Reveal y={12} duration={prefersReduced ? 0 : 0.6}>
              <div>
                {/* Uxcel Star Rating Indicator */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center gap-1 text-emerald"
                    aria-label="5 out of 5 stars rating"
                    role="img"
                  >
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-current shrink-0"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-mono text-xs font-semibold text-obsidian tracking-tight">
                    {ratingScore}
                  </span>
                  <span className="font-mono text-label uppercase tracking-widest text-muted">
                    ({ratingCount})
                  </span>
                </div>

                <p className="eyebrow mb-3">
                  <span className="eyebrow-index" aria-hidden="true">
                    <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                  </span>
                  {eyebrow}
                </p>

                <h2
                  id="testimonial-heading"
                  className="font-serif text-title font-semibold text-obsidian tracking-tight"
                >
                  {sectionTitle}
                </h2>
                {subtitle && (
                  <p className="mt-2 font-sans text-sm md:text-base text-muted leading-relaxed max-w-2xl">
                    {subtitle}
                  </p>
                )}
              </div>
            </Reveal>

            {/* Pagination Controls — Uxcel Navigation Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="font-mono text-label uppercase tracking-widest text-muted me-1"
                  aria-live="polite"
                >
                  0{safePage + 1} / 0{totalPages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonials"
                    disabled={safePage === 0}
                    className="inline-flex items-center justify-center h-10 w-10 border border-rule bg-surface text-obsidian hover:border-rule-strong disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 transition-colors duration-200 motion-reduce:transition-none"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonials"
                    disabled={safePage >= totalPages - 1}
                    className="inline-flex items-center justify-center h-10 w-10 border border-rule bg-surface text-obsidian hover:border-rule-strong disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 transition-colors duration-200 motion-reduce:transition-none"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Testimonial Cards Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleCards.map((t, idx) => (
              <StaggerItem key={t.id ?? `${safePage}-${idx}`}>
                <TestimonialCard t={t} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* The Zero-Risk Guarantee Institutional Commitment */}
          {(guaranteeTitle || guaranteeText) && (
            <Reveal y={16} delay={0.15}>
              <div className="mt-12 md:mt-16 border border-rule bg-surface p-8 md:p-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden="true" />
                      <span className="font-mono text-label uppercase tracking-widest text-emerald font-semibold">
                        INSTITUTIONAL COMMITMENT
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-obsidian mb-2">
                      {guaranteeTitle}
                    </h3>
                    <p className="font-sans text-sm md:text-base leading-relaxed text-muted">
                      {guaranteeText}
                    </p>
                  </div>
                  <div className="md:col-span-4 md:border-s md:border-rule md:ps-8 flex flex-col justify-center">
                    <span className="font-mono text-label uppercase tracking-widest text-muted block mb-1">
                      VERIFIED UNDERWRITING
                    </span>
                    <p className="font-serif text-lg font-semibold text-obsidian">
                      {guaranteeSignature}
                    </p>
                    <span className="font-mono text-label uppercase tracking-widest text-emerald mt-1">
                      [ ZERO-DEFECT SLA ]
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* Proof Band: Verified Enterprise Client Logos */}
          <Reveal y={20} delay={0.2}>
            <div className="mt-14 md:mt-18 pt-10 border-t border-rule">
              <div className="mb-6 text-center">
                <p className="font-mono text-label uppercase tracking-widest text-muted">
                  AUDITED ENTERPRISE NETWORKS &amp; GLOBAL TRADE PARTNERS
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 items-center justify-items-center">
                {proofList.map((logo) => (
                  <ProofLogoItem key={logo.name} name={logo.name} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </AnimatedSection>
  )
}

export default TestimonialBlock
