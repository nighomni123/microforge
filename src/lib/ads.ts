let requested = false

/**
 * Load the AdSense library exactly once, after consent has been granted.
 * The AdSlot components handle individual ad units.
 */
export function loadAdsense(clientId: string): void {
  if (requested) return
  if (document.querySelector('script[data-mf-adsense]')) {
    requested = true
    return
  }
  requested = true
  const script = document.createElement('script')
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-mf-adsense', 'true')
  document.head.appendChild(script)
}
