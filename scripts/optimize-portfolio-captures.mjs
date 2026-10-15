// Turns the raw full-page captures (public/portfolio-<slug>.png, 4–15 MB each)
// into what the site actually serves: 1440px-wide WebP cropped to the first
// 6400px — the portfolio frames only ever show the top of the page plus a
// short hover drift.
//
//   node scripts/capture-portfolio-screenshots.mjs   # writes the PNGs (needs live internet)
//   node scripts/optimize-portfolio-captures.mjs     # PNG → public/portfolio-<slug>.webp
//
// Delete the PNGs afterwards; only the .webp files belong in the repo.
import sharp from 'sharp'
import { existsSync, statSync } from 'node:fs'

const SLUGS = ['spicevo', 'nutave', 'stonvi']
const WIDTH = 1440
const MAX_HEIGHT = 6400

for (const slug of SLUGS) {
  const src = `public/portfolio-${slug}.png`
  if (!existsSync(src)) {
    console.log(`${slug}: no ${src}, skipping`)
    continue
  }
  const { width, height } = await sharp(src).metadata()
  const scaledHeight = Math.round((height * WIDTH) / width)
  const out = `public/portfolio-${slug}.webp`
  await sharp(src)
    .resize({ width: WIDTH })
    .extract({ left: 0, top: 0, width: WIDTH, height: Math.min(scaledHeight, MAX_HEIGHT) })
    .webp({ quality: 78, effort: 6 })
    .toFile(out)
  console.log(`${slug}: ${(statSync(src).size / 1e6).toFixed(1)} MB → ${(statSync(out).size / 1e3).toFixed(0)} KB`)
}
