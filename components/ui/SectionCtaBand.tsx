'use client'

import React from 'react'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/Container'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

export interface SectionCtaAction {
  label: string
  href: string
  target?: string
}

export interface SectionCtaBandProps {
  id?: string
  tone?: 'dark' | 'surface' | 'light'
  eyebrow?: React.ReactNode
  headline?: React.ReactNode
  description?: React.ReactNode
  primaryCta?: SectionCtaAction | null
  secondaryCta?: SectionCtaAction | null
  compact?: boolean
  trackingTarget?: string
  className?: string
}

export function SectionCtaBand({
  id,
  tone = 'dark',
  eyebrow = 'INFRASTRUCTURE ENGAGEMENT',
  headline = 'Ready to deploy institutional digital infrastructure?',
  description = 'Deterministic fixed-scope export platforms and systems engineered for high-velocity international trade.',
  primaryCta = { label: '[ REQUEST PROPOSAL ]', href: '/rfq' },
  secondaryCta = { label: '[ EXPLORE CAPABILITIES ]', href: '/pricing' },
  compact = false,
  trackingTarget = 'section_cta_band',
  className = '',
}: SectionCtaBandProps) {
  const isDark = tone === 'dark'
  const isSurface = tone === 'surface'

  const toneSectionClasses = isDark
    ? 'on-dark border-t border-rule-dark bg-obsidian text-white'
    : isSurface
      ? 'on-dark border-t border-rule-dark bg-surface/5 text-white'
      : 'border-y border-rule bg-surface text-obsidian'

  const toneFrameClasses = isDark
    ? 'frame-dark border-rule-dark bg-surface/5'
    : isSurface
      ? 'frame-dark border-rule-dark bg-obsidian/40'
      : 'border-rule bg-cream'

  const isThemeDark = isDark || isSurface

  const handleCtaClick = (action: SectionCtaAction, type: 'primary' | 'secondary') => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICKED, {
      target: trackingTarget,
      href: action.href,
      label: action.label,
      type,
    })
  }

  return (
    <section
      id={id}
      role="region"
      aria-label={typeof headline === 'string' ? headline : 'Call to action'}
      data-reveal=""
      suppressHydrationWarning
      style={{
        '--reveal-y': '24px',
        '--reveal-dur': '0.8s',
      } as React.CSSProperties}
      className={`relative isolate w-full overflow-hidden ${toneSectionClasses} ${className}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {isThemeDark && <div className="bg-aura-dark absolute inset-0 opacity-60" />}
        <div
          className={`absolute inset-0 ${
            isThemeDark ? 'bg-blueprint-grid-dark opacity-80' : 'bg-blueprint-grid'
          }`}
        />
      </div>

      <Container className={compact ? 'py-12 md:py-16' : 'py-20 md:py-28'}>
        <div
          className={`frame mx-auto max-w-5xl border px-6 text-center md:px-12 ${
            compact ? 'py-10 md:py-14' : 'py-14 md:py-20'
          } ${toneFrameClasses}`}
        >
          {eyebrow && (
            <Reveal y={10} duration={0.5}>
              <div
                className={`eyebrow mb-6 justify-center ${
                  isThemeDark ? 'eyebrow-dark' : ''
                }`}
              >
                <span className="eyebrow-index" aria-hidden>
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                {eyebrow}
              </div>
            </Reveal>
          )}

          <Reveal y={16} delay={0.06} duration={0.6}>
            <h2
              className={`mx-auto max-w-3xl font-serif font-semibold text-balance ${
                compact
                  ? 'mb-4 text-2xl md:text-3xl'
                  : 'mb-6 text-headline md:text-display'
              } ${isThemeDark ? 'text-white' : 'text-obsidian'}`}
            >
              {headline}
            </h2>
          </Reveal>

          {description && (
            <Reveal y={14} delay={0.12} duration={0.6}>
              <p
                className={`mx-auto max-w-2xl font-light text-pretty ${
                  compact ? 'mb-8 text-sm md:text-base' : 'mb-10 text-base md:text-lede'
                } ${isThemeDark ? 'text-muted-dark' : 'text-muted'}`}
              >
                {description}
              </p>
            </Reveal>
          )}

          {(primaryCta || secondaryCta) && (
            <Reveal y={14} delay={0.18} duration={0.6}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    target={primaryCta.target}
                    rel={primaryCta.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={() => handleCtaClick(primaryCta, 'primary')}
                    className={`btn-primary font-semibold ${
                      compact ? 'min-h-[44px] px-6 py-3' : 'min-h-[48px] px-8 py-3.5'
                    }`}
                  >
                    {primaryCta.label}
                  </Link>
                )}

                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    target={secondaryCta.target}
                    rel={secondaryCta.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={() => handleCtaClick(secondaryCta, 'secondary')}
                    className={`btn-ghost font-semibold ${
                      compact ? 'min-h-[44px] px-6 py-3' : 'min-h-[48px] px-8 py-3.5'
                    }`}
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}

export default SectionCtaBand
