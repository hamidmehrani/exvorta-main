import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal';
import type { Page } from '@/payload-types'

type Props = Extract<NonNullable<Page['layout']>[0], { blockType: 'globalPresence' }>

export const GlobalPresenceBlock: React.FC<Props> = (props) => {
  const { eyebrow, headline, description, locations } = props

  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] py-32 md:py-40 px-6 border-y border-[#E5E5E5]" id="global-presence"> 
      <div className="max-w-7xl mx-auto w-full flex flex-col"> 
        {/* Header Block */} 
        {eyebrow && (
          <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-6 block text-center">
            {eyebrow}
          </span>
        )}
        {headline && (
          <h2 className="text-4xl md:text-5xl font-serif text-black text-center mb-8">
            {headline}
          </h2>
        )}
        {description && (
          <p className="text-lg text-black/50 font-sans text-center max-w-2xl mx-auto mb-24">
            {description}
          </p> 
        )}
        {/* Terminal Grid */} 
        <div className="grid grid-cols-1 md:grid-cols-3 w-full border-t border-b border-[#E5E5E5]">
          {locations?.map((location, idx) => (
            <div 
              key={idx} 
              className={`p-12 border-b md:border-b-0 flex flex-col ${idx !== locations.length - 1 ? 'md:border-r border-[#E5E5E5]' : ''}`}
            >
              <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-6">
                {location.name}
              </span>
              {location.description && (
                <p className="text-lg font-serif text-black leading-relaxed">
                  {location.description}
                </p>
              )}
            </div>
          ))}
        </div> 
      </div> 
    </AnimatedSection>
  )
}

export default GlobalPresenceBlock