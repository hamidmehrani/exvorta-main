import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import type { Page } from '@/payload-types'

export async function POST(req: Request) {
  // 1. Strict Environment Protection
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Forbidden: Auto-Seeder Pipeline is strictly for development.' },
      { status: 403 }
    )
  }

  try {
    const body = await req.json()
    const { title, slug, blocks } = body as {
      title: string
      slug: string
      blocks?: NonNullable<Page['blocks']>
    }

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Missing Required Fields: title and slug are mandatory.' },
        { status: 400 }
      )
    }

    // 2. Initialize Payload Local API
    const payload = await getPayloadClient()

    // 3. Check for existing page by slug
    const existingPages = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })

    let result: Page

    if (existingPages.docs.length > 0) {
      // 4. Update Existing Document
      const existingPage = existingPages.docs[0]
      result = await payload.update({
        collection: 'pages',
        id: existingPage.id,
        data: {
          title,
          slug,
          blocks,
        },
      }) as unknown as Page
    } else {
      // 5. Create New Document
      result = await payload.create({
        collection: 'pages',
        data: {
          title,
          slug,
          blocks,
        },
      }) as unknown as Page
    }

    return NextResponse.json(
      {
        success: true,
        action: existingPages.docs.length > 0 ? 'updated' : 'created',
        doc: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auto-Seeder Pipeline Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error: Failed to seed page data.' },
      { status: 500 }
    )
  }
}
