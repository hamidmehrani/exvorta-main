import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import UaeEinvoicingCalculator from './UaeEinvoicingCalculator'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    title: 'UAE E-Invoicing (PINT-AE) Readiness Assessment',
    description:
      'Assess your enterprise compliance readiness for the UAE Peppol 5-corner DCTCE e-invoicing mandate under Ministerial Decisions No. 243 & 244 of 2025 and Resolution No. 66 of 2026.',
    url: '/tools/uae-einvoicing',
  })

  return {
    ...meta,
    alternates: {
      canonical: '/tools/uae-einvoicing',
      languages: {
        en: '/tools/uae-einvoicing',
        ar: '/tools/uae-einvoicing/ar',
        'x-default': '/tools/uae-einvoicing',
      },
    },
  }
}

function CalculatorSkeleton() {
  return (
    <div className="container-site animate-pulse" aria-hidden="true">
      <div className="frame border border-rule bg-surface p-6 md:p-10 mb-12">
        <div className="h-6 w-48 bg-surface-2 rounded mb-4" />
        <div className="h-10 w-96 bg-surface-2 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-2 rounded" />
          ))}
        </div>
        <div className="h-48 bg-surface-2 rounded" />
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

export default function UaeEinvoicingPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="REGULATORY COMPLIANCE TOOLS"
            title="UAE E-Invoicing (PINT-AE) Readiness Assessment"
            description="Evaluate your organization's alignment with the UAE Peppol 5-Corner Continuous Transaction Control mandate. Review statutory ASP deadlines, ERP schema readiness, and penalty avoidance roadmaps."
            as="h1"
            tone="light"
          />
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <main className="py-12 md:py-16">
        <Suspense fallback={<CalculatorSkeleton />}>
          <UaeEinvoicingCalculator />
        </Suspense>
      </main>

      {/* Section: Enterprise Compliance Advisory CTA */}
      <CtaBand
        tone="dark"
        eyebrow="ENTERPRISE TAX & E-INVOICING ADVISORY"
        headline="Facing tight statutory ASP deadlines or complex multi-entity ERP architectures?"
        description="Exvorta equips enterprise finance teams with automated Peppol PINT-AE data pipelines, validated master data architectures, and accredited ASP selection advisory."
        primary={{
          label: 'Schedule Compliance Advisory',
          href: '/contact?ref=uae-einvoicing',
        }}
        secondary={{
          label: 'Join Enterprise Compliance Pilot',
          href: '/waitlist',
        }}
        footnote="Sourced from UAE MoF Ministerial Decisions No. 243 & 244 of 2025 and Ministerial Resolution No. 66 of 2026 • Verified 2026-10-27"
      />
    </div>
  )
}
