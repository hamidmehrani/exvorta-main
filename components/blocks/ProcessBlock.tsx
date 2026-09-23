'use client'

import { sanitizeHeadingHtml } from '@/utils/heading-sanitize'
import React from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem, EASE_OUT } from '@/components/ui/Reveal'
import { m } from 'framer-motion'

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

export const ProcessBlock: React.FC<ProcessBlockProps> = (props) => {
  try {
  const eyebrow = props.eyebrow || "[ THE DEPLOYMENT PIPELINE ]"
  const headline = sanitizeHeadingHtml(props.headline || 'Zero Friction. Infinite Precision.')
  
  const defaultSteps: ProcessStep[] = [
    {
      stepNumber: "WEEK 1",
      title: "Strategic Discovery",
      subtitle: "ARCHITECTURAL BLUEPRINTING",
      description: "We audit your current digital footprint and map out a bespoke strategy that aligns your technical infrastructure with your global market ambitions."
    },
    {
      stepNumber: "WEEKS 2-3",
      title: "The Iterative Canvas",
      subtitle: "BESPOKE VISUAL DESIGN",
      description: "Our art directors create your visual identity from scratch. No UI kits. No shortcuts. Just high-fidelity, institutional-grade aesthetics."
    },
    {
      stepNumber: "WEEKS 4-5",
      title: "Hardcoded Engineering",
      subtitle: "PURE CODE DEVELOPMENT",
      description: "Once design is approved, our engineers build the front-end using pure, lightweight code. We optimize for sub-second load times on the global trade floor."
    },
    {
      stepNumber: "ONGOING",
      title: "Handover & Concierge",
      subtitle: "Deployment & Dedicated Support",
      description: "We launch your asset to the global edge network. From there, we provide concierge-level support and maintenance for your evolving digital ecosystem."
    }
  ]

  const steps = (props.steps && props.steps.length > 0) ? props.steps : defaultSteps

  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] py-16 sm:py-24 lg:py-32 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <span className="text-[10px] font-mono tracking-[0.3em] text-black/40 uppercase mb-6 block">
            {eyebrow}
          </span>
          <h2
            className="text-4xl md:text-5xl font-serif text-black tracking-tight"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line — draws in on scroll */}
          <m.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE_OUT }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-black/20 -translate-x-1/2 hidden md:block"
          ></m.div>

          <StaggerContainer staggerChildren={0.18} delayChildren={0.3}>
            {steps?.map((step, index) => {
              const isEven = index % 2 === 0
              const isLast = index === steps.length - 1

              return (
                <StaggerItem key={index}>
                  <div className={`relative group ${isLast ? '' : 'mb-32'}`}>
                    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-8 md:gap-16`}>

                      {/* Left Side (or Right Side on reverse) */}
                      <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : ''}`}>
                        <span className="text-[9px] font-mono tracking-[0.3em] text-emerald-600 uppercase mb-2 block">
                          {step.stepNumber}
                        </span>
                        <h3 className="text-2xl font-serif text-black mb-3">{step.title}</h3>
                      </div>

                      {/* Node */}
                      <div className="hidden md:flex w-4 h-4 bg-white border border-black z-10 shrink-0 transition-all duration-500 group-hover:bg-black group-hover:scale-125"></div>

                      {/* Right Side (or Left Side on reverse) */}
                      <div className={`w-full md:w-1/2 ${!isEven ? 'md:text-right flex justify-end' : ''}`}>
                        <div>
                          {step.subtitle && (
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3">
                              {step.subtitle}
                            </h4>
                          )}
                          <p className="text-sm text-black/60 leading-relaxed max-w-sm">
                            {step.description}
                          </p>
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
  } catch (error) {
    console.error('[ProcessBlock] render error:', error)
    if (process.env.NODE_ENV !== 'production') {
      return <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>Error in ProcessBlock</div>
    }
    return null
  }
}

export default ProcessBlock
