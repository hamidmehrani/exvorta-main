'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'

const CookieBanner = dynamic(() => import('@/components/legal/CookieBanner'), { ssr: false })

interface DeferredWidgetsProps {
  cookieConfig: any
  whatsappConfig: any
  umamiConfig: {
    websiteId: string
    scriptUrl: string
    nonce: string
  } | null
}

export default function DeferredWidgets({ cookieConfig, umamiConfig, whatsappConfig }: DeferredWidgetsProps) {
  const [showWidgets, setShowWidgets] = useState(false)

  useEffect(() => {
    // Load widgets after 3 seconds OR on first user interaction
    const timer = setTimeout(() => setShowWidgets(true), 3000)
    
    const interaction = () => {
      setShowWidgets(true)
      clearTimeout(timer)
      window.removeEventListener('scroll', interaction)
      window.removeEventListener('click', interaction)
      window.removeEventListener('mousemove', interaction)
      window.removeEventListener('touchstart', interaction)
      window.removeEventListener('keydown', interaction)
    }

    window.addEventListener('scroll', interaction, { once: true, passive: true })
    window.addEventListener('click', interaction, { once: true, passive: true })
    window.addEventListener('mousemove', interaction, { once: true, passive: true })
    window.addEventListener('touchstart', interaction, { once: true, passive: true })
    window.addEventListener('keydown', interaction, { once: true, passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', interaction)
      window.removeEventListener('click', interaction)
      window.removeEventListener('mousemove', interaction)
      window.removeEventListener('touchstart', interaction)
      window.removeEventListener('keydown', interaction)
    }
  }, [])

  if (!showWidgets) return null

  return (
    <>
      <WhatsAppFloat config={whatsappConfig} />
      <CookieBanner config={cookieConfig} />
      {umamiConfig && (
        <Script 
          src={umamiConfig.scriptUrl} 
          data-website-id={umamiConfig.websiteId} 
          strategy="lazyOnload"
          nonce={umamiConfig.nonce}
        />
      )}
    </>
  )
}
