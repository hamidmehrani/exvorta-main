'use client'

import React from 'react'
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
  const defaultImageUrl = "https://lh3.googleusercontent.com/aida/AP1WRLuCABArA0dFLPr7X-kzVh0ePxOiRBVUP80aMVLCo4Zm4Ag2EAEoleoHyv0zWqpOnKnbtnsp02fwaS4F40nXwEtHwo6Hu37pR0UyHPVeXKTKGCk1JgsgwSz0hJbZz5DCEqEuCjqHpnaD22poW7CaU5XQdjCPR66D6sQgWW8JrlQDhNZRuAOZUQKKBc5gsUC-uogWXb3IaFvVe96wEpHZC0o7uvK3SdERtz23Ob1kTgrgftxXjgLLYQOXdFw"
  const hasCMSImage = props.image && typeof props.image === 'object' && props.image.url

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
              ) : (
                <img 
                  alt={`${name}, ${role}`}
                  src={defaultImageUrl}
                  className="w-full h-full object-cover grayscale contrast-125 rounded-none" 
                  onError={(e) => {
                    // Fallback to initials if even the default image fails
                    e.currentTarget.style.display = 'none';
                    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-4xl font-serif text-black/20">${initials}</span>`;
                  }}
                />
              )}
            </div>
          </div>
          
        </div>
      </div>
    </AnimatedSection>
  )
}

export default FounderBlock
