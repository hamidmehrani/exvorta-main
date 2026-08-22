import React from 'react'
import { Page } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'

type CTABlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

export const CTABlock: React.FC<CTABlockProps> = (props) => {
  return (
    <AnimatedSection className="w-full">
      
<section className="py-32" data-purpose="the-pitch">
<div className="max-w-4xl mx-auto px-4 text-center">
<h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-obsidian mb-8 leading-tight">{props.title || "Deals are won before the first meeting."}</h2>
<p className="text-base md:text-lg text-obsidian/60 leading-relaxed font-light max-w-2xl mx-auto text-center">{props.description || "Without a credible digital presence, you are losing deals before the first conversation. Exvorta fixes this."}</p>
</div>
</section>


    </AnimatedSection>
  )
}

export default CTABlock
