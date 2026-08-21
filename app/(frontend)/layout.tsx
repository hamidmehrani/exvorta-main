import React from 'react'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import Script from 'next/script'
import '../globals.css'


import { getPayloadClient } from '@/lib/payload'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import type { SeoDefault, SiteSetting, Analytics } from '@/payload-types'

import DeferredWidgets from '@/components/layout/DeferredWidgets'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { cookies, headers } from 'next/headers'
import SkipToContent from '@/components/legal/SkipToContent'
import { generateMeta } from '@/utils/generateMeta'

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
    console.error("Failed to fetch site-settings", e);
  }

  try {
    analyticsConfig = await payload.findGlobal({
      slug: 'analytics',
    })
  } catch (e) {
    console.error("Failed to fetch analytics", e);
  }
  
  try {
    whatsappConfig = (await payload.findGlobal({
      slug: 'whatsapp-config',
    })) as unknown as { phoneNumber?: string; enableWidget?: boolean; defaultMessage?: string }
  } catch (e) {
    console.error("Failed to fetch whatsapp-config", e);
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
    <div dir={dir} className={`h-full antialiased light`} data-theme="light">
      <div className="min-h-full flex flex-col bg-bg text-text">
        <SkipToContent />
        <OrganizationSchema />
        {hasConsent && analyticsConfig?.gaId && <GoogleAnalytics gaId={analyticsConfig.gaId} />}
        {hasConsent && analyticsConfig?.gtmId && <GoogleTagManager gtmId={analyticsConfig.gtmId} />}
        
        {siteSettings?.maintenanceMode ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-text">
            <div className="text-center p-12 border-2 border-border rounded-none max-w-xl w-full bg-surface relative overflow-hidden">
              <div className="absolute top-0 start-0 w-full h-2 bg-text" />
              <h1 className="text-5xl font-serif font-bold text-text mb-4 tracking-tighter uppercase">Maintenance</h1>
              <p className="text-muted mb-8 text-sm font-mono uppercase tracking-widest">We are currently updating our systems. Please check back shortly.</p>
            </div>
          </div>
        ) : (
          <>
            <Header />
            <SmoothScrollProvider>
              <PageWrapper>{children}</PageWrapper>
            </SmoothScrollProvider>
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
  )
}

