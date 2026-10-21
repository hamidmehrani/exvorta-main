import React from 'react'
import LoginForm from '@/components/forms/LoginForm'
import ExvortaLogo from '@/components/brand/ExvortaLogo'

type RiseStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>

export default function LoginShell() {
  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center px-6 pb-24 pt-36">
      {/* Blueprint backdrop + soft emerald aura (gradients, not blur filters) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,color-mix(in_oklab,var(--color-emerald)_12%,transparent),transparent_72%)]" />
        <div className="bg-blueprint-grid absolute inset-0" />
      </div>

      <div
        style={{ '--i': 0 } as RiseStyle}
        className="rise relative z-10 flex w-full max-w-md flex-col items-center border border-obsidian/10 bg-surface p-8 text-center shadow-soft sm:p-10"
      >
        <ExvortaLogo size={36} />

        <div className="my-8 h-px w-12 bg-obsidian/15" aria-hidden />

        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">[ Client portal ]</p>
        <h1 className="mb-3 font-serif text-3xl font-semibold tracking-tight text-obsidian">Sign in to your workspace</h1>
        <p className="mb-8 text-sm text-muted">Project dashboards, documents and deployments in one place.</p>

        <div className="mb-8 flex w-full items-start gap-3 border border-obsidian/10 bg-surface-2 p-4 text-start">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <circle cx="12" cy="8" r="0.9" />
          </svg>
          <p className="text-xs leading-relaxed text-muted">
            Client dashboards are being provisioned. You can sign in now — project workspaces unlock for active
            engagements. Need access?{' '}
            <a href="mailto:ops@exvorta.com" className="text-obsidian underline underline-offset-2">
              ops@exvorta.com
            </a>
            .
          </p>
        </div>

        <LoginForm />

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Secured · Exvorta infrastructure</p>
      </div>
    </div>
  )
}
