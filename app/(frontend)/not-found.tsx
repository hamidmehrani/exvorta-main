import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-obsidian mb-4">404</h1>
        <p className="text-xl text-brand-obsidian/60 mb-8">Page not found</p>
        <Link href="/" className="btn-primary">
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}
