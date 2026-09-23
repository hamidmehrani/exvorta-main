import React from 'react'
import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'
import type {  Page  } from '@/payload-types'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import { useReducedMotion } from '@/lib/animations'

type CTABlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

export const CTABlock: React.FC<CTABlockProps> = (props) => {
  const prefersReducedMotion = useReducedMotion()
  const headline = props.title || "Deals are won before the first meeting."

  return (
    <AnimatedSection className="w-full">

<section className="py-16 sm:py-24 lg:py-32" data-purpose="the-pitch">
<div className="max-w-4xl mx-auto px-4 text-center">
{prefersReducedMotion ? (
  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-obsidian mb-8 leading-tight"><span dangerouslySetInnerHTML={{ __html: sanitizeHeadingHtml(headline) }} /></h2>
) : (
  <StaggerText
    as="h2"
    text={headline}
    unit="words"
    stagger={0.09}
    duration={0.7}
    mode="inView"
    fromMarks={false}
    className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-obsidian mb-8 leading-tight"
  />
)}
<Reveal delay={0.25} y={14}>
<p className="text-base md:text-lg text-obsidian/60 leading-relaxed font-light max-w-2xl mx-auto text-center">{props.description || "Without a credible digital presence, you are losing deals before the first conversation. Exvorta fixes this."}</p>
</Reveal>
</div>
</section>


    </AnimatedSection>
  )
}

export default CTABlock
