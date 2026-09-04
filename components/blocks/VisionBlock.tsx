'use client'

import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem, EASE_OUT } from '@/components/ui/Reveal'
import { m } from 'framer-motion'
import { StaggerText } from '@/components/ui/motion'

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

export const VisionBlock: React.FC<VisionBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ THE EXVORTA STANDARD ]"
  const title = props.title || "Our Operating Principles."
  
  const defaultPrinciples: VisionPrinciple[] = [
    {
      number: "01",
      category: "ENGINEERING",
      title: "Zero Bloat Architecture.",
      description: "We categorically reject templates and heavy content management systems. Every line of code is written specifically for your entity, ensuring strong security standards and fast load times on any device."
    },
    {
      number: "02",
      category: "AESTHETICS",
      title: "Institutional Authority.",
      description: "Design is not decoration; it is a mechanism for trust. We apply elite, bespoke UI/UX architecture so your digital presence instantly matches the scale of your global operations."
    },
    {
      number: "03",
      category: "PRIVACY",
      title: "Absolute Discretion.",
      description: "We operate under strict Non-Disclosure Agreements. Your digital infrastructure, competitive data, and market strategies are treated as confidential business assets."
    },
    {
      number: "04",
      category: "PARTNERSHIP",
      title: "Dedicated Partnership",
      description: "Deployment is just the beginning. We remain available for updates, adjustments, and ongoing improvements as your business grows."
    }
  ]

  const principles = (props.principles && props.principles.length > 0) ? props.principles : defaultPrinciples

  return (
    <AnimatedSection className="w-full bg-[#0A0A0A] py-32 md:py-48 px-6" id="values">
      <div className="max-w-7xl mx-auto w-full">
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-6 block text-center">
          {eyebrow}
        </span>
        <StaggerText
          as="h2"
          text={title}
          unit="words"
          stagger={0.08}
          duration={0.75}
          mode="inView"
          className="text-4xl md:text-5xl font-serif text-white text-center mb-8"
        />
        <m.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.0, delay: 0.2, ease: EASE_OUT }}
          className="w-24 h-px bg-brand-emerald/50 mx-auto mb-24 origin-center"
        ></m.div>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 w-full border-t border-l border-[#333]" staggerChildren={0.12} delayChildren={0.15}>
          {principles?.map((p, i) => {
            const num = p.number || String(i + 1).padStart(2, '0')
            return (
              <StaggerItem key={i}>
                <div className="bg-transparent border-r border-b border-[#333] p-12 lg:p-16 rounded-none flex flex-col h-full transition-colors duration-500 hover:bg-white/[0.02]">
                  <div className="font-mono text-xs text-white/30 tracking-widest mb-10 uppercase">
                    {num} — {p.category}
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-4">{p.title}</h3>
                  <p className="text-white/50 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default VisionBlock