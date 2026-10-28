'use client'

import React, { useState, useMemo } from 'react'
import Link from '@/components/ui/AppLink'
import type { Project, Media } from '@/payload-types'
import { Container } from '@/components/ui/Container'
import { LiveWebsiteFrame } from '@/components/ui/LiveWebsiteFrame'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { CtaBand } from '@/components/ui/CtaBand'
import { StaggerText } from '@/components/ui/motion'
import { unbracket } from '@/lib/text'
import { CASE_STUDIES, getCaseStudy } from '@/components/blocks/case-study-data'

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

// Default inline projects from authoritative CASE_STUDIES fallback
const DEFAULT_INLINE_PROJECTS: InlineProject[] = Object.values(CASE_STUDIES).map((cs) => ({
  id: cs.domain,
  title: cs.title,
  description: cs.excerpt,
  industry: cs.category.toUpperCase(),
  volume: cs.stats[0]?.value || '',
  service: 'WEB DESIGN & CMS',
  linkLabel: 'VIEW CASE STUDY',
}));

// Known case-study routes + local preview assets, matched from the project title.
const TITLE_SLUG_ROUTES: Record<string, string> = {
  spicevo: '/portfolio/spicevo',
  nutave: '/portfolio/nutave',
  stonvi: '/portfolio/stonvi',
};

const TITLE_IMAGE_ROUTES: Record<string, string> = {
  spicevo: '/portfolio-spicevo.webp',
  nutave: '/portfolio-nutave.webp',
  stonvi: '/portfolio-stonvi.webp',
};

function isUsableUrl(url?: string): boolean {
  return !!url && url !== '#' && !url.startsWith('https://lh3.googleusercontent.com/');
}

function resolveCaseStudyUrl(project: InlineProject): string {
  if (isUsableUrl(project.linkUrl) && project.linkUrl) return project.linkUrl;
  const match = Object.keys(TITLE_SLUG_ROUTES).find((k) =>
    project.title.toLowerCase().includes(k),
  );
  return match ? TITLE_SLUG_ROUTES[match] : '/portfolio';
}

function resolveProjectImage(project: InlineProject): string {
  const uploaded = project.image && typeof project.image === 'object' ? project.image.url : null;
  if (isUsableUrl(uploaded ?? undefined) && uploaded) return uploaded;
  if (isUsableUrl(project.imageUrl) && project.imageUrl) return project.imageUrl;
  const match = Object.keys(TITLE_IMAGE_ROUTES).find((k) =>
    project.title.toLowerCase().includes(k),
  );
  return match ? TITLE_IMAGE_ROUTES[match] : '';
}

function extractMediaUrl(media?: number | Media | null, fallbackSlug?: string): string {
  if (typeof media === 'object' && media !== null && 'url' in media && media.url) {
    return media.url;
  }
  if (fallbackSlug) {
    const key = Object.keys(TITLE_IMAGE_ROUTES).find((k) => fallbackSlug.toLowerCase().includes(k));
    if (key) return TITLE_IMAGE_ROUTES[key];
  }
  return '';
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Extracts the raw sector/industry string from an inline or Payload project */
function getProjectSector(project: InlineProject | Project): string {
  if ('industry' in project && typeof project.industry === 'string' && project.industry) {
    return project.industry;
  }
  if ('clientInfo' in project && project.clientInfo && typeof project.clientInfo === 'object') {
    if (project.clientInfo.industry) return project.clientInfo.industry;
  }
  if ('metrics' in project && Array.isArray(project.metrics)) {
    const ind = project.metrics.find((m) => m?.label?.toLowerCase() === 'industry');
    if (ind?.value) return ind.value;
  }
  const match = Object.keys(CASE_STUDIES).find((k) =>
    project.title.toLowerCase().includes(k),
  );
  if (match) return CASE_STUDIES[match].category;
  return 'Global Trade';
}

/** Normalizes sector strings into clean, concise category labels for filter tabs */
function normalizeCategoryLabel(sector: string): string {
  const s = sector.toLowerCase();
  if (s.includes('herb') || s.includes('spice') || s.includes('organic')) return 'Agriculture';
  if (s.includes('fruit') || s.includes('nut') || s.includes('food')) return 'Food & Commodities';
  if (s.includes('ceramic') || s.includes('building') || s.includes('construction')) return 'Building Materials';
  return sector.trim();
}

/** Resolves metric callouts for inline projects */
function getInlineProjectMetrics(project: InlineProject): {
  metric1: { value: string; label: string };
  metric2: { value: string; label: string };
} {
  const cs = getCaseStudy(project.title);
  const metric1 = project.volume
    ? { value: project.volume, label: 'Export Volume' }
    : cs?.stats[0]
      ? { value: cs.stats[0].value, label: cs.stats[0].label }
      : { value: 'Global', label: 'Market Reach' };

  const metric2 = cs?.stats[1]
    ? { value: cs.stats[1].value, label: cs.stats[1].label }
    : project.service
      ? { value: project.service, label: 'Service Spec' }
      : { value: 'Enterprise', label: 'Architecture' };

  return { metric1, metric2 };
}

/** Resolves metric callouts for Payload CMS projects */
function getPayloadProjectMetrics(project: Project): {
  metric1: { value: string; label: string };
  metric2: { value: string; label: string };
} {
  const cs = getCaseStudy(project.title || project.slug);
  const m1 = project.metrics?.[0];
  const m2 = project.metrics?.[1];

  const metric1 = project.clientInfo?.volume
    ? { value: project.clientInfo.volume, label: 'Export Volume' }
    : m1
      ? { value: m1.value, label: m1.label }
      : cs?.stats[0]
        ? { value: cs.stats[0].value, label: cs.stats[0].label }
        : { value: 'Enterprise', label: 'Platform' };

  const metric2 = m2
    ? { value: m2.value, label: m2.label }
    : cs?.stats[1]
      ? { value: cs.stats[1].value, label: cs.stats[1].label }
      : project.clientInfo?.service
        ? { value: project.clientInfo.service, label: 'Service' }
        : { value: 'Next.js', label: 'Stack' };

  return { metric1, metric2 };
}

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  panelId: string;
  totalCount: number;
  filteredCount: number;
}

function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
  panelId,
  totalCount,
  filteredCount,
}: CategoryTabsProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + dir + categories.length) % categories.length;
      const nextCategory = categories[nextIndex];
      onSelectCategory(nextCategory);
      const tabEl = document.getElementById(`tab-${panelId}-${slugify(nextCategory)}`);
      tabEl?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelectCategory(categories[0]);
      document.getElementById(`tab-${panelId}-${slugify(categories[0])}`)?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = categories[categories.length - 1];
      onSelectCategory(last);
      document.getElementById(`tab-${panelId}-${slugify(last)}`)?.focus();
    }
  };

  return (
    <div className="mb-10 flex flex-col gap-4 border-b border-rule pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Filter projects by industry sector"
        className="flex flex-wrap items-center gap-2"
      >
        {categories.map((cat, index) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={panelId}
              id={`tab-${panelId}-${slugify(cat)}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelectCategory(cat)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`font-mono text-label uppercase tracking-widest px-4 py-2 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none ${
                isSelected
                  ? 'border-obsidian bg-obsidian text-surface shadow-sm'
                  : 'border-rule bg-surface text-obsidian hover:border-rule-strong hover:bg-surface-2'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
      <span className="font-mono text-label uppercase tracking-widest text-muted">
        Showing {filteredCount} of {totalCount} works
      </span>
    </div>
  );
}

/** Shared card shell: hairline surface, lifts on hover, content below the browser frame. */
function CardBody({
  title,
  as: Heading = 'h3',
  titleId,
  children,
}: {
  title: string;
  as?: 'h2' | 'h3';
  titleId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-grow flex-col p-6 md:p-7">
      <Heading
        id={titleId}
        className="mb-3 font-serif text-title font-semibold leading-tight text-obsidian"
      >
        {title}
      </Heading>
      {children}
    </div>
  );
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
  const safeProjects = useMemo(() => {
    const filtered = Array.isArray(projects) ? projects.filter(isInlineProject) : [];
    return filtered.length > 0 ? filtered : DEFAULT_INLINE_PROJECTS;
  }, [projects]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    safeProjects.forEach((p) => {
      const cat = normalizeCategoryLabel(getProjectSector(p));
      if (cat) cats.add(cat);
    });
    return ['All', ...Array.from(cats)];
  }, [safeProjects]);

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return safeProjects;
    return safeProjects.filter((p) => normalizeCategoryLabel(getProjectSector(p)) === activeCategory);
  }, [safeProjects, activeCategory]);

  return (
    <section
      className="w-full border-t border-rule bg-cream py-24 md:py-32"
      data-purpose="proof-of-execution"
      aria-labelledby="proof-of-execution-heading"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-14 flex flex-col gap-8 md:mb-18 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={10} duration={0.5}>
              <p className="eyebrow mb-6">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-emerald" />
                </span>
                <span className="font-mono text-label uppercase tracking-widest text-muted">
                  {unbracket(sectionLabel) || 'Our infrastructure work'}
                </span>
              </p>
            </Reveal>
            <Reveal y={18} delay={0.06}>
              <h2
                id="proof-of-execution-heading"
                className="font-serif text-headline font-semibold text-obsidian max-w-4xl"
              >
                {headline || 'Proof of Execution.'}
              </h2>
            </Reveal>
            {subtitle && (
              <Reveal y={14} delay={0.14}>
                <p className="mt-6 font-sans text-lede font-light text-muted max-w-2xl">
                  {subtitle}
                </p>
              </Reveal>
            )}
          </div>
          <Reveal y={14} delay={0.2} className="shrink-0">
            <Link
              href={ctaUrl || '/portfolio'}
              className="btn-ghost min-h-[52px] px-8 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              {(ctaLabel || 'EXPLORE FULL PORTFOLIO').replace(/\s*[↗→]\s*$/, '')} ↗
            </Link>
          </Reveal>
        </div>

        {/* Gemini Notebook Filter Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          panelId="homepage-portfolio-panel"
          totalCount={safeProjects.length}
          filteredCount={filteredProjects.length}
        />

        {/* Projects Grid Panel */}
        <div
          id="homepage-portfolio-panel"
          role="tabpanel"
          aria-labelledby={`tab-homepage-portfolio-panel-${slugify(activeCategory)}`}
        >
          {filteredProjects.length > 0 ? (
            <StaggerContainer
              key={activeCategory}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              staggerChildren={0.14}
              delayChildren={0.1}
            >
              {filteredProjects.map((project, index) => {
                const csUrl = resolveCaseStudyUrl(project);
                const liveHref = csUrl.startsWith('/portfolio/') ? `https://${csUrl.split('/').pop()}.exvorta.com` : '';
                const sectorTag = getProjectSector(project).toUpperCase();
                const metrics = getInlineProjectMetrics(project);
                const cardId = slugify(project.title || `proj-${index}`);

                return (
                  <StaggerItem key={project.id || project.title || index} className="h-full" y={28}>
                    <article
                      className="card-elite group flex h-full flex-col border border-rule bg-surface transition-all duration-300 hover:border-rule-strong hover:shadow-lift motion-reduce:transition-none"
                      aria-labelledby={`card-title-${cardId}`}
                    >
                      {/* Sector badge & live deployment header */}
                      <div className="flex items-center justify-between gap-3 border-b border-rule bg-surface px-5 py-3">
                        <span className="font-mono text-label uppercase tracking-widest text-muted">
                          {sectorTag}
                        </span>
                        <span className="inline-flex items-center gap-1.5 border border-rule bg-surface px-2 py-0.5 font-mono text-label uppercase tracking-widest text-emerald">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
                          LIVE INFRASTRUCTURE
                        </span>
                      </div>

                      {/* Browser Thumbnail Preview */}
                      <LiveWebsiteFrame
                        title={project.title}
                        imageUrl={resolveProjectImage(project)}
                        liveUrl={liveHref || undefined}
                        live
                        priority={index === 0}
                      />

                      {/* Card Body */}
                      <CardBody title={project.title} as="h3" titleId={`card-title-${cardId}`}>
                        {project.description && (
                          <p className="mb-6 flex-grow font-sans text-sm text-muted leading-relaxed">
                            {project.description}
                          </p>
                        )}

                        {/* Metric Callouts */}
                        <div className="mb-6 grid grid-cols-2 gap-3 border-y border-rule py-3.5">
                          <div className="border-e border-rule pe-3">
                            <span className="block font-serif text-xl font-semibold leading-tight text-obsidian">
                              {metrics.metric1.value}
                            </span>
                            <span className="mt-1 block font-mono text-label uppercase tracking-widest text-muted">
                              {metrics.metric1.label}
                            </span>
                          </div>
                          <div className="ps-3">
                            <span className="block font-serif text-xl font-semibold leading-tight text-obsidian">
                              {metrics.metric2.value}
                            </span>
                            <span className="mt-1 block font-mono text-label uppercase tracking-widest text-muted">
                              {metrics.metric2.label}
                            </span>
                          </div>
                        </div>

                        {/* Action affordances */}
                        <div className="mt-auto flex flex-wrap items-center gap-3">
                          <Link
                            href={csUrl}
                            className="btn-ghost px-5 py-3.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
                          >
                            {(project.linkLabel || 'VIEW CASE STUDY').replace(/\s*[↗→]\s*$/, '')} ↗
                          </Link>
                          {liveHref && (
                            <a
                              href={liveHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${project.title} live website in new tab`}
                              className="btn-mono gap-2 px-4 py-3.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
                              Live site ↗
                            </a>
                          )}
                        </div>
                      </CardBody>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          ) : (
            <div className="py-20 text-center border border-dashed border-rule bg-surface p-8">
              <p className="font-mono text-label uppercase tracking-widest text-muted mb-4">
                No projects match &ldquo;{activeCategory}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="btn-ghost px-5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL-PAGE MODE: used by /portfolio page, receives Project[] from Payload
// ─────────────────────────────────────────────────────────────────────────────
function FullPagePortfolioArchive({ projects }: { projects: Project[] }) {
  const safeProjects = useMemo(() => {
    return Array.isArray(projects) && projects.length > 0 ? projects : [];
  }, [projects]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    safeProjects.forEach((p) => {
      const cat = normalizeCategoryLabel(getProjectSector(p));
      if (cat) cats.add(cat);
    });
    return ['All', ...Array.from(cats)];
  }, [safeProjects]);

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return safeProjects;
    return safeProjects.filter((p) => normalizeCategoryLabel(getProjectSector(p)) === activeCategory);
  }, [safeProjects, activeCategory]);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="rails relative isolate w-full overflow-hidden border-b border-rule pb-20 pt-36 md:pb-28 md:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_55%_65%_at_30%_0%,color-mix(in_oklab,var(--color-emerald)_12%,transparent),transparent_72%)]" />
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>
        <Container>
          <div className="max-w-5xl">
            <p className="eyebrow rise mb-8">
              <span className="eyebrow-index" aria-hidden="true">
                <i className="block h-1.5 w-1.5 rotate-45 bg-emerald" />
              </span>
              <span className="font-mono text-label uppercase tracking-widest text-muted">Selected works</span>
            </p>
            <StaggerText
              as="h1"
              text="Latest Web Design Works."
              mode="animate"
              unit="words"
              stagger={0.08}
              duration={0.8}
              className="mb-8 font-serif text-display font-semibold text-obsidian"
            />
            <p className="max-w-2xl text-lede font-light text-muted">
              Premium websites and CMS platforms engineered for global exporters.
            </p>
          </div>
        </Container>
      </section>

      {/* Project Blocks Grid Section */}
      <section className="w-full py-24 md:py-32" aria-labelledby="portfolio-archive-heading">
        <Container>
          <h2 id="portfolio-archive-heading" className="sr-only">
            Case Studies Directory
          </h2>

          {safeProjects.length > 0 && (
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              panelId="fullpage-portfolio-panel"
              totalCount={safeProjects.length}
              filteredCount={filteredProjects.length}
            />
          )}

          <div
            id="fullpage-portfolio-panel"
            role="tabpanel"
            aria-labelledby={`tab-fullpage-portfolio-panel-${slugify(activeCategory)}`}
          >
            {filteredProjects.length > 0 ? (
              <StaggerContainer
                key={activeCategory}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                staggerChildren={0.14}
                delayChildren={0.1}
              >
                {filteredProjects.map((project, index) => {
                  const sectorTag = getProjectSector(project).toUpperCase();
                  const metrics = getPayloadProjectMetrics(project);
                  const projAny = project as unknown as Record<string, unknown>;
                  const excerpt = typeof projAny.excerpt === 'string' ? projAny.excerpt : 'Premium web design and CMS platform.';
                  const liveHref = project.liveUrl || (project.slug ? `https://${project.slug}.exvorta.com` : undefined);
                  const cardId = slugify(project.title || project.slug || `proj-${index}`);

                  return (
                    <StaggerItem key={project.id || project.slug || index} className="h-full" y={28}>
                      <article
                        className="card-elite group flex h-full flex-col border border-rule bg-surface transition-all duration-300 hover:border-rule-strong hover:shadow-lift motion-reduce:transition-none"
                        aria-labelledby={`fullpage-card-title-${cardId}`}
                      >
                        {/* Sector badge & live deployment header */}
                        <div className="flex items-center justify-between gap-3 border-b border-rule bg-surface px-5 py-3">
                          <span className="font-mono text-label uppercase tracking-widest text-muted">
                            {sectorTag}
                          </span>
                          <span className="inline-flex items-center gap-1.5 border border-rule bg-surface px-2 py-0.5 font-mono text-label uppercase tracking-widest text-emerald">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
                            LIVE DEPLOYMENT
                          </span>
                        </div>

                        {/* LiveWebsiteFrame Browser Preview */}
                        <LiveWebsiteFrame
                          title={project.title}
                          imageUrl={extractMediaUrl(project.heroImage, project.slug)}
                          liveUrl={liveHref}
                          slug={project.slug}
                          live
                          priority={index < 3}
                        />

                        {/* Card Body */}
                        <CardBody title={project.title} as="h2" titleId={`fullpage-card-title-${cardId}`}>
                          <p className="mb-6 flex-grow font-sans text-sm text-muted leading-relaxed">
                            {excerpt}
                          </p>

                          {/* Metric Callouts */}
                          <div className="mb-6 grid grid-cols-2 gap-3 border-y border-rule py-3.5">
                            <div className="border-e border-rule pe-3">
                              <span className="block font-serif text-xl font-semibold leading-tight text-obsidian">
                                {metrics.metric1.value}
                              </span>
                              <span className="mt-1 block font-mono text-label uppercase tracking-widest text-muted">
                                {metrics.metric1.label}
                              </span>
                            </div>
                            <div className="ps-3">
                              <span className="block font-serif text-xl font-semibold leading-tight text-obsidian">
                                {metrics.metric2.value}
                              </span>
                              <span className="mt-1 block font-mono text-label uppercase tracking-widest text-muted">
                                {metrics.metric2.label}
                              </span>
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="mt-auto flex flex-wrap items-center gap-3">
                            <Link
                              href={`/portfolio/${project.slug}`}
                              className="btn-ghost px-5 py-3.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
                            >
                              READ CASE STUDY ↗
                            </Link>
                            {liveHref && (
                              <a
                                href={liveHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${project.title} live website in new tab`}
                                className="btn-mono gap-2 px-4 py-3.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
                                Live site ↗
                              </a>
                            )}
                          </div>
                        </CardBody>
                      </article>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            ) : (
              <div className="py-32 text-center border border-dashed border-rule bg-surface p-8">
                <p className="font-mono text-label uppercase tracking-widest text-muted mb-4">No projects found.</p>
                {activeCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory('All')}
                    className="btn-ghost px-5 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <CtaBand
        tone="dark"
        eyebrow="Next steps"
        headline="Initiate a Project."
        description="We partner with a limited number of global exporters each quarter to ensure institutional-grade delivery. Let's discuss your digital infrastructure."
        primary={{ label: 'REQUEST A CONSULTATION ↗', href: '/rfq' }}
      />
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
