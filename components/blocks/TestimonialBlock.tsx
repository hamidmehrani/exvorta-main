'use client'

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal'

export interface TestimonialBlockProps {
  eyebrow?: string
  quote?: string
  quoteAuthor?: string
  guaranteeTitle?: string
  guaranteeText?: string
  guaranteeSignature?: string
  manualTestimonials?: any[]
  [key: string]: any
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ THE MARKET CONSENSUS ]"
  const quote = props.quote || "75% of people judge a company's credibility based on their website design alone."
  const quoteAuthor = props.quoteAuthor || "Stanford Web Credibility Research, B.J. Fogg"
  const guaranteeTitle = props.guaranteeTitle || "The Zero-Risk Standard"
  const guaranteeText = props.guaranteeText || "Every engagement begins with a clear scope and mutual agreement. We deliver to standard or we iterate until we do. No ambiguity. No surprises."
  const guaranteeSignature = props.guaranteeSignature || "The Exvorta Partners"

  return (
    <AnimatedSection className="w-full bg-white py-32 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        
        {/* Left Column: The Market Proof */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-8 block">
            {eyebrow}
          </span>
          <h3 className="text-4xl md:text-5xl font-serif text-black leading-tight mb-8">
            {quote}
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-8 h-[1px] bg-black"></div>
            <span className="text-xs font-mono tracking-widest text-black/50 uppercase">
              — {quoteAuthor}
            </span>
          </div>
        </div>
        
        {/* Right Column: The Exvorta Guarantee */}
        <div className="bg-[#FCFAF8] border border-black p-12 md:p-16 rounded-none relative">
          <h4 className="text-2xl font-serif text-black mb-4">{guaranteeTitle}</h4>
          <p className="text-black/60 leading-relaxed mb-8">
            {guaranteeText}
          </p>
          <div className="font-serif text-black italic text-xl">
            {guaranteeSignature}
          </div>
        </div>
        
      </div>
    </AnimatedSection>
  )
}

export default TestimonialBlock
