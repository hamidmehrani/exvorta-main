'use client'

import React from 'react'
import dynamic from 'next/dynamic'

class BlockErrorBoundary extends React.Component<{children: React.ReactNode, blockType: string}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, blockType: string}) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error(`Error in block ${this.props.blockType}:`, error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-200 text-red-600 m-4 rounded">
          Block failed: {this.props.blockType}
        </div>
      )
    }
    return this.props.children
  }
}

const LoadingPlaceholder = () => <div className="h-[50vh] w-full bg-surface animate-pulse" />

const blockComponents: Record<string, any> = {
  hero: dynamic(() => import('./HeroBlock').then(m => m.default || m.HeroBlock), { ssr: false, loading: LoadingPlaceholder }),
  pricing: dynamic(() => import('./PricingBlock').then(m => m.default || m.PricingBlock), { ssr: false, loading: LoadingPlaceholder }),
  contactForm: dynamic(() => import('./ContactFormBlock').then(m => m.default || m.ContactFormBlock), { ssr: false, loading: LoadingPlaceholder }),
  featureGrid: dynamic(() => import('./FeatureGridBlock').then(m => m.default || m.FeatureGridBlock), { ssr: false, loading: LoadingPlaceholder }),
  cta: dynamic(() => import('./CTABlock').then(m => m.default || m.CTABlock), { ssr: false, loading: LoadingPlaceholder }),
  ctaBanner: dynamic(() => import('./CTABannerBlock').then(m => m.default || m.CTABannerBlock), { ssr: false, loading: LoadingPlaceholder }),
  faq: dynamic(() => import('./FAQBlock').then(m => m.default || m.FAQBlock), { ssr: false, loading: LoadingPlaceholder }),
  marquee: dynamic(() => import('./MarqueeBlock').then(m => m.default || m.MarqueeBlock), { ssr: false, loading: LoadingPlaceholder }),
  process: dynamic(() => import('./ProcessBlock').then(m => m.default || m.ProcessBlock), { ssr: false, loading: LoadingPlaceholder }),
  richText: dynamic(() => import('./RichTextBlock').then(m => m.default || m.RichTextBlock), { ssr: false, loading: LoadingPlaceholder }),
  stats: dynamic(() => import('./StatsBlock').then(m => m.default || m.StatsBlock), { ssr: false, loading: LoadingPlaceholder }),
  testimonialBlock: dynamic(() => import('./TestimonialBlock').then(m => m.default || m.TestimonialBlock), { ssr: false, loading: LoadingPlaceholder }),
  video: dynamic(() => import('./VideoBlock').then(m => m.default || m.VideoBlock), { ssr: false, loading: LoadingPlaceholder }),
  portfolioArchive: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false, loading: LoadingPlaceholder }),
  portfolio: dynamic(() => import('./PortfolioArchiveBlock').then(m => m.default || m.PortfolioArchiveBlock), { ssr: false, loading: LoadingPlaceholder }),
  productShowcase: dynamic(() => import('./ProductShowcaseBlock').then(m => m.default || m.ProductShowcaseBlock), { ssr: false, loading: LoadingPlaceholder }),
  roadmap: dynamic(() => import('./RoadmapBlock').then(m => m.default || m.RoadmapBlock), { ssr: false, loading: LoadingPlaceholder }),
  ecosystem: dynamic(() => import('./EcosystemBlock').then(m => m.default || m.EcosystemBlock), { ssr: false, loading: LoadingPlaceholder }),
  founder: dynamic(() => import('./FounderBlock').then(m => m.default || m.FounderBlock), { ssr: false, loading: LoadingPlaceholder }),
  vision: dynamic(() => import('./VisionBlock').then(m => m.default || m.VisionBlock), { ssr: false, loading: LoadingPlaceholder }),
  thesis: dynamic(() => import('./ThesisBlock').then(m => m.default || m.ThesisBlock), { ssr: false, loading: LoadingPlaceholder }),
  waitlistForm: dynamic(() => import('./WaitlistFormBlock').then(m => m.default || m.WaitlistFormBlock), { ssr: false, loading: LoadingPlaceholder }),
  rfqForm: dynamic(() => import('./RFQFormBlock').then(m => m.default || m.RFQFormBlock), { ssr: false, loading: LoadingPlaceholder }),
}

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
        const key = block.id || index;
        const Comp = blockComponents[block.blockType];
        
        if (!Comp) {
          return (
            <div key={key} className="p-8 border border-dashed border-danger text-danger text-center my-4 rounded-lg bg-surface">
              <strong>Warning:</strong> Block type <code>{block.blockType}</code> is missing a component renderer.
            </div>
          )
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
