## Recovery Log

- **Commit:** `git rev-parse HEAD` (will be the latest commit)
- **Tag:** v1.0-stable
- **Rollback command:** `git checkout v1.0-stable`

### What the routing issue was
The site experienced a catastrophic routing failure where ALL routes were falling back to `not-found.tsx` (which rendered a "Page not found. Return to Homepage" message), despite the database and routes being healthy.

The root cause was a subtle but fatal bug in the Payload caching layer (`lib/payload-cache.ts`). The `getCachedPage` function was using Next.js's `unstable_cache` with a static key array: `['payload-page']`. 

Because the cache key did not include the dynamic `slug`, the very first call to `getCachedPage` (which likely hit a non-existent page like `/robots.txt` or a random `[...slug]` route during build/initial load) cached a `null` response globally under the `['payload-page']` key. Every subsequent page request, including `/` (home), used this poisoned cache key, received `null`, and triggered Next.js's `notFound()`.

### What file(s) were changed
- `lib/payload-cache.ts`
  - Added `slug` to the `unstable_cache` key array (`['payload-page', slug]`) so each route caches independently.

### Why this fix works
By dynamically appending the `slug` to the cache key, `unstable_cache` now correctly creates separate cache entries for each page (e.g., `['payload-page', 'home']`). This prevents a 404 on one page from globally poisoning the CMS data fetch for all other pages.

### How to verify
1. Start the server (`npm run build && npm start`)
2. Visit `http://localhost:3000/` – The homepage should render normally instead of showing the "Page not found" error boundary.
3. Visit `http://localhost:3000/portfolio` and other routes to confirm global routing restoration.

### Rollback instructions
If this fix causes unforeseen issues, revert to the stable tag:
```bash
git checkout v1.0-stable
```
