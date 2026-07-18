/*
 * sync-locales.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Copies the `en` (default) locale data into every other configured locale for
 * the specified localized collections.  Run this once after enabling
 * `localized: true` on blocks/fields so that non-English admin views show the
 * complete block structure instead of an empty page.
 *
 * IMPORTANT: Run via the npm script which injects the @next/env interop shim:
 *
 *   npm run i18n:sync
 *
 * Or manually:
 *   NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" npx tsx scripts/sync-locales.ts
 *
 * Optional flags:
 *   --collections pages,products   Only sync specific collections (comma-separated)
 *   --locales ar,fa                Only sync to specific target locales
 *   --dry-run                      Log what would happen without writing to DB
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * FIX NOTES (v2):
 *
 * The previous version fetched with depth:2 and tried to collapse expanded
 * relationship objects `{ id, title, slug, ... }` back into bare IDs using a
 * fragile heuristic.  That heuristic also matched block sub-array items (which
 * legitimately have `id` + `title` + other fields), stripping their content
 * fields and causing validation errors.
 *
 * v2 approach:
 *   1. Fetch with depth:0  — Payload returns relationship fields as bare IDs
 *      already (strings/numbers), so there is nothing to collapse.
 *   2. Strip `id` only from blocks[] and array[] items — these internal DB row
 *      IDs conflict with the new locale rows Payload tries to INSERT. By omitting
 *      them Payload generates fresh IDs for every locale partition.
 *   3. Never touch the content fields (title, description, etc.) inside those
 *      items — they are plain scalar values that must be preserved.
 *   4. Top-level doc system fields (createdAt, updatedAt, _status, globalType)
 *      are stripped from the outer shell only.
 */

import payload from 'payload'
import configPromise from '../payload.config'

// ─── Configuration ────────────────────────────────────────────────────────────

/** Collections whose localized fields/blocks should be synced. */
const LOCALIZED_COLLECTIONS = ['pages', 'products', 'categories'] as const
type LocalizedCollection = (typeof LOCALIZED_COLLECTIONS)[number]

/**
 * Top-level document system fields that Payload manages internally.
 * We strip them from the outer doc shell before passing to payload.update().
 */
const TOP_LEVEL_STRIP = new Set([
  'id',
  'createdAt',
  'updatedAt',
  '_status',
  'globalType',
])

// ─── Sanitization (v2) ────────────────────────────────────────────────────────

/**
 * Walk the value tree and strip `id` from every object that lives inside an
 * array.  These are Payload's internal row IDs for blocks and array items —
 * they must be absent so Payload generates new IDs when inserting rows for the
 * target locale.
 *
 * Critically, we do NOT:
 *   - modify scalar values (strings, numbers, booleans, null)
 *   - collapse any object to a bare ID (that was the v1 bug)
 *   - strip content fields like `title`, `description`, `blockType`, etc.
 *
 * We fetch with depth:0, so relationship fields already arrive as bare ID
 * scalars — no special handling required for relations.
 */
function sanitizeArrayItem(item: unknown): unknown {
  if (item === null || item === undefined) return item

  if (Array.isArray(item)) {
    // Recurse into nested arrays (e.g. blocks inside blocks, if any)
    return item.map(sanitizeArrayItem)
  }

  if (typeof item === 'object') {
    const obj = item as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'id') continue // ← strip internal row ID so Payload auto-assigns a new one
      if (Array.isArray(v)) {
        // Recurse into nested arrays, applying the same id-strip to their items
        out[k] = v.map(sanitizeArrayItem)
      } else if (v !== null && typeof v === 'object') {
        // Plain group/nested object — recurse but do NOT strip its id
        // (groups don't have separate DB rows, so their id is irrelevant anyway)
        out[k] = sanitizeNestedObject(v as Record<string, unknown>)
      } else {
        // Scalar (string, number, boolean, null) — copy verbatim
        out[k] = v
      }
    }
    return out
  }

  return item
}

/**
 * Walk a plain nested object (group field) and recurse into any arrays inside
 * it.  We strip `id` from the array items but preserve the group object itself.
 */
function sanitizeNestedObject(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'id') continue // groups rarely have ids but strip if present
    if (Array.isArray(v)) {
      out[k] = v.map(sanitizeArrayItem)
    } else if (v !== null && typeof v === 'object') {
      out[k] = sanitizeNestedObject(v as Record<string, unknown>)
    } else {
      out[k] = v
    }
  }
  return out
}

/**
 * Build the final data payload for payload.update() from a raw Payload doc.
 * - Strips top-level system fields.
 * - Strips `id` from every block/array item (preserving all content fields).
 * - Leaves scalar and relationship (bare ID) fields untouched.
 */
function buildUpdateData(doc: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(doc)) {
    // Strip top-level system fields
    if (TOP_LEVEL_STRIP.has(k)) continue

    if (Array.isArray(v)) {
      // blocks[] or top-level array fields — strip id from each item
      out[k] = v.map(sanitizeArrayItem)
    } else if (v !== null && typeof v === 'object') {
      // Group / tabs wrapper — recurse but don't strip group's own id
      out[k] = sanitizeNestedObject(v as Record<string, unknown>)
    } else {
      // Scalar or bare relationship ID — copy verbatim
      out[k] = v
    }
  }

  return out
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFlag(flag: string): string | null {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return null
  return process.argv[idx + 1] ?? null
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag)
}

/** Retry a failed update once after a short delay (handles transient DB blips). */
async function updateWithRetry(
  params: Parameters<typeof payload.update>[0],
  retries = 2,
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await payload.update(params)
      return
    } catch (err) {
      if (attempt === retries) throw err
      const wait = attempt * 500
      console.warn(
        `    ⚠ Attempt ${attempt} failed, retrying in ${wait}ms…`,
        (err as Error).message,
      )
      await new Promise((r) => setTimeout(r, wait))
    }
  }
}

// ─── Core sync logic ──────────────────────────────────────────────────────────

async function syncCollection(
  collectionSlug: LocalizedCollection,
  targetLocales: string[],
  isDryRun: boolean,
): Promise<{ synced: number; failed: number }> {
  console.log(`\n📦  Collection: ${collectionSlug}`)

  // depth:0 — relations come back as bare IDs (strings/numbers), not objects.
  // This is intentional and avoids the relationship-collapsing bug from v1.
  const { docs, totalDocs } = await payload.find({
    collection: collectionSlug,
    locale: 'en',
    depth: 0,
    limit: 1000,
    overrideAccess: true,
  })

  if (totalDocs === 0) {
    console.log('   (no documents — skipping)')
    return { synced: 0, failed: 0 }
  }

  console.log(`   Found ${totalDocs} document(s) in EN locale`)

  let synced = 0
  let failed = 0

  for (const doc of docs) {
    const rawDoc = doc as Record<string, unknown>
    const docId = rawDoc['id'] as string | number
    const docTitle = rawDoc['title'] ?? rawDoc['slug'] ?? docId
    console.log(`\n   📄  Doc: "${docTitle}" (id: ${docId})`)

    const updateData = buildUpdateData(rawDoc)

    for (const locale of targetLocales) {
      if (isDryRun) {
        const blockCount = Array.isArray(updateData['blocks'])
          ? updateData['blocks'].length
          : '—'
        console.log(
          `      [DRY RUN] Would sync → locale: ${locale}  (blocks: ${blockCount})`,
        )
        synced++
        continue
      }

      try {
        await updateWithRetry({
          collection: collectionSlug,
          id: docId,
          locale,
          data: updateData,
          overrideAccess: true,
          depth: 0,
        } as Parameters<typeof payload.update>[0])

        console.log(`      ✅  locale: ${locale}`)
        synced++
      } catch (err) {
        const msg = (err as Error).message ?? String(err)
        console.error(`      ❌  locale: ${locale} — ${msg}`)
        failed++
      }
    }
  }

  return { synced, failed }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = hasFlag('--dry-run')

  const collectionsFlag = getFlag('--collections')
  const targetCollections: LocalizedCollection[] = collectionsFlag
    ? (collectionsFlag.split(',').map((s) => s.trim()) as LocalizedCollection[])
    : [...LOCALIZED_COLLECTIONS]

  for (const col of targetCollections) {
    if (!(LOCALIZED_COLLECTIONS as readonly string[]).includes(col)) {
      console.error(
        `❌ Unknown collection: "${col}". Valid options: ${LOCALIZED_COLLECTIONS.join(', ')}`,
      )
      process.exit(1)
    }
  }

  process.env.PAYLOAD_MIGRATING = 'true'
  const config = await configPromise

  const allLocales: string[] =
    config.localization && 'locales' in config.localization
      ? (config.localization.locales as Array<string | { code: string }>).map((l) =>
          typeof l === 'string' ? l : l.code,
        )
      : ['en', 'ar', 'fa', 'tr', 'es']

  const defaultLocale =
    config.localization && 'defaultLocale' in config.localization
      ? (config.localization.defaultLocale as string)
      : 'en'

  const localesFlag = getFlag('--locales')
  const targetLocales: string[] = localesFlag
    ? localesFlag.split(',').map((s) => s.trim())
    : allLocales.filter((l) => l !== defaultLocale)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🌍  Payload Locale Sync Script  [v2 — depth:0 sanitizer]')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`   Source locale  : ${defaultLocale}`)
  console.log(`   Target locales : ${targetLocales.join(', ')}`)
  console.log(`   Collections    : ${targetCollections.join(', ')}`)
  if (isDryRun) console.log('   ⚠️  DRY RUN MODE — no changes will be written')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await payload.init({
    config,
    disableDBConnect: false,
    disableOnInit: true,
    loggerOptions: { level: 'warn' },
  } as Parameters<typeof payload.init>[0])

  let totalSynced = 0
  let totalFailed = 0

  for (const col of targetCollections) {
    const { synced, failed } = await syncCollection(col, targetLocales, isDryRun)
    totalSynced += synced
    totalFailed += failed
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅  Done!  ${totalSynced} locale entries synced,  ${totalFailed} failed.`)
  if (totalFailed > 0) {
    console.log('   Review the ❌ errors above and re-run to retry failed docs.')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await payload.destroy()
  process.exit(totalFailed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('\n💥  SYNC SCRIPT CRASHED:', err)
  process.exit(1)
})
