import React from 'react'
import './globals.css'

export default function GlobalNotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text items-center justify-center bg-surface">
        <div className="text-center p-12 border border-border rounded shadow-2xl max-w-xl w-full bg-surface-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <h1 className="text-9xl font-bold text-text mb-4 tracking-tighter opacity-90">404</h1>
          <div className="w-16 h-1 bg-primary mx-auto mb-8 opacity-80" />
          <h2 className="text-2xl font-medium text-text mb-4 uppercase tracking-widest">Document Not Found</h2>
          <p className="text-muted mb-12 text-lg">The requested record or resource could not be located in the current database.</p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold bg-primary text-bg rounded transition-all hover:bg-accent-hover hover:scale-[1.02] uppercase tracking-widest"
          >
            Return to Homepage
          </a>
        </div>
      </body>
    </html>
  )
}
