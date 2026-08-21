'use client'

import React from 'react'
import { AnimatedSection, AnimatedButton } from '@/components/ui/Reveal';
// import Image from 'next/image'

export interface FeatureShowcaseBlockProps {
  label?: string
  title: string
  description?: string
  features?: {
    title: string
    description: string
  }[]
  ctaText?: string
  ctaUrl?: string
  media?: any // Adjust based on your Payload media type
  mediaPosition?: 'left' | 'right'
  [key: string]: any
}

export const FeatureShowcaseBlock: React.FC<FeatureShowcaseBlockProps> = (props) => {
  const hasMedia = !!props.media

  if (hasMedia) {
    // If there's media, use a 2-column layout (from design or default placeholder)
    const isRight = props.mediaPosition === 'right'
    return (
      <AnimatedSection className="w-full bg-white py-32 px-6 border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto w-full">
          {props.label && (
            <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-16 block text-center">
              {props.label}
            </span>
          )}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${isRight ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`flex flex-col ${isRight ? 'lg:order-2' : ''}`}>
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight mb-8 text-black">
                {props.title}
              </h2>
              {props.description && (
                <p className="text-lg text-black/60 leading-relaxed font-sans mb-12">
                  {props.description}
                </p>
              )}
              {props.features && props.features.length > 0 && (
                <div className="flex flex-col gap-8">
                  {props.features.map((f, i) => (
                    <div key={i} className="border-l border-black/20 pl-6">
                      <h3 className="text-xl font-serif text-black mb-2">{f.title}</h3>
                      <p className="text-black/60 leading-relaxed text-sm">{f.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {props.ctaText && props.ctaUrl && (
                <div className="mt-12">
                  <AnimatedButton href={props.ctaUrl} className="bg-[#0D0D0D] text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-black transition-colors rounded-none inline-block">
                    {props.ctaText}
                  </AnimatedButton>
                </div>
              )}
            </div>
            <div className={`w-full aspect-square md:aspect-auto md:h-full min-h-[400px] border border-black bg-[#FCFAF8] relative ${isRight ? 'lg:order-1' : ''}`}>
              {/* Media rendering logic can be added here if needed */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <span className="text-xs font-mono text-black/30 tracking-widest uppercase text-center">
                   [ MEDIA PLACEHOLDER ]
                 </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    )
  }

  // The Exvorta Solution style (no media)
  return (
    <AnimatedSection className="w-full bg-white py-32 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto w-full">
        {props.label && (
          <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-16 block">
            {props.label}
          </span>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 sticky top-32">
            <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight mb-8 text-black">
              {props.title}
            </h2>
            {props.description && (
              <p className="text-lg text-black/60 leading-relaxed font-sans">
                {props.description}
              </p>
            )}
          </div>
          <div className="lg:col-span-7 flex flex-col gap-12">
            {props.features?.map((f, i) => (
              <div key={i} className="border-l border-black/20 pl-8">
                <h3 className="text-2xl font-serif text-black mb-3">{f.title}</h3>
                <p className="text-black/60 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default FeatureShowcaseBlock
