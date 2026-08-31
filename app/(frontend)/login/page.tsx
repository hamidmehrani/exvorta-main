import React from 'react'
import type { Metadata } from 'next'
import LoginShell from './LoginShell'

export const metadata: Metadata = {
  title: 'Partner Login | Exvorta',
  description: 'Secure enterprise portal access.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return <LoginShell />
}
