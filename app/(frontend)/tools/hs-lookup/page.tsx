import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import HsConverterTool from './HsConverterTool'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    title: 'GCC HS 8→12-Digit Converter & Duty Lookup',
    description:
      'Free customs tariff calculator converting 8-digit GCC codes to 12-digit UAE & Saudi national tariff lines with real-time duty, VAT, and regulatory agency lookup.',
    url: '/tools/hs-lookup',
  })

  return {
    ...meta,
    alternates: {
      canonical: '/tools/hs-lookup',
      languages: {
        en: '/tools/hs-lookup',
        ar: '/tools/hs-lookup/ar',
        'x-default': '/tools/hs-lookup',
      },
    },
  }
}

function ToolSkeleton() {
  return (
    <div className="container-site animate-pulse" aria-hidden="true">
      <div className="frame border border-rule bg-surface p-6 md:p-8 mb-8">
        <div className="h-6 w-48 bg-surface-2 rounded mb-4" />
        <div className="h-10 w-96 bg-surface-2 rounded mb-6" />
        <div className="h-12 bg-surface-2 rounded mb-4" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-5 frame border border-rule bg-surface p-6 h-96 bg-surface-2 rounded" />
        <div className="lg:col-span-7 frame border border-rule bg-surface p-6 h-96 bg-surface-2 rounded" />
      </div>
      <div className="frame border border-rule bg-surface p-6 md:p-10 h-64 bg-surface-2 rounded" />
    </div>
  )
}

export default function HsLookupPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="TRADE TOOLS"
            title="GCC HS 8→12-Digit Converter & Duty Lookup"
            description="Convert 8-digit GCC unified tariff codes into 12-digit national lines for UAE and Saudi Arabia. Calculate customs duties, VAT, and inspect regulatory authority requirements in real time."
            as="h1"
            tone="light"
          />
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <main className="py-12 md:py-16">
        <Suspense fallback={<ToolSkeleton />}>
          <HsConverterTool />
        </Suspense>
      </main>

      {/* Lead-Gen CTA Band */}
      <CtaBand
        tone="dark"
        eyebrow="ENTERPRISE TRADE ADVISORY"
        headline="Need classification assistance or binding tariff rulings?"
        description="Exvorta connects cross-border traders and forwarders with automated customs compliance, HS classification audits, and regulatory clearance."
        primary={{
          label: 'Consult Trade Advisory',
          href: '/contact?ref=hs-lookup',
        }}
        secondary={{
          label: 'Request RFQ',
          href: '/rfq',
        }}
      />
    </div>
  )
}
