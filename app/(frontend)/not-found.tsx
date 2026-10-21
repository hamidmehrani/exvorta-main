import Link from '@/components/ui/AppLink'

export default function NotFound() {
  return (
    <div className="rails relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden px-6 py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-blueprint-grid absolute inset-0" />
      </div>
      <div className="frame mx-auto w-full max-w-3xl border border-rule bg-surface px-8 py-16 text-center md:px-16 md:py-24">
        <p className="eyebrow mb-8 justify-center">
          <span className="eyebrow-index" aria-hidden>
            <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
          </span>
          Error 404
        </p>
        <h1 className="mb-6 font-serif text-display font-semibold text-obsidian">Page Not Found</h1>
        <p className="mx-auto mb-12 max-w-md text-lede font-light text-muted">
          The page you requested does not exist or has been moved.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-primary min-h-[52px] px-9 py-4">
            [ RETURN HOME ]
          </Link>
          <Link href="/contact" className="btn-ghost min-h-[52px] px-9 py-4">
            [ CONTACT US ]
          </Link>
        </div>
      </div>
    </div>
  )
}
