import { useEffect, useState } from 'react'
import { AdSlot } from './AdSlot'

const KEY = 'mf.sticky-closed'

/** Mobile-only sticky bottom banner. Dismissible for the session. */
export function StickyAd() {
  const [mounted, setMounted] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (window.sessionStorage.getItem(KEY) === '1') setClosed(true)
    } catch {
      /* ignore */
    }
  }, [])

  if (!mounted || closed) return null

  function close(): void {
    setClosed(true)
    try {
      window.sessionStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      role="complementary"
      aria-label="Advertisement"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95"
    >
      <button
        type="button"
        aria-label="Close ad"
        onClick={close}
        className="absolute right-1 top-1 z-10 rounded px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        ✕
      </button>
      <AdSlot slot="sticky" />
    </div>
  )
}
