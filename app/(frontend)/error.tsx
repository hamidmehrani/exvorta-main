'use client'

import React, { useEffect } from 'react'
import Link from '@/components/ui/AppLink'
import { Reveal } from '@/components/ui/Reveal'
import { reportError } from '@/lib/error-reporting'

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[EXVORTA] Unhandled page error:', error)
    reportError(error, { digest: error.digest, boundary: 'frontend-error' })
  }, [error])

  return (
    <div className="rails relative isolate flex min-h-[78vh] flex-1 items-center justify-center overflow-hidden px-6 py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-blueprint-grid absolute inset-0" />
      </div>

      <Reveal y={16} duration={0.6} className="mx-auto w-full max-w-2xl">
        <section
          role="alert"
          aria-live="assertive"
          className="frame mx-auto w-full border border-rule bg-surface px-6 py-12 text-center sm:px-12 sm:py-16 md:px-14 md:py-18"
        >
          <div className="mb-8 flex justify-center">
            <span className="eyebrow inline-flex items-center gap-2 border border-danger/30 bg-danger/5 px-3.5 py-1.5 font-mono font-medium !text-danger">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
              </span>
              [ 500 // SYSTEM FAULT ]
            </span>
          </div>

          <h1 className="mb-6 font-serif text-headline font-semibold text-obsidian">
            System Fault Encountered
          </h1>

          <p className="mx-auto mb-8 max-w-lg font-sans text-lede font-light text-muted">
            An unexpected error occurred while processing this request. Our operations monitoring has logged the incident for review.
          </p>

          {error.digest && (
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded border border-rule bg-surface-2 px-3.5 py-1.5 font-mono text-xs text-muted">
              <span className="font-medium uppercase tracking-wider text-muted">DIGEST //</span>
              <code className="select-all font-mono font-medium text-obsidian">{error.digest}</code>
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="btn-primary min-h-[52px] w-full px-8 py-4 sm:w-auto"
            >
              [ TRY AGAIN ]
            </button>
            <Link
              href="/"
              className="btn-ghost min-h-[52px] w-full px-8 py-4 sm:w-auto"
            >
              [ RETURN HOME ]
            </Link>
            <Link
              href="/contact"
              className="btn-ghost min-h-[52px] w-full px-8 py-4 sm:w-auto"
            >
              [ OPS SUPPORT ]
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
