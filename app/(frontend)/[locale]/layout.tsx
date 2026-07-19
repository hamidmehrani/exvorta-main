import React from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import Script from 'next/script'
import '../../globals.css'

import { getPayloadClient } from '@/lib/payload'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'
import CookieBanner from '@/components/legal/CookieBanner'
import type { SeoDefault, SiteSetting, Analytic } from '@/payload-types'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { cookies } from 'next/headers'
import SkipToContent from '@/components/legal/SkipToContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayloadClient()

  let seoDefaults: SeoDefault | null = null
  try {
    seoDefaults = await payload.findGlobal({
      slug: 'seo-defaults',
      locale: locale as "en" | "ar" | "fa",
    }) as SeoDefault
  } catch (error) {
    console.error('Failed to fetch seo-defaults', error)
  }

  const title = seoDefaults?.fallbackTitle || 'Boilerplate Engine'
  const description = seoDefaults?.fallbackDescription || 'Enterprise white-labeled foundation engine'
  
  let ogImageUrl = ''
  if (seoDefaults?.defaultOgImage && typeof seoDefaults.defaultOgImage === 'object' && seoDefaults.defaultOgImage.url) {
    ogImageUrl = seoDefaults.defaultOgImage.url
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    openGraph: {
      title,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: './',
      languages: {
        'en': '/en',
        'ar': '/ar',
        'fa': '/fa',
      },
    },
  }
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  const isRtl = locale === 'ar' || locale === 'fa'
  const dir = isRtl ? 'rtl' : 'ltr'

  // Fetch SiteSettings for Cookie Banner
  const payload = await getPayloadClient()
  let siteSettings: SiteSetting | null = null
  let analyticsConfig: Analytic | null = null
  try {
    siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      locale: locale as "en" | "ar" | "fa",
    }) as SiteSetting
    analyticsConfig = await payload.findGlobal({
      slug: 'analytics',
    }) as Analytic
  } catch {}

  const cookieStore = await cookies()
  const cookieConfig = {
    enable: siteSettings?.enableCookieBanner,
    text: siteSettings?.cookieBannerText,
    policyUrl: siteSettings?.cookiePolicyUrl,
    hasResponded: cookieStore.has('cookie-consent'),
  }

  const hasConsent = cookieStore.get('cookie-consent')?.value === 'accepted'

  return (
    <html lang={locale} dir={dir} className="h-full antialiased light" data-theme="light">
      <head>
        <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Vazirmatn-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <SkipToContent />
        <OrganizationSchema />
        {hasConsent && analyticsConfig?.gaId && <GoogleAnalytics gaId={analyticsConfig.gaId} />}
        {hasConsent && analyticsConfig?.gtmId && <GoogleTagManager gtmId={analyticsConfig.gtmId} />}
        {siteSettings?.umamiWebsiteId && (
          <Script 
            src={siteSettings?.umamiScriptUrl || 'https://cloud.umami.is/script.js'} 
            data-website-id={siteSettings.umamiWebsiteId} 
            strategy="afterInteractive" 
          />
        )}
        {siteSettings?.maintenanceMode ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-text">
            <div className="text-center p-12 border border-border rounded shadow-2xl max-w-xl w-full bg-surface relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <h1 className="text-5xl font-bold text-text mb-4 tracking-tighter opacity-90">System Under Maintenance</h1>
              <p className="text-muted mb-8 text-lg">We are currently updating our systems. Please check back shortly.</p>
            </div>
          </div>
        ) : (
          <>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Header />
              <PageWrapper>{children}</PageWrapper>
              <Footer />
            </NextIntlClientProvider>
            <WhatsAppFloat />
            <CookieBanner config={cookieConfig} />
          </>
        )}
      </body>
    </html>
  )
}

