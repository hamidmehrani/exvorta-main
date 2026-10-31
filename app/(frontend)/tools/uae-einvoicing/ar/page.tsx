import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import UaeEinvoicingCalculatorAr from './UaeEinvoicingCalculatorAr'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    title: 'تقييم الجاهزية للفوترة الإلكترونية في الإمارات (PINT-AE)',
    description:
      'أداة تقييم الامتثال لمنظومة الفوترة الإلكترونية ونظام بيبول الخماسي (Peppol 5-Corner DCTCE) وفقاً للقرارات الوزارية 243 و244 لسنة 2025 والقرار 66 لسنة 2026.',
    url: '/tools/uae-einvoicing/ar',
  })

  return {
    ...meta,
    alternates: {
      canonical: '/tools/uae-einvoicing/ar',
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

export default function UaeEinvoicingArabicPage() {
  return (
    <div dir="rtl" lang="ar" className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="أدوات الامتثال واللوائح التنظيمية"
            title="تقييم الجاهزية للفوترة الإلكترونية في الإمارات (PINT-AE)"
            description="قيّم مدى جاهزية مؤسستك لنظام الفوترة الإلكترونية الإماراتي المستند إلى شبكة بيبول الخماسية (Peppol 5-Corner DCTCE). راجع المواعيد النهائية لتعيين مزودي الخدمة المعتمدين (ASP)، وجاهزية أنظمة تخطيط الموارد، وتفادي الغرامات المالية."
            as="h1"
            tone="light"
          />
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <main className="py-12 md:py-16">
        <Suspense fallback={<CalculatorSkeleton />}>
          <UaeEinvoicingCalculatorAr />
        </Suspense>
      </main>

      {/* Section: Enterprise Compliance Advisory CTA */}
      <CtaBand
        tone="dark"
        eyebrow="استشارات الامتثال الضريبي والفوترة الإلكترونية للمؤسسات"
        headline="هل تواجه مواعيد نهائية وشيكة لتعيين مزود الخدمة المعتمد أو بنية ERP معقدة متعددة الكيانات؟"
        description="توفر إكسفورتا للفرق المالية في المؤسسات خطوط تدفق مؤتمتة لبيانات PINT-AE وفق معيار بيبول، وهيكلة معتمدة للبيانات الأساسية، واستشارات لاختيار مزودي الخدمة المعتمدين."
        primary={{
          label: 'احجز استشارة للامتثال الضريبي',
          href: '/contact?ref=uae-einvoicing-ar',
        }}
        secondary={{
          label: 'انضم إلى المرحلة التجريبية للمؤسسات',
          href: '/waitlist',
        }}
        footnote="مستند إلى القرارات الوزارية لدولة الإمارات رقم 243 و244 لسنة 2025 والقرار الوزاري رقم 66 لسنة 2026 • موثق ومطابق 2026-10-27"
      />
    </div>
  )
}
