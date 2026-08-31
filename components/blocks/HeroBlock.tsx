'use client'
import React from 'react'
import type {  Page  } from '@/payload-types'
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/Reveal'
import { StaggerText } from '@/components/ui/motion/StaggerText'
import { MagneticButton } from '@/components/ui/motion/MagneticButton'
import { useReducedMotion } from '@/lib/animations'
import { m as motion } from 'framer-motion'
import { easings } from '@/lib/animations'
import { ExvortaOsPanel } from '@/components/blocks/ExvortaOsPanel'

type HeroBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
  const prefersReducedMotion = useReducedMotion()

  try {
  const isHome = props.headline?.includes('Digital Infrastructure') || props.eyebrow?.includes('ENGINE') || (!props.headline && !props.eyebrow) // fallback to home if nothing
  const isWebHero = props.eyebrow?.includes('HIGH-PERFORMANCE') || props.headline?.includes('High-Performance') || props.eyebrow?.includes('WEBSITES')
  const isAboutHero = props.headline?.includes('Gravity') || props.eyebrow?.includes('IDENTITY') || props.headline?.includes('Digital Gravity')

  if (isAboutHero) {
    return (
      <AnimatedSection className="w-full">
        <section className="w-full bg-[#0A0A0A] flex flex-col items-center justify-center text-center relative px-6 py-40 min-h-[85vh] overflow-hidden rounded-none" id="hero">
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
            <span className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase mb-10 block">
              {props.eyebrow || '[ THE EXVORTA IDENTITY ]'}
            </span>
            <h1
              className="text-5xl md:text-[5.5rem] font-serif font-bold text-white leading-[1.05] tracking-tight max-w-5xl mx-auto mb-10"
              dangerouslySetInnerHTML={{ __html: props.headline || 'We Engineer Digital Gravity.<br/><span class="text-white/60">For the World\'s Most Demanding Trade Entities.</span>' }}
            />
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed font-sans mt-6">
              {props.subheadline || 'Exvorta is a boutique digital architecture firm. We exist strictly to close the credibility gap between your monumental physical trading velocity and your online infrastructure.'}
            </p>
            <div className="text-[9px] font-mono text-white/20 tracking-[0.2em] uppercase mt-16">[ DUBAI · GLOBAL REACH ]</div>
          </div>
        </section>
      </AnimatedSection>
    )
  }

  if (isWebHero) {
    return (
      <AnimatedSection className="w-full relative py-0">
        <section className="relative w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-[90vh] py-20 text-center">
          {/* Status Pill */}
          <div className="relative z-10 flex items-center gap-2 bg-black/[0.03] px-4 py-1.5 border border-black/5 mb-10 rounded-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex h-1.5 w-1.5 bg-[#059669] rounded-none"></span>
            </span>
            <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-black/60">
              {props.eyebrow || '[ EXVORTA WEB ]'}
            </span>
          </div>
          
          {/* Monumental Headline */}
          <h1 className="relative z-10 font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
              dangerouslySetInnerHTML={{ __html: props.headline || '<span class="block text-black">High-Performance Websites.</span>\n<span class="block text-black/80">For Global Traders.</span>' }}
          />
          
          {/* Strategic Sub-headline */}
          <p className="relative z-10 max-w-2xl text-sm md:text-base text-black/60 leading-relaxed font-sans mb-12">
            {props.subheadline || 'We build high-performance websites that make global trading companies look like the serious players they are.'}
          </p>
          
          {/* Dual CTA Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link className="bg-[#0D0D0D] text-white px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-gray-900 transition-all duration-300 rounded-none" href={props.primaryCTA?.url || "/rfq"}>
              {props.primaryCTA?.label || '[ START YOUR PROJECT ]'}
            </Link>
            <Link className="border text-black/80 px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-black/5 transition-all duration-300 border-black rounded-none" href="/portfolio">
              [ VIEW RECENT PROJECTS ]
            </Link>
          </div>
          
          {/* Legal Micro-copy */}
          <div className="absolute bottom-12 left-0 right-0 px-6 hidden sm:block">
            <div className="max-w-4xl mx-auto flex justify-between items-center text-[10px] tracking-[0.3em] font-mono text-black/40 uppercase">
              <span>[ ENGINEERED FOR SPEED ]</span>
              <span>[ GLOBAL B2B READY ]</span>
              <span>[ ON-TIME DELIVERY ]</span>
            </div>
          </div>
        </section>
      </AnimatedSection>
    )
  }

  // Fallback to Home Hero for others
  const heroVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  }
  const heroItem = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(5px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: easings.cinematic } },
  }

  return (
    <AnimatedSection className="w-full">
      {/*  BEGIN: Hero Section  */}
<section className="relative pt-32 pb-40 overflow-hidden" data-purpose="hero-section">
<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
{/*  Hero Content  */}
<motion.div className="text-center max-w-4xl mx-auto mb-20" variants={heroVariants} initial="hidden" animate="show">
<motion.div variants={heroItem} className="inline-flex items-center justify-center px-3 py-1 mb-8 rounded-full border border-black/10 bg-white/50 text-[10px] tracking-widest uppercase text-obsidian/60"><motion.span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}></motion.span> [ {props.eyebrow || (isWebHero ? "HIGH-PERFORMANCE WEBSITES" : "ENGINE V1.0 LIVE")} ]</motion.div>
{prefersReducedMotion ? (
  <h1
    className="text-5xl md:text-7xl lg:text-[84px] leading-[1.1] font-serif font-semibold text-obsidian mb-8 tracking-tight"
    dangerouslySetInnerHTML={{ __html: props.headline || "Digital Infrastructure<br/>for Global Traders" }}
  />
) : (
  <StaggerText
    as="h1"
    text={props.headline || "Digital Infrastructure<br/>for Global Traders"}
    stagger={0.028}
    delay={0.2}
    duration={0.75}
    unit="chars"
    fromMarks
    className="text-5xl md:text-7xl lg:text-[84px] leading-[1.1] font-serif font-semibold text-obsidian mb-8 tracking-tight"
  />
)}
<motion.p variants={heroItem} className="text-base md:text-lg text-obsidian/60 max-w-2xl mx-auto mb-12 font-light">{props.subheadline || (isWebHero ? "The institutional standard. Bespoke architecture, flawless aesthetics, and engineered for elite B2B trading companies operating at a global scale." : "Websites that make institutional buyers take you seriously — built for exporters who compete on trust, not price. See the proof: three live deployments, one standard.")}</motion.p>
<motion.div variants={heroItem}>
<MagneticButton>
  <Link
    className="inline-flex min-h-[44px] items-center justify-center px-8 py-4 btn-primary"
    href={props.primaryCTA?.url && props.primaryCTA.url !== '#' ? props.primaryCTA.url : '/rfq'}
  >
    {props.primaryCTA?.label || "[ START YOUR PROJECT ]"}
  </Link>
</MagneticButton>
</motion.div>
</motion.div>
{/*  Dashboard Preview - ONLY for Home  */}
{(!isWebHero) && (
  <ExvortaOsPanel prefersReducedMotion={prefersReducedMotion} />
)}
</div></section><div className="py-12 flex justify-center" data-purpose="social-proof-anchor"><p className="text-[11px] font-sans text-obsidian/40 uppercase tracking-[0.2em] text-center max-w-xl leading-relaxed">Elevating digital infrastructure for modern trading firms across the GCC and Europe.</p></div>
{/*  END: Hero Section  */}

    </AnimatedSection>
  )
  } catch (error) {
    return <div style={{padding: 20, color: 'red', border: '1px solid red'}}>Error in HeroBlock</div>
  }
}

export default HeroBlock
