import React from 'react'
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import type { WaitlistFormBlock as WaitlistFormBlockType } from '@/payload-types'
import WaitlistClientForm from './WaitlistClientForm'

const PERKS = [
  { title: 'Docs', desc: 'Zero-trust document data room with AI classification.', phase: 'Q3 2026' },
  { title: 'Track', desc: 'Real-time multimodal shipment visibility dashboard.', phase: 'Q3 2026' },
  { title: 'CRM', desc: 'Counterparty risk management built for trade desks.', phase: 'Q1 2027' },
  { title: 'Intel', desc: 'Predictive commodity forecasting & risk analysis.', phase: 'Q3 2027' },
]

export const WaitlistFormBlock: React.FC<WaitlistFormBlockType> = ({
  placeholder,
  buttonText,
  source,
}) => {
  return (
    <AnimatedSection className="on-dark relative isolate flex w-full flex-grow flex-col items-center justify-center overflow-hidden bg-obsidian px-6 pb-28 pt-40 md:pb-36">
      {/* Aura + blueprint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-aura-dark absolute inset-0" />
        <div className="bg-blueprint-grid-dark absolute inset-0" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">

        {/* Typography Block */}
        <Reveal y={14}>
          <p className="eyebrow eyebrow-dark mb-8 justify-center">
            <span className="eyebrow-index" aria-hidden>
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            Exvorta Ecosystem
          </p>
        </Reveal>

        <Reveal y={22}>
          <h1 className="mb-6 font-serif text-headline font-semibold text-white">
            Request Alpha Access.
          </h1>
        </Reveal>

        <Reveal y={16} delay={0.12}>
          <p className="mx-auto mb-12 max-w-lg text-lede font-light text-muted-dark">
            The Exvorta Suite is in closed beta. Enter your corporate email to
            reserve your position — early partners shape the roadmap.
          </p>
        </Reveal>

        <Reveal y={20} delay={0.2} className="mx-auto w-full max-w-2xl">
          <WaitlistClientForm
            placeholder={placeholder || ''}
            buttonText={buttonText || ''}
            source={source || ''}
          />
        </Reveal>

        {/* What you get — module grid */}
        <Reveal y={20} delay={0.3} className="mt-20 w-full">
          <StaggerContainer delayChildren={0.15} staggerChildren={0.1} className="frame frame-dark mx-auto grid w-full max-w-2xl grid-cols-1 border border-rule-dark text-start sm:grid-cols-2">
            {PERKS.map((p) => (
              <StaggerItem
                key={p.title}
                className="group flex h-full flex-col gap-2 border-b border-rule-dark p-6 transition-colors hover:bg-white/[0.04] last:border-b-0 sm:odd:border-e sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-white">{p.title}</span>
                  <span className="font-mono text-label uppercase text-success">{p.phase}</span>
                </div>
                <span className="text-sm font-light leading-relaxed text-muted-dark">{p.desc}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Reveal>

        {/* Security Micro-copy */}
        <Reveal y={12} delay={0.4}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success motion-reduce:animate-none" aria-hidden />
              <span className="eyebrow eyebrow-dark">End-to-End Encrypted Data Transmission</span>
            </div>
            <p className="font-mono text-label uppercase text-white/50">
              * Active Exvorta Web clients bypass the waitlist automatically
            </p>
          </div>
        </Reveal>
      </div>
    </AnimatedSection>
  )
}

export default WaitlistFormBlock
