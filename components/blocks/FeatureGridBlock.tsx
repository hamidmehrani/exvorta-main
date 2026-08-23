import React from 'react'
import type {  Page  } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'

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
  const features = props.features && props.features.length > 0 ? props.features : DEFAULT_FEATURES;

  return (
    <AnimatedSection className="w-full">
      <section className="py-24 border-t border-black/5" data-purpose="manifesto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-[10px] tracking-widest uppercase text-obsidian/40 mb-4">{props.eyebrow || props.sectionEyebrow || "Architecture Manifesto"}</div>
            <h2 className="text-3xl md:text-4xl font-serif text-obsidian">{props.sectionTitle || "Built for How Traders Actually Work"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={feature.id || idx} className="bg-surface p-8 border border-black/5 rounded-sm hover:shadow-soft transition-shadow relative border-t-2 border-transparent hover:border-black transition-all duration-300">
                <span className="text-gray-200 text-4xl font-serif leading-none absolute top-6 right-8 opacity-50">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-serif mb-3 text-black font-semibold">{feature.title}</h3>
                <p className="text-sm text-obsidian/60 leading-relaxed font-light text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  )
}

export default FeatureGridBlock
