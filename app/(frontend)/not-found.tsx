import Link from '@/components/ui/AppLink'
import { Reveal } from '@/components/ui/Reveal'

export default function NotFound() {
  return (
    <div className="rails relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden px-6 py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-blueprint-grid absolute inset-0" />
      </div>

      <Reveal y={16} duration={0.6} className="mx-auto w-full max-w-3xl">
        <div className="frame mx-auto w-full border border-rule bg-surface px-6 py-12 text-center sm:px-12 sm:py-16 md:px-16 md:py-20">
          <div className="mb-8 flex justify-center">
            <span className="eyebrow inline-flex items-center gap-2 border border-danger/30 bg-danger/5 px-3.5 py-1.5 font-medium !text-danger">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-danger" />
              </span>
              [ 404_PAGE_NOT_FOUND ]
            </span>
          </div>

          <h1 className="mb-6 font-serif text-display font-semibold text-obsidian">
            Page Not Found
          </h1>

          <p className="mx-auto mb-10 max-w-lg font-sans text-lede font-light text-muted">
            The page you requested does not exist, has been moved, or is temporarily unavailable.
          </p>

          <form
            action="/tools"
            method="GET"
            role="search"
            className="mx-auto mb-10 w-full max-w-md"
          >
            <label htmlFor="recovery-search" className="sr-only">
              Search site
            </label>
            <div className="relative flex items-center">
              <input
                id="recovery-search"
                name="q"
                type="search"
                placeholder="Search tools or resources…"
                className="h-12 w-full rounded border border-rule bg-surface-2 pe-28 ps-4 font-sans text-sm text-obsidian placeholder:text-muted transition-colors focus:border-obsidian focus:bg-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-obsidian"
              />
              <button
                type="submit"
                className="btn-primary absolute end-1.5 top-1.5 bottom-1.5 px-4 text-label"
              >
                [ SEARCH ]
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/" className="btn-primary min-h-[52px] w-full px-8 py-4 sm:w-auto">
              [ RETURN HOME ]
            </Link>
            <Link href="/tools" className="btn-ghost min-h-[52px] w-full px-8 py-4 sm:w-auto">
              [ EXPLORE TOOLS ]
            </Link>
            <Link href="/contact" className="btn-ghost min-h-[52px] w-full px-8 py-4 sm:w-auto">
              [ CONTACT US ]
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
