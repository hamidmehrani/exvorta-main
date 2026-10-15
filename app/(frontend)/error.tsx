'use client'

import React, { useEffect } from 'react'

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[EXVORTA] Unhandled page error:', error)
  }, [error])

  return (
    <div className="rails relative isolate flex min-h-[78vh] flex-1 flex-col items-center justify-center overflow-hidden px-6 py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-blueprint-grid absolute inset-0" />
      </div>
      <div className="frame w-full max-w-2xl border border-rule bg-surface px-8 py-16 text-center md:px-14">
        <p className="eyebrow mb-8 justify-center">
          <span className="eyebrow-index" aria-hidden>
            <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
          </span>
          System fault — code 500
        </p>
        <h1 className="mb-6 font-serif text-headline font-semibold text-obsidian">
          Something went wrong on our side.
        </h1>
        <p className="mx-auto mb-10 max-w-md text-base font-light leading-relaxed text-muted">
          The page failed to load. This has been logged — please retry, and if the
          problem persists contact{' '}
          <a href="mailto:ops@exvorta.com" className="text-obsidian underline underline-offset-4 transition-colors hover:text-emerald">
            ops@exvorta.com
          </a>
          .
        </p>
        <button onClick={reset} className="btn-primary min-h-[52px] px-9 py-4" type="button">
          [ RETRY ]
        </button>
      </div>
    </div>
  )
}
