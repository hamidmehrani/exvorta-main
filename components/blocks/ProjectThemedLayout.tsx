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
    heroBg: project?.heroBgColor || '#141414',
    accent: project?.accentColor || '#059669',
    stats: [],
    certifications: [],
    products: [],
    metrics: [],
  };

  const cmsHero = project?.heroImage && typeof project.heroImage === 'object' && project.heroImage.url
    ? project.heroImage
    : null;
  const heroSrc = cmsHero?.url || cs.heroImage;
  const accent = project?.accentColor || cs.accent;
  const liveUrl = project?.liveUrl || cs.url;

  const metrics: { label: string; value: string }[] =
    project?.metrics && project.metrics.length > 0
      ? project.metrics.map((mm) => ({ label: mm.label || '', value: mm.value || '' }))
      : cs.metrics;

  const excerpt = project?.excerpt || cs.excerpt;

  return (
    <div className="bg-obsidian text-cream">
      {/* ═══════════════ HERO: split editorial + live frame ═══════════════ */}
      <div className="min-h-screen pt-32 pb-24 border-b border-white/10 bg-obsidian">
        <div className="container-site relative z-10">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easings.cinematic }}
            className="mb-12 flex flex-wrap items-center gap-4"
          >
            <Link className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:opacity-80" style={{ color: accent }} href="/portfolio">
              <span className="text-[14px]">←</span>
              ALL CASE STUDIES
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{cs.category}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left: brand story */}
            <div className="col-span-1 lg:col-span-5 flex flex-col">
              <AnimatedSection>
                <div className="flex items-center gap-3 mb-8">
                  <span className="inline-block w-10 h-[2px]" style={{ backgroundColor: accent }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">CASE STUDY — {cs.title.toUpperCase()}</span>
                </div>
                <h1 className="font-serif text-[44px] md:text-[64px] tracking-tighter leading-[1.05] mb-6 font-semibold">
                  {cs.title}
                </h1>
                <p className="font-serif text-xl md:text-2xl leading-snug mb-6" style={{ color: accent }}>
                  {cs.tagline}
                </p>
                <p className="font-sans text-[16px] text-white/50 leading-relaxed font-light mb-10 max-w-lg">
                  {excerpt}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                {/* Live deployment CTA — the proof */}
                <Link
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-4 border px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:gap-6"
                  style={{ borderColor: accent, color: accent }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: accent }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: accent }} />
                  </span>
                  VISIT LIVE — {cs.domain.toUpperCase().replace('.EXVORTA.COM', '')}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </Link>
              </AnimatedSection>

              {/* Metrics ledger */}
              {metrics.length > 0 && (
                <AnimatedSection className="mt-14" delay={0.15}>
                  <div className="w-full border border-white/10 divide-y divide-white/10">
                    {metrics.map((metric, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{metric.label}</span>
                        <span className="font-mono text-[10px] uppercase text-white/80">{metric.value}</span>
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
            <AnimatedSection className="mt-24" delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {cs.stats.map((s, i) => (
                  <div key={i} className="px-8 py-10 text-center">
                    <div className="font-serif text-5xl md:text-6xl font-semibold mb-2 tracking-tight" style={{ color: accent }}>
                      {s.value}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* ═══════════════ SECTION 1: THE BRIEF — why they needed us ═══════════════ */}
      <section className="py-28 border-t border-white/10" style={{ backgroundColor: cs.heroBg }} id="the-brief">
        <div className="container-site text-obsidian">
          <StaggerContainer staggerChildren={0.12} delayChildren={0.05}>
            <StaggerItem>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-8" style={{ color: accent }}>[ 01 — THE BRIEF ]</div>
              <h2 className="font-serif text-[40px] md:text-[56px] tracking-tighter leading-[1.08] mb-10 font-semibold max-w-4xl">
                {cs.brief?.headline || 'A commodity product. A non-commodity buyer.'}
              </h2>
            </StaggerItem>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <StaggerItem className="lg:col-span-5">
                <p className="font-sans text-[17px] leading-relaxed text-black/70 font-light">
                  {cs.brief?.intro || (
                    <>
                      {cs.title} competes in a market where every offer looks identical — same fairs, same
                      price lists, same PDFs. The buyer&apos;s real question is never &quot;what do you sell&quot;
                      but <em>&quot;can I trust this container to arrive exactly as specified.&quot;</em>
                    </>
                  )}
                </p>
              </StaggerItem>
              <StaggerItem className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border border-black/10 p-6 bg-white/40">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/60 mb-3">THE PROBLEM</div>
                    <p className="font-sans text-sm text-black/70 leading-relaxed">
                      {cs.brief?.problem ||
                        'Credibility gap: institutional buyers judged the company by a website that undersold its certifications, capacity, and compliance depth.'}
                    </p>
                  </div>
                  <div className="border p-6" style={{ borderColor: accent, backgroundColor: `${accent}08` }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>THE EXVORTA ANSWER</div>
                    <p className="font-sans text-sm text-black/80 leading-relaxed">
                      {cs.brief?.answer ||
                        'A spec-grade web presence: every claim verifiable, every certificate one click away, every product documented like an architectural submittal.'}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ SECTION 2: WHAT WE SHIPPED — capabilities ═══════════════ */}
      <section className="bg-obsidian py-28 border-t border-white/10" id="what-we-shipped">
        <div className="container-site">
          <StaggerContainer staggerChildren={0.1} delayChildren={0.05}>
            <StaggerItem>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-8" style={{ color: accent }}>[ 02 — WHAT WE SHIPPED ]</div>
              <h2 className="font-serif text-[40px] md:text-[56px] tracking-tighter leading-[1.08] mb-16 font-semibold">
                Built to close deals, not just to look good.
              </h2>
            </StaggerItem>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {cs.products.map((p, i) => (
                <StaggerItem key={i}>
                  <div className="h-full border border-white/10 bg-sidebar p-8 hover:border-white/25 transition-colors duration-300 group">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-6" style={{ color: accent }}>
                      {String(i + 1).padStart(2, '0')} — RANGE
                    </div>
                    <h3 className="font-serif text-2xl mb-4 font-medium tracking-tight">{p.name}</h3>
                    <p className="font-sans text-sm text-white/50 leading-relaxed font-light">{p.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>

            {/* certifications strip */}
            {cs.certifications.length > 0 && (
              <StaggerItem>
                <div className="border border-white/10 divide-y divide-white/10">
                  <div className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55 border-b border-white/10">
                    COMPLIANCE FRONT-AND-CENTER — VERIFIED CLAIMS, ZERO INFLATION
                  </div>
                  {cs.certifications.map((c, i) => (
                    <div key={i} className="px-6 py-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-white/70">
                      <span style={{ color: accent }}>✓</span>
                      {c}
                    </div>
                  ))}
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ SECTION 3: YOU OWN THE PANEL (CMS control) ═══════════════ */}
      <section className="py-28 border-t border-white/10" style={{ backgroundColor: cs.heroBg }} id="own-the-panel">
        <div className="container-site text-obsidian">
          <StaggerContainer staggerChildren={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <StaggerItem className="lg:col-span-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-8" style={{ color: accent }}>[ 03 — YOU OWN IT ]</div>
                <h2 className="font-serif text-[38px] md:text-[52px] tracking-tighter leading-[1.08] mb-8 font-semibold">
                  No developer required. Ever.
                </h2>
                <p className="font-sans text-[16px] leading-relaxed text-black/70 font-light mb-8">
                  {cs.title} runs on a custom CMS panel we engineered. From your own browser you can
                  add products, upload certificates, publish news, change hero copy, swap imagery —
                  anything, in seconds, without touching a line of code.
                </p>
                <ul className="space-y-3 mb-10">
                  {['Add / edit products & spec sheets', 'Upload certificates & compliance docs', 'Update copy, imagery and hero sections', 'Full multilingual-ready content model'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-sm text-black/70">
                      <span className="mt-0.5 font-mono" style={{ color: accent }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/web" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] border-b pb-1 transition-all hover:gap-4" style={{ borderColor: accent, color: accent }}>
                  SEE WHAT ELSE COMES STANDARD
                  <span>→</span>
                </Link>
              </StaggerItem>
              <StaggerItem className="lg:col-span-7">
                {/* Admin panel mock */}
                <div className="border border-black/10 bg-[#141414] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#0D0D0D] border-b border-white/10">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="ml-3 font-mono text-[10px] text-white/60">{cs.domain}/admin — YOUR PANEL</span>
                  </div>
                  <div className="flex">
                    <div className="w-14 border-r border-white/10 flex flex-col items-center py-5 gap-4 bg-[#0D0D0D]">
                      {[0, 1, 2, 3, 4].map(i => (
                        <span key={i} className="w-5 h-5 border" style={i === 1 ? { backgroundColor: accent, borderColor: accent } : { borderColor: 'rgba(255,255,255,0.2)' }} />
                      ))}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-2">CONTENT OPERATIONS</div>
                          <div className="font-serif text-xl text-white">Everything editable</div>
                        </div>
                        <span className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white" style={{ backgroundColor: accent }}>+ NEW</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          ['PRODUCTS', '24 items', accent],
                          ['CERTIFICATIONS', '9 documents', accent],
                          ['NEWS & STORIES', '6 published', accent],
                          ['PAGE SECTIONS', 'drag & drop', accent],
                          ['MEDIA LIBRARY', 'unlimited', accent],
                        ].map(([label, meta, c], i) => (
                          <div key={i} className="flex items-center justify-between gap-3 border border-white/10 px-4 py-3 bg-obsidian hover:bg-white/5 transition-colors">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">{label}</span>
                            <span className="font-mono text-[10px] text-white/60">{meta}</span>
                            <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: c }}>[ EDIT ]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: testimonial (when available) ═══════════════ */}
      {cs.testimonial && (
        <section className="bg-obsidian py-28 border-t border-white/10">
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

      {/* ═══════════════ FINAL CTA: two doors ═══════════════ */}
      <section className="py-32 border-t border-white/10" style={{ backgroundColor: cs.heroBg }}>
        <div className="container-site text-obsidian">
          <AnimatedSection className="text-center mb-16">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: accent }}>[ NEXT STEPS ]</div>
            <h2 className="font-serif text-[44px] md:text-[64px] tracking-tighter leading-[1.05] font-semibold mb-6">
              Judge the work yourself.
            </h2>
            <p className="font-sans text-[17px] text-black/60 max-w-xl mx-auto font-light">
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
              className="inline-flex items-center justify-center px-12 py-5 font-mono text-[11px] uppercase tracking-[0.2em] border transition-colors"
              style={{ borderColor: 'var(--color-obsidian)' }}
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
            className="group block border-t border-white/10 bg-obsidian py-20 transition-colors hover:bg-sidebar"
          >
            <div className="container-site flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55 mb-4">NEXT CASE STUDY</div>
                <div className="font-serif text-[36px] md:text-[52px] tracking-tighter leading-none font-semibold text-white">
                  {next.title}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] mt-3 text-white/60">
                  {next.category}
                </div>
              </div>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-all group-hover:text-white group-hover:translate-x-2"
              >
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
