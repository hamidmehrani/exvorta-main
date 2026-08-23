'use client'

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal'

export interface FeatureShowcaseBlockProps {
  label?: string
  title?: string
  description?: string
  features?: {
    title: string
    description: string
  }[]
  [key: string]: any
}

export const FeatureShowcaseBlock: React.FC<FeatureShowcaseBlockProps> = (props) => {
  const eyebrow = props.label || "[ ARCHITECTURAL SPECS ]"
  const title = props.title || "Pure Code. Flawless Aesthetics."
  
  const defaultFeatures = [
    {
      title: "Bespoke Art Direction. Refined Until Perfect.",
      description: "Custom visual identities designed from scratch. We refine every pixel until we achieve a shared, institutional masterpiece.",
      iconType: "target"
    },
    {
      title: "100% Hardcoded.",
      description: "Built from scratch. No templates, no shortcuts. Elite code for unbreachable security and extreme speed.",
      iconType: "horizontal-lines"
    },
    {
      title: "High-Performance UX.",
      description: "Fluid animations and instant interaction speeds designed for high-stakes, fast-moving global trade environments.",
      iconType: "vertical-lines"
    },
    {
      title: "Dedicated Ongoing Support.",
      description: "Professional infrastructure handling and unlimited layout updates so your team remains focused on moving trade volume.",
      iconType: "dot"
    }
  ]

  const featuresToRender = (props.features && props.features.length > 0) ? props.features : defaultFeatures

  const renderIcon = (index: number) => {
    const type = defaultFeatures[index]?.iconType || "dot"
    
    if (type === "target") {
      return (
        <div className="w-8 h-8 border border-white/20 flex items-center justify-center mb-8">
          <div className="w-4 h-4 border border-white/20"></div>
        </div>
      )
    }
    if (type === "horizontal-lines") {
      return (
        <div className="w-8 h-8 border border-white/20 flex flex-col mb-8">
          <div className="flex-1 border-b border-white/20"></div>
          <div className="flex-1"></div>
        </div>
      )
    }
    if (type === "vertical-lines") {
      return (
        <div className="w-8 h-8 border border-white/20 flex mb-8">
          <div className="flex-1 border-r border-white/20"></div>
          <div className="flex-1"></div>
        </div>
      )
    }
    
    return (
      <div className="w-8 h-8 border border-white/20 flex items-center justify-center mb-8">
        <div className="w-2 h-2 bg-white/20"></div>
      </div>
    )
  }

  return (
    <AnimatedSection className="w-full py-24 bg-[#0D0D0D] border-b border-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-white/40 text-[10px] font-mono tracking-[0.2em] mb-6 block">
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            {title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 w-full border border-white/20">
          {featuresToRender.map((f, i) => {
            // Apply borders conditionally based on position in grid
            const isLastRow = i >= featuresToRender.length - 2
            const isRightCol = i % 2 !== 0
            
            let borderClass = 'border-white/20 p-10 flex flex-col justify-between min-h-[340px] '
            if (!isLastRow) borderClass += 'border-b md:border-b '
            if (!isRightCol) borderClass += 'md:border-r '
            
            return (
              <div key={i} className={`bg-[#0D0D0D] ${borderClass}`}>
                {renderIcon(i)}
                <div>
                  <h3 className="text-2xl font-serif text-white mb-3">{f.title}</h3>
                  <p className="text-white/50 text-sm max-w-xl">{f.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default FeatureShowcaseBlock
