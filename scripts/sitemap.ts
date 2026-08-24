/**
 * Post-build step: generates dist/sitemap.xml and dist/robots.txt from the
 * live tool registry. Runs after prerender via `pnpm build`.
 */
// SSR modules read import.meta.env.PROD from process.env.NODE_ENV (not the
// Vite server mode) — pin it so the registry sees production visibility.
process.env.NODE_ENV = 'production'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(projectRoot, 'dist')

interface MetaModule {
  allSiteUrls: () => string[]
}
interface SiteModule {
  SITE: { url: string }
}

const vite = await createViteServer({
  // Production mode: honors .env.production (VITE_SITE_URL) in SSR modules.
  mode: 'production',
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const metaModule = (await vite.ssrLoadModule('/src/lib/meta.ts')) as unknown as MetaModule
  const siteModule = (await vite.ssrLoadModule('/src/lib/site.ts')) as unknown as SiteModule
  const siteUrl = siteModule.SITE.url

  const urls = metaModule.allSiteUrls()
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (url) =>
          `  <url><loc>${siteUrl}${url === '/' ? '/' : url}</loc><changefreq>weekly</changefreq></url>`,
      )
      .join('\n') +
    `\n</urlset>\n`
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

  const robots =
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robots)

  console.log(`sitemap: ${urls.length} URL(s) → dist/sitemap.xml (+ robots.txt)`)
} finally {
  await vite.close()
}
