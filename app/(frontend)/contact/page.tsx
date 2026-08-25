import React from 'react'
import ContactFormBlock from '@/components/blocks/ContactFormBlock'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Contact',
    description: 'Contact Exvorta — digital infrastructure for global traders. We respond within one business day.',
    url: '/contact',
  })
}

export default function ContactPage() {
  return (
    <main className="flex-1 flex flex-col w-full bg-bg">
      <ContactFormBlock />
    </main>
  )
}
