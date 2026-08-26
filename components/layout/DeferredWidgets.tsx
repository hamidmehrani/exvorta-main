'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
const CookieBanner = dynamic(() => import('@/components/legal/CookieBanner'), { ssr: false, loading: () => null })
export default function DeferredWidgets({ cookieConfig, umamiConfig }: any) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 3000); return () => clearTimeout(t) }, [])
  if (!show) return null
  return (
    <>
      <CookieBanner config={cookieConfig} />
      {umamiConfig && <Script src={umamiConfig.scriptUrl} data-website-id={umamiConfig.websiteId} strategy="lazyOnload" nonce={umamiConfig.nonce} />}
    </>
  )
}
