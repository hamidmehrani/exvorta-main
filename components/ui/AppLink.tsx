'use client'

import Link from 'next/link'

/**
 * `next/link` re-exported behind the site's own client boundary.
 *
 * Server components that import `next/link` directly reference Next's shared
 * `link.js` client module. Because the Payload admin bundles that same module,
 * webpack lists the admin's entire chunk group (~1.5 MB of @payloadcms/ui +
 * Lexical) as its dependencies and every public page ends up downloading
 * them. Importing this wrapper instead keeps the reference inside the
 * frontend's own chunks. Client components can keep using `next/link`.
 */
export default Link
