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
      className="btn-primary mt-2 min-h-[52px] w-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
          [ Authenticating… ]
        </span>
      ) : (
        '[ Sign in ]'
      )}
    </button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { error: '', success: false })

  return (
    <form action={formAction} className="flex w-full flex-col gap-6 text-start">
      {state?.error && (
        <p role="alert" className="border border-danger/30 bg-danger/10 p-4 font-mono text-xs uppercase tracking-widest text-danger">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="login-email" className="field-label">Email address</label>
        <input
          id="login-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-invalid={state?.error ? true : undefined}
          className="field"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="field-label">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          aria-invalid={state?.error ? true : undefined}
          className="field"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
