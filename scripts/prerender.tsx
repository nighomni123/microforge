/**
 * Prerender step: turns the SPA build into real crawlable HTML — one
 * dist/<route>/index.html per route, with full head tags and rendered content.
 *
 * Runs after `vite build` via `pnpm build`. Uses Vite's ssrLoadModule so the
 * same source (and the same import.meta.glob registry) powers client, SSR and
 * sitemap. No puppeteer, no extra runtime deps.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'
import type { PageMeta } from '../src/lib/meta'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(projectRoot, 'dist')

interface MetaModule {
  pageMetaFor: (pathname: string) => PageMeta
  allSiteUrls: () => string[]
}
interface SiteModule {
  SITE: { url: string; name: string }
}
interface ServerModule {
  render: (url: string) => string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function headHtml(meta: PageMeta, siteUrl: string): string {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex" />' : '',
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:image" content="${escapeHtml(siteUrl)}/og-default.png" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    ...(meta.jsonLd ?? []).map(
      (obj) =>
        `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
  return tags.filter(Boolean).join('\n    ')
}

function injectIntoShell(shell: string, bodyHtml: string, head: string): string {
  let out = shell.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`)
  out = out.replace(/<title>.*?<\/title>/s, '')
  out = out.replace('</head>', `    ${head}\n</head>`)
  return out
}

function writePage(url: string, html: string): void {
  const filePath =
    url === '/' ? path.join(distDir, 'index.html') : path.join(distDir, url, 'index.html')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, html)
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
  const serverModule = (await vite.ssrLoadModule('/src/entry-server.tsx')) as unknown as ServerModule

  const shell = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
  if (!shell.includes('<div id="root"></div>')) {
    throw new Error('dist/index.html does not contain the expected <div id="root"></div> mount')
  }

  let count = 0
  for (const url of metaModule.allSiteUrls()) {
    const bodyHtml = serverModule.render(url)
    const head = headHtml(metaModule.pageMetaFor(url), siteModule.SITE.url)
    writePage(url, injectIntoShell(shell, bodyHtml, head))
    count++
  }

  // Cloudflare Pages / static hosts use 404.html as the not-found document.
  {
    const notFoundUrl = '/this-page-does-not-exist'
    const bodyHtml = serverModule.render(notFoundUrl)
    const head = headHtml(metaModule.pageMetaFor(notFoundUrl), siteModule.SITE.url)
    fs.writeFileSync(path.join(distDir, '404.html'), injectIntoShell(shell, bodyHtml, head))
  }

  console.log(`prerender: wrote ${count} page(s) + 404.html`)
} finally {
  await vite.close()
}
