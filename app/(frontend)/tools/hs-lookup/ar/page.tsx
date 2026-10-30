import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import HsConverterToolAr from './HsConverterToolAr'

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    title: 'محول بنود النظام المنسق الخليجي (8 إلى 12 رقماً) وحاسبة الرسوم الجمركية',
    description:
      'أداة مجانية لتحويل رموز النظام المنسق الموحدة (8 أرقام) إلى بنود التعرفة الوطنية الممتدة (12 رقماً) في الإمارات والسعودية مع حساب الرسوم الجمركية وضريبة القيمة المضافة.',
    url: '/tools/hs-lookup/ar',
  })

  return {
    ...meta,
    alternates: {
      canonical: '/tools/hs-lookup/ar',
      languages: {
        en: '/tools/hs-lookup',
        ar: '/tools/hs-lookup/ar',
        'x-default': '/tools/hs-lookup',
      },
    },
  }
}

function ToolSkeletonAr() {
  return (
    <div dir="rtl" lang="ar" className="container-site animate-pulse" aria-hidden="true">
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

export default function HsLookupArabicPage() {
  return (
    <div dir="rtl" lang="ar" className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <SectionHeading
            eyebrow="أدوات التجارة"
            title="محول بنود النظام المنسق الخليجي (8 إلى 12 رقماً) وحاسبة الرسوم الجمركية"
            description="حول رموز النظام المنسق الموحدة لدول مجلس التعاون (8 أرقام) إلى بنود التعرفة الوطنية الممتدة (12 رقماً) لدولة الإمارات والمملكة العربية السعودية. احسب الرسوم الجمركية وضريبة القيمة المضافة، واطلع على متطلبات الجهات التنظيمية في الوقت الفعلي."
            as="h1"
            tone="light"
          />
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <main className="py-12 md:py-16">
        <Suspense fallback={<ToolSkeletonAr />}>
          <HsConverterToolAr />
        </Suspense>
      </main>

      {/* Arabic Lead-Gen CTA Band */}
      <CtaBand
        tone="dark"
        eyebrow="استشارات التجارة للمؤسسات"
        headline="هل تحتاج إلى مساعدة في تصنيف البنود أو قرارات جمركية ملزمة؟"
        description="تربط إكسفورتا التجار الدوليين ووكلاء الشحن العالميين بأنظمة الامتثال الجمركي المؤتمت، وتدقيق تصنيفات النظام المنسق، والتخليص التنظيمي."
        primary={{
          label: 'استشر المستشار التجاري',
          href: '/contact?ref=hs-lookup',
        }}
        secondary={{
          label: 'طلب عرض أسعار (RFQ)',
          href: '/rfq',
        }}
        footnote="صادر عبر إكسفورتا • Issued via Exvorta"
      />
    </div>
  )
}
