import React from 'react'
import RFQFormBlock from '@/components/blocks/RFQFormBlock'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Request for Quote',
    description:
      'Get a scoped proposal for your export website in 48 hours — share your requirements and receive architecture, timeline and pricing.',
    url: '/rfq',
  })
}

export default function RFQPage() {
  return (
    <main className="flex-1 flex flex-col w-full bg-bg">
      <RFQFormBlock blockType="rfqForm" title="Initiate Strategic Alignment." />
    </main>
  )
}
