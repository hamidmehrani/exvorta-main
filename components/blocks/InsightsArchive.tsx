import React from 'react';
import Image from 'next/image';
import { Reveal, AnimatedSection, AnimatedButton, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { WeeklyBriefingForm } from '@/components/blocks/WeeklyBriefingForm';
import Link from '@/components/ui/AppLink';
import type { Post } from '@/payload-types';
import { Container } from '@/components/ui/Container';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Hairline } from '@/components/ui/Hairline';

export function InsightsArchiveEmptyState() {
  return (
    <Reveal y={16} duration={0.6} className="mx-auto w-full max-w-3xl">
      <div
        role="status"
        aria-label="No insights found"
        className="frame relative isolate mx-auto w-full border border-rule bg-surface px-6 py-14 text-center sm:px-12 sm:py-16 md:px-16 md:py-20"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex justify-center">
            <MonoLabel className="eyebrow inline-flex items-center gap-2 border border-rule bg-surface-2 px-3.5 py-1.5 font-medium">
              [ 00 // NO_INSIGHTS_FOUND ]
            </MonoLabel>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-semibold text-obsidian sm:text-4xl">
            No Insights Published
          </h2>

          <p className="mx-auto mb-10 max-w-lg font-sans text-lede font-light text-muted">
            There are currently no published reports in the insights archive. Explore our interactive commodity tools or contact our advisory team directly.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/tools" className="btn-primary min-h-[52px] w-full px-8 py-4 sm:w-auto">
              [ EXPLORE TOOLS ]
            </Link>
            <Link href="/contact" className="btn-ghost min-h-[52px] w-full px-8 py-4 sm:w-auto">
              [ CONTACT US ]
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export const InsightsArchive: React.FC<{ posts?: Post[] }> = ({ posts }) => {
  return (
    <div className="w-full flex flex-col z-10 relative">
      {/* 01. [HERO] - Purpose: Trade Intelligence Identity */}
      <AnimatedSection id="blog-hero" className="on-dark relative isolate w-full overflow-hidden bg-obsidian px-6 pb-20 pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>
        <Container className="relative z-10 flex flex-col items-center text-center">
          <MonoLabel className="eyebrow eyebrow-dark mb-8">
            [ EXVORTA INTELLIGENCE NODE ]
          </MonoLabel>
          <h1 className="mb-8 font-serif text-display font-semibold text-white">
            Trade Intelligence.<br />
            <span className="text-muted-dark">Every week.</span>
          </h1>
          <p className="mb-16 max-w-2xl text-lede font-light text-muted-dark">
            Institutional-grade analysis, regulatory compliance updates, and architectural blueprints for global commodities trading.
          </p>
          <div className="flex w-full max-w-4xl flex-wrap justify-center gap-3 border-t border-rule-dark pt-8 md:gap-4">
            <span className="inline-flex items-center rounded-sm bg-surface px-5 py-2.5 font-mono text-label uppercase text-obsidian">
              [ ALL INSIGHTS ]
            </span>
            {['MARKET INTEL', 'COMPLIANCE', 'DOCUMENTS', 'ARCHITECTURE'].map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-sm border border-rule-dark bg-white/[0.02] px-5 py-2.5 font-mono text-label uppercase text-muted-dark"
              >
                {topic}
              </span>
            ))}
          </div>
        </Container>
      </AnimatedSection>
      <Hairline className="bg-white/10 w-full" />

      {/* 02. [FEATURED POST] - Purpose: High-priority insight */}
      <AnimatedSection id="blog-featured" className="w-full bg-[#FCFAF8] py-14 sm:py-20 lg:py-24 px-6">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full aspect-[16/10] bg-black/[0.03] rounded-xl border border-black/5 flex items-center justify-center animate-pulse">
            <MonoLabel className="text-black/30">
              [ DATA COMPILING ]
            </MonoLabel>
          </div>
          <div className="flex flex-col">
            <div className="w-20 h-4 bg-black/[0.05] rounded mb-6 animate-pulse"></div>
            <div className="w-full h-12 bg-black/[0.06] rounded mb-4 animate-pulse"></div>
            <div className="w-3/4 h-12 bg-black/[0.06] rounded mb-8 animate-pulse"></div>
            <div className="w-full h-4 bg-black/[0.03] rounded mb-3 animate-pulse"></div>
            <div className="w-5/6 h-4 bg-black/[0.03] rounded mb-10 animate-pulse"></div>
            <div className="w-40 h-12 bg-black/[0.05] rounded animate-pulse"></div>
          </div>
        </Container>
      </AnimatedSection>
      <Hairline className="bg-black/5 w-full" />

      {/* 03. [ARTICLE GRID] - Purpose: News and reports index */}
      <AnimatedSection id="blog-grid" className="w-full bg-[#FCFAF8] pb-16 sm:pb-24 lg:pb-32 px-6 pt-32">
        <Container>
          {posts && posts.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerChildren={0.08} delayChildren={0.15}>
              {posts.map((post) => (
                <StaggerItem key={post.id} className="h-full">
                <Link href={`/insights/${post.slug}`} className="w-full h-full flex flex-col group cursor-pointer block">
                  <div className="w-full aspect-[4/3] bg-black/[0.03] rounded-lg mb-6 border border-black/5 overflow-hidden relative">
                    {typeof post.coverImage === 'object' && post.coverImage?.url ? (
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/5" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <MonoLabel className="text-black/40">
                      {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'UNKNOWN DATE'}
                    </MonoLabel>
                    <MonoLabel className="text-black/40">
                      {typeof post.category === 'object' && post.category !== null && 'title' in post.category ? String((post.category as Record<string, unknown>).title) : 'UNCATEGORIZED'}
                    </MonoLabel>
                  </div>
                  <h3 className="w-full text-xl font-serif text-black leading-tight mb-2 group-hover:text-black/70 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <InsightsArchiveEmptyState />
          )}
        </Container>
      </AnimatedSection>
      <Hairline className="bg-black/5 w-full" />

      {/* 04. [NEWSLETTER] - Purpose: Retention */}
      <AnimatedSection id="blog-newsletter" className="w-full bg-[#0A0A0A] py-16 sm:py-24 lg:py-32 px-6">
        <Container className="max-w-3xl flex flex-col items-center text-center">
          <MonoLabel className="text-white/40 mb-6 block">
            [ WEEKLY BRIEFING ]
          </MonoLabel>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Get weekly trade insights.
          </h2>
          <p className="text-white/50 mb-12">
            Actionable data delivered straight to your executive inbox.
          </p>
          <WeeklyBriefingForm />
        </Container>
      </AnimatedSection>
      <Hairline className="bg-black/5 w-full" />

      {/* 05. [TOPICS] - Purpose: Taxonomy & SEO */}
      <AnimatedSection id="blog-topics" className="w-full bg-[#FCFAF8] py-14 sm:py-20 lg:py-24 px-6">
        <Container className="max-w-5xl flex flex-col items-center text-center">
          <MonoLabel className="text-black/40 mb-10 block">
            [ EXPLORE ARCHIVES ]
          </MonoLabel>
          <div className="flex flex-wrap justify-center gap-3">
            {['Trade Compliance', 'HS Codes', 'Shipping', 'Market Intel', 'UAE Trade']?.map((topic) => (
              <span
                key={topic}
                className="px-5 py-3 border border-black/10 text-black/60 text-[10px] font-mono uppercase tracking-widest hover:bg-black/5 cursor-pointer"
              >
                {topic}
              </span>
            ))}
          </div>
        </Container>
      </AnimatedSection>
      <Hairline className="bg-black/5 w-full" />

      {/* 06. [PROMO] - Purpose: Product pipeline awareness */}
      <AnimatedSection id="blog-promo" className="w-full bg-[#0A0A0A] py-14 sm:py-20 lg:py-24 px-6">
        <Container className="max-w-5xl bg-[#111] border border-white/10 p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col text-center md:text-left">
            <h3 className="text-2xl font-serif text-white mb-2">
              Looking for the tools behind the insights?
            </h3>
            <p className="text-white/50 font-sans">
              Explore Exvorta Docs and Track for enterprise trade management.
            </p>
          </div>
          <AnimatedButton
            href="/insights"
            className="bg-transparent border border-white/20 text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:border-white whitespace-nowrap"
          >
            [ VIEW ECOSYSTEM ]
          </AnimatedButton>
        </Container>
      </AnimatedSection>
      <Hairline className="bg-white/5 w-full" />

      {/* 07. [FINAL CTA] - Purpose: Lead generation */}
      <AnimatedSection id="blog-cta" className="w-full bg-[#0A0A0A] py-14 sm:py-20 lg:py-24 sm:py-32 lg:py-40 px-6">
        <Container className="max-w-4xl text-center flex flex-col items-center">
          <MonoLabel className="text-white/60 mb-8 block">
            [ INITIATE PARTNERSHIP ]
          </MonoLabel>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-12">
            Ready to automate your trade operations?
          </h2>
          <AnimatedButton
            href="/rfq"
            className="bg-white text-black px-12 py-6 text-[11px] uppercase tracking-[0.2em] font-mono hover:bg-gray-200"
          >
            [ REQUEST PROPOSAL ]
          </AnimatedButton>
        </Container>
      </AnimatedSection>
    </div>
  );
};

export default InsightsArchive;
