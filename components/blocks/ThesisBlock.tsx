import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'

import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { StaggerText } from '@/components/ui/motion'
import { unbracket } from '@/lib/text'

export interface ThesisBlockProps {
  eyebrow?: string
  headline?: string
  paragraph1?: string
  paragraph2?: string
  [key: string]: any
}

export const ThesisBlock: React.FC<ThesisBlockProps> = (props) => {
  // CMS eyebrows carry brackets and <br/>; the label renders as plain text.
  const eyebrow = unbracket((props.eyebrow || 'THE EXVORTA THESIS').replace(/<br\s*\/?>/gi, ' '))
  const headline = props.headline || "The era of the digital brochure is dead. A generic website signals operational weakness to global partners. We engineer assets with a balance sheet impact."
  const paragraph1 = props.paragraph1 || "In the high-stakes arena of global trade, your digital footprint is your most heavily scrutinized asset. Before a contract is signed, before a container is shipped, serious buyers verify your credibility online before they ever reach out."
  const paragraph2 = props.paragraph2 || "We established Exvorta to provide elite trading firms with digital infrastructure that matches their physical scale. No templates. No shortcuts. Just pure, unadulterated performance architecture."

  return (
    <AnimatedSection className="w-full py-24 md:py-40">
      <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: The Anchor */}
        <div className="flex flex-col justify-start lg:col-span-3">
          <span aria-hidden className="mb-8 block h-px w-12 bg-rule-strong" />
          <p className="eyebrow !items-start leading-relaxed">
            <span className="eyebrow-index" aria-hidden>
              <i className="mt-px block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            {eyebrow}
          </p>
        </div>

        {/* Right Column: The Manifesto */}
        <StaggerContainer className="flex flex-col justify-center lg:col-span-9" staggerChildren={0.12} delayChildren={0.1}>
          <StaggerItem>
            <StaggerText
              as="h2"
              text={sanitizeHeadingHtml(headline)}
              unit="words"
              stagger={0.055}
              duration={0.7}
              mode="inView"
              className="mb-12 max-w-4xl font-serif text-headline font-semibold text-obsidian"
            />
          </StaggerItem>
          {paragraph1 && (
            <StaggerItem>
              <p className="mb-8 max-w-3xl text-lede font-light text-muted">{paragraph1}</p>
            </StaggerItem>
          )}
          {paragraph2 && (
            <StaggerItem>
              <p className="max-w-3xl text-lede font-light text-muted">{paragraph2}</p>
            </StaggerItem>
          )}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default ThesisBlock
