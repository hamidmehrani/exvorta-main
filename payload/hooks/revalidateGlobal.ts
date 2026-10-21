import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Public pages read globals (navigation, footer, site settings…) through
 * `getCachedGlobal` and are statically cached. Publishing a change must bust
 * both the data cache entry for that global and the rendered layout.
 */
export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    try {
      revalidateTag(`global-${slug}`)
      revalidatePath('/', 'layout')
    } catch (e) {
      // Standalone CLI scripts (seed, migrate) run outside a Next request.
      if (!(e instanceof Error && e.message.includes('static generation store missing'))) {
        console.error(`Failed to revalidate global "${slug}":`, e)
      }
    }
    return doc
  }

export default revalidateGlobal
