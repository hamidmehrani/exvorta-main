import React from 'react'
import WaitlistFormBlock from '@/components/blocks/WaitlistFormBlock'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'

export const metadata: Metadata = {
  title: 'Waitlist',
  description: 'Join the waitlist for the Exvorta Suite.',
}

export default function WaitlistPage() {
  return (
    <main className="flex-1 flex flex-col w-full bg-bg">
      <WaitlistFormBlock blockType="waitlistForm" source="waitlist_page" />
    </main>
  )
}
