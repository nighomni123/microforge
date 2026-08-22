import { CATEGORY_META } from './categories'
import { getTool, liveCategories, liveTools } from './tools'
import { SITE } from './site'

export interface PageMeta {
  title: string
  description: string
  canonical: string
  jsonLd?: object[]
  noindex?: boolean
}

function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`
}

const STATIC_PAGES: Record<string, { title: string; description: string }> = {
  '/about': {
    title: `About ${SITE.name}`,
    description: `What ${SITE.name} is, how the tools work, and why everything runs in your browser.`,
  },
  '/contact': {
    title: `Contact ${SITE.name}`,
    description: `Report a bug, suggest a tool, or ask a question about ${SITE.name}.`,
  },
  '/privacy': {
    title: `Privacy Policy — ${SITE.name}`,
    description: `How ${SITE.name} handles data: local storage, analytics, advertising cookies and your choices.`,
  },
  '/terms': {
    title: `Terms of Use — ${SITE.name}`,
    description: `Simple terms for using the free tools on ${SITE.name}.`,
  },
}

function homeMeta(): PageMeta {
  return {
    title: `${SITE.name} — Free Calculators, Generators & Web Tools`,
    description: SITE.description,
    canonical: absoluteUrl('/'),
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url }],
  }
}

function notFoundMeta(): PageMeta {
  return {
    title: `Page Not Found — ${SITE.name}`,
    description: 'This page does not exist. Browse free calculators, generators and web tools instead.',
    canonical: absoluteUrl('/'),
    noindex: true,
  }
}

function toolMeta(path: string): PageMeta | undefined {
  const match = /^\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(path)
  if (!match) return undefined
  const [, category, slug] = match
  const tool = getTool(slug)
  if (!tool || tool.category !== category) return undefined

  const canonical = absoluteUrl(`/${tool.category}/${tool.slug}`)
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.title,
      url: canonical,
      description: tool.metaDescription,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: tool.currencyCode ?? 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: CATEGORY_META[tool.category].label,
          item: absoluteUrl(`/category/${tool.category}`),
        },
        { '@type': 'ListItem', position: 3, name: tool.title, item: canonical },
      ],
    },
  ]
  return { title: tool.metaTitle, description: tool.metaDescription, canonical, jsonLd }
}

/** Single source of truth for head tags — used by <Seo/> and by prerender. */
export function pageMetaFor(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/'

  const tool = toolMeta(path)
  if (tool) return tool

  if (path === '/') return homeMeta()

  const staticPage = STATIC_PAGES[path]
  if (staticPage) return { ...staticPage, canonical: absoluteUrl(path) }

  if (path.startsWith('/category/')) {
    const category = path.slice('/category/'.length)
    const known = (liveCategories() as string[]).includes(category)
    if (known) {
      const meta = CATEGORY_META[category as keyof typeof CATEGORY_META]
      return {
        title: `Free Online ${meta.label} — ${SITE.name}`,
        description: meta.blurb,
        canonical: absoluteUrl(path),
      }
    }
  }

  return notFoundMeta()
}

/** Every indexable URL — used by the prerender step and sitemap.xml (live tools only). */
export function allSiteUrls(): string[] {
  const urls = ['/', ...Object.keys(STATIC_PAGES)]
  for (const category of liveCategories()) urls.push(`/category/${category}`)
  for (const tool of liveTools) urls.push(`/${tool.category}/${tool.slug}`)
  return urls
}
