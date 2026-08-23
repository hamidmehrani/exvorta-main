import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { FramerMotionProvider } from '@/components/providers/FramerMotionProvider'
import { PageTransition } from '@/components/layout/PageTransition'
import { LoadingBar } from '@/components/ui/LoadingBar'
import localFont from 'next/font/local'
import '../globals.css'

import { getPayloadClient } from '@/lib/payload'
import OrganizationSchema from '@/components/seo/OrganizationSchema'

import DeferredWidgets from '@/components/layout/DeferredWidgets'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { cookies, headers } from 'next/headers'
import SkipToContent from '@/components/legal/SkipToContent'
import { generateMeta } from '@/utils/generateMeta'

const inter = localFont({
  src: '../../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

const vazirmatn = localFont({
  src: '../../public/fonts/Vazirmatn-Variable.woff2',
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: '100 900',
})

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta()
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dir = 'ltr'

  // Fetch SiteSettings for Cookie Banner
  const payload = await getPayloadClient()
  let siteSettings = null;
  let analyticsConfig = null;
  let whatsappConfig = null;

  try {
    siteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })
  } catch (e) {
    console.warn("site-settings fetch failed, using default", e);
    siteSettings = { enableCookieBanner: false, maintenanceMode: false } as any;
  }

  try {
    analyticsConfig = await payload.findGlobal({
      slug: 'analytics',
    })
  } catch (e) {
    console.warn("analytics fetch failed, using default", e);
    analyticsConfig = {} as any;
  }
  
  try {
    whatsappConfig = (await payload.findGlobal({
      slug: 'whatsapp-config',
    })) as unknown as { phoneNumber?: string; enableWidget?: boolean; defaultMessage?: string }
  } catch (e) {
    console.warn("whatsapp-config fetch failed, using default", e);
    whatsappConfig = { enableWidget: false, phoneNumber: '', defaultMessage: '' } as any;
  }

  const cookieStore = await cookies()
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') || ''
  
  const cookieConfig = {
    enable: siteSettings?.enableCookieBanner,
    text: siteSettings?.cookieBannerText,
    policyUrl: siteSettings?.cookiePolicyUrl,
    hasResponded: cookieStore.has('cookie-consent'),
  }

  const hasConsent = cookieStore.get('cookie-consent')?.value === 'accepted'

  return (
    <html lang="en" className={`${inter.variable} ${vazirmatn.variable}`}>
      <body>
        <SmoothScrollProvider>
          <Suspense fallback={null}>
            <LoadingBar />
          </Suspense>
          <FramerMotionProvider>
            <PageTransition>
              <div dir={dir} className={`h-full antialiased`}>
                <div className="min-h-full flex flex-col bg-cream text-obsidian">
                  <SkipToContent />
                  <OrganizationSchema />
                  {hasConsent && analyticsConfig?.gaId && <GoogleAnalytics gaId={analyticsConfig.gaId} />}
                  {hasConsent && analyticsConfig?.gtmId && <GoogleTagManager gtmId={analyticsConfig.gtmId} />}
                  
                  {siteSettings?.maintenanceMode ? (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-obsidian">
                      <div className="text-center p-12 border-2 border-border-dark rounded-none max-w-xl w-full bg-surface relative overflow-hidden">
                        <div className="absolute top-0 start-0 w-full h-2 bg-obsidian" />
                        <h1 className="text-5xl font-serif font-bold text-obsidian mb-4 tracking-tighter uppercase">Maintenance</h1>
                        <p className="text-obsidian/60 mb-8 text-sm font-mono uppercase tracking-widest">We are currently updating our systems. Please check back shortly.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Header />
                      <PageWrapper>{children}</PageWrapper>
                      <Footer />
                      <DeferredWidgets 
                        cookieConfig={cookieConfig}
                        whatsappConfig={whatsappConfig}
                        umamiConfig={siteSettings?.umamiWebsiteId ? {
                          websiteId: siteSettings.umamiWebsiteId,
                          scriptUrl: siteSettings?.umamiScriptUrl || 'https://cloud.umami.is/script.js',
                          nonce: nonce
                        } : null}
                      />
                    </>
                  )}
                </div>
              </div>
            </PageTransition>
          </FramerMotionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
