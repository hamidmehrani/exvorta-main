import { spawn } from 'child_process'

const p = spawn('npx', ['tsx', '--env-file=.env', 'scripts/seed-master.ts'], {
  env: { ...process.env, NODE_OPTIONS: '--require ./scripts/next-env-shim.cjs' }
})

p.stdout.on('data', (data) => {
  const str = data.toString()
  process.stdout.write(str)
  if (str.includes('rename column') || str.includes('Is ') || str.includes('?')) {
    p.stdin.write('\r') // carriage return
  }
})

p.stderr.on('data', (data) => {
  process.stderr.write(data.toString())
})

p.on('close', (code) => {
  process.exit(code)
})
