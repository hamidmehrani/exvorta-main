'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Script from 'next/script'
const CookieBanner = dynamic(() => import('@/components/legal/CookieBanner'), { ssr: false, loading: () => null })
const WhatsAppFloat = dynamic(() => import('@/components/ui/WhatsAppFloat'), { ssr: false, loading: () => null })

interface DeferredWidgetsProps {
  cookieConfig: {
    enable?: boolean | null
    text?: string | null
    policyUrl?: string | null
  }
  whatsappConfig: {
    enableWidget?: boolean | null
    phoneNumber?: string | null
    defaultMessage?: string | null
  } | null
  umamiConfig: { websiteId: string; scriptUrl: string } | null
}

export default function DeferredWidgets({ cookieConfig, whatsappConfig, umamiConfig }: DeferredWidgetsProps) {
  const pathname = usePathname()
  // Umami only: defer the analytics script past first paint. The cookie banner
  // must not be delayed — consent UI should be available immediately.
  const [showUmami, setShowUmami] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowUmami(true), 3000)
    return () => clearTimeout(t)
  }, [])

  if (pathname?.startsWith('/rfq/embed')) {
    return null
  }

  const waReady = Boolean(
    whatsappConfig &&
    whatsappConfig.enableWidget !== false &&
    (whatsappConfig.enableWidget || whatsappConfig.phoneNumber)
  )

  return (
    <>
      {cookieConfig?.enable && <CookieBanner config={cookieConfig} />}
      {waReady && (
        <WhatsAppFloat
          phoneNumber={whatsappConfig?.phoneNumber}
          message={whatsappConfig?.defaultMessage}
        />
      )}
      {showUmami && umamiConfig && <Script src={umamiConfig.scriptUrl} data-website-id={umamiConfig.websiteId} strategy="lazyOnload" />}
    </>
  )
}
