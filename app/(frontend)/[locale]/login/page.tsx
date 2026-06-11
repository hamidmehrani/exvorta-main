import React from 'react'
import LoginForm from '@/components/forms/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Login | Exvorta',
  description: 'Secure enterprise portal access.',
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 min-h-[80vh] w-full relative">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md p-10 bg-surface border border-border rounded-2xl shadow-2xl relative z-10 flex flex-col items-center text-center">
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded bg-primary flex items-center justify-center font-bold text-bg text-2xl mb-6">
          E
        </div>

        <h1 className="text-3xl font-extrabold text-text mb-2 tracking-tight">Partner Login</h1>
        <p className="text-muted mb-8 font-medium">Access your exclusive enterprise dashboard.</p>
        
        <LoginForm locale={locale} />
      </div>
    </main>
  )
}
