'use client'

import React, { useActionState } from 'react'
import { loginAction } from '@/actions/loginAction'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 mt-4 rounded-lg bg-primary text-bg font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin"></span>
          Authenticating...
        </span>
      ) : (
        'Sign In'
      )}
    </button>
  )
}

export default function LoginForm({ locale }: { locale: string }) {
  const [state, formAction] = useActionState(loginAction, { error: '', success: false })

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full text-start">
      <input type="hidden" name="locale" value={locale} />
      
      {state?.error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm font-medium">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text uppercase tracking-wider text-xs">Email Address</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="h-12 bg-surface-2 border border-border rounded-lg px-4 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          placeholder="admin@exvorta.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text uppercase tracking-wider text-xs">Password</label>
        <input 
          type="password" 
          name="password" 
          required 
          className="h-12 bg-surface-2 border border-border rounded-lg px-4 text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
