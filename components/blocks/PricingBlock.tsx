'use client'

import React from 'react'
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/Reveal'

export interface PricingTier {
  tierName: string
  price?: string
  highlight?: string
  features: { feature: string }[]
  ctaText?: string
  ctaLink?: string
}

export interface PricingBlockProps {
  eyebrow?: string
  sectionTitle?: string
  sectionSubtitle?: string
  description?: string
  tiers?: PricingTier[]
  bottomCtaText?: string
  bottomCtaLink?: string
  [key: string]: any
}

export const PricingBlock: React.FC<PricingBlockProps> = (props) => {
  try {
  const eyebrow = props.eyebrow || "[ SCOPE OF INVESTMENT ]"
  const sectionTitle = props.sectionTitle || "Tailored Architectures."
  const sectionSubtitle = props.sectionSubtitle || "Scoped to Your Scale."
  const description = props.description || "We scope every engagement individually based on your operational complexity and market ambitions."
  const bottomCtaText = props.bottomCtaText || "[ REQUEST A CUSTOM SCOPE ]"
  const bottomCtaLink = props.bottomCtaLink || "/rfq"

  const defaultTiers = [
    {
      tierName: "01. Foundation",
      highlight: "All packages include: Custom Design, Custom Development & Admin Panel",
      features: [
        { feature: "SEO Foundation Setup" },
        { feature: "Up to 5 Pages" },
        { feature: "Mobile Responsive" },
        { feature: "Contact Form Integration" },
        { feature: "30-Day Support" }
      ],
      price: "Pricing Upon Proposal"
    },
    {
      tierName: "02. Professional",
      highlight: "All packages include: Custom Design, Custom Development & Admin Panel",
      features: [
        { feature: "SEO & Performance Optimization" },
        { feature: "Up to 10 Pages" },
        { feature: "Brand Identity & Guidelines" },
        { feature: "Advanced Animations" },
        { feature: "Multilingual Ready" },
        { feature: "60-Day Support" }
      ],
      price: "Pricing Upon Proposal"
    },
    {
      tierName: "03. Premium",
      highlight: "All packages include: Custom Design, Custom Development & Admin Panel",
      features: [
        { feature: "Advanced SEO & Analytics Dashboard" },
        { feature: "Unlimited Pages" },
        { feature: "Full Brand System" },
        { feature: "Admin Panel" },
        { feature: "Priority Delivery" },
        { feature: "90-Day Support" }
      ],
      price: "Pricing Upon Proposal"
    }
  ]

  const tiersToRender = (props.tiers && props.tiers.length > 0) ? props.tiers : defaultTiers

  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] py-32 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto w-full">
        <span className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase mb-6 block text-center">
          {eyebrow}
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-black mb-6 text-center leading-tight">
          {sectionTitle}<br/>
          <span className="text-black/50">{sectionSubtitle}</span>
        </h2>
        <p className="text-lg text-black/50 text-center max-w-2xl mx-auto mb-20">
          {description}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full items-stretch border border-black">
          {tiersToRender.map((tier, index) => {
            const isMiddle = index === 1
            const isLast = index === tiersToRender.length - 1
            
            const bgClass = isMiddle ? "bg-[#0D0D0D]" : "bg-[#FCFAF8]"
            const textClass = isMiddle ? "text-white" : "text-black"
            const mutedTextClass = isMiddle ? "text-white/40" : "text-black/40"
            const itemTextClass = isMiddle ? "text-white/80" : "text-black/80"
            const borderClass = isMiddle ? "border-white/20" : "border-black/20"
            
            let containerBorderClass = ""
            if (!isLast) containerBorderClass += "border-b lg:border-b-0 lg:border-r border-black "
            
            return (
              <div key={index} className={`${bgClass} ${containerBorderClass} p-10 flex flex-col rounded-none`}>
                <h3 className={`text-2xl font-serif ${textClass} mb-2`}>{tier.tierName}</h3>
                <p className={`text-[10px] ${mutedTextClass} uppercase tracking-widest mb-10 h-10`}>
                  {tier.highlight}
                </p>
                <ul className="flex-grow flex flex-col gap-4 mb-12">
                  {tier.features.map((f, i) => (
                    <li key={i} className={`text-sm ${itemTextClass} flex items-start gap-3 border-t ${borderClass} pt-4`}>
                      + {f.feature}
                    </li>
                  ))}
                </ul>
                <div className={`mt-auto border-t ${borderClass} w-full pt-4 text-center text-[10px] uppercase tracking-[0.1em] font-mono ${itemTextClass}`}>
                  {tier.price}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-20 flex justify-center">
          <Link 
            href={bottomCtaLink}
            className="bg-[#0D0D0D] text-white px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-black transition-all rounded-none"
          >
            {bottomCtaText}
          </Link>
        </div>
      </div>
    </AnimatedSection>
  )
  } catch (error) {
    return <div style={{padding: 20, color: 'red', border: '1px solid red'}}>Error in PricingBlock</div>
  }
}

export default PricingBlock
