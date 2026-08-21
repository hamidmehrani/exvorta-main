import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    const { collection, slug } = await request.json()

    if (collection) {
      revalidateTag(collection)
    }

    if (slug) {
      revalidateTag(slug)
    }

    // Always revalidate global tags to be safe
    revalidateTag('pages')
    revalidateTag('seo-defaults')

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
