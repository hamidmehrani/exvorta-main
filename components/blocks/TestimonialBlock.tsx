'use client'

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal'
import { Marquee } from '@/components/ui/motion/Marquee'

export interface ManualTestimonial {
  id?: string | null
  quote: string
  author: string
  role?: string | null
  company?: string | null
}

export interface TestimonialBlockProps {
  eyebrow?: string
  quote?: string
  quoteAuthor?: string
  guaranteeTitle?: string
  guaranteeText?: string
  guaranteeSignature?: string
  manualTestimonials?: ManualTestimonial[] | null
  [key: string]: unknown
}

function TestimonialCard({ t }: { t: ManualTestimonial }) {
  return (
    <figure className="w-[320px] md:w-[420px] shrink-0 mx-4 bg-cream border border-hairline-light p-8 md:p-10 flex flex-col justify-between min-h-[260px]">
      <blockquote className="font-serif text-lg md:text-xl text-obsidian leading-snug">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span aria-hidden className="inline-block w-8 h-[1px] bg-obsidian" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-obsidian/60">
          {t.author}
          {t.company ? ` · ${t.company}` : ''}
          {t.role ? ` — ${t.role}` : ''}
        </span>
      </figcaption>
    </figure>
  )
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = (props) => {
  try {
  const eyebrow = props.eyebrow || "[ THE MARKET CONSENSUS ]"
  const quote = props.quote || "75% of people judge a company's credibility based on their website design alone."
  const quoteAuthor = props.quoteAuthor || "Stanford Web Credibility Research, B.J. Fogg"
  const guaranteeTitle = props.guaranteeTitle || "The Zero-Risk Standard"
  const guaranteeText = props.guaranteeText || "Every engagement begins with a clear scope and mutual agreement. We deliver to standard or we iterate until we do. No ambiguity. No surprises."
  const guaranteeSignature = props.guaranteeSignature || "The Exvorta Partners"
  const testimonials = (Array.isArray(props.manualTestimonials) ? props.manualTestimonials : []).filter(
    (t): t is ManualTestimonial => Boolean(t && t.quote && t.author),
  )

  if (testimonials.length > 0) {
    return (
      <AnimatedSection className="w-full bg-white py-16 sm:py-24 lg:py-32 px-6 border-b border-hairline-light overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-12 block text-center">
            {eyebrow}
          </span>
        </div>
        <Marquee speed={35} className="py-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id ?? i} t={t} />
          ))}
        </Marquee>
      </AnimatedSection>
    )
  }

  return (
    <AnimatedSection className="w-full bg-white py-16 sm:py-24 lg:py-32 px-6 border-b border-hairline-light">
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
        <div className="bg-brand-cream border border-black p-12 md:p-16 rounded-none relative">
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
  } catch (error) {
    console.error('[TestimonialBlock] render error:', error)
    if (process.env.NODE_ENV !== 'production') {
      return <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>Error in TestimonialBlock</div>
    }
    return null
  }
}

export default TestimonialBlock
