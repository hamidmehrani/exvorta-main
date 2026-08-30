import React from 'react'

export default function Loading() {
  return (
    <div className="w-full flex-1 flex flex-col animate-pulse bg-bg min-h-[calc(100vh-80px)]">
      <div className="h-[35vh] w-full bg-surface mb-12 flex flex-col items-center justify-center gap-5 px-6">
        <div className="w-80 max-w-full h-12 bg-surface-2 rounded-md"></div>
        <div className="w-96 max-w-full h-4 bg-surface-2 rounded-md"></div>
      </div>
      <div className="max-w-xl mx-auto w-full px-6 pb-20 space-y-6">
        <div className="h-16 bg-surface rounded-md border border-border"></div>
        <div className="h-14 bg-surface rounded-md border border-border w-2/3 mx-auto"></div>
      </div>
    </div>
  )
}
