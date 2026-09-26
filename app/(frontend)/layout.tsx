import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { FramerMotionProvider } from '@/components/providers/FramerMotionProvider'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { PageTransition } from '@/components/layout/PageTransition'
import { LoadingBar } from '@/components/ui/LoadingBar'
import localFont from 'next/font/local'
import '../globals.css'

import { getCachedSiteSettings, getCachedAnalytics, getCachedWhatsappConfig } from '@/lib/payload-cache'

import type { SiteSetting, Analytics, WhatsappConfig } from '@/payload-types'
import OrganizationSchema from '@/components/seo/OrganizationSchema'

import DeferredWidgets from '@/components/layout/DeferredWidgets'
import CursorGlow from '@/components/ui/CursorGlow'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { cookies } from 'next/headers'
import SkipToContent from '@/components/legal/SkipToContent'
import { generateMeta } from '@/utils/generateMeta'
import { reportWarning } from '@/lib/error-reporting'

const inter = localFont({
  src: '../../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

const playfair = localFont({
  src: [
    { path: '../../public/fonts/PlayfairDisplay-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/PlayfairDisplay-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-playfair',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const [meta, settings] = await Promise.all([
    generateMeta(),
    getCachedSiteSettings(),
  ])

  const faviconUrl =
    settings?.favicon && typeof settings.favicon === 'object' && settings.favicon.url
      ? settings.favicon.url
      : null

  return {
    ...meta,
    icons: faviconUrl
      ? {
          icon: [{ url: faviconUrl }],
          apple: [{ url: faviconUrl }],
          shortcut: [{ url: faviconUrl }],
        }
      : meta.icons,
  }
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dir = 'ltr'

  // Fetch SiteSettings for Cookie Banner & Maintenance State in parallel using data cache
  const [siteSettings, analyticsConfig, whatsappConfig] = await Promise.all([
    getCachedSiteSettings(),
    getCachedAnalytics(),
    getCachedWhatsappConfig(),
  ])

  // Maintenance mode: completely isolate the page — hide Header, Footer, scripts, and layout chrome
  if (siteSettings?.maintenanceMode) {
    return (
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="bg-cream text-obsidian min-h-screen">
          <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-cream text-obsidian">
            <div className="text-center p-12 border-2 border-border-dark rounded-none max-w-xl w-full bg-surface relative overflow-hidden">
              <div className="absolute top-0 start-0 w-full h-2 bg-obsidian" />
              <h1 className="text-5xl font-serif font-bold text-obsidian mb-4 tracking-tighter uppercase">
                Maintenance
              </h1>
              <p className="text-obsidian/60 text-sm font-mono uppercase tracking-widest">
                We are currently updating our systems. Please check back shortly.
              </p>
            </div>
          </main>
        </body>
      </html>
    )
  }

  // Standard Next.js cookies API for consent
  const cookieStore = await cookies()

  const cookieConfig = {
    enable: siteSettings?.enableCookieBanner,
    text: siteSettings?.cookieBannerText,
    policyUrl: siteSettings?.cookiePolicyUrl,
    hasResponded: cookieStore.has('cookie-consent'),
  }

  const hasConsent = cookieStore.get('cookie-consent')?.value === 'accepted'

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Suspense fallback={null}>
          <LoadingBar />
        </Suspense>
        <ScrollProgress />
        <FramerMotionProvider>
          <SmoothScrollProvider>
            <PageTransition>
              <div dir={dir} className="h-full antialiased">
                <div className="min-h-full flex flex-col bg-cream text-obsidian">
                  <SkipToContent />
                  <OrganizationSchema />
                  {hasConsent && analyticsConfig?.gaId && <GoogleAnalytics gaId={analyticsConfig.gaId} />}
                  {hasConsent && analyticsConfig?.gtmId && <GoogleTagManager gtmId={analyticsConfig.gtmId} />}

                  <CursorGlow />
                  <Header />
                  <PageWrapper>{children}</PageWrapper>
                  <Footer />
                  <DeferredWidgets
                    cookieConfig={cookieConfig}
                    whatsappConfig={whatsappConfig}
                    umamiConfig={
                      siteSettings?.umamiWebsiteId
                        ? {
                            websiteId: siteSettings.umamiWebsiteId,
                            scriptUrl: siteSettings?.umamiScriptUrl || 'https://cloud.umami.is/script.js',
                          }
                        : null
                    }
                  />
                </div>
              </div>
            </PageTransition>
          </SmoothScrollProvider>
        </FramerMotionProvider>
      </body>
    </html>
  )
}
