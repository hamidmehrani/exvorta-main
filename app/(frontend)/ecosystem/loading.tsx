import React from 'react'

export default function Loading() {
  return (
    <div className="w-full flex-1 flex flex-col animate-pulse bg-bg min-h-[calc(100vh-80px)]">
      <div className="h-[40vh] w-full bg-surface mb-12 flex flex-col items-center justify-center gap-5 px-6">
        <div className="w-3/4 max-w-2xl h-14 bg-surface-2 rounded-md"></div>
        <div className="w-1/2 max-w-md h-5 bg-surface-2 rounded-md"></div>
      </div>
      <div className="max-w-7xl mx-auto w-full px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 bg-surface rounded-2xl border border-border"></div>
        ))}
      </div>
    </div>
  )
}
