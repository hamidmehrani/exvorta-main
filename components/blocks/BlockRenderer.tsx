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

const LoadingPlaceholder = () => <div className="h-[400px] w-full bg-[#FAFAF8] animate-pulse" />
const LoadingThin = () => <div className="h-16 w-full bg-[#FAFAF8] animate-pulse" />

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
  problem: ProblemStatementBlock,
  firm: dynamic(() => import('./FirmBlock').then(m => m.default || m.FirmBlock), { ssr: false, loading: LoadingPlaceholder }),
  firmBlock: dynamic(() => import('./FirmBlock').then(m => m.default || m.FirmBlock), { ssr: false, loading: LoadingPlaceholder }),
  portfolioArchive: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false, loading: LoadingPlaceholder }),
  portfolio: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false, loading: LoadingPlaceholder }),
  productShowcase: dynamic(() => import('./ProductShowcaseBlock').then(m => m.default || m.ProductShowcaseBlock), { ssr: false, loading: LoadingPlaceholder }),
  ecosystem: dynamic(() => import('./EcosystemBlock').then(m => m.default || m.EcosystemBlock), { ssr: false, loading: LoadingPlaceholder }),
  marquee: dynamic(() => import('./MarqueeBlock').then(m => m.default || m.MarqueeBlock), { ssr: false, loading: LoadingThin }),
}

class BlockErrorBoundary extends React.Component<{ children: React.ReactNode; blockType: string }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(e: any, info: any) { console.error(`Block ${this.props.blockType} failed`, e, info) }
  render() { if (this.state.hasError) return null; return this.props.children }
}

export const BlockRenderer: React.FC<{ blocks?: any[] }> = ({ blocks }) => {
  if (!blocks?.length) return null
  return <>{blocks.map((block, i) => {
    const type = block.blockType || block._blockType
    const Comp = blockComponents[type]
    if (!Comp) { console.warn(`Missing renderer for ${type}`); return null }
    return <BlockErrorBoundary key={block.id || i} blockType={type}><Comp {...block} /></BlockErrorBoundary>
  })}</>
}

export default BlockRenderer
