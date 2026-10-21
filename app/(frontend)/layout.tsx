import React from 'react'
import type { Metadata, Viewport } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { FramerMotionProvider } from '@/components/providers/FramerMotionProvider'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { PageTransition } from '@/components/layout/PageTransition'
import RevealScript from '@/components/ui/RevealScript'
import localFont from 'next/font/local'
import '../globals.css'

import { getCachedGlobal } from '@/lib/payload-cache'
import type { SiteSetting, Analytics, WhatsappConfig } from '@/payload-types'
import OrganizationSchema from '@/components/seo/OrganizationSchema'

import DeferredWidgets from '@/components/layout/DeferredWidgets'
import ConsentAnalytics from '@/components/legal/ConsentAnalytics'
import CursorGlow from '@/components/ui/CursorGlow'
import SkipToContent from '@/components/legal/SkipToContent'
import { generateMeta } from '@/utils/generateMeta'
import { reportWarning } from '@/lib/error-reporting'

const inter = localFont({
  src: '../../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

// The design system sets headings in Playfair 600. The single 600 file is
// declared for the 600–700 range so `font-bold` headings use the same cut
// instead of synthesising a bold (or downloading a second, near-identical file).
const playfair = localFont({
  src: [{ path: '../../public/fonts/PlayfairDisplay-600.woff2', weight: '600 700', style: 'normal' }],
  variable: '--font-playfair',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
})

// Literal because <meta name="theme-color"> cannot read CSS variables. Mirrors --color-cream.
const THEME_COLOR = '#FAFAF8'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: THEME_COLOR,
}

export async function generateMetadata(): Promise<Metadata> {
  const [meta, settings] = await Promise.all([generateMeta(), getCachedGlobal<SiteSetting>('site-settings')])

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
  // Everything the shell needs comes from cached globals (tagged, revalidated
  // on publish) — no cookies()/headers() here, so pages can be statically
  // generated and served from the CDN instead of rendering per request.
  const [siteSettingsRaw, analyticsConfig, whatsappRaw] = await Promise.all([
    getCachedGlobal<SiteSetting>('site-settings'),
    getCachedGlobal<Analytics>('analytics'),
    getCachedGlobal<WhatsappConfig>('whatsapp-config'),
  ])

  const siteSettings: SiteSetting =
    siteSettingsRaw ?? { id: 0, siteName: 'Exvorta', enableCookieBanner: false, maintenanceMode: false, updatedAt: '', createdAt: '' }

  const cookieConfig = {
    enable: siteSettings.enableCookieBanner,
    text: siteSettings.cookieBannerText,
    policyUrl: siteSettings.cookiePolicyUrl,
  }

  const whatsappConfig = whatsappRaw
    ? {
        enableWidget: whatsappRaw.enableWidget,
        phoneNumber: whatsappRaw.phoneNumber,
        defaultMessage: whatsappRaw.defaultMessage,
      }
    : null

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <RevealScript />
        <noscript>
          <style>{'[data-reveal],[data-reveal-stagger] [data-reveal-item]{opacity:1!important;transform:none!important}[data-sx-inview] .sx-unit{opacity:1!important}'}</style>
        </noscript>
      </head>
      <body>
        <ScrollProgress />
        <FramerMotionProvider>
          <SmoothScrollProvider>
            <div className="flex min-h-screen flex-col bg-cream text-obsidian">
              <SkipToContent />
              <OrganizationSchema />
              <ConsentAnalytics gaId={analyticsConfig?.gaId} gtmId={analyticsConfig?.gtmId} />

              {siteSettings.maintenanceMode ? (
                <div className="flex min-h-screen flex-col items-center justify-center bg-cream text-obsidian">
                  <div className="relative w-full max-w-xl overflow-hidden border-2 border-obsidian bg-surface p-12 text-center">
                    <div className="absolute inset-x-0 top-0 h-2 bg-obsidian" />
                    <h1 className="mb-4 font-serif text-5xl font-semibold uppercase tracking-tighter text-obsidian">Maintenance</h1>
                    <p className="font-mono text-sm uppercase tracking-widest text-muted">We are currently updating our systems. Please check back shortly.</p>
                  </div>
                </div>
              ) : (
                <>
                  <CursorGlow />
                  <Header />
                  <PageWrapper>
                    <PageTransition>{children}</PageTransition>
                  </PageWrapper>
                  <Footer />
                  <DeferredWidgets
                    cookieConfig={cookieConfig}
                    whatsappConfig={whatsappConfig}
                    umamiConfig={
                      siteSettings.umamiWebsiteId
                        ? {
                            websiteId: siteSettings.umamiWebsiteId,
                            scriptUrl: siteSettings.umamiScriptUrl || 'https://cloud.umami.is/script.js',
                          }
                        : null
                    }
                  />
                </>
              )}
            </div>
          </SmoothScrollProvider>
        </FramerMotionProvider>
      </body>
    </html>
  )
}
