import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'
import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { unbracket } from '@/lib/text'

export interface ProcessStep {
  stepNumber?: string
  title: string
  subtitle?: string
  description: string
}

export interface ProcessBlockProps {
  eyebrow?: string
  headline?: string
  steps?: ProcessStep[]
  [key: string]: any
}

const defaultSteps: ProcessStep[] = [
  {
    stepNumber: 'WEEK 1',
    title: 'Strategic Discovery',
    subtitle: 'ARCHITECTURAL BLUEPRINTING',
    description: 'We audit your current digital footprint and map out a bespoke strategy that aligns your technical infrastructure with your global market ambitions.',
  },
  {
    stepNumber: 'WEEKS 2-3',
    title: 'The Iterative Canvas',
    subtitle: 'BESPOKE VISUAL DESIGN',
    description: 'Our art directors create your visual identity from scratch. No UI kits. No shortcuts. Just high-fidelity, institutional-grade aesthetics.',
  },
  {
    stepNumber: 'WEEKS 4-5',
    title: 'Hardcoded Engineering',
    subtitle: 'PURE CODE DEVELOPMENT',
    description: 'Once design is approved, our engineers build the front-end using pure, lightweight code. We optimize for sub-second load times on the global trade floor.',
  },
  {
    stepNumber: 'ONGOING',
    title: 'Handover & Concierge',
    subtitle: 'Deployment & Dedicated Support',
    description: 'We launch your asset to the global edge network. From there, we provide concierge-level support and maintenance for your evolving digital ecosystem.',
  },
]

/**
 * Deployment pipeline: a vertical rule with alternating steps. Each step is a
 * node on the line, labelled with its timeline marker in emerald.
 */
export const ProcessBlock: React.FC<ProcessBlockProps> = (props) => {
  const eyebrow = unbracket(props.eyebrow) || 'THE DEPLOYMENT PIPELINE'
  const headline = sanitizeHeadingHtml(props.headline || 'Zero Friction. Infinite Precision.')
  const steps = props.steps && props.steps.length > 0 ? props.steps : defaultSteps

  return (
    <AnimatedSection className="w-full border-y border-rule bg-surface py-24 md:py-32">
      <div className="container-site">
        <SectionHeading align="center" eyebrow={eyebrow} title="" titleHtml={headline} className="mb-20 md:mb-28" />

        <div className="relative mx-auto max-w-4xl">
          {/* The pipeline rule */}
          <div aria-hidden className="absolute bottom-0 top-0 hidden w-px -translate-x-1/2 bg-rule-strong md:left-1/2 md:block" />

          <StaggerContainer staggerChildren={0.18} delayChildren={0.2}>
            {steps.map((step: ProcessStep, index: number) => {
              const isEven = index % 2 === 0
              const isLast = index === steps.length - 1

              return (
                <StaggerItem key={index}>
                  <div className={`group relative ${isLast ? '' : 'mb-20 md:mb-28'}`}>
                    <div className={`flex flex-col items-start gap-6 md:items-center md:gap-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className={`w-full md:w-1/2 ${isEven ? 'md:text-end' : ''}`}>
                        <span className={`eyebrow eyebrow-index mb-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>{step.stepNumber}</span>
                        <h3 className="font-serif text-3xl font-semibold leading-tight text-obsidian">{step.title}</h3>
                      </div>

                      {/* Node */}
                      <div
                        aria-hidden
                        className="z-10 hidden h-3.5 w-3.5 shrink-0 rotate-45 border border-obsidian bg-surface transition-all duration-500 group-hover:scale-125 group-hover:border-emerald group-hover:bg-emerald md:block"
                      />

                      <div className={`w-full md:w-1/2 ${!isEven ? 'md:flex md:justify-end md:text-end' : ''}`}>
                        <div>
                          {step.subtitle && (
                            <h4 className="eyebrow mb-3 !text-obsidian">{step.subtitle}</h4>
                          )}
                          <p className="max-w-sm text-base font-light leading-relaxed text-muted">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ProcessBlock
