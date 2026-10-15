import Link from '@/components/ui/AppLink'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.3em] text-obsidian/40 uppercase mb-6">
          [ ERROR 404 ]
        </p>
        <h1 className="text-6xl md:text-7xl font-serif font-semibold text-obsidian tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-sm text-obsidian/60 font-light mb-10">
          The page you requested does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          [ RETURN HOME ]
        </Link>
      </div>
    </div>
  )
}
