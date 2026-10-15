'use client'
import React from 'react'
import type {  Page  } from '@/payload-types'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/Reveal'
import { m as motion } from 'framer-motion'
import { easings } from '@/lib/animations'
import { useReducedMotion } from '@/lib/animations'

type FeatureGridBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'featureGrid' }>

const DEFAULT_FEATURES = [
  {
    id: "default-1",
    title: "Rapid Bespoke Deployment",
    description: "High-performance websites delivered in just 2–4 weeks. We leverage advanced coding frameworks and agile team structures to move at the speed of global trade, without ever compromising institutional prestige."
  },
  {
    id: "default-2",
    title: "Headless Architecture",
    description: "Built on modern, scalable infrastructure (Next.js & Edge compute). API-ready designs ensuring your web presence is fast, secure, and globally accessible without legacy constraints."
  },
  {
    id: "default-3",
    title: "Absolute Data Sovereignty",
    description: "Enterprise-grade security protocols standard in every build. We ensure your corporate presence and proprietary intelligence remain strictly confidential and protected."
  }
]

export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = (props) => {
  try {
  const prefersReducedMotion = useReducedMotion()
  const features = props.features && props.features.length > 0 ? props.features : DEFAULT_FEATURES;

  return (
    <AnimatedSection className="w-full">
      <section className="py-24 border-t border-black/5" data-purpose="manifesto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted mb-4"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(4px)' }}
              whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: easings.cinematic }}
            >{props.eyebrow || props.sectionEyebrow || "Architecture Manifesto"}</motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-serif text-obsidian"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
              whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.08, ease: easings.cinematic }}
            >{props.sectionTitle || "Built for How Traders Actually Work"}</motion.h2>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerChildren={0.12} delayChildren={0.15}>
            {features?.map((feature, idx) => (
              <StaggerItem key={feature.id || idx} className="h-full">
                <motion.div
                  className="h-full bg-surface p-8 border border-black/5 rounded-sm hover:shadow-soft transition-shadow relative border-t-2 border-transparent hover:border-black group/card"
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  transition={{ duration: 0.3, ease: easings.cinematic }}
                >
                  <motion.span
                    className="text-obsidian/20 text-4xl font-serif leading-none absolute top-6 end-8 group-hover/card:text-emerald transition-colors duration-500"
                    aria-hidden
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </motion.span>
                  <h3 className="text-lg font-serif mb-3 text-black font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted leading-relaxed font-light">{feature.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </AnimatedSection>
  )
  } catch (error) {
    console.error('[FeatureGridBlock] render error:', error)
    if (process.env.NODE_ENV !== 'production') {
      return <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>Error in FeatureGridBlock</div>
    }
    return null
  }
}

export default FeatureGridBlock
