'use client'

import React from 'react'
import LoginForm from '@/components/forms/LoginForm'
import { m, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '@/components/ui/Reveal'

export default function LoginShell() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 min-h-[80vh] w-full relative">
      {/* Aesthetic Background Elements — slow orbital drift */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] pointer-events-none">
        <m.div
          animate={{ x: [0, 30, -20, 0], y: [0, -18, 12, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-primary/5 blur-[120px] rounded-full"
        />
      </div>

      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="w-full max-w-md p-10 bg-surface border border-border rounded-2xl shadow-2xl relative z-10 flex flex-col items-center text-center"
      >
        {/* Brand Icon */}
        <m.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE_OUT }}
          className="w-12 h-12 rounded bg-primary flex items-center justify-center font-bold text-bg text-2xl mb-6"
        >
          E
        </m.div>

        <h1 className="text-3xl font-extrabold text-text mb-2 tracking-tight">Partner Login</h1>
        <p className="text-muted mb-8 font-medium">Access your exclusive enterprise dashboard.</p>

        <LoginForm />
      </m.div>
    </main>
  )
}
