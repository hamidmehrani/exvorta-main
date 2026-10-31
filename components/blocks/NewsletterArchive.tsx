import React from 'react'
import type { Post } from '@/payload-types'
import { NewsletterSignup } from './NewsletterSignup'
import { Container } from '@/components/ui/Container'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import AppLink from '@/components/ui/AppLink'

function getPostExcerpt(post: Post): string {
  if (post.content && typeof post.content === 'object' && 'root' in post.content) {
    try {
      const texts: string[] = []
      const traverse = (node: any) => {
        if (!node) return
        if (typeof node.text === 'string' && node.text.trim()) {
          texts.push(node.text.trim())
        }
        if (Array.isArray(node.children)) {
          node.children.forEach(traverse)
        }
      }
      traverse(post.content.root)
      const combined = texts.join(' ').replace(/\s+/g, ' ').trim()
      if (combined.length > 0) {
        return combined.length > 180 ? `${combined.slice(0, 177)}...` : combined
      }
    } catch {
      // Fallback below
    }
  }
  return 'Strategic analysis on cross-border logistics, tariff architectures, and regulatory clearance across the UAE and broader GCC corridor.'
}

function getPostCategory(post: Post): string {
  if (typeof post.category === 'object' && post.category !== null) {
    if ('name' in post.category && typeof post.category.name === 'string') {
      return post.category.name.toUpperCase()
    }
    if ('title' in post.category && typeof (post.category as any).title === 'string') {
      return (post.category as any).title.toUpperCase()
    }
  }
  return 'TRADE INTEL'
}

function getFormattedDate(post: Post): string {
  if (post.publishedDate) {
    try {
      const d = new Date(post.publishedDate)
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).toUpperCase()
      }
    } catch {
      // Fallback below
    }
  }
  return 'THURSDAY DISPATCH'
}

function estimateReadingTime(post: Post): string {
  const excerpt = getPostExcerpt(post)
  const wordCount = excerpt.split(/\s+/).length
  const minutes = Math.max(3, Math.min(8, Math.ceil(wordCount / 20)))
  return `${minutes} MIN READ`
}

export function NewsletterArchiveEmptyState() {
  return (
    <div
      role="status"
      aria-label="No archive dispatches indexed yet"
      className="frame relative isolate mx-auto w-full max-w-3xl border border-rule bg-surface p-8 sm:p-12 text-center"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-blueprint-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4">
          <MonoLabel className="eyebrow inline-flex items-center gap-2 border border-rule bg-surface-2 px-3.5 py-1.5 font-medium">
            [ 00 // ARCHIVE_INDEXING ]
          </MonoLabel>
        </div>

        <h3 className="mb-3 font-serif text-2xl sm:text-3xl font-semibold text-obsidian">
          Next Dispatch Queued
        </h3>

        <p className="mx-auto mb-8 max-w-lg font-sans text-sm sm:text-base font-light text-muted leading-relaxed">
          The public briefing archive is undergoing systematic indexing. The upcoming executive briefing transmits this Thursday at 08:00 GST. Subscribe above to receive the complete intelligence docket directly in your executive inbox.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-muted font-mono text-[11px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            SCHEDULED: THURSDAY 08:00 GST
          </span>
          <span className="opacity-40" aria-hidden="true">{'//'}</span>
          <span>DISTRIBUTION: SECURE SMTP</span>
          <span className="opacity-40" aria-hidden="true">{'//'}</span>
          <span>UNRESTRICTED GCC COVERAGE</span>
        </div>
      </div>
    </div>
  )
}

export function NewsletterMetricsStrip() {
  return (
    <section aria-label="Newsletter distribution specifications" className="w-full bg-cream border-y border-rule">
      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
          <div className="bg-surface p-6 sm:p-8 flex flex-col justify-between gap-4">
            <div>
              <div className="font-mono text-label text-muted uppercase tracking-widest mb-2">
                [ DISTRIBUTION ]
              </div>
              <div className="font-serif text-xl font-semibold text-obsidian">
                Weekly on Thursday 08:00 GST
              </div>
            </div>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Synchronized dispatch aligned with GCC commercial trade week operations and customs clearing desks.
            </p>
          </div>

          <div className="bg-surface p-6 sm:p-8 flex flex-col justify-between gap-4">
            <div>
              <div className="font-mono text-label text-muted uppercase tracking-widest mb-2">
                [ COVERAGE ]
              </div>
              <div className="font-serif text-xl font-semibold text-obsidian">
                GCC Trade, Settlement, Audits
              </div>
            </div>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Cross-border settlement frameworks, UAE FTA e-invoicing mandates, and HS tariff reclassifications.
            </p>
          </div>

          <div className="bg-surface p-6 sm:p-8 flex flex-col justify-between gap-4">
            <div>
              <div className="font-mono text-label text-muted uppercase tracking-widest mb-2">
                [ READERSHIP ]
              </div>
              <div className="font-serif text-xl font-semibold text-obsidian">
                Institutional & Sovereign
              </div>
            </div>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Trade operators, corporate treasurers, supply chain directors, and regional commodity brokerages.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function NewsletterPostCard({ post }: { post: Post }) {
  const dateStr = getFormattedDate(post)
  const categoryStr = getPostCategory(post)
  const readingTime = estimateReadingTime(post)
  const excerpt = getPostExcerpt(post)

  return (
    <AppLink
      href={`/insights/${post.slug}`}
      className="card-elite block h-full p-6 sm:p-8 bg-surface border border-rule hover:border-obsidian transition-colors group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>{dateStr}</span>
          <span>[ {categoryStr} ]</span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-obsidian group-hover:text-neutral-700 transition-colors mb-3 leading-snug">
          {post.title}
        </h3>

        <p className="font-sans text-sm text-muted line-clamp-3 leading-relaxed mb-6">
          {excerpt}
        </p>
      </div>

      <div className="pt-4 border-t border-rule flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
        <span className="text-muted">{readingTime}</span>
        <span className="text-obsidian font-medium group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform inline-flex items-center gap-1">
          [ READ DISPATCH ]
        </span>
      </div>
    </AppLink>
  )
}

export interface NewsletterArchiveProps {
  posts?: Post[]
}

export function NewsletterArchive({ posts }: NewsletterArchiveProps) {
  // Filter or prioritize newsletter/briefing posts if tagged, otherwise render dispatches
  const dispatches = React.useMemo(() => {
    if (!posts || posts.length === 0) return []
    const targeted = posts.filter((p) => {
      const cat = typeof p.category === 'object' && p.category !== null
        ? ('name' in p.category ? p.category.name : ('title' in p.category ? (p.category as any).title : ''))
        : ''
      const text = `${p.title} ${p.slug} ${cat}`.toLowerCase()
      return text.includes('newsletter') || text.includes('briefing') || text.includes('dispatch') || text.includes('weekly')
    })
    return targeted.length > 0 ? targeted : posts
  }, [posts])

  return (
    <div className="w-full flex flex-col relative z-10">
      {/* 01. [HERO SECTION] */}
      <AnimatedSection
        id="newsletter-hero"
        className="on-dark relative isolate w-full overflow-hidden bg-obsidian px-6 pb-20 pt-36 sm:pt-40"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-aura-dark absolute inset-0 opacity-70" />
          <div className="bg-blueprint-grid-dark absolute inset-0" />
        </div>

        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex justify-center">
            <MonoLabel className="eyebrow eyebrow-dark">
              [ EXVORTA EXECUTIVE BRIEFINGS ]
            </MonoLabel>
          </div>

          <h1 className="mb-6 font-serif text-display font-semibold text-white max-w-4xl tracking-tight">
            Institutional Trade Intelligence.<br />
            <span className="text-muted-dark">Delivered weekly.</span>
          </h1>

          <p className="mb-12 max-w-2xl text-lede font-light text-muted-dark">
            Comprehensive macro analysis, regulatory trade compliance, and cross-border settlement architectures for GCC enterprise operators.
          </p>

          <div className="w-full max-w-2xl">
            <NewsletterSignup variant="dark" />
          </div>
        </Container>
      </AnimatedSection>

      {/* 02. [CADENCE / METRICS STRIP] */}
      <NewsletterMetricsStrip />

      {/* 03. [ARCHIVE LIST / GRID] */}
      <AnimatedSection id="newsletter-archive-grid" className="w-full bg-[#FCFAF8] py-16 sm:py-24 px-6">
        <Container>
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rule pb-6">
            <div>
              <div className="font-mono text-label text-muted uppercase tracking-widest mb-2">
                [ 01 // DISPATCH ARCHIVE ]
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-obsidian">
                Historical Briefings & Intelligence Reports
              </h2>
            </div>
            <div className="font-mono text-[11px] text-muted uppercase tracking-wider">
              {dispatches.length > 0 ? `INDEXED: ${dispatches.length} DISPATCHES` : 'STATUS: LIVE CADENCE QUEUED'}
            </div>
          </div>

          {dispatches.length > 0 ? (
            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              staggerChildren={0.08}
              delayChildren={0.12}
            >
              {dispatches.map((post) => (
                <StaggerItem key={post.id} className="h-full">
                  <NewsletterPostCard post={post} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Reveal y={16} duration={0.6}>
              <NewsletterArchiveEmptyState />
            </Reveal>
          )}
        </Container>
      </AnimatedSection>
    </div>
  )
}

export default NewsletterArchive
