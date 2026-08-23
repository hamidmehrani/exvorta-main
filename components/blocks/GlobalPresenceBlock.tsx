'use client'

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal'

export interface LocationInfo {
  region: string
  description: string
}

export interface GlobalPresenceBlockProps {
  eyebrow?: string
  title?: string
  description?: string
  locations?: LocationInfo[]
  [key: string]: any
}

export const GlobalPresenceBlock: React.FC<GlobalPresenceBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ GLOBAL EDGE INFRASTRUCTURE ]"
  const title = props.title || "Built for Global Reach."
  const description = props.description || "Your buyers are everywhere. Your website should perform everywhere — on any device, in any market, at any hour."
  
  const defaultLocations: LocationInfo[] = [
    {
      region: "MENA & Gulf",
      description: "Serving sovereign wealth funds and energy trade entities across the GCC."
    },
    {
      region: "Europe & UK",
      description: "Powering high-frequency trade desks in Mayfair, Geneva, and Frankfurt."
    },
    {
      region: "Asia Pacific",
      description: "Connecting institutional commodities brokers in Singapore and Hong Kong."
    }
  ]

  const locations = (props.locations && props.locations.length > 0) ? props.locations : defaultLocations

  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] py-32 md:py-40 px-6 border-y border-[#E5E5E5]" id="global-presence">
      <div className="max-w-7xl mx-auto w-full flex flex-col">
        {/* Header Block */}
        <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-6 block text-center">
          {eyebrow}
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-black text-center mb-8">
          {title}
        </h2>
        <p className="text-lg text-black/50 font-sans text-center max-w-2xl mx-auto mb-24">
          {description}
        </p>
        
        {/* Terminal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full border-t border-b border-[#E5E5E5]">
          {locations.map((loc, index) => {
            const isLast = index === locations.length - 1
            const borderClass = isLast ? "" : "border-b md:border-b-0 md:border-r border-[#E5E5E5]"
            
            return (
              <div key={index} className={`p-12 flex flex-col ${borderClass}`}>
                <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-6">
                  [ {loc.region} ]
                </span>
                <p className="text-lg font-serif text-black leading-relaxed">
                  {loc.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default GlobalPresenceBlock