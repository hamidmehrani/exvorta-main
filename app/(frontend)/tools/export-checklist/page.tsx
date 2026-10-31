import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import ExportChecklistClient from './ExportChecklistClient'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    title: 'Pre-Shipment Export Documents Checklist (MENA, GCC & EU) | Exvorta',
    description:
      'Comprehensive pre-shipment export document matrix across Intra-GCC, Saudi Arabia (SABER/FASAH), Egypt (Nafeza ACID), UAE (PINT-AE), and EU CBAM trade corridors.',
    url: '/tools/export-checklist',
  })

  return {
    ...meta,
    title: 'Pre-Shipment Export Documents Checklist (MENA, GCC & EU) | Exvorta',
    description:
      'Comprehensive pre-shipment export document matrix across Intra-GCC, Saudi Arabia (SABER/FASAH), Egypt (Nafeza ACID), UAE (PINT-AE), and EU CBAM trade corridors.',
    alternates: {
      canonical: '/tools/export-checklist',
    },
    openGraph: {
      ...meta.openGraph,
      title: 'Pre-Shipment Export Documents Checklist (MENA, GCC & EU) | Exvorta',
      description:
        'Comprehensive pre-shipment export document matrix across Intra-GCC, Saudi Arabia (SABER/FASAH), Egypt (Nafeza ACID), UAE (PINT-AE), and EU CBAM trade corridors.',
      url: '/tools/export-checklist',
    },
  }
}

const checklistJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://exvorta.com/tools/export-checklist#app',
      name: 'Pre-Shipment Export Documents Checklist (MENA, GCC & EU)',
      url: 'https://exvorta.com/tools/export-checklist',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'Comprehensive pre-shipment export document matrix across Intra-GCC, Saudi Arabia (SABER/FASAH), Egypt (Nafeza ACID), UAE (PINT-AE), and EU CBAM trade corridors.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'ItemPage',
      '@id': 'https://exvorta.com/tools/export-checklist#webpage',
      url: 'https://exvorta.com/tools/export-checklist',
      name: 'Pre-Shipment Export Documents Checklist (MENA, GCC & EU) | Exvorta',
      description:
        'Comprehensive pre-shipment export document matrix across Intra-GCC, Saudi Arabia (SABER/FASAH), Egypt (Nafeza ACID), UAE (PINT-AE), and EU CBAM trade corridors.',
    },
    {
      '@type': 'Checklist',
      name: 'MENA & Cross-Border Pre-Shipment Export Document Matrix',
      description:
        'Institutional compliance checklist covering 25 export documents across 5 regulatory corridors: Intra-GCC, Saudi Arabia (SABER/FASAH), Egypt (Nafeza ACID), UAE (PINT-AE), and EU CBAM.',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Intra-GCC & Regional Trade Corridor (12-Digit GCC Tariff, GCC COO, Bayan Waybill)',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Saudi Arabia Inbound Trade Corridor (SABER PCoC/SCoC, ZATCA FASAH 12-Digit Declaration)',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Egypt Inbound Trade Corridor (Nafeza & CargoX ACI System, 19-digit ACID)',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'UAE Inbound & Compliance Corridor (Dubai Customs 12-Digit Tariff, PINT-AE E-Invoicing)',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'European Union Export Corridor (EU CBAM Installation Emissions, Accredited Verifier, ICS2 ENS)',
        },
      ],
    },
  ],
}

function ChecklistSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse py-8 font-mono text-xs text-muted" aria-hidden="true">
      <div className="border border-rule bg-surface p-6 rounded-sm mb-6 h-14" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-rule bg-surface p-5 rounded-sm h-28" />
        ))}
      </div>
      <div className="border border-rule bg-surface p-8 rounded-sm h-64" />
    </div>
  )
}

export default function ExportChecklistPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-cream text-obsidian min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(checklistJsonLd) }}
      />

      {/* Hero Section (Hidden on Print) */}
      <header className="no-print relative isolate pt-24 pb-10 md:pt-32 md:pb-14 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="TRADE COMPLIANCE INTELLIGENCE"
            title="Pre-Shipment Export Documents Checklist"
            description="Institutional pre-shipment compliance matrix across Intra-GCC, Saudi Arabia (SABER/FASAH), Egypt (Nafeza ACID), UAE (PINT-AE), and European Union (CBAM) trade corridors."
            as="h1"
            tone="light"
          />
        </div>
      </header>

      {/* Main Interactive Tool Area */}
      <main className="py-8 md:py-12 flex-1">
        <Suspense fallback={<ChecklistSkeleton />}>
          <ExportChecklistClient />
        </Suspense>
      </main>
    </div>
  )
}
