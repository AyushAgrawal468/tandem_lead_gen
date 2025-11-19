import { SitemapStream, streamToPromise } from 'sitemap'
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.resolve(projectRoot, 'public')

// Configure your site URL via env, falls back to localhost for dev
const SITE_URL_RAW = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://tandem.it.com'
const SITE_URL = SITE_URL_RAW.replace(/\/$/, '')

// Define your routes here. SPA anchors (like #features) are not part of sitemaps.
const links = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
]

async function main() {
  mkdirSync(publicDir, { recursive: true })

  // Build sitemap.xml
  const smStream = new SitemapStream({ hostname: SITE_URL })
  for (const link of links) smStream.write(link)
  smStream.end()
  const xml = (await streamToPromise(smStream)).toString()

  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  writeFileSync(sitemapPath, xml, 'utf8')

  // Build robots.txt with absolute sitemap URL
  const robots = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
  const robotsPath = path.join(publicDir, 'robots.txt')
  writeFileSync(robotsPath, robots, 'utf8')

  console.log(`✔ Wrote sitemap.xml -> ${sitemapPath}`)
  console.log(`✔ Wrote robots.txt  -> ${robotsPath}`)
  console.log('ℹ Set SITE_URL env to your production domain (e.g., https://example.com)')
}

main().catch((err) => {
  console.error('Failed to generate sitemap:', err)
  process.exit(1)
})
