"use client";

import React, { useRef } from 'react';
import { m as motion } from "framer-motion";
import type { Project, Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Button } from '@/components/ui/Button';
import { useAnimationLevel, easings } from '@/lib/animations';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { LiveWebsiteFrame } from '@/components/ui/LiveWebsiteFrame';
import { Reveal } from '@/components/ui/Reveal';
import { StaggerText } from '@/components/ui/motion';

// ── Strict Type Definitions ───────────────────────────────────────────────────

export interface InlineProject {
  id?: string;
  title: string;
  description?: string;
  industry?: string;
  volume?: string;
  service?: string;
  linkLabel?: string;
  linkUrl?: string;
  imageUrl?: string;
  image?: { url?: string | null } | number | null;
}

export interface PortfolioArchiveBlockProps {
  sectionLabel?: string;
  headline?: string;
  subtitle?: string;
  projects?: unknown[];
  ctaLabel?: string;
  ctaUrl?: string;
  fullPage?: boolean;
}

function isProject(obj: unknown): obj is Project {
  return typeof obj === 'object' && obj !== null && 'slug' in obj && 'title' in obj;
}

function isInlineProject(obj: unknown): obj is InlineProject {
  return typeof obj === 'object' && obj !== null && 'title' in obj && !('slug' in obj);
}

// Known case-study routes + local preview assets, matched from the project title.
// CMS records hold placeholder values ('#' links, expiring googleusercontent image
// URLs), so they are only trusted when they point somewhere real.
const TITLE_SLUG_ROUTES: Record<string, string> = {
  spicevo: '/portfolio/spicevo',
  nutave: '/portfolio/nutave',
  stonvi: '/portfolio/stonvi',
};

const TITLE_IMAGE_ROUTES: Record<string, string> = {
  spicevo: '/portfolio-spicevo.png',
  nutave: '/portfolio-nutave.png',
  stonvi: '/portfolio-stonvi.png',
};

function isUsableUrl(url?: string): boolean {
  return !!url && url !== '#' && !url.startsWith('https://lh3.googleusercontent.com/');
}

function resolveCaseStudyUrl(project: InlineProject): string {
  if (isUsableUrl(project.linkUrl) && project.linkUrl) return project.linkUrl;
  const match = Object.keys(TITLE_SLUG_ROUTES).find(k =>
    project.title.toLowerCase().includes(k),
  );
  return match ? TITLE_SLUG_ROUTES[match] : '/portfolio';
}

function resolveProjectImage(project: InlineProject): string {
  const uploaded = project.image && typeof project.image === 'object' ? project.image.url : null;
  if (isUsableUrl(uploaded ?? undefined) && uploaded) return uploaded;
  if (isUsableUrl(project.imageUrl) && project.imageUrl) return project.imageUrl;
  const match = Object.keys(TITLE_IMAGE_ROUTES).find(k =>
    project.title.toLowerCase().includes(k),
  );
  return match ? TITLE_IMAGE_ROUTES[match] : '';
}

function extractMediaUrl(media?: number | Media | null, fallbackSlug?: string): string {
  if (typeof media === 'object' && media !== null && 'url' in media && media.url) {
    return media.url;
  }
  // Per-project placeholder fallbacks (single source: TITLE_IMAGE_ROUTES)
  if (fallbackSlug) {
    const key = Object.keys(TITLE_IMAGE_ROUTES).find(k => fallbackSlug.toLowerCase().includes(k))
    if (key) return TITLE_IMAGE_ROUTES[key]
  }
  return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE SECTION MODE (Proof of Execution)
// ─────────────────────────────────────────────────────────────────────────────
function HomepagePortfolioSection({
  sectionLabel,
  headline,
  subtitle,
  projects,
  ctaLabel,
  ctaUrl,
}: PortfolioArchiveBlockProps) {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const animationLevel = useAnimationLevel();

  const safeProjects = Array.isArray(projects) ? projects.filter(isInlineProject) : [];

  const cardVariants = {
    hidden: { opacity: 0, y: 48, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: easings.cinematic },
    },
  };

  return (
    <section ref={containerRef} className="w-full py-16 sm:py-24 lg:py-32 bg-[#FAFAF8] border-t border-black/5" data-purpose="proof-of-execution">
      <Container>
        {/* Header matched to reference design */}
        <Reveal y={20} className="mb-20">
          <div className="font-mono text-[11px] tracking-[0.25em] text-gray-500 uppercase mb-4">
            {sectionLabel || '[ OUR INFRASTRUCTURE WORK ]'}
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-serif text-[#0D0D0D] tracking-tighter leading-none mb-8">
            {headline || 'Proof of Execution.'}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-black/60 font-light max-w-2xl">{subtitle}</p>
          )}
          <motion.div
            className="w-full h-[1px] bg-black mt-8 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.3, ease: easings.cinematic }}
          />
        </Reveal>

        {/* 1 col mobile, 2 col tablet, 3 col desktop as requested */}
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: animationLevel === 'none' ? 0 : 0.14, delayChildren: 0.1 } } }}
        >
          {safeProjects?.map((project, index) => (
            <motion.article
              key={project.id || index}
              variants={cardVariants}
              className="portfolio-card group flex flex-col bg-white border border-black/5 rounded-none overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 relative"
              whileHover={animationLevel === 'none' ? undefined : { y: -8 }}
            >
              <LiveWebsiteFrame
                title={project.title}
                imageUrl={resolveProjectImage(project)}
                liveUrl={resolveCaseStudyUrl(project).startsWith('/portfolio/') ? `https://${resolveCaseStudyUrl(project).split('/').pop()}.exvorta.com` : undefined}
                live
                industry={project.industry}
                volume={project.volume}
                service={project.service}
              />

              <div className="flex flex-col flex-grow p-8">
                <h3 className="card-title font-serif text-3xl text-black mb-4 font-medium tracking-tight relative z-10">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm font-light text-black/60 leading-relaxed mb-8 flex-grow">
                    {project.description}
                  </p>
                )}

                <div className="mt-auto self-start flex flex-wrap items-center gap-3">
                  <MagneticButton>
                    <a
                      href={resolveCaseStudyUrl(project)}
                      className="inline-flex items-center justify-center border border-black rounded-none px-8 py-4 text-[10px] font-mono text-center hover:bg-black hover:text-white transition-colors group/btn"
                    >
                      {project.linkLabel || 'VIEW CASE STUDY'}
                      <span className="ml-2 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform">↗</span>
                    </a>
                  </MagneticButton>
                  {(() => {
                    const csUrl = resolveCaseStudyUrl(project);
                    const liveHref = csUrl.startsWith('/portfolio/') ? `https://${csUrl.split('/').pop()}.exvorta.com` : '';
                    return liveHref ? (
                      <a
                        href={liveHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${project.title} live website`}
                        className="inline-flex items-center gap-2 rounded-none px-6 py-4 text-[10px] font-mono text-black/60 hover:text-black border border-black/15 hover:border-black transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" aria-hidden />
                        LIVE SITE
                      </a>
                    ) : null;
                  })()}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="py-12 flex justify-center border-t border-black/5 pt-20">
          <Reveal delay={0.1}>
            <MagneticButton>
              <a
                href={ctaUrl || "/portfolio"}
                className="bg-[#0D0D0D] text-white px-12 py-5 text-[11px] font-mono font-medium tracking-[0.2em] uppercase rounded-none hover:bg-black transition-all"
              >
                {ctaLabel || 'EXPLORE FULL PORTFOLIO ↗'}
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL-PAGE MODE: used by /portfolio page, receives Project[] from Payload
// ─────────────────────────────────────────────────────────────────────────────
function FullPagePortfolioArchive({ projects }: { projects: Project[] }) {
  const hasProjects = projects && projects.length > 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const animationLevel = useAnimationLevel();

  const cardVariants = {
    hidden: { opacity: 0, y: 48, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: easings.cinematic },
    },
  };

  return (
    <div ref={containerRef} className="w-full bg-[#FAFAF8] min-h-screen">
      {/* Hero Section */}
      <section className="w-full pt-28 sm:pt-40 pb-24 border-b border-black/5">
        <Container>
          <div className="max-w-5xl">
            <div className="font-mono text-[11px] uppercase text-gray-500 mb-6 tracking-[0.2em]">[ SELECTED WORKS ]</div>
            <StaggerText
              as="h1"
              text="Latest Web Design Works."
              mode="animate"
              unit="chars"
              duration={0.7}
              className="font-serif text-5xl sm:text-[64px] md:text-[100px] text-[#0D0D0D] mb-8 leading-none font-semibold tracking-tighter"
            />
            <p className="font-sans text-xl md:text-2xl text-black/60 max-w-2xl font-light">
              Premium websites and CMS platforms engineered for global exporters.
            </p>
          </div>
        </Container>
      </section>

      {/* Project Blocks Grid */}
      <section className="w-full py-16 sm:py-24 lg:py-32">
        <Container>
          {hasProjects ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: animationLevel === 'none' ? 0 : 0.14, delayChildren: 0.1 } } }}
            >
              {projects?.map((project, index) => {
                const heroImageUrl = extractMediaUrl(project.heroImage);
                const industry = project.metrics?.find((m) => m.label.toLowerCase() === 'industry')?.value || 'Various';
                const stack = project.metrics?.find((m) => m.label.toLowerCase() === 'tech stack' || m.label.toLowerCase() === 'stack')?.value || 'Next.js';
                // Type narrowing for dynamic Payload CMS fields if any
                const projAny = project as unknown as Record<string, unknown>;
                const excerpt = typeof projAny.excerpt === 'string' ? projAny.excerpt : 'Premium web design and CMS platform.';

                return (
                  <motion.article
                    key={project.id || index}
                    variants={cardVariants}
                    className="portfolio-card group flex flex-col bg-white border border-black/5 rounded-none overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 relative"
                    whileHover={animationLevel === 'none' ? undefined : { y: -8 }}
                  >
                    <LiveWebsiteFrame
                      title={project.title}
                      imageUrl={extractMediaUrl(project.heroImage, project.slug)}
                      liveUrl={project.liveUrl || (project.slug ? `https://${project.slug}.exvorta.com` : undefined)}
                      slug={project.slug}
                      live
                    />

                    <div className="flex flex-col flex-grow p-8">
                      <h3 className="card-title font-serif text-3xl text-black mb-4 font-medium tracking-tight relative z-10">
                        {project.title}
                      </h3>
                      <p className="text-sm font-light text-black/60 leading-relaxed mb-8 flex-grow">
                        {excerpt}
                      </p>

                      <div className="space-y-3 font-mono text-[9px] uppercase tracking-widest mb-10 text-gray-500">
                        <div className="flex justify-between border-b border-black/5 pb-2">
                          <span>INDUSTRY</span>
                          <span className="text-black font-medium truncate max-w-[150px]">{industry}</span>
                        </div>
                        <div className="flex justify-between border-b border-black/5 pb-2">
                          <span>STACK</span>
                          <span className="text-black font-medium truncate max-w-[150px]">{stack}</span>
                        </div>
                      </div>

                      <div className="mt-auto self-start">
                        <MagneticButton>
                          <a href={`/portfolio/${project.slug}`} className="inline-flex items-center justify-center border border-black rounded-none px-8 py-4 text-[10px] font-mono text-center hover:bg-black hover:text-white transition-colors group/btn">
                            READ CASE STUDY <span className="ml-2 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform">↗</span>
                          </a>
                        </MagneticButton>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            <div className="py-16 sm:py-24 lg:py-32 text-center text-black/40 font-mono text-[10px] uppercase tracking-widest">
              No projects found.
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#111] text-white py-16 sm:py-24 lg:py-32 border-t border-black">
        <Container>
          <div className="flex flex-col items-center text-center">
            <MonoLabel className="text-white/40 mb-8 border-white/20">[ NEXT STEPS ]</MonoLabel>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-[96px] text-white mb-8 leading-none font-semibold">
              Initiate a Project.
            </h2>
            <p className="font-sans text-lg text-white/60 max-w-2xl mb-12 mx-auto font-light">
              We partner with a limited number of global exporters each quarter to ensure
              institutional-grade delivery. Let&apos;s discuss your digital infrastructure.
            </p>
            <MagneticButton>
              <Link href="/rfq" className="inline-flex items-center justify-center px-12 py-6 bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] font-mono text-[10px] uppercase tracking-widest transition-colors group/btn">
                REQUEST A CONSULTATION <span className="ml-2 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform">↗</span>
              </Link>
            </MagneticButton>
          </div>
        </Container>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export function PortfolioArchiveBlock(props: PortfolioArchiveBlockProps) {
  const { projects = [], fullPage, ...rest } = props;

  // Filter projects via type guard arrays
  const fullProjects = Array.isArray(projects) ? projects.filter(isProject) : [];
  
  if (fullPage || fullProjects.length > 0) {
    return <FullPagePortfolioArchive projects={fullProjects} />;
  }

  return (
    <HomepagePortfolioSection
      {...rest}
      projects={projects}
    />
  );
}

export default PortfolioArchiveBlock;
