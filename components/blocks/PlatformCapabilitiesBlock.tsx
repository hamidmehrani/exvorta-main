import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

/**
 * PlatformCapabilitiesBlock — /web section answering "what do I actually get"
 * in business language: self-service CMS, unlimited languages & design
 * iterations, and the engineering stack behind it.
 */

const CAPABILITIES = [
  {
    title: 'Edit everything. Yourself.',
    desc: 'Products, certificates, prices, images, news — every word and pixel is editable from your admin panel. No developer, no ticket, no waiting.',
    tag: 'SELF-SERVE CMS',
    stat: '100%',
    statLabel: 'of content is editable',
  },
  {
    title: 'Unlimited languages.',
    desc: 'Arabic, Chinese, Russian, Spanish — launch as many locales as your markets demand, with a built-in translation workflow. One click to add a market.',
    tag: 'UNLIMITED LOCALES',
    stat: '∞',
    statLabel: 'languages supported',
  },
  {
    title: 'Unlimited design revisions.',
    desc: 'Your Figma designs are implemented faithfully and iterated without limits — new sections, seasonal campaigns, complete rebrands — all included.',
    tag: 'UNLIMITED FIGMA',
    stat: '∞',
    statLabel: 'design iterations',
  },
  {
    title: 'Speed as a sales weapon.',
    desc: 'Server rendering and a global edge CDN keep every page under a second, anywhere on earth — the same infrastructure trusted by Adobe and NVIDIA.',
    tag: 'ELITE STACK',
    stat: '<1s',
    statLabel: 'load time globally',
  },
]

const TECH = [
  { name: 'Next.js 15', why: 'Server rendering keeps pages instant for buyers on any continent — and Google rewards it with better rankings.' },
  { name: 'Vercel Edge', why: 'Served from 100+ data centers, so a buyer in Shanghai gets the same speed as one in Dubai.' },
  { name: 'Payload CMS', why: 'A real admin panel — manage products and certificates without ever touching code.' },
  { name: 'PostgreSQL', why: 'Bank-grade data integrity for your catalog, certificates and lead pipeline.' },
  { name: 'Cloudflare', why: 'DDoS protection, image optimization and a fully redundant delivery layer.' },
  { name: 'TypeScript', why: 'Strict typing means fewer production bugs and a codebase any senior team can inherit.' },
]

export function PlatformCapabilitiesBlock() {
  return (
    <AnimatedSection className="w-full">
      <section
        className="on-dark relative isolate overflow-hidden border-t border-rule-dark bg-obsidian py-24 text-white md:py-32"
        data-purpose="platform-capabilities"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-60" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <div className="container-site">
          <SectionHeading
            align="center"
            tone="dark"
            eyebrow="What you actually get"
            title={
              <>
                Built to be operated <span className="text-muted-dark">by you.</span>
              </>
            }
            description="Most agencies hand you a website and a monthly invoice. We hand you the keys — and the infrastructure stays out of your way."
            className="mb-16 md:mb-20"
          />

          {/* Capability cells */}
          <StaggerContainer
            delayChildren={0.1}
            staggerChildren={0.12}
            className="frame frame-dark mb-28 grid grid-cols-1 border border-rule-dark md:grid-cols-2"
          >
            {CAPABILITIES.map((cap) => (
              <StaggerItem
                key={cap.tag}
                className="group relative flex flex-col border-b border-rule-dark p-8 transition-colors duration-500 last:border-b-0 hover:bg-white/[0.03] md:odd:border-e md:[&:nth-last-child(-n+2)]:border-b-0 md:p-12"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                />
                <div className="mb-10 flex items-start justify-between gap-4">
                  <span className="border border-success/40 px-2.5 py-1.5 font-mono text-label uppercase text-success">
                    {cap.tag}
                  </span>
                  <div className="shrink-0 text-end">
                    <div className="font-serif text-headline font-semibold leading-none text-white">{cap.stat}</div>
                    <div className="mt-3 font-mono text-label uppercase text-muted-dark">{cap.statLabel}</div>
                  </div>
                </div>
                <h3 className="mb-4 font-serif text-3xl font-semibold leading-tight text-white">{cap.title}</h3>
                <p className="text-base font-light leading-relaxed text-muted-dark">{cap.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Tech stack — translated to business language */}
          <SectionHeading
            align="center"
            tone="dark"
            as="h3"
            eyebrow="The engine room — in plain English"
            title={
              <>
                Serious technology. <span className="text-muted-dark">Business reasons.</span>
              </>
            }
            className="mb-12"
          />

          <StaggerContainer
            delayChildren={0.08}
            staggerChildren={0.08}
            className="grid grid-cols-1 gap-px border border-rule-dark bg-rule-dark sm:grid-cols-2 lg:grid-cols-3"
          >
            {TECH.map((t) => (
              <StaggerItem key={t.name} className="h-full">
                <div className="flex h-full flex-col gap-3 bg-obsidian p-8 transition-colors duration-300 hover:bg-card">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rotate-45 bg-success" aria-hidden />
                    <span className="font-mono text-sm font-medium text-white">{t.name}</span>
                  </div>
                  <p className="text-base font-light leading-relaxed text-muted-dark">{t.why}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-12 text-center">
            <p className="eyebrow eyebrow-dark">
              You never touch any of it — but every layer works for your business.
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>
  )
}

export default PlatformCapabilitiesBlock
