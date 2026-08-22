import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { pageMetaFor } from '../lib/meta'
import { SITE } from '../lib/site'

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Client-side head manager for SPA navigation.
 * The prerender step writes identical tags into the static HTML at build time.
 */
export function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = pageMetaFor(pathname)
    document.title = meta.title
    upsertMeta('name', 'description', meta.description)
    if (meta.noindex) {
      upsertMeta('name', 'robots', 'noindex')
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
    }
    upsertCanonical(meta.canonical)
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:url', meta.canonical)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:image', `${SITE.url}/og-default.png`)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', meta.title)
    upsertMeta('name', 'twitter:description', meta.description)

    document.head.querySelectorAll('script[data-mf-jsonld]').forEach((node) => node.remove())
    for (const obj of meta.jsonLd ?? []) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-mf-jsonld', 'true')
      script.textContent = JSON.stringify(obj).replace(/</g, '\\u003c')
      document.head.appendChild(script)
    }
  }, [pathname])

  return null
}
