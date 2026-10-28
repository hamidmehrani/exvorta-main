import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import IncotermCbmCalculator from './IncotermCbmCalculator'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Incoterm & CBM Calculator',
    description:
      'Free international trade calculator for Incoterms 2020 responsibility matrices, CBM volume math, volumetric weight, and container fit estimation.',
    url: '/tools/incoterm-cbm',
  })
}

function CalculatorSkeleton() {
  return (
    <div className="container-site animate-pulse" aria-hidden="true">
      <div className="frame border border-rule bg-surface p-6 md:p-10 mb-12">
        <div className="h-6 w-48 bg-surface-2 rounded mb-4" />
        <div className="h-10 w-96 bg-surface-2 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="h-16 bg-surface-2 rounded" />
          ))}
        </div>
        <div className="h-64 bg-surface-2 rounded" />
      </div>
      <div className="frame border border-rule bg-surface p-6 md:p-10 mb-12">
        <div className="h-8 w-64 bg-surface-2 rounded mb-6" />
        <div className="h-32 bg-surface-2 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-2 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function IncotermCbmPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="TRADE TOOLS"
            title="Incoterm & CBM Calculator"
            description="Calculate cargo volume, compare Incoterms 2020 seller vs buyer obligations, determine chargeable weight, and estimate container capacity in real time."
            as="h1"
            tone="light"
          />
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <main className="py-12 md:py-16">
        <Suspense fallback={<CalculatorSkeleton />}>
          <IncotermCbmCalculator />
        </Suspense>
      </main>

      {/* Section E: Lead-Gen End CTA */}
      <CtaBand
        tone="dark"
        eyebrow="ENTERPRISE TRADE ADVISORY"
        headline="Planning complex shipments or need bespoke customs solutions?"
        description="Exvorta connects enterprise exporters and freight forwarders with automated compliance and intelligence."
        primary={{
          label: 'Contact Trade Advisory',
          href: '/contact?ref=incoterm-cbm',
        }}
        secondary={{
          label: 'Join Exvorta Waitlist',
          href: '/waitlist',
        }}
      />
    </div>
  )
}
