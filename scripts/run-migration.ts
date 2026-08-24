/*
 * Standalone migration runner — bypasses the `payload` CLI which is broken in
 * this environment by a tsx <-> @next/env ESM/CJS interop bug.
 *
 * Root cause: @next/env's ncc bundle sets `__esModule: true` but defines no
 * `.default` property, so under tsx an ESM `import x from '@next/env'` resolves
 * to `undefined`. Payload's internal `dist/bin/loadEnv.js` then does
 * `nextEnvImport.loadEnvConfig` at module-eval time → TypeError. This crash
 * happens in payload's own transitive imports, so it cannot be fixed from
 * inside this script body — it must be repaired BEFORE payload is imported.
 *
 * Fix: preload `scripts/next-env-shim.cjs` via NODE_OPTIONS. That shim
 * `require()`s @next/env (getting the full namespace) and attaches
 * `.default = module.exports`, which tsx's ESM cache observes too.
 *
 * Usage (always pass the shim via NODE_OPTIONS):
 *   NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" \
 *     npx tsx scripts/run-migration.ts create <migrationName>
 *   NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" \
 *     npx tsx scripts/run-migration.ts run
 *   NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" \
 *     npx tsx scripts/run-migration.ts status
 */
import 'dotenv/config'
import payload from 'payload'
async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  if (!cmd || !['create', 'run', 'status', 'down'].includes(cmd)) {
    console.error('Usage: tsx scripts/run-migration.ts <create|run|status|down> [migrationName]')
    process.exit(1)
  }

  process.env.PAYLOAD_MIGRATING = 'true'

  // Override DATABASE_URI with the unpooled string for migrations BEFORE importing payload.config.ts
  if (process.env.DATABASE_URI_UNPOOLED) {
    process.env.DATABASE_URI = process.env.DATABASE_URI_UNPOOLED
  }

  console.log('--- DB CONNECTION RESOLUTION ---')
  console.log(`Using DATABASE_URI for migration: ${process.env.DATABASE_URI}`)
  console.log('--------------------------------')

  const { default: configPromise } = await import('../payload.config')
  const config = await configPromise

  // For `create`, don't connect to the DB (matches CLI behavior).
  const disableDBConnect = cmd === 'create'

  await payload.init({
    config,
    disableDBConnect,
    disableOnInit: true,
    loggerOptions: {},
  } as any)

  const adapter = payload.db
  if (!adapter) throw new Error('No database adapter found')

  if (cmd === 'create') {
    const migrationName = rest[0]
    if (!migrationName) throw new Error('migrationName required for create')
    await adapter.createMigration({
      file: undefined as any,
      forceAcceptWarning: true,
      migrationName,
      payload,
      skipEmpty: false,
    })
    payload.logger.info({ msg: 'Migration created.' })
  } else if (cmd === 'run') {
    await adapter.migrate()
    payload.logger.info({ msg: 'Migrations applied.' })
  } else if (cmd === 'status') {
    if (typeof (adapter as any).migrateStatus === 'function') {
      await (adapter as any).migrateStatus()
    } else {
      payload.logger.info({ msg: 'migrateStatus not implemented on adapter; running migrate (noop if up to date).' })
    }
  } else if (cmd === 'down') {
    await adapter.migrateDown()
  }

  await payload.destroy()
  process.exit(0)
}

main().catch((err) => {
  console.error('MIGRATION RUNNER FAILED:', err)
  process.exit(1)
})
