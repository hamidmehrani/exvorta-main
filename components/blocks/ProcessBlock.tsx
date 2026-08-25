'use client'

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal'

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
  const headline = props.headline || "Zero Friction. Infinite Precision."
  
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
    <AnimatedSection className="w-full bg-[#FCFAF8] py-32 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <span className="text-[10px] font-mono tracking-[0.3em] text-black/40 uppercase mb-6 block">
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-black tracking-tight">
            {headline}
          </h2>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-black/20 -translate-x-1/2 hidden md:block"></div>
          
          {steps?.map((step, index) => {
            const isEven = index % 2 === 0
            const isLast = index === steps.length - 1
            
            return (
              <div key={index} className={`relative group ${isLast ? '' : 'mb-32'}`}>
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-8 md:gap-16`}>
                  
                  {/* Left Side (or Right Side on reverse) */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : ''}`}>
                    <span className="text-[9px] font-mono tracking-[0.3em] text-emerald-600 uppercase mb-2 block">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-2xl font-serif text-black mb-3">{step.title}</h3>
                  </div>
                  
                  {/* Node */}
                  <div className="hidden md:flex w-4 h-4 bg-white border border-black z-10 shrink-0"></div>
                  
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
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
  } catch (error) {
    return <div style={{padding: 20, color: 'red', border: '1px solid red'}}>Error in ProcessBlock</div>
  }
}

export default ProcessBlock
