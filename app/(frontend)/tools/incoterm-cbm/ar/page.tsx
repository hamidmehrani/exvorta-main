import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import IncotermCbmCalculatorAr from './IncotermCbmCalculatorAr'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    title: 'حاسبة الإنكوتيرمز وحجم الشحن (CBM)',
    description:
      'أداة مجانية لحساب شروط التجارة الدولية (Incoterms 2020)، ومصفوفة المسؤوليات بين البائع والمشتري، وحجم CBM، والوزن الحجمي وسعة الحاويات.',
    url: '/tools/incoterm-cbm/ar',
  })

  return {
    ...meta,
    alternates: {
      canonical: '/tools/incoterm-cbm/ar',
      languages: {
        en: '/tools/incoterm-cbm',
        ar: '/tools/incoterm-cbm/ar',
        'x-default': '/tools/incoterm-cbm',
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

export default function IncotermCbmArabicPage() {
  return (
    <div dir="rtl" lang="ar" className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="أدوات التجارة"
            title="حاسبة الإنكوتيرمز وحجم الشحن (CBM)"
            description="احسب حجم البضائع، وقارن التزامات البائع والمشتري وفقاً لقواعد Incoterms 2020، وحدد الوزن الخاضع للرسوم، وقدّر سعة الحاويات في الوقت الفعلي."
            as="h1"
            tone="light"
          />
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <div className="py-12 md:py-16">
        <Suspense fallback={<CalculatorSkeleton />}>
          <IncotermCbmCalculatorAr />
        </Suspense>
      </div>

      {/* Section E: Lead-Gen End CTA */}
      <CtaBand
        tone="dark"
        eyebrow="استشارات التجارة للمؤسسات"
        headline="هل تخطط لشحنات معقدة أو تحتاج لحلول جمركية مخصصة؟"
        description="تربط إكسفورتا المصدرين ووكلاء الشحن العالميين بأنظمة الامتثال التجاري والبيانات الذكية المؤتمتة."
        primary={{
          label: 'تواصل مع المستشار التجاري',
          href: '/contact?ref=incoterm-cbm-ar',
        }}
        secondary={{
          label: 'انضم إلى قائمة انتظار إكسفورتا',
          href: '/waitlist',
        }}
        footnote="صادر عبر إكسفورتا • Issued via Exvorta"
      />
    </div>
  )
}
