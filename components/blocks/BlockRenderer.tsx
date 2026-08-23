'use client'

import React from 'react'
import dynamic from 'next/dynamic'

import HeroBlock from './HeroBlock'
import FeatureGridBlock from './FeatureGridBlock'
import FeatureShowcaseBlock from './FeatureShowcaseBlock'
import StatsBlock from './StatsBlock'
import CTABlock from './CTABlock'
import CTABannerBlock from './CTABannerBlock'
import RichTextBlock from './RichTextBlock'
import VideoBlock from './VideoBlock'
import ProcessBlock from './ProcessBlock'
import FAQBlock from './FAQBlock'
import PricingBlock from './PricingBlock'
import TestimonialBlock from './TestimonialBlock'
import ThesisBlock from './ThesisBlock'
import VisionBlock from './VisionBlock'
import FounderBlock from './FounderBlock'
import GlobalPresenceBlock from './GlobalPresenceBlock'
import PortfolioShowcaseBlock from './PortfolioShowcaseBlock'
import TeamShowcaseBlock from './TeamShowcaseBlock'
import ContactFormBlock from './ContactFormBlock'
import RFQFormBlock from './RFQFormBlock'
import WaitlistFormBlock from './WaitlistFormBlock'
import RoadmapBlock from './RoadmapBlock'
import ProblemStatementBlock from './ProblemStatementBlock'

// ── Loading skeleton ──────────────────────────────────────────────────────────
const LoadingPlaceholder = () => <div className="h-[50vh] w-full bg-[#FAFAF8] animate-pulse" />
const LoadingThin = () => <div className="h-16 w-full bg-[#FAFAF8] animate-pulse" />

// ── Block component registry ──────────────────────────────────────────────────
// Only GSAP heavy components use dynamic({ ssr: false })
const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  featureGrid: FeatureGridBlock,
  featureShowcase: FeatureShowcaseBlock,
  stats: StatsBlock,
  cta: CTABlock,
  ctaBanner: CTABannerBlock,
  richText: RichTextBlock,
  video: VideoBlock,
  process: ProcessBlock,
  processBlock: ProcessBlock,
  faq: FAQBlock,
  faqBlock: FAQBlock,
  pricing: PricingBlock,
  pricingBlock: PricingBlock,
  testimonialBlock: TestimonialBlock,
  testimonials: TestimonialBlock,
  thesis: ThesisBlock,
  vision: VisionBlock,
  founder: FounderBlock,
  globalPresence: GlobalPresenceBlock,
  portfolioShowcase: PortfolioShowcaseBlock,
  teamShowcase: TeamShowcaseBlock,
  contactForm: ContactFormBlock,
  rfqForm: RFQFormBlock,
  waitlistForm: WaitlistFormBlock,
  roadmap: RoadmapBlock,
  problemStatement: ProblemStatementBlock,

  // GSAP Heavy - MUST BE DYNAMIC SSR:FALSE
  portfolioArchive: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false, loading: LoadingPlaceholder }),
  portfolio: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false, loading: LoadingPlaceholder }),
  productShowcase: dynamic(() => import('./ProductShowcaseBlock').then(m => m.default || m.ProductShowcaseBlock), { ssr: false, loading: LoadingPlaceholder }),
  ecosystem: dynamic(() => import('./EcosystemBlock').then(m => m.default || m.EcosystemBlock), { ssr: false, loading: LoadingPlaceholder }),
  marquee: dynamic(() => import('./MarqueeBlock').then(m => m.default || m.MarqueeBlock), { ssr: false, loading: LoadingThin }),
}

// ── Error Boundary ─────────────────────────────────────────────────────────────
class BlockErrorBoundary extends React.Component<
  { children: React.ReactNode; blockType: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; blockType: string }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error(`[BlockRenderer] Error in block "${this.props.blockType}":`, error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      // Never break the page — silently render nothing
      return null
    }
    return this.props.children
  }
}

// ── Main Renderer ──────────────────────────────────────────────────────────────
type BlockType = any

interface BlockRendererProps {
  blocks?: BlockType[] | null
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || index
        const Comp = blockComponents[block.blockType]

        if (!Comp) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Available blockTypes:', Object.keys(blockComponents), 'Incoming block:', block.blockType);
            console.warn(
              `[BlockRenderer] No component registered for block type: "${block.blockType}". ` +
              `Available: ${Object.keys(blockComponents).join(', ')}`
            )
          }
          // Silently skip — NEVER show dashed warning boxes in any environment
          return null
        }

        return (
          <BlockErrorBoundary key={key} blockType={block.blockType}>
            <Comp {...block} />
          </BlockErrorBoundary>
        )
      })}
    </>
  )
}

export default BlockRenderer
