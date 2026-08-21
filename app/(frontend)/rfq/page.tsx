import React from 'react'
import RFQFormBlock from '@/components/blocks/RFQFormBlock'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'

export const metadata: Metadata = {
  title: 'Request for Quote',
  description: 'Submit your operational requirements.',
}

export default function RFQPage() {
  return (
    <main className="flex-1 flex flex-col w-full bg-bg">
      <RFQFormBlock blockType="rfqForm" title="Initiate Strategic Alignment." />
    </main>
  )
}
