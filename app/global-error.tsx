'use client'

import React, { useEffect } from 'react'
import { reportError } from '@/lib/error-reporting'
import './globals.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    reportError(error, { digest: error.digest, boundary: 'global-error' })
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-16 text-obsidian">
        <div className="w-full max-w-2xl border border-rule bg-surface px-8 py-16 text-center md:px-14">
          <p className="eyebrow mb-8 justify-center">
            <span className="eyebrow-index" aria-hidden>
              <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
            </span>
            System fault — code 500
          </p>
          <h1 className="mb-6 font-serif text-3xl font-semibold text-obsidian md:text-4xl">
            Critical system error
          </h1>
          <p className="mx-auto mb-10 max-w-md text-base font-light leading-relaxed text-muted">
            An unexpected error occurred in the application root. This has been logged — please retry, and if the problem persists contact{' '}
            <a
              href="mailto:ops@exvorta.com"
              className="text-obsidian underline underline-offset-4 transition-colors hover:text-emerald"
            >
              ops@exvorta.com
            </a>
            .
          </p>
          <button
            onClick={() => reset()}
            className="btn-primary min-h-[52px] px-9 py-4"
            type="button"
          >
            [ RETRY ]
          </button>
        </div>
      </body>
    </html>
  )
}
