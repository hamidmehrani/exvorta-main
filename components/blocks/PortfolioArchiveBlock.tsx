import React from 'react'
import Link from '@/components/ui/AppLink'
import type { Project, Media } from '@/payload-types'
import { Container } from '@/components/ui/Container'
import { LiveWebsiteFrame } from '@/components/ui/LiveWebsiteFrame'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CtaBand } from '@/components/ui/CtaBand'
import { StaggerText } from '@/components/ui/motion'
import { unbracket } from '@/lib/text'

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
  spicevo: '/portfolio-spicevo.webp',
  nutave: '/portfolio-nutave.webp',
  stonvi: '/portfolio-stonvi.webp',
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

/** Shared card shell: hairline surface, lifts on hover, content below the browser frame. */
function CardBody({ title, as: Heading = 'h3', children }: { title: string; as?: 'h2' | 'h3'; children: React.ReactNode }) {
  return (
    <div className="flex flex-grow flex-col p-7">
      <Heading className="mb-3 font-serif text-3xl font-semibold leading-tight text-obsidian">{title}</Heading>
      {children}
    </div>
  )
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
  const safeProjects = Array.isArray(projects) ? projects.filter(isInlineProject) : [];

  return (
    <section className="w-full border-t border-rule py-24 md:py-32" data-purpose="proof-of-execution">
      <Container>
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={unbracket(sectionLabel) || 'Our infrastructure work'}
            title={headline || 'Proof of Execution.'}
            description={subtitle}
          />
          <Reveal y={14} delay={0.2} className="shrink-0">
            <Link href={ctaUrl || '/portfolio'} className="btn-ghost min-h-[52px] px-8 py-4">
              {(ctaLabel || 'EXPLORE FULL PORTFOLIO').replace(/\s*[↗→]\s*$/, '')} ↗
            </Link>
          </Reveal>
        </div>

        {/* 1 col mobile, 2 col tablet, 3 col desktop */}
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" staggerChildren={0.14} delayChildren={0.1}>
          {safeProjects.map((project, index) => {
            const csUrl = resolveCaseStudyUrl(project);
            const liveHref = csUrl.startsWith('/portfolio/') ? `https://${csUrl.split('/').pop()}.exvorta.com` : '';
            return (
              <StaggerItem key={project.id || index} className="h-full" y={28}>
                <article className="card-elite group flex h-full flex-col">
                  <LiveWebsiteFrame
                    title={project.title}
                    imageUrl={resolveProjectImage(project)}
                    liveUrl={liveHref || undefined}
                    live
                    industry={project.industry}
                    volume={project.volume}
                    service={project.service}
                  />
                  <CardBody title={project.title}>
                    {project.description && (
                      <p className="mb-8 flex-grow text-base font-light leading-relaxed text-muted">{project.description}</p>
                    )}
                    <div className="mt-auto flex flex-wrap items-center gap-2.5">
                      <Link href={csUrl} className="btn-ghost px-5 py-3.5">
                        {(project.linkLabel || 'VIEW CASE STUDY').replace(/\s*[↗→]\s*$/, '')} ↗
                      </Link>
                      {liveHref && (
                        <a
                          href={liveHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title} live website`}
                          className="btn-mono gap-2 px-4 py-3.5"
                        >
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" aria-hidden />
                          Live site
                        </a>
                      )}
                    </div>
                  </CardBody>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL-PAGE MODE: used by /portfolio page, receives Project[] from Payload
// ─────────────────────────────────────────────────────────────────────────────
function FullPagePortfolioArchive({ projects }: { projects: Project[] }) {
  const hasProjects = projects && projects.length > 0;

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="rails relative isolate w-full overflow-hidden border-b border-rule pb-20 pt-36 md:pb-28 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_55%_65%_at_30%_0%,color-mix(in_oklab,var(--color-emerald)_12%,transparent),transparent_72%)]" />
          <div className="bg-blueprint-grid absolute inset-0" />
        </div>
        <Container>
          <div className="max-w-5xl">
            <p className="eyebrow rise mb-8">
              <span className="eyebrow-index" aria-hidden>
                <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
              </span>
              Selected works
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

      {/* Project Blocks Grid */}
      <section className="w-full py-24 md:py-32">
        <Container>
          {hasProjects ? (
            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" staggerChildren={0.14} delayChildren={0.1}>
              {projects?.map((project, index) => {
                const industry = project.metrics?.find((m) => m.label.toLowerCase() === 'industry')?.value || 'Various';
                const stack = project.metrics?.find((m) => m.label.toLowerCase() === 'tech stack' || m.label.toLowerCase() === 'stack')?.value || 'Next.js';
                // Type narrowing for dynamic Payload CMS fields if any
                const projAny = project as unknown as Record<string, unknown>;
                const excerpt = typeof projAny.excerpt === 'string' ? projAny.excerpt : 'Premium web design and CMS platform.';

                return (
                  <StaggerItem key={project.id || index} className="h-full" y={28}>
                    <article className="card-elite group flex h-full flex-col">
                      <LiveWebsiteFrame
                        title={project.title}
                        imageUrl={extractMediaUrl(project.heroImage, project.slug)}
                        liveUrl={project.liveUrl || (project.slug ? `https://${project.slug}.exvorta.com` : undefined)}
                        slug={project.slug}
                        live
                      />
                      <CardBody title={project.title} as="h2">
                        <p className="mb-8 flex-grow text-base font-light leading-relaxed text-muted">{excerpt}</p>

                        <dl className="mb-10 space-y-3 font-mono text-label uppercase">
                          <div className="flex justify-between gap-4 border-b border-rule pb-2.5">
                            <dt className="text-muted">Industry</dt>
                            <dd className="max-w-[60%] truncate font-medium text-obsidian">{industry}</dd>
                          </div>
                          <div className="flex justify-between gap-4 border-b border-rule pb-2.5">
                            <dt className="text-muted">Stack</dt>
                            <dd className="max-w-[60%] truncate font-medium text-obsidian">{stack}</dd>
                          </div>
                        </dl>

                        <div className="mt-auto self-start">
                          <Link href={`/portfolio/${project.slug}`} className="btn-ghost px-6 py-3.5">
                            READ CASE STUDY ↗
                          </Link>
                        </div>
                      </CardBody>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          ) : (
            <div className="py-32 text-center">
              <p className="eyebrow justify-center">No projects found.</p>
            </div>
          )}
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
