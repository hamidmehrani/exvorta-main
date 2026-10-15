'use client'

import React, { useState } from 'react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import FAQJsonLd from '@/components/seo/FAQJsonLd'
import { unbracket } from '@/lib/text'

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

const defaultQuestions: FAQItem[] = [
  {
    question: "How much of my team's time will this deployment require?",
    answer: "Virtually none. We require a single 60-minute strategic alignment call. From there, our architects and copywriters handle 100% of the heavy lifting. You simply review and approve the final institutional asset.",
  },
  {
    question: "We move fast. Do we need internal developers to update the site?",
    answer: "No. Your focus should remain entirely on moving trade volume. Every engagement includes ongoing dedicated support. Any updates, new pages, or adjustments are handled by our team — so you stay focused on your business.",
  },
  {
    question: "Why custom architecture instead of a premium WordPress setup?",
    answer: "WordPress is built for general use. We build specifically for your business — custom architecture, faster load times, and a codebase only you own. No shared templates, no plugin dependencies.",
  },
]

/** Accordion row: heading › button for the question, separate region for the answer. */
const FAQRow = ({ q, i, open, onToggle }: { q: FAQItem; i: number; open: boolean; onToggle: () => void }) => (
  <div className="border-b border-rule-dark">
    <h3>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${i}`}
        id={`faq-trigger-${i}`}
        className="group flex w-full cursor-pointer items-start justify-between gap-6 py-7 text-start"
      >
        <span className="flex items-baseline gap-5">
          <span className="font-mono text-label text-success" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
          <span className="font-serif text-xl font-semibold leading-snug text-white transition-colors group-hover:text-white/80 md:text-2xl">
            {q.question}
          </span>
        </span>
        <span
          aria-hidden
          className={`relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300 ease-[var(--ease-cinematic)] ${open ? 'rotate-45' : ''}`}
        >
          <span className="absolute h-px w-full bg-white" />
          <span className="absolute h-full w-px bg-white" />
        </span>
      </button>
    </h3>
    <div
      id={`faq-panel-${i}`}
      role="region"
      aria-labelledby={`faq-trigger-${i}`}
      inert={!open}
      className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-cinematic)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
    >
      <div className="overflow-hidden">
        <p className="max-w-3xl pb-8 ps-9 text-lg font-light leading-relaxed text-muted-dark md:ps-11">{q.answer}</p>
      </div>
    </div>
  </div>
)

export const FAQBlock: React.FC<FAQBlockProps> = (props) => {
  const eyebrow = unbracket(props.eyebrow) || 'EXECUTIVE BRIEFING'
  // Legacy CMS markup greys the second line with a 50% white class; on this
  // obsidian band it must stay legible.
  const sectionTitle = (props.sectionTitle || 'Clarity on Execution.<br/><span class="text-white/50">Addressing Common Friction.</span>').replace(
    /text-white\/(30|40|50|60)/g,
    'text-muted-dark',
  )
  const questions = props.questions && props.questions.length > 0 ? props.questions : defaultQuestions
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <AnimatedSection className="on-dark relative isolate w-full overflow-hidden bg-obsidian py-24 text-white md:py-32">
      <FAQJsonLd questions={questions} />
      <div aria-hidden className="bg-blueprint-grid-dark pointer-events-none absolute inset-0 -z-10" />
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading tone="dark" eyebrow={eyebrow} title="" titleHtml={sectionTitle} />
          </div>
        </div>

        <StaggerContainer className="border-t border-rule-dark lg:col-span-7" staggerChildren={0.08} delayChildren={0.15}>
          {questions.map((q: FAQItem, i: number) => (
            <StaggerItem key={i}>
              <FAQRow q={q} i={i} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  )
}

export default FAQBlock
