'use client';

import React from 'react';
import type { Project } from '@/payload-types';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import Link from 'next/link';
import { m as motion } from 'framer-motion';
import { easings, useReducedMotion } from '@/lib/animations';
import { getCaseStudy, CASE_STUDIES, type CaseStudyData } from '@/components/blocks/case-study-data';
import LiveSitePreview from '@/components/ui/LiveSitePreview';

export function ProjectThemedLayout({ project }: { project?: Project }) {
  const slug = project?.slug || 'spicevo';
  const prefersReducedMotion = useReducedMotion();

  // Authoritative teardown data for known deployments; CMS fields override when set.
  const cs: CaseStudyData = getCaseStudy(slug) || {
    title: project?.title || 'Project',
    domain: `${slug}.exvorta.com`,
    url: `https://${slug}.exvorta.com`,
    tagline: project?.excerpt || 'Custom deployment by Exvorta.',
    category: 'Digital Infrastructure',
    excerpt: project?.excerpt || 'A precision-engineered web presence for global trade.',
    heroBg: project?.heroBgColor || '#FAFAF8',
    accent: project?.accentColor || '#059669',
    stats: [],
    certifications: [],
    products: [],
    metrics: [],
  };

  const cmsHero =
    project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url
      ? project.heroImage
      : null;
  const heroSrc = cmsHero?.url || cs.heroImage;
  const accent = project?.accentColor || cs.accent;
  const liveUrl = project?.liveUrl || cs.url;

  // Use CMS metrics when robustly populated, otherwise fall back to case study teardown.
  const metrics: { label: string; value: string }[] =
    project?.metrics && project.metrics.length > 2
      ? project.metrics.map((mm) => ({ label: mm.label || '', value: mm.value || '' }))
      : cs.metrics.length > 0
      ? cs.metrics
      : project?.metrics && project.metrics.length > 0
      ? project.metrics.map((mm) => ({ label: mm.label || '', value: mm.value || '' }))
      : [];

  const excerpt = project?.excerpt || cs.excerpt;
  const hasLandmark = Boolean(cs.landmarkProject);

  return (
    <div className="bg-obsidian text-cream">
      {/* ═══════════════ HERO: split editorial + live frame ═══════════════ */}
      <section className="min-h-screen pt-32 pb-24 border-b border-rule-dark bg-obsidian text-cream">
        <div className="container-site relative z-10">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easings.cinematic }}
            className="mb-12 flex flex-wrap items-center gap-4"
          >
            <Link
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:opacity-80"
              style={{ color: accent }}
              href="/portfolio"
            >
              <span className="text-[14px]">←</span>
              ALL CASE STUDIES
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
              {cs.category}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left: brand story */}
            <div className="col-span-1 lg:col-span-5 flex flex-col text-start">
              <AnimatedSection>
                <div className="flex items-center gap-3 mb-8">
                  <span className="inline-block w-10 h-[2px]" style={{ backgroundColor: accent }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                    CASE STUDY — {cs.title.toUpperCase()}
                  </span>
                </div>
                <h1 className="font-serif text-[44px] md:text-[64px] tracking-tighter leading-[1.05] mb-6 font-semibold">
                  {cs.title}
                </h1>
                <p className="font-serif text-xl md:text-2xl leading-snug mb-6" style={{ color: accent }}>
                  {cs.tagline}
                </p>
                <p className="font-sans text-[16px] text-white/60 leading-relaxed font-light mb-10 max-w-lg">
                  {excerpt}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                {/* Live deployment CTA — the proof */}
                <Link
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-4 border border-rule-dark px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:gap-6 bg-[#141414]"
                  style={{ borderColor: accent, color: accent }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ backgroundColor: accent }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: accent }}
                    />
                  </span>
                  VISIT LIVE — {cs.domain.toUpperCase().replace('.EXVORTA.COM', '')}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </Link>
              </AnimatedSection>

              {/* Metrics ledger */}
              {metrics.length > 0 && (
                <AnimatedSection className="mt-12" delay={0.15}>
                  <div className="w-full border border-rule-dark divide-y divide-rule-dark bg-[#141414]/60">
                    {metrics.map((metric, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                          {metric.label}
                        </span>
                        <span className="font-mono text-[10px] uppercase text-white/85">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Right: browser-framed live screenshot */}
            <div className="col-span-1 lg:col-span-7">
              <motion.div
                initial={false}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: easings.cinematic }}
              >
                <LiveSitePreview
                  url={liveUrl}
                  title={cs.title}
                  poster={heroSrc || undefined}
                  priority={true}
                />
                <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                  FIG. 01 — LIVE DEPLOYMENT — {cs.domain}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Impact stats band */}
          {cs.stats.length > 0 && (
            <AnimatedSection className="mt-20" delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 border border-rule-dark divide-y md:divide-y-0 md:divide-x divide-rule-dark bg-[#141414]/40">
                {cs.stats.map((s, i) => (
                  <div key={i} className="px-8 py-10 text-center">
                    <div
                      className="font-serif text-5xl md:text-6xl font-semibold mb-2 tracking-tight"
                      style={{ color: accent }}
                    >
                      {s.value}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* ═══════════════ PART 01: [ THE BRIEF & PROBLEM ] ═══════════════ */}
      <section
        className="py-28 border-t border-rule bg-paper bg-cream text-obsidian"
        id="the-brief"
      >
        <div className="container-site">
          <StaggerContainer staggerChildren={0.12} delayChildren={0.05}>
            <StaggerItem>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
                style={{ color: accent }}
              >
                [ 01 — THE BRIEF &amp; PROBLEM ]
              </div>
              <h2 className="font-serif text-[40px] md:text-[56px] tracking-tighter leading-[1.08] mb-8 font-semibold max-w-4xl text-obsidian text-start">
                {cs.brief?.headline || 'Institutional Buyer Friction. Compliance Verification Barrier.'}
              </h2>
            </StaggerItem>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <StaggerItem className="lg:col-span-5 text-start">
                <p className="font-sans text-[17px] leading-relaxed text-muted font-light mb-6">
                  {cs.brief?.intro || (
                    <>
                      {cs.title} operates in global export corridors where enterprise procurement teams
                      evaluate suppliers strictly on verifiable compliance, testing standards, and logistical
                      reliability. Standard brochure websites obscure critical data, forcing high-friction
                      audit cycles.
                    </>
                  )}
                </p>
                <div className="border-s-2 ps-4 py-1 text-sm font-serif italic text-obsidian/85" style={{ borderColor: accent }}>
                  &ldquo;In international commodity trade, the question is never what you produce — it is whether the shipment clears destination customs with zero audit discrepancy.&rdquo;
                </div>
              </StaggerItem>

              <StaggerItem className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start">
                  {/* Friction Barrier */}
                  <div className="border border-rule p-8 bg-surface shadow-soft">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-rule">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                        DIAGNOSTIC 01.1
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-danger px-2 py-0.5 border border-danger/25 bg-danger/5">
                        BUYER FRICTION
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-medium text-obsidian mb-3">
                      The Compliance Audit Barrier
                    </h3>
                    <p className="font-sans text-sm text-muted leading-relaxed font-light mb-6">
                      {cs.brief?.problem ||
                        'Enterprise buyers discounted genuine capabilities because regulatory credentials, batch CoAs, and testing tolerances were buried in static attachments and opaque sales decks.'}
                    </p>
                    <div className="pt-4 border-t border-rule font-mono text-[10px] text-muted space-y-2 uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span className="text-danger font-bold">✕</span>
                        <span>Opaque laboratory certifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-danger font-bold">✕</span>
                        <span>Protracted on-site qualification delay</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-danger font-bold">✕</span>
                        <span>Commodity pricing race-to-bottom</span>
                      </div>
                    </div>
                  </div>

                  {/* Exvorta Spec-Grade Solution */}
                  <div
                    className="border p-8 bg-surface shadow-soft relative"
                    style={{ borderColor: accent }}
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-rule">
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.25em]"
                        style={{ color: accent }}
                      >
                        INTERVENTION 01.2
                      </span>
                      <span
                        className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border"
                        style={{ borderColor: accent, color: accent, backgroundColor: `${accent}12` }}
                      >
                        SPEC-GRADE PROOF
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-medium text-obsidian mb-3">
                      Instant Submittal Verification
                    </h3>
                    <p className="font-sans text-sm text-obsidian/85 leading-relaxed font-light mb-6">
                      {cs.brief?.answer ||
                        'A precision digital submittal system: every regulatory claim is linked to third-party registries, product specs follow architectural submittal formats, and export volume is provable.'}
                    </p>
                    <div
                      className="pt-4 border-t border-rule font-mono text-[10px] space-y-2 uppercase tracking-wide"
                      style={{ color: accent }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">✓</span>
                        <span className="text-obsidian">Accredited registry verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-obsidian">✓</span>
                        <span className="text-obsidian">Submittal-ready parameter sheets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-obsidian">✓</span>
                        <span className="text-obsidian">Accelerated procurement approval</span>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ PART 02: [ THE SPEC-GRADE BUILD ] ═══════════════ */}
      <section className="bg-obsidian text-cream py-28 border-t border-rule-dark" id="what-we-shipped">
        <div className="container-site">
          <StaggerContainer staggerChildren={0.1} delayChildren={0.05}>
            <StaggerItem>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
                style={{ color: accent }}
              >
                [ 02 — THE SPEC-GRADE BUILD ]
              </div>
              <h2 className="font-serif text-[40px] md:text-[56px] tracking-tighter leading-[1.08] mb-4 font-semibold text-white text-start">
                Engineered for Institutional Trade &amp; Procurement.
              </h2>
              <p className="font-sans text-[16px] text-white/60 max-w-2xl font-light mb-16 leading-relaxed text-start">
                A purpose-built digital infrastructure combining edge delivery, self-hosted Payload CMS schema,
                multilingual technical catalogs, and tamper-proof certificate verification vaults.
              </p>
            </StaggerItem>

            {/* Architecture Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-start">
              <div className="border border-rule-dark bg-[#141414] p-7 flex flex-col justify-between hover:border-white/25 transition-colors">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: accent }}>
                    PILLAR 01 · EDGE INFRASTRUCTURE
                  </div>
                  <h3 className="font-serif text-xl font-medium text-white mb-3">
                    Subdomain Trade Routing
                  </h3>
                  <p className="font-sans text-xs text-white/55 leading-relaxed font-light">
                    Autonomous Next.js edge routing on dedicated subdomains (<span className="text-white/80 font-mono">{cs.domain}</span>) with global multi-region caching and sub-100ms response times.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-rule-dark font-mono text-[10px] text-white/40 uppercase tracking-wider">
                  [ NEXT.JS · APP ROUTER ]
                </div>
              </div>

              <div className="border border-rule-dark bg-[#141414] p-7 flex flex-col justify-between hover:border-white/25 transition-colors">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: accent }}>
                    PILLAR 02 · CMS ENGINE
                  </div>
                  <h3 className="font-serif text-xl font-medium text-white mb-3">
                    Payload CMS Schema Control
                  </h3>
                  <p className="font-sans text-xs text-white/55 leading-relaxed font-light">
                    Self-hosted PostgreSQL data models for SKUs, technical tolerances, and regulatory documentation vaults with zero vendor lock-in.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-rule-dark font-mono text-[10px] text-white/40 uppercase tracking-wider">
                  [ PAYLOAD CMS · POSTGRESQL ]
                </div>
              </div>

              <div className="border border-rule-dark bg-[#141414] p-7 flex flex-col justify-between hover:border-white/25 transition-colors">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: accent }}>
                    PILLAR 03 · CATALOG LEDGER
                  </div>
                  <h3 className="font-serif text-xl font-medium text-white mb-3">
                    Multilingual Spec Catalogs
                  </h3>
                  <p className="font-sans text-xs text-white/55 leading-relaxed font-light">
                    Structured multilingual catalog schemas with documented technical parameters, test tolerances, and instant downloadable submittal packages.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-rule-dark font-mono text-[10px] text-white/40 uppercase tracking-wider">
                  [ I18N · SPEC SUBMITTALS ]
                </div>
              </div>

              <div className="border border-rule-dark bg-[#141414] p-7 flex flex-col justify-between hover:border-white/25 transition-colors">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: accent }}>
                    PILLAR 04 · COMPLIANCE ENGINE
                  </div>
                  <h3 className="font-serif text-xl font-medium text-white mb-3">
                    Certificate Vaults
                  </h3>
                  <p className="font-sans text-xs text-white/55 leading-relaxed font-light">
                    Direct third-party accreditation registry integration and batch Certificate of Analysis (CoA) vault lookups for audit-free buyer onboarding.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-rule-dark font-mono text-[10px] text-white/40 uppercase tracking-wider">
                  [ VERIFIED · REGISTRY KEYS ]
                </div>
              </div>
            </div>

            {/* Product range catalog cards with technical specs */}
            {cs.products.length > 0 && (
              <div className="mb-20 text-start">
                <div className="flex items-center justify-between mb-8 pb-3 border-b border-rule-dark">
                  <h3 className="font-serif text-2xl font-medium text-white">
                    Documented Product Ranges &amp; Technical Submittals
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                    {cs.products.length} RANGES ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cs.products.map((p, i) => (
                    <StaggerItem key={i}>
                      <div className="h-full border border-rule-dark bg-[#141414] p-8 hover:border-white/25 transition-colors duration-300 flex flex-col justify-between group">
                        <div>
                          <div
                            className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4"
                            style={{ color: accent }}
                          >
                            {String(i + 1).padStart(2, '0')} — RANGE
                          </div>
                          <h4 className="font-serif text-2xl mb-3 font-medium tracking-tight text-white">
                            {p.name}
                          </h4>
                          <p className="font-sans text-sm text-white/50 leading-relaxed font-light mb-6">
                            {p.description}
                          </p>
                        </div>
                        {p.specs && (
                          <div className="pt-4 border-t border-rule-dark font-mono text-[10px] text-white/70 tracking-wide bg-white/[0.02] p-3 -mx-3 -mb-3">
                            <span className="text-white/40 block mb-1">TECHNICAL SPECIFICATIONS</span>
                            {p.specs}
                          </div>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </div>
            )}

            {/* Admin panel autonomy mock */}
            <StaggerItem>
              <div className="border border-rule-dark bg-[#141414] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)] overflow-hidden text-start">
                <div className="flex items-center justify-between px-6 py-4 bg-[#0D0D0D] border-b border-rule-dark">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="ms-3 font-mono text-[10px] text-white/60">
                      {cs.domain}/admin — PAYLOAD CMS OPERATIONAL CONTROL
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald hidden sm:inline-block">
                    ● SELF-HOSTED ENGINE
                  </span>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 border-b md:border-b-0 md:border-e border-rule-dark p-6 bg-[#0D0D0D]">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-4">
                      SCHEMA COLLECTIONS
                    </div>
                    <ul className="space-y-2 font-mono text-[11px] text-white/75">
                      <li className="flex items-center justify-between p-2 bg-white/5 border border-white/10">
                        <span>Products &amp; SKUs</span>
                        <span className="text-[10px]" style={{ color: accent }}>[ACTIVE]</span>
                      </li>
                      <li className="flex items-center justify-between p-2 border border-transparent hover:border-white/10">
                        <span>Certifications Vault</span>
                        <span className="text-[10px] text-white/40">VAULT</span>
                      </li>
                      <li className="flex items-center justify-between p-2 border border-transparent hover:border-white/10">
                        <span>Trade Submittals</span>
                        <span className="text-[10px] text-white/40">PDF/CoA</span>
                      </li>
                      <li className="flex items-center justify-between p-2 border border-transparent hover:border-white/10">
                        <span>Markets &amp; Ports</span>
                        <span className="text-[10px] text-white/40">GEO</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-1">
                          CONTENT AUTONOMY
                        </div>
                        <div className="font-serif text-xl text-white">Full Client Control Without Developer Dependencies</div>
                      </div>
                      <span
                        className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white"
                        style={{ backgroundColor: accent }}
                      >
                        + NEW RECORD
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        ['PRODUCT SPEC SHEETS', 'Documented slip ratings, moisture limits, and optical grading', accent],
                        ['THIRD-PARTY AUDIT CERTIFICATES', 'Verifiable registry keys and expiration tracker', accent],
                        ['CONTAINER LOGISTICS & INCOTERMS', 'FOB/CIF pricing thresholds and lead-time calculators', accent],
                        ['MULTILINGUAL CATALOG TRANSLATIONS', 'Synchronized locale publishing across trading desks', accent],
                      ].map(([label, meta, c], i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-rule-dark px-4 py-3 bg-obsidian hover:bg-white/5 transition-colors"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
                            {label}
                          </span>
                          <span className="font-mono text-[10px] text-white/50">{meta}</span>
                          <span className="font-mono text-[10px] whitespace-nowrap self-start sm:self-auto" style={{ color: c }}>
                            [ EDIT SCHEMA ]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ PART 03: [ OPERATIONAL RESULTS & IMPACT ] ═══════════════ */}
      <section
        className="py-28 border-t border-rule bg-paper bg-cream text-obsidian"
        id="operational-impact"
      >
        <div className="container-site">
          <StaggerContainer staggerChildren={0.1} delayChildren={0.05}>
            <StaggerItem>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
                style={{ color: accent }}
              >
                [ 03 — OPERATIONAL RESULTS &amp; IMPACT ]
              </div>
              <h2 className="font-serif text-[40px] md:text-[56px] tracking-tighter leading-[1.08] mb-4 font-semibold text-obsidian text-start">
                Institutional Scale &amp; Proven Trade Corridors.
              </h2>
              <p className="font-sans text-[16px] text-muted max-w-2xl font-light mb-16 leading-relaxed text-start">
                Measurable export volumes, audit clearances, accelerated port dispatch speeds,
                and landmark project execution across primary trading hubs.
              </p>
            </StaggerItem>

            {/* Landmark Project Highlight Banner / Pill for Flagship Deployments */}
            {hasLandmark && cs.landmarkProject && (
              <StaggerItem className="mb-20">
                <div className="border border-rule bg-surface p-8 sm:p-10 relative shadow-soft text-start">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-rule">
                    <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-1 border border-rule bg-paper bg-cream/70 text-obsidian">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                      FLAGSHIP DEPLOYMENT · LANDMARK PROJECT
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted border border-rule px-2.5 py-0.5 bg-paper bg-cream/40">
                      LOCATION: {cs.landmarkProject.location}
                    </span>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-obsidian mb-2">
                      {cs.landmarkProject.name}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted">
                      PROVEN INSTITUTIONAL CONTRACT DELIVERABLE
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 border border-rule divide-y md:divide-y-0 md:divide-x divide-rule bg-surface-2/40">
                    <div className="p-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block mb-2">
                        CONTRACT SCOPE
                      </span>
                      <p className="font-mono text-xs sm:text-sm text-obsidian leading-relaxed font-medium">
                        {cs.landmarkProject.scope}
                      </p>
                    </div>

                    <div className="p-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block mb-2">
                        DELIVERY &amp; TRANSIT
                      </span>
                      <p className="font-mono text-xs sm:text-sm text-obsidian leading-relaxed font-medium">
                        {cs.landmarkProject.delivery}
                      </p>
                    </div>

                    <div className="p-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block mb-2">
                        CLEARANCE &amp; OUTCOME
                      </span>
                      <p className="font-mono text-xs sm:text-sm text-emerald leading-relaxed font-semibold">
                        {cs.landmarkProject.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )}

            {/* Dedicated Operational Metrics Band */}
            <StaggerItem className="mb-20 text-start">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-rule">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted block mb-1">
                    OPERATIONAL PROOF LEDGER
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-obsidian">
                    Verified Trade Performance Metrics
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border border-rule bg-surface text-muted hidden sm:inline-block">
                  AUDITED CORRIDORS
                </span>
              </div>

              {/* Primary 4-metric grid with hairline borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-rule divide-y sm:divide-y-0 sm:divide-x divide-rule bg-surface shadow-soft">
                <div className="p-8 flex flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted block mb-4">
                    01 / EXPORT VOLUME
                  </span>
                  <div
                    className="font-serif text-3xl sm:text-4xl font-semibold mb-2 tracking-tight"
                    style={{ color: accent }}
                  >
                    {cs.operationalMetrics?.annualVolume || (cs.stats[0] ? `${cs.stats[0].value} ${cs.stats[0].label}` : '1M+ SQM')}
                  </div>
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
                    Annual Contracted Capacity
                  </p>
                </div>

                <div className="p-8 flex flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted block mb-4">
                    02 / GLOBAL EXPANSION
                  </span>
                  <div
                    className="font-serif text-3xl sm:text-4xl font-semibold mb-2 tracking-tight"
                    style={{ color: accent }}
                  >
                    {cs.operationalMetrics?.countriesServed || (cs.stats[1] ? `${cs.stats[1].value} ${cs.stats[1].label}` : '40+ Markets')}
                  </div>
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
                    Active International Corridors
                  </p>
                </div>

                <div className="p-8 flex flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted block mb-4">
                    03 / PORT CLEARANCE SPEED
                  </span>
                  <div
                    className="font-serif text-2xl sm:text-3xl font-semibold mb-2 tracking-tight"
                    style={{ color: accent }}
                  >
                    {cs.operationalMetrics?.portClearance || cs.operationalMetrics?.leadTime || 'Accelerated Transit'}
                  </div>
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
                    Port Staging &amp; Clearance Speed
                  </p>
                </div>

                <div className="p-8 flex flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted block mb-4">
                    04 / COMPLIANCE AUDITS
                  </span>
                  <div
                    className="font-serif text-2xl sm:text-3xl font-semibold mb-2 tracking-tight"
                    style={{ color: accent }}
                  >
                    100% Passed
                  </div>
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider truncate" title={cs.operationalMetrics?.certificationsSummary}>
                    {cs.operationalMetrics?.certificationsSummary || 'Multi-Agency Regulatory Acceptance'}
                  </p>
                </div>
              </div>

              {/* Secondary logistics parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-x border-b border-rule divide-x divide-rule bg-surface-2/40 text-start">
                <div className="px-6 py-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted block">
                    MINIMUM ORDER (MOQ)
                  </span>
                  <span className="font-mono text-xs text-obsidian font-medium">
                    {cs.operationalMetrics?.moq || "1×20' FCL"}
                  </span>
                </div>
                <div className="px-6 py-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted block">
                    LEAD TIME
                  </span>
                  <span className="font-mono text-xs text-obsidian font-medium">
                    {cs.operationalMetrics?.leadTime || '15–25 Days'}
                  </span>
                </div>
                <div className="px-6 py-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted block">
                    INCOTERMS
                  </span>
                  <span className="font-mono text-xs text-obsidian font-medium">
                    {cs.operationalMetrics?.incoterms || cs.operationalMetrics?.traceability || 'FOB / CFR / CIF'}
                  </span>
                </div>
                <div className="px-6 py-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted block">
                    AUDIT READINESS
                  </span>
                  <span className="font-mono text-xs text-emerald font-medium">
                    Audit-Free Qualification
                  </span>
                </div>
              </div>
            </StaggerItem>

            {/* Regulatory certifications & accreditation badges */}
            {cs.certifications.length > 0 && (
              <StaggerItem className="text-start">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-rule">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                    OFFICIAL REGULATORY ACCREDITATIONS &amp; CERTIFICATION VAULT
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald">
                    {cs.certifications.length} AUDITED STANDARDS
                  </span>
                </div>
                <div className="border border-rule divide-y divide-rule bg-surface shadow-soft">
                  {cs.certifications.map((c, i) => (
                    <div
                      key={i}
                      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-emerald">✓</span>
                        <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-obsidian font-medium">
                          {c}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted border border-rule px-2.5 py-0.5 self-start sm:self-auto bg-paper bg-cream/50">
                        [ VERIFIED &amp; AUDITED ]
                      </span>
                    </div>
                  ))}
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: Testimonial (when available) ═══════════════ */}
      {cs.testimonial && (
        <section className="bg-obsidian py-28 border-t border-rule-dark text-cream">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <AnimatedSection>
              <div className="font-serif text-3xl md:text-4xl leading-snug italic text-white/90 mb-10">
                &ldquo;{cs.testimonial.quote}&rdquo;
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                {cs.testimonial.author}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55 mt-2">
                {cs.testimonial.role}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ FINAL CTA: Two doors ═══════════════ */}
      <section className="py-32 border-t border-rule bg-paper bg-cream text-obsidian">
        <div className="container-site text-center">
          <AnimatedSection className="mb-16">
            <div
              className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
              style={{ color: accent }}
            >
              [ NEXT STEPS ]
            </div>
            <h2 className="font-serif text-[44px] md:text-[64px] tracking-tighter leading-[1.05] font-semibold mb-6 text-obsidian">
              Judge the work yourself.
            </h2>
            <p className="font-sans text-[17px] text-muted max-w-xl mx-auto font-light">
              Explore the live deployment — or let&apos;s build the same standard of digital
              infrastructure for your trade operation.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-12 py-5 text-white font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              VIEW LIVE SITE ↗
            </Link>
            <Link
              href="/rfq"
              className="inline-flex items-center justify-center px-12 py-5 font-mono text-[11px] uppercase tracking-[0.2em] border border-rule hover:border-obsidian transition-colors text-obsidian bg-surface"
            >
              [ REQUEST A SIMILAR BUILD ]
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ NEXT CASE STUDY ═══════════════ */}
      {(() => {
        const keys = Object.keys(CASE_STUDIES);
        const idx = keys.findIndex((k) => slug.toLowerCase().includes(k));
        const nextKey = keys[(idx + 1 + keys.length) % keys.length] || keys[0];
        const next = CASE_STUDIES[nextKey];
        if (!next || next.title === cs.title) return null;
        return (
          <Link
            href={`/portfolio/${nextKey}`}
            className="group block border-t border-rule-dark bg-obsidian py-20 transition-colors hover:bg-sidebar text-cream"
          >
            <div className="container-site flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="text-start">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55 mb-4">
                  NEXT CASE STUDY
                </div>
                <div className="font-serif text-[36px] md:text-[52px] tracking-tighter leading-none font-semibold text-white">
                  {next.title}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] mt-3 text-white/60">
                  {next.category}
                </div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-all group-hover:text-white group-hover:translate-x-2">
                VIEW CASE STUDY →
              </span>
            </div>
          </Link>
        );
      })()}
    </div>
  );
}

export default ProjectThemedLayout;
