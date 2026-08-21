import React from 'react'

export default function Loading() {
  return (
    <div className="w-full flex-1 flex flex-col animate-pulse bg-bg min-h-[calc(100vh-80px)]">
      {/* Hero Skeleton */}
      <div className="h-[50vh] w-full bg-surface mb-12 flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-3/4 max-w-2xl h-16 bg-surface-2 rounded-lg"></div>
        <div className="w-1/2 max-w-md h-6 bg-surface-2 rounded-md"></div>
        <div className="w-40 h-12 bg-surface-2 rounded-lg mt-4"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 bg-surface rounded-2xl border border-border flex flex-col p-6 gap-4">
            <div className="w-full h-32 bg-surface-2 rounded-xl mb-auto"></div>
            <div className="w-3/4 h-5 bg-surface-2 rounded-md"></div>
            <div className="w-1/2 h-4 bg-surface-2 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
