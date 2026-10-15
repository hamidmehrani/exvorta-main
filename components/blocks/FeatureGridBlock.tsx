import React from 'react'
import type { Page } from '@/payload-types'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { unbracket } from '@/lib/text'

type FeatureGridBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'featureGrid' }>

const DEFAULT_FEATURES = [
  {
    id: 'default-1',
    title: 'Rapid Bespoke Deployment',
    description:
      'High-performance websites delivered in just 2–4 weeks. We leverage advanced coding frameworks and agile team structures to move at the speed of global trade, without ever compromising institutional prestige.',
  },
  {
    id: 'default-2',
    title: 'Headless Architecture',
    description:
      'Built on modern, scalable infrastructure (Next.js & Edge compute). API-ready designs ensuring your web presence is fast, secure, and globally accessible without legacy constraints.',
  },
  {
    id: 'default-3',
    title: 'Absolute Data Sovereignty',
    description:
      'Enterprise-grade security protocols standard in every build. We ensure your corporate presence and proprietary intelligence remain strictly confidential and protected.',
  },
]

/**
 * "Architecture Manifesto" — three principles laid out as one ledger: cells
 * share hairline rules inside a crosshair frame instead of floating as
 * separate cards. Server component; motion is CSS only.
 */
export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = (props) => {
  const features = props.features && props.features.length > 0 ? props.features : DEFAULT_FEATURES
  const eyebrow = unbracket(props.eyebrow || props.sectionEyebrow) || 'Architecture Manifesto'
  const title = props.sectionTitle || 'Built for How Traders Actually Work'
  const columns = features.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : features.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <AnimatedSection className="w-full">
      <section className="border-t border-rule py-24 md:py-32" data-purpose="manifesto">
        <div className="container-site">
          <SectionHeading align="center" eyebrow={eyebrow} title={title} className="mb-16 md:mb-20" />

          <StaggerContainer className={`frame grid grid-cols-1 border border-rule ${columns}`} staggerChildren={0.12} delayChildren={0.1}>
            {features.map((feature, idx) => (
              <StaggerItem
                key={feature.id || idx}
                className="group relative border-b border-rule bg-surface p-8 transition-colors duration-300 last:border-b-0 hover:bg-surface-2 md:border-b-0 md:border-e md:p-10 md:last:border-e-0"
              >
                {/* Active rule: slides in along the cell's top edge on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-emerald transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                />
                <span className="eyebrow-index mb-10 flex font-mono text-label" aria-hidden>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-4 font-serif text-2xl font-semibold leading-snug text-obsidian">{feature.title}</h3>
                <p className="text-base font-light leading-relaxed text-muted">{feature.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </AnimatedSection>
  )
}

export default FeatureGridBlock
