import { getConsent } from './consent'

type Props = Record<string, string | number | boolean>

/**
 * Privacy-first measurement:
 * - No script is injected until the visitor grants consent.
 * - Umami (cookieless) is the default; GA4 is optional via env.
 * - track() is a no-op without consent, so denied users are never measured.
 */

function injectScript(id: string, src: string, attrs: Record<string, string> = {}): void {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.async = true
  for (const [key, value] of Object.entries(attrs)) script.setAttribute(key, value)
  document.head.appendChild(script)
}

/** Load measurement scripts. Safe to call repeatedly; only runs after consent. */
export function initMeasurement(): void {
  if (getConsent() !== 'granted') return
  const env = import.meta.env

  const umamiUrl = env.VITE_UMAMI_URL as string | undefined
  const umamiId = env.VITE_UMAMI_ID as string | undefined
  if (umamiUrl && umamiId) injectScript('mf-umami', umamiUrl, { 'data-website-id': umamiId })

  const gaId = env.VITE_GA_ID as string | undefined
  if (gaId) {
    injectScript('mf-ga', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`)
    if (!document.getElementById('mf-ga-inline')) {
      const inline = document.createElement('script')
      inline.id = 'mf-ga-inline'
      inline.text =
        'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};' +
        `gtag('js',new Date());gtag('config','${gaId}')`
      document.head.appendChild(inline)
    }
  }
}

const lastTracked = new Map<string, number>()

/**
 * Track an event. throttleMs dedupes high-frequency events (e.g. live recompute).
 * Never include user input values — only slugs and coarse counts.
 */
export function track(event: string, props?: Props, throttleMs = 0): void {
  if (getConsent() !== 'granted') return
  if (throttleMs > 0) {
    const now = Date.now()
    if (now - (lastTracked.get(event) ?? 0) < throttleMs) return
    lastTracked.set(event, now)
  }
  const w = window as unknown as {
    umami?: { track?: (event: string, props?: Props) => void }
    gtag?: (...args: unknown[]) => void
  }
  if (typeof w.umami?.track === 'function') {
    w.umami.track(event, props)
  } else if (typeof w.gtag === 'function') {
    w.gtag('event', event, props)
  } else if (import.meta.env.DEV) {
    console.debug('[analytics]', event, props ?? {})
  }
}
