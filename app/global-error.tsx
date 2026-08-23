'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-[#0D0D0D] text-white antialiased">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-white/10 bg-[#141414] p-8">
            <h1 className="font-serif text-3xl mb-4 text-[#FAFAF8]">Critical Error</h1>
            <p className="font-mono text-xs text-white/60 mb-8 uppercase tracking-widest leading-relaxed">
              System fault detected. Support team has been notified.
            </p>
            <div className="bg-black/50 p-4 border border-red-500/30 mb-8 overflow-auto">
              <code className="font-mono text-[10px] text-red-400">
                {error.message || 'Unknown error occurred'}
              </code>
            </div>
            <button
              onClick={() => reset()}
              className="w-full py-4 bg-white text-black font-mono text-xs tracking-widest uppercase hover:bg-white/90 transition-colors"
            >
              [ REBOOT SYSTEM ]
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
