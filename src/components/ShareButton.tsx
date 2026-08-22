import { useState } from 'react'
import { track } from '../lib/analytics'

/** Native share where available, clipboard fallback otherwise. */
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false)

  async function share(): Promise<void> {
    track('share_click', { path })
    const url = window.location.href
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, url })
        return
      }
      throw new Error('share-unavailable')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        /* clipboard unavailable */
      }
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      <span aria-hidden>🔗</span> {copied ? 'Link copied!' : 'Share'}
    </button>
  )
}
