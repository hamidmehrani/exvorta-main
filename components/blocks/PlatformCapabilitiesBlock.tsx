import React from 'react'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '../ui/Reveal'

/**
 * PlatformCapabilitiesBlock — /web section answering "what do I actually get"
 * in business language: self-service CMS, unlimited languages & design
 * iterations, and the engineering stack behind it.
 *
 * Implements the Base44 services grid pattern 1:1 through Exvorta design tokens.
 */

export interface PlatformCapabilityItem {
  title: string
  desc: string
  tag: string
  stat: string
  statLabel: string
  tier?: string
  tags?: string[]
}

export interface PlatformTechItem {
  name: string
  why: string
  tag?: string
}

export interface PlatformCapabilitiesBlockProps {
  eyebrow?: string
  title?: React.ReactNode
  description?: string
  capabilities?: PlatformCapabilityItem[]
  techHeading?: {
    eyebrow?: string
    title?: React.ReactNode
    description?: string
  }
  tech?: PlatformTechItem[]
  ctaText?: string
  ctaLink?: string
  className?: string
  id?: string
  [key: string]: unknown
}

const DEFAULT_CAPABILITIES: PlatformCapabilityItem[] = [
  {
    title: 'Edit everything. Yourself.',
    desc: 'Products, certificates, prices, images, news — every word and pixel is editable from your admin panel. No developer, no ticket, no waiting.',
    tag: 'SELF-SERVE CMS',
    stat: '100%',
    statLabel: 'of content is editable',
    tier: 'ENTERPRISE',
    tags: ['Payload CMS', 'Visual Editing', 'Asset Library', 'Zero Lock-in'],
  },
  {
    title: 'Unlimited languages.',
    desc: 'Arabic, Chinese, Russian, Spanish — launch as many locales as your markets demand, with a built-in translation workflow. One click to add a market.',
    tag: 'UNLIMITED LOCALES',
    stat: '∞',
    statLabel: 'languages supported',
    tier: 'GLOBAL',
    tags: ['Persian / Arabic RTL', 'Vazirmatn Local', 'Subpath Routing', 'i18n Engine'],
  },
  {
    title: 'Unlimited design revisions.',
    desc: 'Your Figma designs are implemented faithfully and iterated without limits — new sections, seasonal campaigns, complete rebrands — all included.',
    tag: 'UNLIMITED FIGMA',
    stat: '∞',
    statLabel: 'design iterations',
    tier: 'PRECISION',
    tags: ['Figma 1:1 Fidelity', 'Design Tokens', 'Fluid Typography', 'Brand System'],
  },
  {
    title: 'Speed as a sales weapon.',
    desc: 'Server rendering and a global edge CDN keep every page under a second, anywhere on earth — the same infrastructure trusted by Adobe and NVIDIA.',
    tag: 'ELITE STACK',
    stat: '<1s',
    statLabel: 'load time globally',
    tier: 'EDGE SLA',
    tags: ['Next.js 15 SSR', 'Vercel Edge', 'Cloudflare DDoS', 'Sub-second TTFB'],
  },
]

const DEFAULT_TECH: PlatformTechItem[] = [
  {
    name: 'Next.js 15',
    why: 'Server rendering keeps pages instant for buyers on any continent — and Google rewards it with better rankings.',
    tag: 'FRAMEWORK',
  },
  {
    name: 'Vercel Edge',
    why: 'Served from 100+ data centers, so a buyer in Shanghai gets the same speed as one in Dubai.',
    tag: 'EDGE NETWORK',
  },
  {
    name: 'Payload CMS',
    why: 'A real admin panel — manage products and certificates without ever touching code.',
    tag: 'ADMIN PANEL',
  },
  {
    name: 'PostgreSQL',
    why: 'Bank-grade data integrity for your catalog, certificates and lead pipeline.',
    tag: 'DATABASE',
  },
  {
    name: 'Cloudflare',
    why: 'DDoS protection, image optimization and a fully redundant delivery layer.',
    tag: 'SECURITY & CDN',
  },
  {
    name: 'TypeScript',
    why: 'Strict typing means fewer production bugs and a codebase any senior team can inherit.',
    tag: 'TYPE SAFETY',
  },
]

export function PlatformCapabilitiesBlock({
  eyebrow = 'What you actually get',
  title = (
    <>
      Built to be operated <span className="text-muted">by you.</span>
    </>
  ),
  description = 'Most agencies hand you a website and a monthly invoice. We hand you the keys — and the infrastructure stays out of your way.',
  capabilities = DEFAULT_CAPABILITIES,
  techHeading = {
    eyebrow: 'The engine room — in plain English',
    title: (
      <>
        Serious technology. <span className="text-muted">Business reasons.</span>
      </>
    ),
    description: 'You never touch any of it — but every layer works for your business.',
  },
  tech = DEFAULT_TECH,
  ctaText = 'Contact',
  ctaLink = '/rfq',
  className = '',
  id,
}: PlatformCapabilitiesBlockProps = {}) {
  const items = capabilities && capabilities.length > 0 ? capabilities : DEFAULT_CAPABILITIES
  const techItems = tech && tech.length > 0 ? tech : DEFAULT_TECH

  return (
    <AnimatedSection className="w-full">
      <section
        id={id}
        className={`relative isolate overflow-hidden border-t border-rule bg-cream py-24 text-obsidian md:py-32 ${className}`}
        data-purpose="platform-capabilities"
        aria-labelledby="platform-capabilities-heading"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-blueprint-grid absolute inset-0 opacity-40" />
        </div>

        <div className="container-site">
          {/* Main Section Header */}
          <div className="mb-14 text-center md:mb-18">
            <Reveal y={10} duration={0.5}>
              <p className="eyebrow mb-4 justify-center">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-emerald" />
                </span>
                <span className="font-mono text-label uppercase tracking-widest text-muted">
                  {eyebrow}
                </span>
              </p>
            </Reveal>
            <Reveal y={18} delay={0.06}>
              <h2
                id="platform-capabilities-heading"
                className="mx-auto max-w-4xl font-serif text-title font-semibold text-obsidian"
              >
                {title}
              </h2>
            </Reveal>
            {description && (
              <Reveal y={14} delay={0.14}>
                <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-muted leading-relaxed">
                  {description}
                </p>
              </Reveal>
            )}
          </div>

          {/* Base44 Services Grid */}
          <StaggerContainer
            delayChildren={0.1}
            staggerChildren={0.12}
            className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 md:mb-28"
          >
            {items.map((cap, index) => (
              <StaggerItem key={cap.tag} className="h-full">
                <article
                  className="group relative flex h-full flex-col justify-between border border-rule bg-surface p-6 transition-colors duration-300 hover:border-rule-strong md:p-8 motion-reduce:transition-none"
                  aria-labelledby={`cap-title-${index}`}
                >
                  <div>
                    {/* Header: Category Badge + Status Pip */}
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <span className="font-mono text-label uppercase tracking-widest text-muted">
                        {cap.tag}
                      </span>
                      <span className="inline-flex items-center gap-1.5 border border-rule bg-surface px-2 py-0.5 font-mono text-label uppercase tracking-widest text-emerald">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden="true" />
                        {cap.tier || 'VERIFIED'}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3
                      id={`cap-title-${index}`}
                      className="mb-3 font-serif text-xl font-medium text-obsidian"
                    >
                      {cap.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 font-sans text-sm text-muted leading-relaxed">
                      {cap.desc}
                    </p>

                    {/* Service / Feature tags */}
                    {cap.tags && cap.tags.length > 0 && (
                      <div
                        className="mb-8 flex flex-wrap gap-2"
                        aria-label={`${cap.title} capabilities`}
                      >
                        {cap.tags.map((t) => (
                          <span
                            key={t}
                            className="border border-rule bg-surface px-2.5 py-1 font-mono text-label uppercase tracking-widest text-muted transition-colors group-hover:border-rule-strong motion-reduce:transition-none"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer: Stat & Action Link */}
                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-rule pt-5">
                    <div>
                      <div className="font-serif text-2xl font-semibold leading-none text-obsidian">
                        {cap.stat}
                      </div>
                      <div className="mt-1.5 font-mono text-label uppercase tracking-widest text-muted">
                        {cap.statLabel}
                      </div>
                    </div>

                    <Link
                      href={ctaLink}
                      aria-label={`Inquire about ${cap.title}`}
                      className="btn-mono px-4 py-2 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
                    >
                      {ctaText}
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Engine Room / Tech Stack Section */}
          <div className="mb-12 text-center md:mb-14">
            <Reveal y={10} duration={0.5}>
              <p className="eyebrow mb-4 justify-center">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-emerald" />
                </span>
                <span className="font-mono text-label uppercase tracking-widest text-muted">
                  {techHeading.eyebrow || 'The engine room — in plain English'}
                </span>
              </p>
            </Reveal>
            <Reveal y={18} delay={0.06}>
              <h2
                id="platform-tech-heading"
                className="mx-auto max-w-4xl font-serif text-title font-semibold text-obsidian"
              >
                {techHeading.title || 'Serious technology. Business reasons.'}
              </h2>
            </Reveal>
            {techHeading.description && (
              <Reveal y={14} delay={0.14}>
                <p className="mx-auto mt-4 max-w-2xl font-sans text-sm text-muted leading-relaxed">
                  {techHeading.description}
                </p>
              </Reveal>
            )}
          </div>

          <StaggerContainer
            delayChildren={0.08}
            staggerChildren={0.06}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {techItems.map((t) => (
              <StaggerItem key={t.name} className="h-full">
                <article className="flex h-full flex-col justify-between border border-rule bg-surface p-6 transition-colors duration-300 hover:border-rule-strong motion-reduce:transition-none">
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="font-mono text-label uppercase tracking-widest text-muted">
                        {t.tag || 'SYSTEM SPEC'}
                      </span>
                      <span className="h-1.5 w-1.5 rotate-45 bg-emerald" aria-hidden="true" />
                    </div>

                    <h3 className="mb-2 font-serif text-lg font-medium text-obsidian">
                      {t.name}
                    </h3>

                    <p className="font-sans text-sm text-muted leading-relaxed">
                      {t.why}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-rule pt-3">
                    <span className="font-mono text-label uppercase tracking-widest text-muted">STATUS</span>
                    <span className="font-mono text-label uppercase tracking-widest text-emerald">READY</span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal y={10} delay={0.1}>
            <div className="mt-12 text-center">
              <p className="eyebrow justify-center">
                <span className="font-mono text-label uppercase tracking-widest text-muted">
                  You never touch any of it — but every layer works for your business.
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </AnimatedSection>
  )
}

export default PlatformCapabilitiesBlock
