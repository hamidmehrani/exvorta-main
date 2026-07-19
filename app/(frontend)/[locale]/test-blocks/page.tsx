
import React from 'react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { Page } from '@/payload-types'

export default function TestBlocksPage() {
  const mockBlocks: Page['blocks'] = [
    {
      id: 'mock-1',
      blockType: 'ctaBanner',
      label: 'Get Started Today',
      headline: 'Ready to Transform Your Business?',
      description: 'Join thousands of satisfied customers who have revolutionized their workflow.',
      primaryCTA: {
        label: 'Start Free Trial',
        url: '/signup'
      },
      secondaryCTA: {
        label: 'Contact Sales',
        url: '/contact'
      },
      guarantees: [
        { id: 'g1', text: 'No credit card required' },
        { id: 'g2', text: '14-day free trial' },
        { id: 'g3', text: 'Cancel anytime' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <main className="flex-1">
        <BlockRenderer blocks={mockBlocks} />
      </main>
    </div>
  )
}
