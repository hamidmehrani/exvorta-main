import React from 'react'

export default function Loading() {
  return (
    <div className="w-full flex-1 flex flex-col animate-pulse bg-bg min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto w-full px-6 py-24 space-y-4">
        <div className="w-96 max-w-full h-12 bg-surface-2 rounded-md mb-10"></div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-4 bg-surface-2 rounded-md" style={{ width: `${95 - (i % 3) * 12}%` }}></div>
        ))}
        <div className="h-8 w-64 bg-surface-2 rounded-md mt-12"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-surface-2 rounded-md" style={{ width: `${90 - (i % 2) * 15}%` }}></div>
        ))}
      </div>
    </div>
  )
}
