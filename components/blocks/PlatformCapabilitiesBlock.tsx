"use client";

import React from 'react';
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '../ui/Reveal';
import { Container } from '../ui/Container';
import { MonoLabel } from '../ui/MonoLabel';
import { m as motion } from 'framer-motion';
import { easings, useReducedMotion } from '@/lib/animations';

/**
 * PlatformCapabilitiesBlock — /web section answering "what do I actually get"
 * in business language: self-service CMS, unlimited languages & design
 * iterations, and the engineering stack behind it.
 */

const CAPABILITIES = [
  {
    title: 'Edit everything. Yourself.',
    desc: 'Products, certificates, prices, images, news — every word and pixel is editable from your admin panel. No developer, no ticket, no waiting.',
    tag: 'SELF-SERVE CMS',
    stat: '100%',
    statLabel: 'of content is editable',
  },
  {
    title: 'Unlimited languages.',
    desc: 'Arabic, Chinese, Russian, Spanish — launch as many locales as your markets demand, with a built-in translation workflow. One click to add a market.',
    tag: 'UNLIMITED LOCALES',
    stat: '∞',
    statLabel: 'languages supported',
  },
  {
    title: 'Unlimited design revisions.',
    desc: 'Your Figma designs are implemented faithfully and iterated without limits — new sections, seasonal campaigns, complete rebrands — all included.',
    tag: 'UNLIMITED FIGMA',
    stat: '∞',
    statLabel: 'design iterations',
  },
  {
    title: 'Speed as a sales weapon.',
    desc: 'Server rendering and a global edge CDN keep every page under a second, anywhere on earth — the same infrastructure trusted by Adobe and NVIDIA.',
    tag: 'ELITE STACK',
    stat: '<1s',
    statLabel: 'load time globally',
  },
]

const TECH = [
  { name: 'Next.js 15', why: 'Server rendering keeps pages instant for buyers on any continent — and Google rewards it with better rankings.' },
  { name: 'Vercel Edge', why: 'Served from 100+ data centers, so a buyer in Shanghai gets the same speed as one in Dubai.' },
  { name: 'Payload CMS', why: 'A real admin panel — manage products and certificates without ever touching code.' },
  { name: 'PostgreSQL', why: 'Bank-grade data integrity for your catalog, certificates and lead pipeline.' },
  { name: 'Cloudflare', why: 'DDoS protection, image optimization and a fully redundant delivery layer.' },
  { name: 'TypeScript', why: 'Strict typing means fewer production bugs and a codebase any senior team can inherit.' },
]

export function PlatformCapabilitiesBlock() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection className="w-full">
      <section
        className="py-32 bg-[#0D0D0D] text-white border-t border-white/10 relative overflow-hidden"
        data-purpose="platform-capabilities"
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(white 0.5px, transparent 0.5px)', backgroundSize: '22px 22px' }} />

        <Container>
          {/* Heading */}
          <Reveal y={20} className="mb-20 text-center">
            <MonoLabel className="text-[10px] font-mono tracking-[0.3em] text-white/45 uppercase mb-6 block">
              [ WHAT YOU ACTUALLY GET ]
            </MonoLabel>
            <h2 className="text-4xl md:text-6xl font-serif font-semibold tracking-tight leading-tight mb-6">
              Built to be operated <span className="text-white/50">by you.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto font-light">
              Most agencies hand you a website and a monthly invoice. We hand you
              the keys — and the infrastructure stays out of your way.
            </p>
          </Reveal>

          {/* Capability cards */}
          <StaggerContainer
            delayChildren={0.1}
            staggerChildren={0.12}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28"
          >
            {CAPABILITIES.map((cap, i) => (
              <StaggerItem key={cap.tag}>
                <motion.div
                  className="h-full border border-white/10 bg-white/[0.03] p-8 md:p-10 flex flex-col hover:border-brand-emerald/40 hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden"
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  transition={{ duration: 0.3, ease: easings.cinematic }}
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-emerald/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-start justify-between mb-8 gap-4">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-brand-emerald/90 uppercase border border-brand-emerald/30 px-2.5 py-1">
                      {cap.tag}
                    </span>
                    <div className="text-right shrink-0">
                      <div className="text-3xl md:text-4xl font-serif font-semibold text-white leading-none">{cap.stat}</div>
                      <div className="font-mono text-[8px] tracking-[0.2em] text-white/40 uppercase mt-2">{cap.statLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight mb-4">{cap.title}</h3>
                  <p className="text-white/55 font-light leading-relaxed text-[15px]">{cap.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Tech stack — translated to business language */}
          <Reveal y={20} className="mb-12 text-center">
            <MonoLabel className="text-[10px] font-mono tracking-[0.3em] text-white/45 uppercase mb-6 block">
              [ THE ENGINE ROOM — IN PLAIN ENGLISH ]
            </MonoLabel>
            <h3 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight">
              Serious technology. <span className="text-white/50">Business reasons.</span>
            </h3>
          </Reveal>

          <StaggerContainer
            delayChildren={0.08}
            staggerChildren={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10"
          >
            {TECH.map((t, i) => (
              <StaggerItem key={t.name}>
                <motion.div
                  className="h-full bg-[#0D0D0D] p-8 flex flex-col gap-3 hover:bg-white/[0.04] transition-colors duration-300"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: easings.cinematic }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-brand-emerald rotate-45" />
                    <span className="font-mono text-sm text-white font-medium tracking-wide">{t.name}</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed font-light">{t.why}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal y={16} delay={0.1} className="mt-10 text-center">
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">
              You never touch any of it — but every layer works for your business.
            </p>
          </Reveal>
        </Container>
      </section>
    </AnimatedSection>
  );
}

export default PlatformCapabilitiesBlock;
