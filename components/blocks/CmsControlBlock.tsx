import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'

import React from 'react'
import Link from '@/components/ui/AppLink'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { unbracket } from '@/lib/text'

const CAPABILITIES = [
  { title: 'Products & Catalog', desc: 'Add, edit, and reorder products with spec sheets, dimensions, and imagery — live instantly.' },
  { title: 'Certificates & Documents', desc: 'Upload compliance PDFs and certifications. Buyers download them straight from the site.' },
  { title: 'Copy & Headlines', desc: 'Change any sentence on any page. Marketing tests, seasonal messaging — no developer ticket.' },
  { title: 'Imagery & Hero Sections', desc: 'Swap hero visuals, publish campaign photography, keep the layout — the design system holds.' },
  { title: 'News & Stories', desc: 'Publish updates that feed SEO automatically. Structured data, sitemaps, metadata — handled.' },
  { title: 'Forms & Leads', desc: 'Every inquiry lands in your panel with spam protection and rate limiting built in.' },
]

export function CmsControlBlock(props: Record<string, unknown>) {
  const eyebrow = unbracket(props.eyebrow as string) || 'TOTAL OPERATIONAL CONTROL'
  const headline = (props.headline as string) || 'Your website. Your panel. Zero dependency.'

  return (
    <AnimatedSection className="on-dark relative isolate w-full overflow-hidden border-t border-rule-dark bg-obsidian py-24 text-white md:py-32" data-purpose="cms-control">
      <div aria-hidden className="bg-blueprint-grid-dark pointer-events-none absolute inset-0 -z-10" />
      <div className="container-site">
        <SectionHeading
          align="center"
          tone="dark"
          eyebrow={eyebrow}
          title=""
          titleHtml={sanitizeHeadingHtml(headline, { onDark: true })}
          description={
            <>
              Every Exvorta deployment ships with a custom content panel engineered for your team. If you can use a
              browser, you can run the entire website — <span className="text-white">no developer required, ever.</span>
            </>
          }
          className="mb-16 md:mb-20"
        />

        <StaggerContainer
          className="frame frame-dark mb-16 grid grid-cols-1 border border-rule-dark md:grid-cols-2 lg:grid-cols-3"
          staggerChildren={0.08}
          delayChildren={0.1}
        >
          {CAPABILITIES.map((cap, i) => (
            <StaggerItem
              key={cap.title}
              className="group relative border-b border-rule-dark p-8 transition-colors duration-300 hover:bg-white/[0.03] max-md:last:border-b-0 md:p-10 md:max-lg:odd:border-e md:max-lg:[&:nth-last-child(-n+2)]:border-b-0 lg:border-e lg:[&:nth-child(3n)]:border-e-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
              />
              <p className="eyebrow eyebrow-dark mb-8">
                <span className="eyebrow-index">{String(i + 1).padStart(2, '0')}</span>
              </p>
              <h3 className="mb-3 font-serif text-2xl font-semibold leading-snug text-white">{cap.title}</h3>
              <p className="text-base font-light leading-relaxed text-muted-dark">{cap.desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal y={14} className="text-center">
          <Link href="/portfolio" className="btn-ghost min-h-[52px] px-10 py-4">
            SEE IT IN THE LIVE CASE STUDIES →
          </Link>
        </Reveal>
      </div>
    </AnimatedSection>
  )
}

export default CmsControlBlock
