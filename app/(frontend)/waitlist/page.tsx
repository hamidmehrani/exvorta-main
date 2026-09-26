import React from 'react'
import WaitlistFormBlock from '@/components/blocks/WaitlistFormBlock'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Join the Waitlist',
    description:
      'Reserve your place in the Exvorta Suite rollout — one operating system for web, docs, tracking, CRM and trade intel.',
    url: '/waitlist',
  })
}

export default function WaitlistPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-bg">
      <WaitlistFormBlock blockType="waitlistForm" source="waitlist_page" />
    </div>
  )
}
