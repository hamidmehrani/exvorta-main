import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getCanonicalBaseline } from '../../phase8/scripts/canonical-baseline.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outDir = path.resolve(__dirname, '../lighthouse')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const nodePath = '/home/hamid/.nvm/versions/node/v20.20.2/bin'

function runLighthouse(url, outFile) {
  const cmd = `npx -y lighthouse "${url}" --output json --output-path "${outFile}" --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" --max-wait-for-load=60000 --only-categories=performance,accessibility,best-practices,seo --quiet`
  execSync(cmd, {
    stdio: 'inherit',
    env: { ...process.env, PATH: `${nodePath}:${process.env.PATH}` }
  })
  const lh = JSON.parse(fs.readFileSync(outFile, 'utf8'))
  const lcpElement = lh.audits?.['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node
  const consoleAudit = lh.audits?.['errors-in-console'] || {}
  const errors = consoleAudit.details?.items || []

  return {
    perf: Math.round((lh.categories.performance?.score || 0) * 100),
    a11y: Math.round((lh.categories.accessibility?.score || 0) * 100),
    bp: Math.round((lh.categories['best-practices']?.score || 0) * 100),
    seo: Math.round((lh.categories.seo?.score || 0) * 100),
    lcp: Math.round(lh.audits?.['largest-contentful-paint']?.numericValue || 0),
    tbt: Math.round(lh.audits?.['total-blocking-time']?.numericValue || 0),
    cls: parseFloat((lh.audits?.['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
    fcp: Math.round(lh.audits?.['first-contentful-paint']?.numericValue || 0),
    si: Math.round(lh.audits?.['speed-index']?.numericValue || 0),
    consoleErrorsCount: errors.length,
    lcpSelector: lcpElement?.selector || 'N/A'
  }
}

async function runBenchmark() {
  console.log('Starting 3-run mobile Lighthouse benchmark on static RFQ...');
  const runs = [];

  for (let i = 1; i <= 3; i++) {
    const outFile = path.join(outDir, `rfq-static-mobile-run${i}.json`);
    console.log(`\n--- Run ${i}/3 ---`);
    const metrics = runLighthouse('http://localhost:3000/rfq', outFile);
    runs.push(metrics);
    console.log(`Run ${i} Result: Perf=${metrics.perf} | LCP=${metrics.lcp}ms | TBT=${metrics.tbt}ms | CLS=${metrics.cls}`);
  }

  const sorted = [...runs].sort((a, b) => a.perf - b.perf);
  const median = sorted[1];
  const minPerf = sorted[0].perf;
  const maxPerf = sorted[2].perf;
  const spread = maxPerf - minPerf;

  const canonicalP5 = getCanonicalBaseline('rfq');
  const phase7MedianPerf = 73;

  const summary = {
    timestamp: new Date().toISOString(),
    route: 'rfq',
    url: 'http://localhost:3000/rfq',
    formFactor: 'mobile',
    runs: runs.map(r => r.perf),
    spread,
    median: {
      perf: median.perf,
      lcp: median.lcp,
      tbt: median.tbt,
      cls: median.cls,
      fcp: median.fcp,
      si: median.si,
      a11y: median.a11y,
      bp: median.bp,
      seo: median.seo,
      lcpSelector: median.lcpSelector
    },
    comparison: {
      p5CanonicalPerf: canonicalP5.mobile.perf,
      p7MedianPerf: phase7MedianPerf,
      currentMedianPerf: median.perf,
      deltaVsP7: median.perf - phase7MedianPerf,
      deltaVsP5: median.perf - canonicalP5.mobile.perf
    }
  };

  const summaryFile = path.join(outDir, 'rfq-static-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

  console.log('\n================ STATIC BENCHMARK COMPLETED ================');
  console.log(`Runs: [${runs.map(r => r.perf).join(', ')}]`);
  console.log(`Median Perf: ${median.perf} (Spread: ${spread})`);
  console.log(`Median LCP: ${median.lcp}ms | Median TBT: ${median.tbt}ms | CLS: ${median.cls}`);
}

runBenchmark().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
