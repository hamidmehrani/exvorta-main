import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'
import React from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProcessStage } from '@/components/blocks/ProcessStage'
import type { ProcessStageStep } from '@/components/blocks/ProcessStage'
import { unbracket } from '@/lib/text'

export interface ProcessStep {
  stepNumber?: string
  title: string
  subtitle?: string
  description: string
  icon?: string
}

export interface ProcessBlockProps {
  eyebrow?: string
  headline?: string
  description?: string
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
 * Deployment pipeline. The copy comes from the CMS (steps[]); the section turns
 * it into a scroll-driven 3D build — see ProcessStage. This wrapper stays a
 * server component so the heading and every step are in the static HTML.
 */
export const ProcessBlock: React.FC<ProcessBlockProps> = (props) => {
  const eyebrow = unbracket(props.eyebrow) || 'THE DEPLOYMENT PIPELINE'
  const headline = sanitizeHeadingHtml(props.headline || 'Zero Friction. Infinite Precision.', { onDark: true })
  const source: ProcessStep[] = props.steps && props.steps.length > 0 ? props.steps : defaultSteps

  const steps: ProcessStageStep[] = source.map((step, i) => ({
    label: step.stepNumber || step.icon || String(i + 1).padStart(2, '0'),
    title: step.title,
    subtitle: step.subtitle,
    description: step.description,
  }))

  return (
    <ProcessStage steps={steps}>
      <SectionHeading tone="dark" eyebrow={eyebrow} title="" titleHtml={headline} description={props.description} className="mb-6 md:mb-10" />
    </ProcessStage>
  )
}

export default ProcessBlock
