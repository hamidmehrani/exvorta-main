import React from 'react'

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Hero skeleton */}
      <div className="animate-pulse pt-32 pb-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-16 w-full bg-white/10 rounded" />
            <div className="h-16 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-full max-w-md bg-white/5 rounded" />
            <div className="h-4 w-2/3 max-w-md bg-white/5 rounded" />
            <div className="mt-8 w-full border border-white/10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex justify-between px-4 py-3 border-b border-white/10 last:border-b-0">
                  <div className="h-3 w-20 bg-white/5 rounded" />
                  <div className="h-3 w-24 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 min-h-[400px] lg:min-h-[600px] bg-white/5 border border-white/10" />
        </div>
      </div>
    </main>
  )
}
