'use client'

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal'

export interface FirmBlockProps {
  eyebrow?: string
  headline?: string
  description?: string
  pillars?: {
    number: string
    title: string
    description: string
  }[]
  [key: string]: any
}

export const FirmBlock: React.FC<FirmBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ HOW WE OPERATE ]"
  const headline = props.headline || "Methodical.<br/>Relentless.<br/><span class=\"text-white/50\">Pure Execution.</span>"
  const description = props.description || "We do not operate like a traditional agency. We function as an outsourced architectural wing for your trading operations. High velocity, zero friction."
  
  const defaultPillars = [
    {
      number: "01",
      title: "Architectural Precision",
      description: "We don't guess. We map your entire digital supply chain before writing a single line of code. Every interface is designed to capture tier-one enterprise leads and establish absolute market authority."
    },
    {
      number: "02",
      title: "Hardcoded Superiority",
      description: "We bypass bloated content management systems. Our engineers deploy pure, bespoke code directly to the global edge network. The result is elite security standards and sub-second load times on any device, anywhere."
    },
    {
      number: "03",
      title: "Dedicated Ongoing Support",
      description: "Deployment is a baseline, not a finish line. We handle your entire digital infrastructure maintenance, updates, and scaling, so you stay focused on your business, not your website."
    }
  ]

  const pillars = (props.pillars && props.pillars.length > 0) ? props.pillars : defaultPillars

  return (
    <AnimatedSection className="w-full bg-[#0A0A0A] py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Core Statement */}
        <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-32 h-fit">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-8 block">
            {eyebrow}
          </span>
          <h2 
            className="text-4xl md:text-5xl font-serif text-white leading-tight mb-8"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          <p className="text-lg text-white/50 font-sans leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Right Column: Operational Pillars */}
        <div className="lg:col-span-7 flex flex-col mt-12 lg:mt-0">
          {pillars.map((pillar, i) => (
            <div key={i} className={`border-t border-white/10 pt-8 pb-12 ${i === pillars.length - 1 ? 'border-b' : ''}`}>
              <div className="flex items-center gap-6 mb-6">
                <span className="text-xs font-mono text-white/30">{pillar.number}</span>
                <h3 className="text-2xl font-serif text-white">{pillar.title}</h3>
              </div>
              <p className="text-white/60 leading-relaxed font-sans pl-10">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </AnimatedSection>
  )
}

export default FirmBlock
