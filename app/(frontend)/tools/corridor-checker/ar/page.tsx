import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from '@/components/ui/AppLink'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand from '@/components/ui/CtaBand'
import CorridorCheckerAr from './CorridorCheckerAr'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'محرك التحقق من مطابقة مسارات الشحن: مصر ACI والسعودية سابر | Exvorta',
    description:
      'أداة تفاعلية للتحقق من جاهزية الشحنات قبل الإبحار لمصر (نظام التسجيل المسبق للشحنات ACID عبر نافذة وCargoX) والمملكة العربية السعودية (منصة سابر، ساسو، منصة فسح).',
    alternates: {
      canonical: '/tools/corridor-checker/ar',
      languages: {
        en: '/tools/corridor-checker',
        ar: '/tools/corridor-checker/ar',
        'x-default': '/tools/corridor-checker',
      },
    },
    openGraph: {
      title: 'محرك التحقق من مطابقة مسارات الشحن: مصر ACI والسعودية سابر | Exvorta',
      description:
        'أداة تفاعلية للتحقق من جاهزية الشحنات قبل الإبحار لمصر (نظام التسجيل المسبق للشحنات ACID عبر نافذة وCargoX) والمملكة العربية السعودية (منصة سابر، ساسو، منصة فسح).',
      url: '/tools/corridor-checker/ar',
      type: 'website',
    },
  }
}

function CheckerSkeletonAr() {
  return (
    <div className="container-site animate-pulse" aria-hidden="true" dir="rtl">
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

export default function CorridorCheckerArabicPage() {
  return (
    <div dir="rtl" lang="ar" className="flex-1 flex flex-col w-full bg-cream text-obsidian">
      {/* Hero Section */}
      <section className="relative isolate pt-24 pb-12 md:pt-32 md:pb-16 border-b border-rule">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-grid opacity-40" />
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
            <SectionHeading
              eyebrow="أدوات الامتثال الجمركي والتجارة الدولية"
              title="محرك التحقق من متطلبات الشحن: مصر (ACI) والسعودية (سابر)"
              description="تحقق من استيفاء المتطلبات التنظيمية للشحنات، ودقة أرقام التسجيل المسبق ACID وشهادات سابر، وتجنب غرامات التأخير ومخاطر رفض الشحنات في الموانئ."
              as="h1"
              tone="light"
            />
            <div className="self-start md:self-auto shrink-0 pt-2">
              <Link
                href="/tools/corridor-checker"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface hover:border-obsidian text-obsidian transition-colors rounded-[4px]"
                aria-label="Switch interface to English LTR"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald" aria-hidden="true" />
                <span>English (LTR)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool Area wrapped in Suspense for static pre-rendering */}
      <main className="py-12 md:py-16">
        <Suspense fallback={<CheckerSkeletonAr />}>
          <CorridorCheckerAr />
        </Suspense>
      </main>

      {/* Section E: Lead-Gen End CTA */}
      <CtaBand
        tone="dark"
        eyebrow="مكتب الامتثال التجاري والتنظيمي"
        headline="هل تحتاج إلى دعم مباشر في إجراءات ACID عبر نافذة أو مطابقة سابر؟"
        description="يساعد خبراء إكسفورتا المصدرين والشركات الكبرى في الشرق الأوسط وشمال أفريقيا على أتمتة الامتثال الجمركي وتفادي حجز الشحنات."
        primary={{
          label: 'تواصل مع المستشار التجاري',
          href: '/contact?ref=corridor-checker-ar',
        }}
        secondary={{
          label: 'انضم إلى قائمة الانتظار',
          href: '/waitlist',
        }}
        footnote="صادر عبر إكسفورتا • Issued via Exvorta"
      />
    </div>
  )
}
