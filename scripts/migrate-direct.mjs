import { config } from 'dotenv'
config({ path: '.env' })
config({ path: '.env.local' })
import { getPayload } from 'payload'

console.log("PAYLOAD_SECRET:", process.env.PAYLOAD_SECRET ? "exists" : "missing")
console.log("DATABASE_URI:", process.env.DATABASE_URI ? "exists" : "missing")
process.env.DATABASE_URI = process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI

const { default: payloadConfig } = await import('../payload.config.ts')
const payload = await getPayload({config: payloadConfig})
await payload.db.migrate()
console.log('MIGRATED')
process.exit(0)
