"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { submitLead } from '@/actions/submitLead';

const PHASES = [
  {
    name: 'Exvorta Track',
    description: 'End-to-end multimodal logistics telemetry and predictive freight visibility.',
    cta: 'JOIN TRACK WAITLIST',
  },
  {
    name: 'Exvorta CRM',
    description: 'Trade-specific counterparty risk management and global vendor intelligence.',
    cta: 'JOIN CRM WAITLIST',
  },
  {
    name: 'Exvorta Intel',
    description: 'Proprietary market data, trade flows, and real-time commodities pricing benchmarks.',
    cta: 'JOIN INTEL WAITLIST',
  },
] as const;

export function RoadmapBlock(props: any) {
  const [email, setEmail] = useState('');
  const [waitlistState, setWaitlistState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitlistState('pending');
    setWaitlistError(null);
    const res = await submitLead({
      source: 'Waitlist',
      email,
      botField: undefined,
      collection: 'waitlist',
    });
    if (res.success) {
      setWaitlistState('done');
      setEmail('');
    } else {
      setWaitlistState('error');
      setWaitlistError(res.error || 'Submission failed');
    }
  };

  return (
    <AnimatedSection className="w-full">
      <section className="border-t border-rule py-24 md:py-32" data-purpose="roadmap">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Ecosystem roadmap"
            title="The Master Plan: Exvorta Ecosystem"
            description="We are actively building the definitive, unified operating system for global trade."
            className="mb-16 md:mb-20"
          />

          {/* Roadmap console: three phases + the suite, one obsidian panel */}
          <div className="frame mb-20">
            <div className="on-dark relative isolate overflow-hidden bg-obsidian text-white">
              <div aria-hidden className="bg-blueprint-grid-dark pointer-events-none absolute inset-0 -z-10" />

              <StaggerContainer
                className="grid grid-cols-1 divide-y divide-rule-dark md:grid-cols-3 md:divide-x md:divide-y-0"
                staggerChildren={0.14}
                delayChildren={0.15}
              >
                {PHASES.map((phase, i) => (
                  <StaggerItem key={phase.name} className="group relative flex flex-col p-8 md:p-10">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-success transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-x-100"
                    />
                    <div className="mb-10 flex items-center gap-4 font-mono text-label uppercase text-muted-dark">
                      <span>[ PHASE {i + 1} ]</span>
                      <span className="flex gap-1" aria-hidden>
                        {PHASES.map((_, step) => (
                          <i key={step} className={`block h-1 w-5 ${step <= i ? 'bg-success' : 'bg-rule-dark'}`} />
                        ))}
                      </span>
                    </div>
                    <h3 className="mb-4 font-serif text-2xl font-semibold text-white">{phase.name}</h3>
                    <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">{phase.description}</p>
                    <Link
                      href="/waitlist"
                      className="mt-auto inline-flex min-h-[44px] items-center gap-2 self-start font-mono text-label uppercase text-white/70 transition-colors group-hover:text-success"
                    >
                      {phase.cta}
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* The vision: suite */}
              <Reveal y={16}>
                <div className="relative flex flex-col items-center gap-12 overflow-hidden border-t border-rule-dark p-8 md:flex-row md:p-14">
                  <div aria-hidden className="bg-aura-dark pointer-events-none absolute inset-0 opacity-60" />
                  <div className="relative w-full md:w-2/3">
                    <p className="eyebrow eyebrow-dark mb-6">[ THE VISION ]</p>
                    <h3 className="mb-6 font-serif text-title font-semibold text-white">Exvorta Suite</h3>
                    <p className="max-w-xl text-lede font-light text-muted-dark">
                      The ultimate convergence. A singular, unified digital infrastructure seamlessly integrating your web presence, automated compliance, logistics, and intelligence into one trade OS.
                    </p>
                    <div className="mt-10">
                      <Link href="/waitlist" className="btn-primary min-h-[52px] px-8 py-4">
                        [ JOIN THE SUITE WAITLIST ] →
                      </Link>
                    </div>
                  </div>
                  <div className="relative flex w-full items-center justify-center md:w-1/3" aria-hidden>
                    <div className="relative flex h-48 w-48 items-center justify-center">
                      <div className="absolute h-full w-full animate-[spin_22s_linear_infinite] rounded-full border border-rule-dark motion-reduce:animate-none" />
                      <div className="absolute h-2/3 w-2/3 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-rule-dark motion-reduce:animate-none" />
                      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100">
                        <path d="M50 50 L50 0 M50 50 L100 75 M50 50 L0 75" fill="none" stroke="currentColor" strokeDasharray="2,2" strokeWidth="0.5" />
                      </svg>
                      <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/50" />
                      <span className="absolute bottom-1/4 right-0 h-2 w-2 rounded-full bg-warning/70" />
                      <span className="absolute left-0 top-1/4 h-1.5 w-1.5 rounded-full bg-white/30" />
                      <span className="relative z-10 h-4 w-4 animate-pulse rounded-full bg-warning shadow-[0_0_24px_color-mix(in_oklab,var(--color-warning)_60%,transparent)] motion-reduce:animate-none" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Waitlist */}
          <Reveal y={20} delay={0.1}>
            <div className="mx-auto w-full max-w-2xl text-center">
              <p className="eyebrow mb-6 justify-center">Early access</p>
              {waitlistState === 'done' ? (
                <div className="border border-rule-strong bg-surface px-6 py-4">
                  <span className="font-mono text-label uppercase text-obsidian">[ YOU ARE ON THE LIST — CHECK YOUR INBOX ]</span>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-4 sm:flex-row">
                  <label htmlFor="roadmap-waitlist-email" className="sr-only">Corporate email</label>
                  <input
                    id="roadmap-waitlist-email"
                    className="field flex-1"
                    placeholder="Enter official corporate email..."
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={waitlistState === 'pending'}
                  />
                  <button
                    type="submit"
                    disabled={waitlistState === 'pending'}
                    className="btn-primary min-h-[52px] whitespace-nowrap px-10 py-4 disabled:opacity-60"
                  >
                    {waitlistState === 'pending' ? '[ SUBMITTING... ]' : '[ REQUEST EARLY ACCESS ]'}
                  </button>
                </form>
              )}
              {waitlistError && (
                <p role="alert" className="mt-3 text-center font-mono text-sm text-danger">{waitlistError}</p>
              )}
            </div>
          </Reveal>
        </Container>
      </section>
    </AnimatedSection>
  );
}

export default RoadmapBlock;
