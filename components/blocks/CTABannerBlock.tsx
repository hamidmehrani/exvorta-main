'use client'

import React from 'react'
import { AnimatedSection } from '../ui/Reveal'
import Link from 'next/link'
import type { Page } from '@/payload-types'

type CTABannerProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'ctaBanner' }>

export function CTABannerBlock(props: CTABannerProps) {
  try {
  const label = props.label || "[ INITIATE PARTNERSHIP ]"
  const headline = props.headline || "Align your digital infrastructure<br/>with your operational scale."
  const description = props.description || "Stop allowing generic architecture to dilute your market authority. Engage our engineering team to map your optimal digital footprint."
  const primaryCTA = props.primaryCTA || { label: "[ REQUEST A PROPOSAL ]", url: "/rfq" }

  return (
    <AnimatedSection className="w-full bg-[#0A0A0A] py-40 px-6 flex flex-col justify-center items-center relative overflow-hidden rounded-none" id="cta">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>
      <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase mb-8 block text-center z-10">
        {label}
      </span>
      <h2 
        className="text-4xl md:text-6xl font-serif text-white text-center mb-8 leading-tight tracking-tight z-10 max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: headline }}
      />
      <p className="text-lg text-white/50 font-sans text-center max-w-2xl mx-auto mb-16 z-10">
        {description}
      </p>
      <div className="flex justify-center z-10">
        <Link
          href={!primaryCTA.url || primaryCTA.url === '#' ? "/rfq" : primaryCTA.url}
          className="bg-white text-black px-12 py-6 text-[11px] uppercase tracking-[0.25em] font-mono hover:bg-gray-200 transition-all duration-300 shadow-none hover:shadow-none flex items-center gap-3 rounded-none"
        >
          {primaryCTA.label}
        </Link>
      </div>
      <div className="mt-10 text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase text-center z-10">
        [ Response within 24 hours ]
      </div>
    </AnimatedSection>
  )
  } catch (error) {
    console.error('[CTABannerBlock] render error:', error)
    if (process.env.NODE_ENV !== 'production') {
      return <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>Error in CTABannerBlock</div>
    }
    return null
  }
}

export default CTABannerBlock;
