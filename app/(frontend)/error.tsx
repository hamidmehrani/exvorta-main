'use client'

import React, { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Frontend Component Error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-surface text-text p-6">
      <div className="max-w-md w-full text-center border border-border p-10 rounded-xl shadow-2xl relative overflow-hidden bg-bg">
        <div className="absolute top-0 left-0 w-full h-1 bg-danger" />
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Something went wrong</h2>
        <p className="text-muted mb-8 text-sm">
          A critical component failed to load. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-primary text-bg font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
