'use client'

import React from 'react'
import { Reveal, StaggerContainer, StaggerItem } from '../ui/Reveal'
import Link from 'next/link'
import type { Page } from '@/payload-types'

type CTABannerProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'ctaBanner' }>
type GuaranteeType = NonNullable<CTABannerProps['guarantees']>[0]

export function CTABannerBlock(props: CTABannerProps) {
  const { label, headline, description, primaryCTA, secondaryCTA, guarantees } = props

  return (
    <section className="w-full bg-obsidian px-5 md:px-[100px] py-[128px] flex flex-col items-center">
      <Reveal className="max-w-[720px] w-full flex flex-col items-center text-center">
        {label && <span className="font-sans font-semibold text-[12px] uppercase tracking-[0.2em] text-primary mb-[24px] block">{label}</span>}
        {headline && <h2 className="font-display font-bold text-[40px] md:text-[64px] leading-[1.2] md:leading-[1.1] text-surface mb-[24px]">{headline}</h2>}
        {description && <p className="font-sans font-light text-[16px] md:text-[18px] text-surface/60 mb-[48px]">{description}</p>}
        <div className="flex flex-col md:flex-row gap-[16px] justify-center w-full md:w-auto">
          {primaryCTA?.label && <Link href={(primaryCTA.url === '#' || !primaryCTA.url) ? '/contact' : primaryCTA.url} className="w-full md:w-auto text-center bg-primary text-surface font-sans font-semibold text-[12px] uppercase tracking-[0.14em] px-[40px] py-[18px] rounded-[2px] transition-all hover:bg-[#5C2006] hover:-translate-y-[2px]">{primaryCTA.label}</Link>}
          {secondaryCTA?.label && <Link href={(secondaryCTA.url === '#' || !secondaryCTA.url) ? '/contact' : secondaryCTA.url} className="w-full md:w-auto text-center bg-transparent border border-surface/30 text-surface font-sans font-semibold text-[12px] uppercase tracking-[0.14em] px-[40px] py-[18px] rounded-[2px] transition-all hover:border-surface hover:-translate-y-[2px]">{secondaryCTA.label}</Link>}
        </div>
        <StaggerContainer delayChildren={0.2} staggerChildren={0.1} className="mt-[48px] flex flex-col md:flex-row justify-center gap-[24px] md:gap-[48px]">
          {guarantees?.map((guarantee: GuaranteeType, i: number) => (
            <StaggerItem key={i} className="flex items-center gap-[12px] justify-center">
              <div className="w-[4px] h-[4px] rounded-full bg-primary"></div>
              <span className="font-sans font-light text-[14px] md:text-[13px] text-surface/50 tracking-[0.04em] whitespace-nowrap">{guarantee.text}</span>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Reveal>
    </section>
  )
}

export default CTABannerBlock;
