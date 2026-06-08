import React from 'react'

export default function Loading() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-bg py-24">
      <div className="flex flex-col items-center space-y-6">
        {/* Minimalist pulsing skeleton loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-border rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-2 border-primary border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
        <div className="text-muted uppercase tracking-[0.3em] text-xs font-semibold animate-pulse">
          Loading
        </div>
      </div>
    </div>
  )
}
