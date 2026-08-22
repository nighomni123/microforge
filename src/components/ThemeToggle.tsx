import { useEffect, useState } from 'react'
import { storageSet } from '../lib/storage'

/** Light/dark toggle persisted to localStorage; index.html pre-paints the class. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle(): void {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    storageSet('mf.theme', next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="ml-1 rounded-lg px-2 py-1.5 text-base hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <span aria-hidden>{dark ? '☀️' : '🌙'}</span>
    </button>
  )
}
