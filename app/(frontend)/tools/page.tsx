import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Trade Tools & Calculators',
    description:
      'Institutional-grade calculation engines and compliance utilities engineered for global importers, exporters, and logistics operators.',
    url: '/tools',
  })
}

export default function ToolsIndexPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="TRADE TOOLS"
            title="Global Trade Calculators"
            description="Institutional-grade utilities for container utilization, Incoterms 2020 obligations, volumetric weight, and customs compliance."
            as="h1"
            tone="light"
          />
        </div>
      </section>

      {/* Tools Catalog Grid */}
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/tools/incoterm-cbm"
            className="card-elite p-8 flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
            aria-label="Incoterm & CBM Calculator tool"
          >
            <div>
              <div className="eyebrow mb-4">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                TOOL 01
              </div>
              <h2 className="font-serif text-2xl font-bold mb-3 text-obsidian">
                Incoterm &amp; CBM Calculator
              </h2>
              <p className="text-sm font-light text-muted leading-relaxed mb-6">
                Calculate cargo volume, compare Incoterms 2020 seller vs buyer obligations, determine chargeable weight, and estimate container capacity in real time.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald font-semibold group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform">
              Launch Calculator <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Enterprise CTA */}
      <CtaBand
        tone="dark"
        eyebrow="ENTERPRISE TRADE ADVISORY"
        headline="Need custom trade tools or ERP integration?"
        description="Exvorta builds high-performance digital infrastructure for elite global traders."
        primary={{
          label: 'Request Proposal',
          href: '/rfq',
        }}
        secondary={{
          label: 'Contact Advisory',
          href: '/contact',
        }}
      />
    </div>
  )
}
