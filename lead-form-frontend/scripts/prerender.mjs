// Handoff 1.6: Playwright snapshot of the crawlable routes, run after `vite build`.
// Run on a laptop or in CI, never on the server (snapshot rule 6). Usage:
//   npm run build:site                       (build + snapshot)
//   PRERENDER_ROUTES=/,/swipe,/faq npm run build:site
//   npm run build:site -- --allow-warnings   (write pages even if a rule check fails)
//
// Contract with the app (rules 1-5):
//   - each route is loaded with ?prerender=1; pages can read it to skip intro animations
//   - a page may set window.__PRERENDER_READY = true when settled; otherwise we wait for
//     network idle plus a short settle
//   - event cards carry data-event-card and must not be in the saved HTML
import { chromium } from 'playwright'
import http from 'node:http'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const ROUTES = (process.env.PRERENDER_ROUTES || '/,/swipe').split(',').map((r) => r.trim()).filter(Boolean)
const ALLOW_WARNINGS = process.argv.includes('--allow-warnings')
const READY_TIMEOUT_MS = 4000

// Rule: the homepage snapshot overwrites dist/index.html, so keep the untouched build as the
// SPA fallback first. A second run must not copy an already-prerendered page over it.
const indexPath = path.join(DIST, 'index.html')
const spaPath = path.join(DIST, 'spa.html')
if (!readFileSync(indexPath, 'utf8').includes('data-prerendered')) copyFileSync(indexPath, spaPath)
const spaHtml = readFileSync(spaPath, 'utf8')
// Scripts the real page ships; anything else in the DOM was injected at runtime (Helmet,
// GA/Clarity/Pixel loaders) and would run twice if saved into the snapshot.
const shippedScriptSrcs = [...spaHtml.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1])

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json',
  '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' }

// Static server with the same fallback as nginx: file, else spa.html.
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let file = path.join(DIST, urlPath)
  if (!file.startsWith(DIST) || !existsSync(file) || !path.extname(file)) file = spaPath
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
  res.end(readFileSync(file))
})
await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch()
// Fresh context: no localStorage, no detected city, no UTM (rule 5)
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
// Only our own files load: no analytics hits, no API calls, nothing visitor-specific
await context.route('**/*', (route) => (route.request().url().startsWith(base) ? route.continue() : route.abort()))

const problems = []
for (const route of ROUTES) {
  const page = await context.newPage()
  await page.goto(`${base}${route}?prerender=1`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__PRERENDER_READY === true, null, { timeout: READY_TIMEOUT_MS }).catch(() => {})
  await page.waitForTimeout(500)

  const { html, issues } = await page.evaluate((shipped) => {
    const issues = []
    // Rule 4: full head before saving
    if (!document.title.trim()) issues.push('missing <title>')
    if (!document.querySelector('meta[name="description"]')?.content?.trim()) issues.push('missing meta description')
    // Rule 3: no live event cards in static HTML
    const cards = document.querySelectorAll('[data-event-card]').length
    if (cards) issues.push(`${cards} event card(s) in the HTML`)
    // Rule 2 (trap): no text saved invisible
    const hidden = []
    for (const el of document.body.querySelectorAll('*')) {
      const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ')
      if (text.length < 3) continue
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).opacity === '0') { hidden.push(text.slice(0, 40)); break }
      }
    }
    if (hidden.length) issues.push(`text at opacity 0: ${hidden.slice(0, 5).map((t) => JSON.stringify(t)).join(', ')}${hidden.length > 5 ? ` (+${hidden.length - 5})` : ''}`)

    // Rule 5 + no double-loading: strip runtime-injected scripts/iframes and per-visitor state
    for (const s of document.querySelectorAll('script[data-react-helmet], script[src]')) {
      if (s.hasAttribute('data-react-helmet') || !shipped.includes(s.getAttribute('src'))) s.remove()
    }
    document.querySelectorAll('iframe').forEach((f) => f.remove())
    document.documentElement.removeAttribute('style') // --vh from main.jsx is this viewport's, not the visitor's
    document.documentElement.setAttribute('data-prerendered', '')
    return { html: '<!doctype html>\n' + document.documentElement.outerHTML, issues }
  }, shippedScriptSrcs)

  const out = route === '/' ? indexPath : path.join(DIST, route.replace(/^\//, ''), 'index.html')
  mkdirSync(path.dirname(out), { recursive: true })
  writeFileSync(out, html, 'utf8')
  issues.forEach((i) => problems.push(`${route}: ${i}`))
  console.log(`✔ ${route} -> ${path.relative(DIST, out)}${issues.length ? `  (${issues.length} issue(s))` : ''}`)
  await page.close()
}

await browser.close()
server.close()

if (problems.length) {
  console.error(`\n✖ Snapshot rule check failed:\n  - ${problems.join('\n  - ')}`)
  if (!ALLOW_WARNINGS) process.exit(1)
  console.error('  (--allow-warnings: pages written anyway)')
}
