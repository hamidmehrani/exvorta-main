import './globals.css'
import localFont from 'next/font/local'
import React, { Suspense } from 'react'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { FramerMotionProvider } from '@/components/providers/FramerMotionProvider'
import { PageTransition } from '@/components/layout/PageTransition'
import { LoadingBar } from '@/components/ui/LoadingBar'


const inter = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

const vazirmatn = localFont({
  src: '../public/fonts/Vazirmatn-Variable.woff2',
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: '100 900',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${vazirmatn.variable}`}>
      <body>
        <SmoothScrollProvider>
          <Suspense fallback={null}>
            <LoadingBar />
          </Suspense>
          <FramerMotionProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </FramerMotionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
