'use client'

import React from 'react'
import Link from 'next/link'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { m as motion } from 'framer-motion'
import { easings, useReducedMotion } from '@/lib/animations'

const CAPABILITIES = [
  { title: 'Products & Catalog', desc: 'Add, edit, and reorder products with spec sheets, dimensions, and imagery — live instantly.' },
  { title: 'Certificates & Documents', desc: 'Upload compliance PDFs and certifications. Buyers download them straight from the site.' },
  { title: 'Copy & Headlines', desc: 'Change any sentence on any page. Marketing tests, seasonal messaging — no developer ticket.' },
  { title: 'Imagery & Hero Sections', desc: 'Swap hero visuals, publish campaign photography, keep the layout — the design system holds.' },
  { title: 'News & Stories', desc: 'Publish updates that feed SEO automatically. Structured data, sitemaps, metadata — handled.' },
  { title: 'Forms & Leads', desc: 'Every inquiry lands in your panel with spam protection and rate limiting built in.' },
]

export function CmsControlBlock(props: Record<string, unknown>) {
  const prefersReducedMotion = useReducedMotion()
  const eyebrow = (props.eyebrow as string) || '[ TOTAL OPERATIONAL CONTROL ]'
  const headline = (props.headline as string) || 'Your website. Your panel. Zero dependency.'

  return (
    <section className="w-full py-28 bg-[#0D0D0D] border-t border-white/10" data-purpose="cms-control">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <AnimatedSection className="text-center mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">{eyebrow}</div>
          <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tighter leading-[1.08] font-semibold mb-6">
            {headline}
          </h2>
          <p className="font-sans text-base md:text-lg text-white/50 max-w-2xl mx-auto font-light">
            Every Exvorta deployment ships with a custom content panel engineered for your team.
            If you can use a browser, you can run the entire website — {` `}
            <span className="text-white/80">no developer required, ever.</span>
          </p>
        </AnimatedSection>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
          staggerChildren={0.08}
          delayChildren={0.1}
        >
          {CAPABILITIES.map((cap, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="h-full border border-white/10 bg-[#141414] p-8 hover:border-white/25 transition-colors duration-300 group"
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.3, ease: easings.cinematic }}
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#059669] mb-5">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-xl text-white mb-3 font-medium tracking-tight">{cap.title}</h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed font-light">{cap.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-3 border border-white/25 px-10 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            SEE IT IN THE LIVE CASE STUDIES
            <span>→</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default CmsControlBlock
