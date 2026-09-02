'use client'

import React from 'react'
import Image from 'next/image'
import { AnimatedSection } from '@/components/ui/Reveal'
import { CMSImage } from '@/components/ui/CMSImage'

export interface FounderBlockProps {
  eyebrow?: string
  quote?: string
  name?: string
  bio?: string
  role?: string
  image?: any
  [key: string]: any
}

export const FounderBlock: React.FC<FounderBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ 04. THE FOUNDER ]"
  const quote = props.quote || `"Architecture is not just visual; it is a balance sheet asset. We engineer digital gravity for the world's most demanding trade entities."`
  const name = props.name || "Hamid Mehrani"
  const bio = props.bio || "Based in Dubai. Background in digital engineering and international trade operations. Founded Exvorta to bridge the credibility gap facing global trading firms."
  const role = props.role || "PRINCIPAL ARCHITECT, EXVORTA"
  
  // Default image URL from HTML if not provided from CMS
  const defaultImageUrl = "/founder-portrait.png"
  const hasCMSImage = props.image && typeof props.image === 'object' && props.image.url
  // Legacy rows: imageSrc as a plain URL string (pre-upload field)
  const legacyImageUrl = !hasCMSImage && typeof props.imageSrc === 'string' && props.imageSrc.trim() !== '' && props.imageSrc !== '#'
    ? props.imageSrc
    : null

  return (
    <AnimatedSection className="w-full py-32 relative overflow-hidden bg-white text-black" id="founder">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col min-h-[40vh] bg-transparent">
        <span className="text-xs font-mono tracking-widest text-black/40 uppercase">
          {eyebrow}
        </span>
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 w-full items-center">
          
          {/* Left Column: Editorial Quote & Signature */}
          <div className="lg:col-span-3 flex flex-col pr-16">
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif text-black leading-tight mb-12 italic">
              {quote}
            </blockquote>
            
            <div className="mt-4">
              <div className="font-serif italic text-3xl text-black mb-4">
                {name}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-sans leading-relaxed text-black/60 mb-3 max-w-md">
                  {bio}
                </p>
                <span className="text-[10px] font-mono tracking-[0.3em] text-black/60 uppercase">
                  {name.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono tracking-[0.3em] text-black/40 uppercase">
                  {role}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Portrait */}
          <div className="lg:col-span-2 mt-12 lg:mt-0">
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-black/10 rounded-none shadow-none bg-black/5 flex items-center justify-center">
              {hasCMSImage ? (
                <CMSImage
                  media={props.image}
                  className="w-full h-full object-cover grayscale contrast-125 rounded-none"
                />
              ) : legacyImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={legacyImageUrl} alt={`${name}, ${role}`} className="w-full h-full object-cover grayscale contrast-125 rounded-none" />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    alt={`${name}, ${role}`}
                    src={defaultImageUrl}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover grayscale contrast-125 rounded-none"
                  />
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </AnimatedSection>
  )
}

export default FounderBlock
