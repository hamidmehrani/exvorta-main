import React from 'react'
import HeroBlock from './HeroBlock'
import PricingBlock from './PricingBlock'
import ContactFormBlock from './ContactFormBlock'
import FeatureGridBlock from './FeatureGridBlock'
import CTABlock from './CTABlock'
import CTABannerBlock from './CTABannerBlock'
import FAQBlock from './FAQBlock'
import MarqueeBlock from './MarqueeBlock'
import ProcessBlock from './ProcessBlock'
import RichTextBlock from './RichTextBlock'
import StatsBlock from './StatsBlock'
import TestimonialBlock from './TestimonialBlock'
import VideoBlock from './VideoBlock'

import { Page } from '@/payload-types'

type BlockType = NonNullable<Page['blocks']>[number]

interface BlockRendererProps {
  blocks?: BlockType[] | null
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || index;
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} {...block} />
          case 'pricing':
            return <PricingBlock key={key} {...block} />
          case 'contactForm':
            return <ContactFormBlock key={key} {...block} />
          case 'featureGrid':
            return <FeatureGridBlock key={key} {...block} />
          case 'cta':
            return <CTABlock key={key} {...block} />
          case 'ctaBanner':
            return <CTABannerBlock key={key} {...block} />
          case 'faq':
            return <FAQBlock key={key} {...block} />
          case 'marquee':
            return <MarqueeBlock key={key} {...block} />
          case 'process':
            return <ProcessBlock key={key} {...block} />
          case 'richText':
            return <RichTextBlock key={key} {...block} />
          case 'stats':
            return <StatsBlock key={key} {...block} />
          case 'testimonialBlock':
            return <TestimonialBlock key={key} {...block} />
          case 'video':
            return <VideoBlock key={key} {...block} />
          default:
            return (
              <div key={key} className="p-8 border border-dashed border-danger text-danger text-center my-4 rounded-lg bg-surface">
                <strong>Warning:</strong> Block type <code>{block.blockType}</code> is missing a component renderer.
              </div>
            )
        }
      })}
    </>
  )
}

export default BlockRenderer
