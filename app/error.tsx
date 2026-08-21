'use client'

import React from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#FCFAF8] text-[#1D1D1F]">
      <h2 className="text-3xl font-bold mb-4 font-serif">Something went wrong!</h2>
      <p className="mb-6 opacity-70 font-sans">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#1D1D1F] text-[#FCFAF8] rounded-full font-mono text-sm uppercase tracking-wider hover:opacity-80 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
