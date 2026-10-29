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
import { getCaseStudy, type CaseStudyData } from '@/components/blocks/case-study-data'

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
  slug?: string;
  destinationMarkets?: string;
  activePorts?: string;
  certifications?: string[];
  metrics?: { label: string; value: string }[];
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

const KNOWN_PORTS: Record<string, string> = {
  stonvi: 'TR IZM / AE DXB (Jebel Ali)',
  spicevo: 'TR IZM (Port of Izmir)',
  nutave: 'TR IZM / AE JEA (Jebel Ali)',
};

const KNOWN_CERTS: Record<string, string[]> = {
  stonvi: ['ISO 9001', 'ISO 14001', 'CE MARKED', 'LEED'],
  spicevo: ['EU ORGANIC', 'USDA NOP', 'ISO 22000', 'HALAL'],
  nutave: ['BRC GRADE A', 'ISO 22000', 'HALAL', 'KOSHER'],
};

function resolveProjectSlug(title?: string, linkUrl?: string, slug?: string): string {
  if (slug) return slug;
  if (linkUrl && linkUrl.startsWith('/portfolio/')) {
    const fromUrl = linkUrl.replace(/^\/portfolio\//, '').split('/')[0].split('?')[0];
    if (fromUrl) return fromUrl;
  }
  const t = (title || '').toLowerCase();
  for (const k of ['stonvi', 'spicevo', 'nutave', 'aegean', 'anatolia']) {
    if (t.includes(k)) {
      if (k === 'aegean') return 'spicevo';
      if (k === 'anatolia') return 'nutave';
      return k;
    }
  }
  return '';
}

function findMetricValue(
  metrics: { label?: string | null; value?: string | null }[] | undefined | null,
  pattern: RegExp,
): string | undefined {
  if (!metrics) return undefined;
  const match = metrics.find(m => m.label && pattern.test(m.label));
  return match?.value ?? undefined;
}

function resolveExporterProofPoints(
  project: {
    title?: string;
    slug?: string;
    linkUrl?: string;
    volume?: string;
    metrics?: { label: string; value: string }[] | null;
    clientInfo?: { industry?: string | null; volume?: string | null; service?: string | null } | null;
  },
  explicitSlug?: string,
) {
  const slug = explicitSlug || resolveProjectSlug(project.title, project.linkUrl, project.slug);
  const cs: CaseStudyData | null = slug ? getCaseStudy(slug) : null;
  const projAny = project as Record<string, unknown>;

  // 1. Export Volume
  const metricVolume = findMetricValue(project.metrics, /(export\s*)?volume|annual\s*volume|capacity/i);
  const clientVolume = project.clientInfo?.volume;
  const directVolume = typeof project.volume === 'string' && project.volume ? project.volume : undefined;
  const csVolume =
    cs?.operationalMetrics?.annualVolume ||
    (cs?.stats && cs.stats[0]?.value && cs.stats[0]?.label ? `${cs.stats[0].value} ${cs.stats[0].label}` : undefined);
  const volumeFromDirect =
    directVolume && (directVolume.includes(' ') || directVolume.includes('/')) ? directVolume : undefined;
  const exportVolume = metricVolume || clientVolume || volumeFromDirect || csVolume || directVolume || 'UNVERIFIED';

  // 2. Destination Markets / Countries
  const metricMarkets = findMetricValue(project.metrics, /market|destinat|countr/i);
  const directMarkets = typeof projAny.destinationMarkets === 'string' ? projAny.destinationMarkets : undefined;
  const csMarkets =
    cs?.operationalMetrics?.countriesServed ||
    (cs?.stats?.find(s => /market|countr/i.test(s.label))
      ? `${cs.stats.find(s => /market|countr/i.test(s.label))?.value} Global Markets`
      : undefined);
  const destinationMarkets = metricMarkets || directMarkets || csMarkets || 'UNVERIFIED';

  // 3. Active Ports
  const metricPorts = findMetricValue(project.metrics, /port|origin\s*port|terminal|hub|pol|transit/i);
  const directPorts =
    typeof projAny.activePorts === 'string'
      ? projAny.activePorts
      : typeof projAny.port === 'string'
      ? projAny.port
      : undefined;
  const normSlug = slug.toLowerCase();
  const knownPort = Object.entries(KNOWN_PORTS).find(([k]) => normSlug.includes(k))?.[1];
  const activePorts = metricPorts || directPorts || knownPort || 'UNVERIFIED';

  // 4. Certification Badges
  let badges: string[] = [];
  if (Array.isArray(projAny.certifications) && projAny.certifications.length > 0) {
    badges = (projAny.certifications as unknown[]).map(String);
  } else {
    const known = Object.entries(KNOWN_CERTS).find(([k]) => normSlug.includes(k))?.[1];
    if (known) {
      badges = known;
    } else if (cs?.operationalMetrics?.certificationsSummary) {
      badges = cs.operationalMetrics.certificationsSummary
        .split(/[·•]/)
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 4);
    } else if (cs?.certifications && cs.certifications.length > 0) {
      badges = cs.certifications.map(c => c.split('—')[0].trim()).filter(Boolean).slice(0, 4);
    }
  }

  return {
    slug,
    cs,
    exportVolume,
    destinationMarkets,
    activePorts,
    badges,
  };
}

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
            const proof = resolveExporterProofPoints(project);
            const csUrl = resolveCaseStudyUrl(project);
            const liveHref = csUrl.startsWith('/portfolio/') ? `https://${csUrl.split('/').pop()}.exvorta.com` : '';
            return (
              <StaggerItem key={project.id || index} className="h-full" y={28}>
                <article className="card-elite group flex h-full flex-col">
                  <LiveWebsiteFrame
                    title={project.title}
                    imageUrl={resolveProjectImage(project)}
                    liveUrl={liveHref || undefined}
                    slug={proof.slug || undefined}
                    live
                    priority={index < 3}
                  />
                  <CardBody title={project.title}>
                    {project.description && (
                      <p className="mb-6 flex-grow text-base font-light leading-relaxed text-muted">{project.description}</p>
                    )}

                    {proof.badges.length > 0 && (
                      <div className="mb-6 flex flex-wrap gap-1.5" aria-label="Certifications">
                        {proof.badges.map((badge) => (
                          <span
                            key={badge}
                            className="font-mono text-[10px] tracking-wider uppercase border border-rule px-2 py-0.5 bg-paper/50 bg-cream/50 text-muted"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    <dl className="mb-8 space-y-2.5 font-mono text-label uppercase">
                      <div className="flex justify-between gap-4 border-b border-rule pb-2">
                        <dt className="text-muted">Export Volume</dt>
                        <dd className="max-w-[60%] truncate font-medium text-obsidian">{proof.exportVolume}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-rule pb-2">
                        <dt className="text-muted">Destination Markets</dt>
                        <dd className="max-w-[60%] truncate font-medium text-obsidian">{proof.destinationMarkets}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-rule pb-2">
                        <dt className="text-muted">Active Ports</dt>
                        <dd className="max-w-[60%] truncate font-medium text-obsidian">{proof.activePorts}</dd>
                      </div>
                    </dl>

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
                const proof = resolveExporterProofPoints(project, project.slug);
                const industry =
                  project.metrics?.find((m) => m.label.toLowerCase() === 'industry')?.value ||
                  project.clientInfo?.industry ||
                  proof.cs?.category ||
                  'Various';
                // Type narrowing for dynamic Payload CMS fields if any
                const projAny = project as unknown as Record<string, unknown>;
                const excerpt =
                  typeof projAny.excerpt === 'string'
                    ? projAny.excerpt
                    : proof.cs?.excerpt || 'Premium web design and CMS platform.';
                const liveHref =
                  project.liveUrl || (project.slug ? `https://${project.slug}.exvorta.com` : '');

                return (
                  <StaggerItem key={project.id || index} className="h-full" y={28}>
                    <article className="card-elite group flex h-full flex-col">
                      <LiveWebsiteFrame
                        title={project.title}
                        imageUrl={extractMediaUrl(project.heroImage, project.slug)}
                        liveUrl={project.liveUrl || (project.slug ? `https://${project.slug}.exvorta.com` : undefined)}
                        slug={project.slug}
                        live
                        priority={index < 3}
                      />
                      <CardBody title={project.title} as="h2">
                        <p className="mb-6 flex-grow text-base font-light leading-relaxed text-muted">{excerpt}</p>

                        {proof.badges.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-1.5" aria-label="Certifications">
                            {proof.badges.map((badge) => (
                              <span
                                key={badge}
                                className="font-mono text-[10px] tracking-wider uppercase border border-rule px-2 py-0.5 bg-paper/50 bg-cream/50 text-muted"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}

                        <dl className="mb-8 space-y-2.5 font-mono text-label uppercase">
                          <div className="flex justify-between gap-4 border-b border-rule pb-2">
                            <dt className="text-muted">Industry</dt>
                            <dd className="max-w-[60%] truncate font-medium text-obsidian">{industry}</dd>
                          </div>
                          <div className="flex justify-between gap-4 border-b border-rule pb-2">
                            <dt className="text-muted">Export Volume</dt>
                            <dd className="max-w-[60%] truncate font-medium text-obsidian">{proof.exportVolume}</dd>
                          </div>
                          <div className="flex justify-between gap-4 border-b border-rule pb-2">
                            <dt className="text-muted">Destination Markets</dt>
                            <dd className="max-w-[60%] truncate font-medium text-obsidian">{proof.destinationMarkets}</dd>
                          </div>
                          <div className="flex justify-between gap-4 border-b border-rule pb-2">
                            <dt className="text-muted">Active Ports</dt>
                            <dd className="max-w-[60%] truncate font-medium text-obsidian">{proof.activePorts}</dd>
                          </div>
                        </dl>

                        <div className="mt-auto flex flex-wrap items-center gap-2.5">
                          <Link href={`/portfolio/${project.slug}`} className="btn-ghost px-6 py-3.5">
                            READ CASE STUDY ↗
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
