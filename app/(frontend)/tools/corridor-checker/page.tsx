import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from '@/components/ui/AppLink'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import CorridorChecker from './CorridorChecker'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Egypt ACI & KSA SABER Corridor Compliance Engine | Exvorta',
    description:
      'Interactive pre-shipment customs compliance checker for Egypt (Nafeza ACID, CargoX) and Saudi Arabia (SABER, SASO, FASAH). Avoid port demurrage and shipment rejection.',
    alternates: {
      canonical: '/tools/corridor-checker',
      languages: {
        en: '/tools/corridor-checker',
        ar: '/tools/corridor-checker/ar',
        'x-default': '/tools/corridor-checker',
      },
    },
    openGraph: {
      title: 'Egypt ACI & KSA SABER Corridor Compliance Engine | Exvorta',
      description:
        'Interactive pre-shipment customs compliance checker for Egypt (Nafeza ACID, CargoX) and Saudi Arabia (SABER, SASO, FASAH). Avoid port demurrage and shipment rejection.',
      url: '/tools/corridor-checker',
      type: 'website',
    },
  }
}

function CheckerSkeleton() {
  return (
    <div className="container-site animate-pulse" aria-hidden="true">
      <div className="frame border border-rule bg-surface p-6 md:p-10 mb-8">
        <div className="h-6 w-48 bg-surface-2 rounded mb-4" />
        <div className="h-10 w-96 bg-surface-2 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="h-28 bg-surface-2 rounded" />
          <div className="h-28 bg-surface-2 rounded" />
        </div>
        <div className="h-32 bg-surface-2 rounded" />
      </div>
      <div className="frame border border-rule bg-surface p-6 md:p-10 mb-8">
        <div className="h-8 w-64 bg-surface-2 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-2 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CorridorCheckerPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
            <SectionHeading
              eyebrow="TRADE COMPLIANCE TOOLS"
              title="Egypt ACI & KSA SABER Corridor Engine"
              description="Verify pre-shipment regulatory readiness, validate 19-digit ACID & SABER certificates, check mandatory customs documents, and eliminate clearance hold risks."
              as="h1"
              tone="light"
            />
            <div className="self-start md:self-auto shrink-0 pt-2">
              <Link
                href="/tools/corridor-checker/ar"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface hover:border-obsidian text-obsidian transition-colors rounded-[4px]"
                aria-label="Switch interface to Arabic RTL"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald" aria-hidden="true" />
                <span>العربية (RTL)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <main className="py-12 md:py-16">
        <Suspense fallback={<CheckerSkeleton />}>
          <CorridorChecker />
        </Suspense>
      </main>

      {/* Section E: Lead-Gen End CTA */}
      <CtaBand
        tone="dark"
        eyebrow="REGULATORY TRADE DESK"
        headline="Need direct assistance with Nafeza ACID or SABER conformity clearance?"
        description="Exvorta trade specialists assist high-volume Middle East & North Africa cross-border shippers with compliance automation."
        primary={{
          label: 'Contact Trade Advisory',
          href: '/contact?ref=corridor-checker',
        }}
        secondary={{
          label: 'Join Exvorta Waitlist',
          href: '/waitlist',
        }}
      />
    </div>
  )
}
