import React from 'react'

export default function Loading() {
  return (
    <div className="w-full flex-1 flex flex-col animate-pulse bg-bg min-h-[calc(100vh-80px)]">
      <div className="h-[30vh] w-full bg-surface mb-12 flex flex-col items-center justify-center gap-5 px-6">
        <div className="w-72 h-10 bg-surface-2 rounded-md"></div>
        <div className="w-96 max-w-full h-4 bg-surface-2 rounded-md"></div>
      </div>
      <div className="max-w-4xl mx-auto w-full px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-surface rounded-md border border-border"></div>
        ))}
      </div>
    </div>
  )
}
