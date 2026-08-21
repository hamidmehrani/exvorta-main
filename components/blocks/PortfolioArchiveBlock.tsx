"use client";

import React, { useRef, useEffect } from 'react';
import { m as motion } from "framer-motion";
import type { Project, Media } from '@/payload-types';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Button } from '@/components/ui/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimationLevel } from '@/lib/animations';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { AnimatedHeadline } from '@/components/ui/AnimatedHeadline';

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

function extractMediaUrl(media?: number | Media | null): string {
  if (typeof media === 'object' && media !== null && 'url' in media && media.url) {
    return media.url;
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

  useEffect(() => {
    if (animationLevel === 'none' || !containerRef.current || !gridRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.portfolio-card') as HTMLElement[];
      
      // Staggered card entrance on scroll
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1, // 100ms delay per card
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );

      // Subtle parallax on titles inside cards
      if (animationLevel === 'full') {
        cards.forEach(card => {
          const title = card.querySelector('.card-title');
          if (title) {
            gsap.fromTo(title,
              { y: 15 },
              {
                y: -15,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                }
              }
            );
          }
        });
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, [animationLevel, safeProjects.length]);

  return (
    <section ref={containerRef} className="w-full py-32 bg-[#FAFAF8] border-t border-black/5" data-purpose="proof-of-execution">
      <Container>
        {/* Header matched to reference design */}
        <div className="mb-20">
          <div className="font-mono text-[11px] tracking-[0.25em] text-gray-500 uppercase mb-4">
            {sectionLabel || '[ OUR INFRASTRUCTURE WORK ]'}
          </div>
          <h2 className="text-7xl md:text-8xl lg:text-[120px] font-serif text-[#0D0D0D] tracking-tighter leading-none mb-8">
            {headline || 'Proof of Execution.'}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg text-black/60 font-light max-w-2xl">{subtitle}</p>
          )}
          <div className="w-full h-[1px] bg-black mt-8"></div>
        </div>

        {/* 1 col mobile, 2 col tablet, 3 col desktop as requested */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {safeProjects.map((project, index) => (
            <article 
              key={project.id || index} 
              className="portfolio-card group flex flex-col bg-white border border-black/5 rounded-none overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 relative"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:scale-105"
                  />
                )}
                {/* Decorative overlay matching "Institutional Elite" */}
                <div className="absolute inset-0 border-[0.5px] border-white/20 pointer-events-none mix-blend-overlay"></div>
              </div>

              <div className="flex flex-col flex-grow p-8">
                <h3 className="card-title font-serif text-3xl text-black mb-4 font-medium tracking-tight relative z-10">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm font-light text-black/60 leading-relaxed mb-8 flex-grow">
                    {project.description}
                  </p>
                )}

                <div className="space-y-3 font-mono text-[9px] uppercase tracking-widest mb-10 text-gray-500">
                  {project.industry && (
                    <div className="flex justify-between border-b border-black/5 pb-2">
                      <span>INDUSTRY</span>
                      <span className="text-black font-medium">{project.industry}</span>
                    </div>
                  )}
                  {project.volume && (
                    <div className="flex justify-between border-b border-black/5 pb-2">
                      <span>VOLUME</span>
                      <span className="text-black font-medium">{project.volume}</span>
                    </div>
                  )}
                  {project.service && (
                    <div className="flex justify-between border-b border-black/5 pb-2">
                      <span>SERVICE</span>
                      <span className="text-black font-medium">{project.service}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto self-start">
                  <MagneticButton>
                    <a 
                      href={project.linkUrl || '#'} 
                      className="inline-flex items-center justify-center border border-black rounded-none px-8 py-4 text-[10px] font-mono text-center hover:bg-black hover:text-white transition-colors group/btn"
                    >
                      {project.linkLabel || 'VIEW CASE STUDY'} 
                      <span className="ml-2 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform">↗</span>
                    </a>
                  </MagneticButton>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="py-12 flex justify-center border-t border-black/5 pt-20">
          <MagneticButton>
            <a 
              href={ctaUrl || "/portfolio"} 
              className="bg-[#0D0D0D] text-white px-12 py-5 text-[11px] font-mono font-medium tracking-[0.2em] uppercase rounded-none hover:bg-black transition-all"
            >
              {ctaLabel || 'EXPLORE FULL PORTFOLIO ↗'}
            </a>
          </MagneticButton>
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
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const animationLevel = useAnimationLevel();

  useEffect(() => {
    if (animationLevel === 'none' || !containerRef.current || !gridRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.portfolio-card') as HTMLElement[];
      
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );

      if (animationLevel === 'full') {
        cards.forEach(card => {
          const title = card.querySelector('.card-title');
          if (title) {
            gsap.fromTo(title,
              { y: 15 },
              {
                y: -15,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                }
              }
            );
          }
        });
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, [animationLevel, hasProjects]);
  
  return (
    <main ref={containerRef} className="w-full bg-[#FAFAF8] min-h-screen">
      {/* Hero Section */}
      <section className="w-full pt-40 pb-24 border-b border-black/5">
        <Container>
          <div className="max-w-5xl">
            <div className="font-mono text-[11px] uppercase text-gray-500 mb-6 tracking-[0.2em]">[ SELECTED WORKS ]</div>
            <AnimatedHeadline 
              text="Latest Web Design Works."
              className="font-serif text-[72px] md:text-[100px] text-[#0D0D0D] mb-8 leading-none font-semibold tracking-tighter"
            />
            <p className="font-sans text-xl md:text-2xl text-black/60 max-w-2xl font-light">
              Premium websites and CMS platforms engineered for global exporters.
            </p>
          </div>
        </Container>
      </section>

      {/* Project Blocks Grid */}
      <section className="w-full py-32">
        <Container>
          {hasProjects ? (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const heroImageUrl = extractMediaUrl(project.heroImage);
                const industry = project.metrics?.find((m) => m.label.toLowerCase() === 'industry')?.value || 'Various';
                const stack = project.metrics?.find((m) => m.label.toLowerCase() === 'tech stack' || m.label.toLowerCase() === 'stack')?.value || 'Next.js';
                // Type narrowing for dynamic Payload CMS fields if any
                const projAny = project as unknown as Record<string, unknown>;
                const excerpt = typeof projAny.excerpt === 'string' ? projAny.excerpt : 'Premium web design and CMS platform.';

                return (
                  <article
                    key={project.id || index}
                    className="portfolio-card group flex flex-col bg-white border border-black/5 rounded-none overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 relative"
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                      {heroImageUrl ? (
                        <Image
                          alt={project.title}
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:scale-105"
                          src={heroImageUrl}
                          fill
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-obsidian/5" />
                      )}
                      <div className="absolute inset-0 border-[0.5px] border-white/20 pointer-events-none mix-blend-overlay"></div>
                    </div>
                    
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
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-32 text-center text-black/40 font-mono text-[10px] uppercase tracking-widest">
              No projects found.
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#111] text-white py-32 border-t border-black">
        <Container>
          <div className="flex flex-col items-center text-center">
            <MonoLabel className="text-white/40 mb-8 border-white/20">[ NEXT STEPS ]</MonoLabel>
            <h2 className="font-serif text-[60px] md:text-[96px] text-white mb-8 leading-none font-semibold">
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
    </main>
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
