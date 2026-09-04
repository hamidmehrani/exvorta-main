'use client'

import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'

import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem, EASE_OUT } from '@/components/ui/Reveal'
import { m } from 'framer-motion'
import { StaggerText } from '@/components/ui/motion'

export interface ThesisBlockProps {
  eyebrow?: string
  headline?: string
  paragraph1?: string
  paragraph2?: string
  [key: string]: any
}

export const ThesisBlock: React.FC<ThesisBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ THE EXVORTA<br/>THESIS ]"
  const headline = props.headline || "The era of the digital brochure is dead. A generic website signals operational weakness to global partners. We engineer assets with a balance sheet impact."
  const paragraph1 = props.paragraph1 || "In the high-stakes arena of global trade, your digital footprint is your most heavily scrutinized asset. Before a contract is signed, before a container is shipped, serious buyers verify your credibility online before they ever reach out."
  const paragraph2 = props.paragraph2 || "We established Exvorta to provide elite trading firms with digital infrastructure that matches their physical scale. No templates. No shortcuts. Just pure, unadulterated performance architecture."

  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Left Column: The Anchor */}
        <div className="lg:col-span-3 flex flex-col justify-start">
          <m.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="w-12 h-[1px] bg-black/20 mb-8 origin-left"
          ></m.div>
          <span 
            className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase leading-relaxed"
            dangerouslySetInnerHTML={{ __html: eyebrow }}
          />
        </div>
        
        {/* Right Column: The Manifesto */}
        <StaggerContainer className="lg:col-span-9 flex flex-col justify-center" staggerChildren={0.12} delayChildren={0.1}>
          <StaggerItem>
            <StaggerText
              as="h2"
              text={sanitizeHeadingHtml(headline)}
              unit="words"
              stagger={0.055}
              duration={0.7}
              mode="inView"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-black leading-[1.1] tracking-tight mb-12 max-w-4xl"
            />
          </StaggerItem>
          {paragraph1 && (
            <StaggerItem>
              <p className="text-xl text-black/60 font-sans leading-relaxed max-w-3xl mb-8">
                {paragraph1}
              </p>
            </StaggerItem>
          )}
          {paragraph2 && (
            <StaggerItem>
              <p className="text-xl text-black/60 font-sans leading-relaxed max-w-3xl">
                {paragraph2}
              </p>
            </StaggerItem>
          )}
        </StaggerContainer>
        
      </div>
    </AnimatedSection>
  )
}

export default ThesisBlock