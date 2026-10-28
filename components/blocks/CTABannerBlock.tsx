import React from 'react'
import Link from '@/components/ui/AppLink'
import type { Page } from '@/payload-types'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'
import { unbracket } from '@/lib/text'

export interface CTABannerAction {
  label?: string | null
  url?: string | null
  href?: string | null
}

export interface CTABannerGuarantee {
  text?: string | null
  id?: string | null
}

export type CTABannerProps = Partial<
  Omit<
    Extract<NonNullable<Page['layout']>[number], { blockType: 'ctaBanner' }>,
    'primaryCTA' | 'secondaryCTA' | 'guarantees'
  >
> & {
  primaryCTA?: CTABannerAction | null
  secondaryCTA?: CTABannerAction | null
  guarantees?: CTABannerGuarantee[] | null
  className?: string
  id?: string
  [key: string]: unknown
}

export type CTABannerBlockProps = CTABannerProps

export const DEFAULT_GUARANTEES: CTABannerGuarantee[] = [
  { text: 'Direct Partner Review', id: 'guar-partner' },
  { text: 'Guaranteed 24-Hour SLA', id: 'guar-sla' },
  { text: 'Zero Lock-in Architecture', id: 'guar-lockin' },
]

export const DEFAULT_PRIMARY_CTA: CTABannerAction = {
  label: 'REQUEST A PROPOSAL',
  url: '/rfq',
}

export const DEFAULT_SECONDARY_CTA: CTABannerAction = {
  label: 'EXPLORE ARCHITECTURE',
  url: '/web',
}

function renderHeadline(rawHeadline: string) {
  const normalized = rawHeadline.replace(/\r?\n/g, '<br />')
  const sanitized = sanitizeHeadingHtml(normalized)
  if (/<[^>]+>/.test(sanitized)) {
    return <span dangerouslySetInnerHTML={{ __html: sanitized }} />
  }
  return sanitized
}

/**
 * CTABannerBlock — High-conversion closing CTA banner section.
 *
 * Implements the Shopify closing CTA banner pattern through Exvorta design tokens:
 * - High-conversion headline, primary action button, secondary action link, and trust microcopy.
 * - Clean container styling using tokenized surfaces and borders (`border-rule`, `bg-surface`, `text-obsidian`).
 * - Clear typographic hierarchy: `font-serif text-3xl md:text-4xl font-semibold text-obsidian` for heading,
 *   `font-sans text-muted` for supporting copy.
 * - Token-based focus-visible styles on all interactive buttons and links.
 * - WCAG-AA contrast compliance, ARIA attributes, and reduced motion support.
 */
export function CTABannerBlock(props: CTABannerProps = {}) {
  const eyebrow = unbracket(props.eyebrow || props.label) || 'INITIATE PARTNERSHIP'
  const headline = props.headline || 'Align your digital infrastructure<br/>with your operational scale.'
  const description =
    props.description ||
    'Stop allowing generic architecture to dilute your market authority. Engage our engineering team to map your optimal digital footprint.'

  const primary =
    props.primaryCTA === null
      ? null
      : {
          label: (props.primaryCTA?.label && unbracket(props.primaryCTA.label)) || DEFAULT_PRIMARY_CTA.label!,
          href:
            !props.primaryCTA?.url || props.primaryCTA.url === '#'
              ? (props.primaryCTA as CTABannerAction)?.href || DEFAULT_PRIMARY_CTA.url!
              : props.primaryCTA.url,
        }

  const secondary =
    props.secondaryCTA === null
      ? null
      : {
          label: (props.secondaryCTA?.label && unbracket(props.secondaryCTA.label)) || DEFAULT_SECONDARY_CTA.label!,
          href:
            !props.secondaryCTA?.url || props.secondaryCTA.url === '#'
              ? (props.secondaryCTA as CTABannerAction)?.href || DEFAULT_SECONDARY_CTA.url!
              : props.secondaryCTA.url,
        }

  const guaranteesList: CTABannerGuarantee[] =
    props.guarantees === null
      ? []
      : Array.isArray(props.guarantees)
        ? props.guarantees.map((g, idx) => (typeof g === 'string' ? { text: g, id: `guar-${idx}` } : g))
        : DEFAULT_GUARANTEES

  const subtextText =
    props.subtext === null
      ? ''
      : props.subtext
        ? unbracket(props.subtext)
        : 'Response within 24 hours · Enterprise NDA protected'

  const sectionId = props.id || 'cta'
  const headingId = `${sectionId}-banner-heading`
  const className = props.className || ''

  return (
    <AnimatedSection className="w-full">
      <section
        id={sectionId}
        aria-labelledby={headingId}
        data-purpose="closing-cta-banner"
        className={`relative isolate overflow-hidden border-t border-rule bg-cream py-20 text-obsidian md:py-28 ${className}`}
      >
        {/* Background blueprint grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-blueprint-grid absolute inset-0 opacity-30" />
        </div>

        <div className="container-site">
          {/* Shopify Closing Banner Card Container */}
          <div className="frame relative mx-auto max-w-5xl border border-rule bg-surface p-8 text-center text-obsidian shadow-soft transition-colors duration-200 sm:p-12 md:p-16">
            {/* Inner Blueprint Texture */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="bg-blueprint-grid absolute inset-0 opacity-20" />
            </div>

            {/* Eyebrow Blueprint Label */}
            {eyebrow && (
              <Reveal y={10} duration={0.5}>
                <p className="eyebrow mb-6 justify-center">
                  <span className="eyebrow-index" aria-hidden="true">
                    <i className="block h-1.5 w-1.5 rotate-45 bg-emerald" />
                  </span>
                  <span className="font-mono text-label uppercase tracking-widest text-muted">
                    {eyebrow}
                  </span>
                </p>
              </Reveal>
            )}

            {/* High-conversion Headline */}
            <Reveal y={16} delay={0.08} duration={0.7}>
              <h2
                id={headingId}
                className="mx-auto max-w-3xl font-serif text-3xl font-semibold text-obsidian leading-tight md:text-4xl"
              >
                {renderHeadline(headline)}
              </h2>
            </Reveal>

            {/* Supporting Copy */}
            {description && (
              <Reveal y={14} delay={0.16} duration={0.7}>
                <p className="mx-auto mt-4 max-w-2xl font-sans text-muted text-base leading-relaxed md:text-lg">
                  {description}
                </p>
              </Reveal>
            )}

            {/* Dual Action Buttons */}
            {(primary || secondary) && (
              <Reveal y={14} delay={0.24} duration={0.7}>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {primary && (
                    <Link
                      href={primary.href}
                      className="btn-primary min-h-[52px] w-full px-8 py-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
                      aria-label={primary.label}
                    >
                      <span>{primary.label}</span>
                    </Link>
                  )}
                  {secondary && (
                    <Link
                      href={secondary.href}
                      className="btn-ghost min-h-[52px] w-full px-8 py-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
                      aria-label={secondary.label}
                    >
                      <span>{secondary.label}</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            )}

            {/* Trust Microcopy & Guarantees */}
            {(guaranteesList.length > 0 || subtextText) && (
              <Reveal y={10} delay={0.32} duration={0.6}>
                <div className="mt-12 border-t border-rule/60 pt-8 flex flex-col items-center gap-3">
                  {guaranteesList.length > 0 && (
                    <div
                      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center"
                      aria-label="Institutional guarantees"
                    >
                      {guaranteesList.map((g, idx) => {
                        const text = g.text ? unbracket(g.text) : ''
                        if (!text) return null
                        return (
                          <div key={g.id || idx} className="inline-flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald"
                            >
                              <svg
                                className="h-2.5 w-2.5"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M13.25 4.75 6 12 2.75 8.75" />
                              </svg>
                            </span>
                            <span className="font-mono text-label uppercase tracking-wider text-muted">
                              {text}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {subtextText && (
                    <p className="font-mono text-label uppercase tracking-widest text-muted">
                      {subtextText}
                    </p>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </AnimatedSection>
  )
}

export default CTABannerBlock
