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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayloadClient()

  let seoDefaults: any = null
  try {
    seoDefaults = await payload.findGlobal({
      slug: 'seo-defaults',
      locale: locale as any,
    })
  } catch (error) {
    console.error('Failed to fetch seo-defaults', error)
  }

  const title = seoDefaults?.fallbackTitle || 'Boilerplate Engine'
  const description = seoDefaults?.fallbackDescription || 'Enterprise white-labeled foundation engine'
  
  let ogImageUrl = ''
  if (seoDefaults?.defaultOgImage && typeof seoDefaults.defaultOgImage === 'object' && seoDefaults.defaultOgImage.url) {
    ogImageUrl = seoDefaults.defaultOgImage.url
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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
  let siteSettings: any = null
  try {
    siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      locale: locale as any,
    })
  } catch (err) {}

  const cookieConfig = {
    enable: siteSettings?.enableCookieBanner,
    text: siteSettings?.cookieBannerText,
    policyUrl: siteSettings?.cookiePolicyUrl,
  }

  return (
    <html lang={locale} dir={dir} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">
        <OrganizationSchema />
        {siteSettings?.umamiWebsiteId && (
          <Script 
            src={siteSettings?.umamiScriptUrl || 'https://cloud.umami.is/script.js'} 
            data-website-id={siteSettings.umamiWebsiteId} 
            strategy="afterInteractive" 
          />
        )}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <PageWrapper>{children}</PageWrapper>
          <Footer />
        </NextIntlClientProvider>
        <WhatsAppFloat />
        <CookieBanner config={cookieConfig} />
      </body>
    </html>
  )
}

