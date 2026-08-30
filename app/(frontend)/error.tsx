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
    <main className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6 bg-bg">
      <div className="text-center max-w-xl w-full border-2 border-border rounded-none bg-surface p-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
          [ SYSTEM FAULT — CODE 500 ]
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text mb-4 tracking-tighter">
          Something went wrong on our side.
        </h1>
        <p className="text-muted mb-8 text-base">
          The page failed to load. This has been logged — please retry, and if the
          problem persists contact{' '}
          <a href="mailto:ops@exvorta.com" className="underline hover:text-text transition-colors">
            ops@exvorta.com
          </a>
          .
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-8 h-12 rounded-none bg-text text-bg font-mono uppercase font-bold text-sm hover:bg-black transition-all duration-200"
        >
          [ RETRY ]
        </button>
      </div>
    </main>
  )
}
