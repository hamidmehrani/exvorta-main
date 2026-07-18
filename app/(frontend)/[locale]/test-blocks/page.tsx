/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

export default function TestBlocksPage() {
  const mockBlocks = [
    {
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
        { text: 'No credit card required' },
        { text: '14-day free trial' },
        { text: 'Cancel anytime' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <main className="flex-1">
        <BlockRenderer blocks={mockBlocks as any} />
      </main>
    </div>
  )
}
