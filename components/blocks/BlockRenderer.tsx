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
// Block components declare specific prop interfaces, but the renderer receives
// untyped CMS layout data by design — entries are cast at lookup time.
const blockComponents: Record<string, unknown> = {
  hero: HeroBlock, featureGrid: FeatureGridBlock, featureShowcase: FeatureShowcaseBlock, stats: StatsBlock, cta: CTABlock, ctaBanner: CTABannerBlock, richText: RichTextBlock, video: VideoBlock,
  process: ProcessBlock, processBlock: ProcessBlock, faq: FAQBlock, faqBlock: FAQBlock, pricing: PricingBlock, pricingBlock: PricingBlock,
  testimonialBlock: TestimonialBlock, thesis: ThesisBlock, vision: VisionBlock, founder: FounderBlock, globalPresence: GlobalPresenceBlock,
  portfolioShowcase: PortfolioShowcaseBlock, teamShowcase: TeamShowcaseBlock, contactForm: ContactFormBlock, rfqForm: RFQFormBlock,
  cmsControl: dynamic(() => import('./CmsControlBlock').then(m => m.default || m.CmsControlBlock), { ssr: false }),
  waitlistForm: WaitlistFormBlock, roadmap: RoadmapBlock, problemStatement: ProblemStatementBlock,
  portfolioArchive: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false }),
  portfolio: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false }),
  productShowcase: dynamic(() => import('./ProductShowcaseBlock').then(m => m.default || m.ProductShowcaseBlock), { ssr: false }),
  ecosystem: dynamic(() => import('./EcosystemBlock').then(m => m.default || m.EcosystemBlock), { ssr: false }),
  marquee: dynamic(() => import('./MarqueeBlock').then(m => m.default || m.MarqueeBlock), { ssr: false }),
}
interface BlockData {
  blockType?: string
  _blockType?: string
  id?: string | number
  [key: string]: unknown
}

class ErrorBoundary extends React.Component<{ blockType?: string; children?: React.ReactNode }, { hasError: boolean }> { constructor(p:{blockType?: string; children?: React.ReactNode}){super(p); this.state={hasError:false}} static getDerivedStateFromError(){return{hasError:true}} componentDidCatch(e: unknown,i: unknown){console.error(e,i)} render(){ if(this.state.hasError) { if (process.env.NODE_ENV !== 'production') { return <div style={{padding:20, border:'1px solid red'}}>BLOCK CRASHED: {this.props.blockType}</div> } return null } return this.props.children } }
const BlockRenderer = ({ blocks }: { blocks?: BlockData[] }) => {
  if (!blocks?.length) return null
  return <>{blocks?.map((b,i) => {
    const type = b.blockType || b._blockType
    const Comp = (type ? blockComponents[type] : undefined) as React.FC<BlockData> | undefined
    if (!Comp) { console.warn(`MISSING ${type}`); return null }
    return <ErrorBoundary key={b.id||i} blockType={type}><Comp {...b} /></ErrorBoundary>
  })}</>
}
export default BlockRenderer
export { BlockRenderer }
