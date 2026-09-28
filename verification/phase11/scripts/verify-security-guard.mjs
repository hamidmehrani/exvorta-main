import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testSecurityGuard() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  console.log('=== Turnstile Dummy-Key Security Guard Verification ===\n')

  // Set production environment
  process.env.NODE_ENV = 'production'
  process.env.TURNSTILE_SECRET_KEY = '1x0000000000000000000000000000000aa'

  // Test 1: Flag absent -> MUST THROW Security Exception
  delete process.env.ALLOW_TEST_TURNSTILE_KEY
  const { verifyTurnstile } = await import('../../../lib/rate-limit.ts')

  let test1Passed = false
  try {
    await verifyTurnstile('dummy-token')
  } catch (err) {
    if (err.message.includes('[Security Exception]')) {
      test1Passed = true
      console.log('✓ Test 1 PASSED: Flag absent -> Threw Security Exception as expected in production.')
      console.log(`  Message: "${err.message}"`)
    } else {
      console.error('✗ Test 1 FAILED: Unexpected error message:', err.message)
    }
  }
  results.tests.push({
    name: 'Flag absent in production',
    passed: test1Passed,
    expected: 'Security Exception thrown',
    result: test1Passed ? 'Blocked' : 'Allowed (VULNERABLE)'
  })
  assert.strictEqual(test1Passed, true, 'Test 1: Default absent flag must throw Security Exception in production')

  // Test 2: Flag explicitly 'false' -> MUST THROW Security Exception
  process.env.ALLOW_TEST_TURNSTILE_KEY = 'false'
  let test2Passed = false
  try {
    await verifyTurnstile('dummy-token')
  } catch (err) {
    if (err.message.includes('[Security Exception]')) {
      test2Passed = true
      console.log('✓ Test 2 PASSED: Flag="false" -> Threw Security Exception as expected.')
    }
  }
  results.tests.push({
    name: 'Flag explicitly false in production',
    passed: test2Passed,
    expected: 'Security Exception thrown',
    result: test2Passed ? 'Blocked' : 'Allowed (VULNERABLE)'
  })
  assert.strictEqual(test2Passed, true, 'Test 2: ALLOW_TEST_TURNSTILE_KEY=false must throw Security Exception')

  // Test 3: Flag explicitly 'true' -> MUST ALLOW test key and query Cloudflare
  process.env.ALLOW_TEST_TURNSTILE_KEY = 'true'
  let test3Passed = false
  try {
    const verified = await verifyTurnstile('XXXX.DUMMY.TOKEN.XXXX')
    test3Passed = true
    console.log(`✓ Test 3 PASSED: Flag="true" -> Permitted dummy key for local test run, verification result: ${verified}`)
  } catch (err) {
    console.error('✗ Test 3 FAILED: Threw unexpectedly when ALLOW_TEST_TURNSTILE_KEY=true:', err)
  }
  results.tests.push({
    name: 'Flag explicitly true in production test run',
    passed: test3Passed,
    expected: 'Permitted and queried siteverify',
    result: test3Passed ? 'Allowed for test' : 'Threw error'
  })
  assert.strictEqual(test3Passed, true, 'Test 3: ALLOW_TEST_TURNSTILE_KEY=true must allow test key')

  // Save evidence
  const outDir = path.resolve(__dirname, '../security')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'security-guard-test-results.json'), JSON.stringify(results, null, 2))
  console.log(`\nAll 3 unit security tests passed! Evidence written to ${path.join(outDir, 'security-guard-test-results.json')}`)
}

testSecurityGuard().catch(err => {
  console.error('Security test failed:', err)
  process.exit(1)
})
