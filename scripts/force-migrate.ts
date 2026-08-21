import { getPayload } from 'payload'
import configPromise from '../payload.config'
import path from 'path'
import { fileURLToPath } from 'url'

async function runMigrations() {
  const payload = await getPayload({ config: configPromise })
  
  // Run all pending migrations
  await payload.db.migrate()
  
  console.log('✅ All migrations applied')
  process.exit(0)
}

runMigrations().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
