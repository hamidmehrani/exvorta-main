import configPromise from '../payload.config'

async function main() {
  const config = await configPromise
  const dbUri = process.env.DATABASE_URI || 'undefined'
  const maskedUri = dbUri.replace(/:([^:@]+)@/, ':***@')
  console.log('Resolved DATABASE_URI:', maskedUri)
}

main().catch(console.error)
