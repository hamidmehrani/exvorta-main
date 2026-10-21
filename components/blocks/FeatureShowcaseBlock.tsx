import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { unbracket } from '@/lib/text'

export interface FeatureShowcaseBlockProps {
  label?: string
  title?: string
  description?: string
  features?: {
    title: string
    description: string
  }[]
  [key: string]: any
}

const defaultFeatures = [
  {
    title: 'Bespoke Art Direction. Refined Until Perfect.',
    description: 'Custom visual identities designed from scratch. We refine every pixel until we achieve a shared, institutional masterpiece.',
    iconType: 'target',
  },
  {
    title: '100% Hardcoded.',
    description: 'Built from scratch. No templates, no shortcuts. Elite code for unbreachable security and extreme speed.',
    iconType: 'horizontal-lines',
  },
  {
    title: 'High-Performance UX.',
    description: 'Fluid animations and instant interaction speeds designed for high-stakes, fast-moving global trade environments.',
    iconType: 'vertical-lines',
  },
  {
    title: 'Dedicated Ongoing Support.',
    description: 'Professional infrastructure handling and unlimited layout updates so your team remains focused on moving trade volume.',
    iconType: 'dot',
  },
]

/** Small schematic glyphs — the blueprint vocabulary in miniature. */
function Glyph({ type }: { type: string }) {
  const box = 'mb-10 flex h-10 w-10 border border-white/30 transition-colors duration-500 group-hover:border-success'
  if (type === 'target') {
    return (
      <div className={`${box} items-center justify-center`} aria-hidden>
        <div className="h-5 w-5 border border-white/30 transition-colors duration-500 group-hover:border-success" />
      </div>
    )
  }
  if (type === 'horizontal-lines') {
    return (
      <div className={`${box} flex-col`} aria-hidden>
        <div className="flex-1 border-b border-white/30 transition-colors duration-500 group-hover:border-success" />
        <div className="flex-1" />
      </div>
    )
  }
  if (type === 'vertical-lines') {
    return (
      <div className={box} aria-hidden>
        <div className="flex-1 border-e border-white/30 transition-colors duration-500 group-hover:border-success" />
        <div className="flex-1" />
      </div>
    )
  }
  return (
    <div className={`${box} items-center justify-center`} aria-hidden>
      <div className="h-2 w-2 bg-white/40 transition-colors duration-500 group-hover:bg-success" />
    </div>
  )
}

export const FeatureShowcaseBlock: React.FC<FeatureShowcaseBlockProps> = (props) => {
  const eyebrow = unbracket(props.label) || 'ARCHITECTURAL SPECS'
  const title = props.title || 'Pure Code. Flawless Aesthetics.'
  const features = props.features && props.features.length > 0 ? props.features : defaultFeatures

  return (
    <AnimatedSection className="on-dark relative isolate w-full overflow-hidden bg-obsidian py-24 text-white md:py-32">
      <div aria-hidden className="bg-blueprint-grid-dark pointer-events-none absolute inset-0 -z-10" />
      <div className="container-site">
        <SectionHeading align="center" tone="dark" eyebrow={eyebrow} title={title} description={props.description} className="mb-16 md:mb-20" />

        <StaggerContainer className="frame frame-dark grid w-full grid-cols-1 border border-rule-dark md:grid-cols-2" staggerChildren={0.1} delayChildren={0.15}>
          {features.map((f: { title: string; description: string }, i: number) => (
            <StaggerItem
              key={i}
              className="group relative flex min-h-[320px] flex-col justify-between border-b border-rule-dark p-10 transition-colors duration-500 last:border-b-0 hover:bg-white/[0.03] md:odd:border-e md:[&:nth-last-child(-n+2)]:border-b-0 md:p-12"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
              />
              <Glyph type={defaultFeatures[i]?.iconType || 'dot'} />
              <div>
                <h3 className="mb-4 font-serif text-3xl font-semibold leading-tight text-white">{f.title}</h3>
                <p className="max-w-xl text-base font-light leading-relaxed text-muted-dark">{f.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default FeatureShowcaseBlock
