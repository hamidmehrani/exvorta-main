import { generateTypes } from '../node_modules/payload/dist/bin/generateTypes.js'

async function main() {
  const { default: configPromise } = await import('../payload.config')
  const config = await configPromise

  await generateTypes(config)
  console.log('Types generated successfully.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Error generating types:', err)
  process.exit(1)
})
