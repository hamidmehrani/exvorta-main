import React from 'react'
import { AnimatedSection, Reveal } from '@/components/ui/Reveal'
import { Marquee } from '@/components/ui/motion/Marquee'
import { unbracket } from '@/lib/text'

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
    <figure className="card-elite mx-3 flex min-h-[260px] w-[320px] shrink-0 flex-col justify-between p-8 md:w-[420px] md:p-10">
      <blockquote className="font-serif text-xl font-semibold leading-snug text-obsidian md:text-2xl">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span aria-hidden className="inline-block h-px w-8 bg-emerald" />
        <span className="font-mono text-label uppercase text-muted">
          {t.author}
          {t.company ? ` · ${t.company}` : ''}
          {t.role ? ` — ${t.role}` : ''}
        </span>
      </figcaption>
    </figure>
  )
}

function Eyebrow({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <p className={`eyebrow ${centered ? 'justify-center' : ''}`}>
      <span className="eyebrow-index" aria-hidden>
        <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
      </span>
      {children}
    </p>
  )
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = (props) => {
  const eyebrow = unbracket(props.eyebrow) || 'THE MARKET CONSENSUS'
  const quote = props.quote || "75% of people judge a company's credibility based on their website design alone."
  const quoteAuthor = props.quoteAuthor || 'Stanford Web Credibility Research, B.J. Fogg'
  const guaranteeTitle = props.guaranteeTitle || 'The Zero-Risk Standard'
  const guaranteeText = props.guaranteeText || 'Every engagement begins with a clear scope and mutual agreement. We deliver to standard or we iterate until we do. No ambiguity. No surprises.'
  const guaranteeSignature = props.guaranteeSignature || 'The Exvorta Partners'
  const testimonials = (Array.isArray(props.manualTestimonials) ? props.manualTestimonials : []).filter(
    (t): t is ManualTestimonial => Boolean(t && t.quote && t.author),
  )

  if (testimonials.length > 0) {
    return (
      <AnimatedSection className="w-full overflow-hidden border-b border-rule bg-surface py-24 md:py-32">
        <div className="container-site mb-12">
          <Eyebrow centered>{eyebrow}</Eyebrow>
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
    <AnimatedSection className="w-full border-b border-rule bg-surface py-24 md:py-32">
      <div className="container-site grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-24">
        {/* Left Column: The Market Proof */}
        <div className="flex flex-col">
          <div className="mb-8">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <Reveal y={18}>
            <h3 className="mb-8 font-serif text-headline font-semibold text-obsidian">{quote}</h3>
          </Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-emerald" aria-hidden />
            {quoteAuthor}
          </p>
        </div>

        {/* Right Column: The Exvorta Guarantee */}
        <Reveal y={24} delay={0.12}>
          <div className="frame relative border border-obsidian bg-cream p-10 md:p-14">
            <h4 className="mb-4 font-serif text-3xl font-semibold text-obsidian">{guaranteeTitle}</h4>
            <p className="mb-8 text-base font-light leading-relaxed text-muted">{guaranteeText}</p>
            <p className="border-t border-rule pt-6 font-serif text-xl font-semibold text-obsidian">{guaranteeSignature}</p>
          </div>
        </Reveal>
      </div>
    </AnimatedSection>
  )
}

export default TestimonialBlock
