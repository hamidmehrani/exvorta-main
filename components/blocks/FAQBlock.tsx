'use client'

import React, { useState } from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { m, AnimatePresence } from 'framer-motion'

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

const FAQRow = ({ q, i, open, onToggle }: { q: FAQItem; i: number; open: boolean; onToggle: () => void }) => (
  <div className={`border-b border-white/20 ${open ? 'py-8' : 'py-8'}`}>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="w-full text-start outline-none cursor-pointer group"
    >
      <span className="text-xl md:text-2xl font-serif text-white list-none flex justify-between items-center gap-6">
        <span>
          <span className="font-mono text-[10px] text-white/30 mr-4 align-middle">{String(i + 1).padStart(2, '0')}</span>
          {q.question}
        </span>
        <m.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
          className="relative flex items-center justify-center w-6 h-6 shrink-0"
        >
          <span className="absolute w-full h-[1px] bg-white"></span>
          <span className="absolute h-full w-[1px] bg-white"></span>
        </m.span>
      </span>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-6 text-white/60 leading-relaxed font-sans max-w-3xl text-lg">{q.answer}</p>
          </m.div>
        )}
      </AnimatePresence>
    </button>
  </div>
)

export const FAQBlock: React.FC<FAQBlockProps> = (props) => {
  try {
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
  const [openIndex, setOpenIndex] = useState<number>(0)

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
          <StaggerContainer staggerChildren={0.08} delayChildren={0.15}>
            {questions?.map((q, i) => (
              <StaggerItem key={i}>
                <FAQRow
                  q={q}
                  i={i}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </AnimatedSection>
  )
  } catch (error) {
    return <div style={{padding: 20, color: 'red', border: '1px solid red'}}>Error in FAQBlock</div>
  }
}

export default FAQBlock
