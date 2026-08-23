'use client'

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQBlockProps {
  eyebrow?: string
  sectionTitle?: string
  questions?: FAQItem[]
  [key: string]: any
}

export const FAQBlock: React.FC<FAQBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ EXECUTIVE BRIEFING ]"
  const sectionTitle = props.sectionTitle || "Clarity on Execution.<br/><span class=\"text-white/50\">Addressing Common Friction.</span>"
  
  const defaultQuestions: FAQItem[] = [
    {
      question: "How much of my team's time will this deployment require?",
      answer: "Virtually none. We require a single 60-minute strategic alignment call. From there, our architects and copywriters handle 100% of the heavy lifting. You simply review and approve the final institutional asset."
    },
    {
      question: "We move fast. Do we need internal developers to update the site?",
      answer: "No. Your focus should remain entirely on moving trade volume. Every engagement includes ongoing dedicated support. Any updates, new pages, or adjustments are handled by our team — so you stay focused on your business."
    },
    {
      question: "Why custom architecture instead of a premium WordPress setup?",
      answer: "WordPress is built for general use. We build specifically for your business — custom architecture, faster load times, and a codebase only you own. No shared templates, no plugin dependencies."
    }
  ]

  const questions = (props.questions && props.questions.length > 0) ? props.questions : defaultQuestions

  return (
    <AnimatedSection className="w-full bg-[#0D0D0D] py-32 px-6 border-b border-[#0D0D0D]">
      <div className="max-w-4xl mx-auto w-full">
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-8 block">
          {eyebrow}
        </span>
        <h2 
          className="text-4xl md:text-5xl font-serif text-white mb-20 leading-tight"
          dangerouslySetInnerHTML={{ __html: sectionTitle }}
        />
        
        <div className="flex flex-col border-t border-white/20">
          {questions.map((q, i) => (
            <details key={i} className="group border-b border-white/20 py-8 cursor-pointer [&_summary::-webkit-details-marker]:hidden" open>
              <summary className="text-xl md:text-2xl font-serif text-white list-none flex justify-between items-center outline-none">
                <span>{q.question}</span>
                <span className="relative flex items-center justify-center w-6 h-6 transition-transform duration-500 group-open:-rotate-180">
                  <span className="absolute w-full h-[1px] bg-white"></span>
                  <span className="absolute h-full w-[1px] bg-white group-open:opacity-0 transition-opacity"></span>
                </span>
              </summary>
              <div className="overflow-hidden transition-all duration-500">
                <p className="mt-6 text-white/60 leading-relaxed font-sans max-w-3xl text-lg">
                  {q.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default FAQBlock
