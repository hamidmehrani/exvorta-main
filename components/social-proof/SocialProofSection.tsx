import React from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ClientLogoStrip } from './ClientLogoStrip'
import { MetricCounters } from './MetricCounters'
import { TestimonialCard } from './TestimonialCard'
import {
  defaultSocialProofConfig,
  buildAggregateRatingJsonLd,
  type SocialProofConfig,
} from '@/lib/social-proof/social-proof-data'

export interface SocialProofSectionProps {
  config?: Partial<SocialProofConfig>
  heading?: {
    eyebrow?: React.ReactNode
    index?: string
    title: React.ReactNode
    description?: React.ReactNode
  }
  showLogos?: boolean
  showCounters?: boolean
  showTestimonials?: boolean
  includeJsonLd?: boolean
  siteUrl?: string
  tone?: 'light' | 'dark'
  className?: string
}

export function SocialProofSection({
  config,
  heading,
  showLogos = true,
  showCounters = true,
  showTestimonials = true,
  includeJsonLd = true,
  siteUrl,
  tone = 'light',
  className = '',
}: SocialProofSectionProps) {
  const logos = config?.logos ?? defaultSocialProofConfig.logos
  const counters = config?.counters ?? defaultSocialProofConfig.counters
  const testimonials = config?.testimonials ?? defaultSocialProofConfig.testimonials

  const dark = tone === 'dark'
  const aggregateRatingJsonLd =
    includeJsonLd && showTestimonials
      ? buildAggregateRatingJsonLd(testimonials, siteUrl)
      : null

  const resolvedHeading = heading ?? {
    eyebrow: 'PROOF OF INFRASTRUCTURE',
    title: 'Engineered for Global Scale',
    description:
      'Institutional-grade digital systems and compliance architecture modeled across multi-corridor cross-border supply chains.',
  }

  return (
    <section
      className={`relative w-full border-b py-20 md:py-28 ${
        dark ? 'border-rule-dark bg-obsidian' : 'border-rule bg-bg'
      } ${className}`}
    >
      {aggregateRatingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
        />
      )}

      <Container>
        <SectionHeading
          title={resolvedHeading.title}
          eyebrow={resolvedHeading.eyebrow}
          index={resolvedHeading.index}
          description={resolvedHeading.description}
          tone={tone}
          className="mb-14"
        />

        {/* Metric Counters */}
        {showCounters && counters.length > 0 && (
          <div className="mb-14">
            <MetricCounters items={counters} tone={tone} />
          </div>
        )}

        {/* Testimonials Grid */}
        {showTestimonials && testimonials.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between border-b pb-3 border-rule">
              <span
                className={`font-mono text-xs uppercase tracking-wider ${
                  dark ? 'text-muted-dark' : 'text-muted'
                }`}
              >
                [ VERIFIED SPECIMENS & CLIENT FEEDBACK ]
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <TestimonialCard
                  key={item.id}
                  item={item}
                  tone={tone}
                  includeJsonLd={includeJsonLd}
                  siteUrl={siteUrl}
                />
              ))}
            </div>
          </div>
        )}

        {/* Logo Strip */}
        {showLogos && logos.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between border-b pb-2 border-rule">
              <span
                className={`font-mono text-[10px] uppercase tracking-wider ${
                  dark ? 'text-muted-dark' : 'text-muted'
                }`}
              >
                [ INSTITUTIONAL TRADING ALLIANCE // CAPACITY RESERVATIONS ]
              </span>
            </div>
            <ClientLogoStrip items={logos} tone={tone} />
          </div>
        )}
      </Container>
    </section>
  )
}

export default SocialProofSection
