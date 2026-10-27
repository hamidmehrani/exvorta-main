"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { submitLead } from '@/actions/submitLead';
import { InfraPoster } from '@/components/three/InfraPoster';
import { STACK_MODULES } from '@/components/three/infra-stack-data';

/** Where each module's call to action goes: the live product has a page, the rest a waitlist. */
const MODULE_LINKS: Record<string, { href: string; label: string }> = {
  web: { href: '/web', label: 'SEE EXVORTA WEB' },
  docs: { href: '/waitlist', label: 'JOIN THE WAITLIST' },
  crm: { href: '/waitlist', label: 'JOIN THE WAITLIST' },
  intel: { href: '/waitlist', label: 'JOIN THE WAITLIST' },
  suite: { href: '/waitlist', label: 'JOIN THE WAITLIST' },
};

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

          {/* Roadmap console: the five modules + the suite vision, one obsidian panel */}
          <div className="frame mb-20">
            <div className="on-dark relative isolate overflow-hidden bg-obsidian text-white">
              <div aria-hidden className="bg-blueprint-grid-dark pointer-events-none absolute inset-0 -z-10" />

              {/* Timeline: the same five modules, order and dates as the hero and the ecosystem page */}
              <StaggerContainer
                className="grid grid-cols-1 divide-y divide-rule-dark lg:grid-cols-5 lg:divide-x lg:divide-y-0"
                staggerChildren={0.12}
                delayChildren={0.15}
              >
                {STACK_MODULES.map((m) => {
                  const link = MODULE_LINKS[m.key];
                  return (
                    <StaggerItem key={m.key} className="group relative flex flex-col p-7 lg:p-8">
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 top-0 h-0.5 origin-left transition-transform duration-500 ease-[var(--ease-cinematic)] ${
                          m.live ? 'scale-x-100 bg-success' : 'scale-x-0 bg-success group-hover:scale-x-100'
                        }`}
                      />
                      <div className="mb-8 flex items-center justify-between gap-3 font-mono text-label uppercase">
                        <span className="tabular-nums text-white/90">{m.index}</span>
                        <span
                          className={`flex items-center gap-1.5 border px-2 py-1.5 ${
                            m.live ? 'border-success/50 text-success' : 'border-rule-dark text-muted-dark'
                          }`}
                        >
                          {m.live && <span className="h-1 w-1 rotate-45 bg-success" aria-hidden />}
                          {m.status}
                        </span>
                      </div>
                      <h3 className="mb-3 font-serif text-title font-semibold text-white">{m.name}</h3>
                      <p className="mb-8 text-base font-light leading-relaxed text-muted-dark">{m.caption}</p>
                      <Link
                        href={link.href}
                        className="mt-auto inline-flex min-h-[44px] items-center gap-2 self-start font-mono text-label uppercase text-white/70 transition-colors group-hover:text-success"
                      >
                        {link.label}
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>

              {/* The vision: suite */}
              <Reveal y={16}>
                <div className="relative flex flex-col items-center gap-12 overflow-hidden border-t border-rule-dark p-6 sm:p-8 md:flex-row md:p-14">
                  <div aria-hidden className="bg-aura-dark pointer-events-none absolute inset-0 opacity-60" />
                  <div className="relative w-full md:w-2/3">
                    <p className="eyebrow eyebrow-dark mb-6">
                      <span className="eyebrow-index" aria-hidden>
                        <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                      </span>
                      The vision
                    </p>
                    <h3 className="mb-6 font-serif text-title font-semibold text-white">Exvorta Suite</h3>
                    <p className="max-w-xl text-lede font-light text-muted-dark">
                      The ultimate convergence. A singular, unified digital infrastructure seamlessly integrating your web presence, automated compliance, logistics, and intelligence into one trade OS.
                    </p>
                    <div className="mt-10">
                      {/* Full width on phones with the arrow dropped, so the label never wraps to an orphaned "] →". */}
                      <Link href="/waitlist" className="btn-primary min-h-[52px] w-full px-4 py-4 sm:w-auto sm:px-8">
                        [ JOIN THE SUITE WAITLIST ]<span aria-hidden className="hidden sm:inline">→</span>
                      </Link>
                    </div>
                  </div>
                  <div className="relative flex w-full items-center justify-center md:w-1/3" aria-hidden>
                    <InfraPoster className="h-56 w-auto animate-[float_9s_ease-in-out_infinite] motion-reduce:animate-none md:h-64" />
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
