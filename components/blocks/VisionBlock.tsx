import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { unbracket } from '@/lib/text'

export interface VisionPrinciple {
  number?: string
  category: string
  title: string
  description: string
}

export interface VisionBlockProps {
  eyebrow?: string
  title?: string
  principles?: VisionPrinciple[]
  [key: string]: any
}

const defaultPrinciples: VisionPrinciple[] = [
  {
    number: '01',
    category: 'ENGINEERING',
    title: 'Zero Bloat Architecture.',
    description: 'We categorically reject templates and heavy content management systems. Every line of code is written specifically for your entity, ensuring strong security standards and fast load times on any device.',
  },
  {
    number: '02',
    category: 'AESTHETICS',
    title: 'Institutional Authority.',
    description: 'Design is not decoration; it is a mechanism for trust. We apply elite, bespoke UI/UX architecture so your digital presence instantly matches the scale of your global operations.',
  },
  {
    number: '03',
    category: 'PRIVACY',
    title: 'Absolute Discretion.',
    description: 'We operate under strict Non-Disclosure Agreements. Your digital infrastructure, competitive data, and market strategies are treated as confidential business assets.',
  },
  {
    number: '04',
    category: 'PARTNERSHIP',
    title: 'Dedicated Partnership',
    description: 'Deployment is just the beginning. We remain available for updates, adjustments, and ongoing improvements as your business grows.',
  },
]

export const VisionBlock: React.FC<VisionBlockProps> = (props) => {
  const eyebrow = unbracket(props.eyebrow) || 'THE EXVORTA STANDARD'
  const title = props.title || 'Our Operating Principles.'
  const principles = props.principles && props.principles.length > 0 ? props.principles : defaultPrinciples

  return (
    <AnimatedSection className="on-dark relative isolate w-full overflow-hidden bg-obsidian py-24 text-white md:py-40" id="values">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-aura-dark absolute inset-0 opacity-70" />
        <div className="bg-blueprint-grid-dark absolute inset-0" />
      </div>

      <div className="container-site">
        <SectionHeading align="center" tone="dark" eyebrow={eyebrow} title={title} className="mb-20 md:mb-24" />

        <StaggerContainer
          className="frame frame-dark grid w-full grid-cols-1 border border-rule-dark md:grid-cols-2"
          staggerChildren={0.12}
          delayChildren={0.15}
        >
          {principles.map((p: VisionPrinciple, i: number) => {
            const num = p.number || String(i + 1).padStart(2, '0')
            return (
              <StaggerItem
                key={i}
                className="group relative flex flex-col border-b border-rule-dark p-10 transition-colors duration-500 hover:bg-white/[0.03] md:p-14 last:border-b-0 md:odd:border-e md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                />
                <p className="eyebrow eyebrow-dark mb-10">
                  <span className="eyebrow-index">{num}</span>
                  {p.category}
                </p>
                <h3 className="mb-4 font-serif text-3xl font-semibold leading-tight text-white">{p.title}</h3>
                <p className="text-base font-light leading-relaxed text-muted-dark">{p.description}</p>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default VisionBlock
