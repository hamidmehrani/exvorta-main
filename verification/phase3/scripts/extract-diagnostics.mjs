import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const lighthouseDir = path.resolve(__dirname, '../lighthouse')
const diagnosticsDir = path.resolve(__dirname, '../diagnostics')

if (!fs.existsSync(diagnosticsDir)) {
  fs.mkdirSync(diagnosticsDir, { recursive: true })
}

const targetRoutes = ['home', 'ecosystem', 'rfq', 'portfolio']

const summary = {}

for (const route of targetRoutes) {
  const lhFile = path.join(lighthouseDir, `${route}.json`)
  if (!fs.existsSync(lhFile)) {
    console.warn(`Lighthouse file not found: ${lhFile}`)
    continue
  }

  const data = JSON.parse(fs.readFileSync(lhFile, 'utf8'))
  const audits = data.audits || {}

  const diag = {
    route,
    performanceScore: Math.round((data.categories?.performance?.score || 0) * 100),
    totalBlockingTime: audits['total-blocking-time'] ? {
      score: audits['total-blocking-time'].score,
      displayValue: audits['total-blocking-time'].displayValue,
      numericValue: audits['total-blocking-time'].numericValue,
    } : null,
    firstContentfulPaint: audits['first-contentful-paint'] ? {
      displayValue: audits['first-contentful-paint'].displayValue,
      numericValue: audits['first-contentful-paint'].numericValue,
    } : null,
    speedIndex: audits['speed-index'] ? {
      displayValue: audits['speed-index'].displayValue,
      numericValue: audits['speed-index'].numericValue,
    } : null,
    interactive: audits['interactive'] ? {
      displayValue: audits['interactive'].displayValue,
      numericValue: audits['interactive'].numericValue,
    } : null,
    bootupTime: audits['bootup-time'] ? {
      displayValue: audits['bootup-time'].displayValue,
      numericValue: audits['bootup-time'].numericValue,
      items: audits['bootup-time'].details?.items || [],
    } : null,
    mainthreadWorkBreakdown: audits['mainthread-work-breakdown'] ? {
      displayValue: audits['mainthread-work-breakdown'].displayValue,
      numericValue: audits['mainthread-work-breakdown'].numericValue,
      items: audits['mainthread-work-breakdown'].details?.items || [],
    } : null,
    unusedJavascript: audits['unused-javascript'] ? {
      displayValue: audits['unused-javascript'].displayValue,
      numericValue: audits['unused-javascript'].numericValue,
      items: audits['unused-javascript'].details?.items || [],
    } : null,
  }

  const outFile = path.join(diagnosticsDir, `${route}.json`)
  fs.writeFileSync(outFile, JSON.stringify(diag, null, 2))
  console.log(`Saved diagnostic for ${route} to ${outFile}`)
  summary[route] = {
    score: diag.performanceScore,
    tbt: diag.totalBlockingTime?.displayValue,
    bootup: diag.bootupTime?.displayValue,
    mainThread: diag.mainthreadWorkBreakdown?.displayValue,
    unusedJsSavings: diag.unusedJavascript?.displayValue,
    topScripts: diag.bootupTime?.items?.slice(0, 3).map(i => ({
      url: i.url.split('/').pop().split('?')[0],
      total: `${Math.round(i.total)}ms`,
      scripting: `${Math.round(i.scripting)}ms`,
    })) || []
  }
}

const summaryFile = path.join(diagnosticsDir, 'diagnostics-summary.json')
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2))
console.log('\n--- DIAGNOSTICS SUMMARY ---')
console.log(JSON.stringify(summary, null, 2))
