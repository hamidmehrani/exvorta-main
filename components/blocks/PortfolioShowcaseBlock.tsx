import React from 'react'
import { AnimatedSection, AnimatedButton } from '@/components/ui/Reveal';
import type { Page } from '@/payload-types'

type PortfolioShowcaseBlockProps = Extract<NonNullable<Page['layout']>[0], { blockType: 'portfolioShowcase' }>;

export const PortfolioShowcaseBlock: React.FC<PortfolioShowcaseBlockProps> = ({
  sectionLabel,
  sectionTitle,
  description,
  ctaText,
  ctaUrl,
}) => {
  return (
    <AnimatedSection className="w-full bg-white py-32 px-6 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 flex flex-col items-start">
            {sectionLabel && (
              <span className="text-xs font-mono tracking-widest text-black/40 uppercase mb-6">
                [{sectionLabel}]
              </span>
            )}
            {sectionTitle && (
              <h2 className="text-4xl md:text-5xl font-serif text-black leading-tight mb-6">
                {sectionTitle}
              </h2>
            )}
            {description && (
              <p className="text-lg text-black/60 mb-10 max-w-md">
                {description}
              </p>
            )}
            {ctaText && ctaUrl && (
              <AnimatedButton className="bg-[#0D0D0D] text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-black transition-colors rounded-none" href={ctaUrl}>
                {ctaText} ↗
              </AnimatedButton>
            )}
          </div>
          <div className="md:col-span-7">
            <div className="w-full aspect-video border border-black bg-[#E5E5E5] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5 mix-blend-multiply"></div>
              <span className="text-xs font-mono text-black/30 tracking-widest uppercase relative z-10">[ CINEMATIC B&amp;W IMAGE PLACEHOLDER ]</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default PortfolioShowcaseBlock
