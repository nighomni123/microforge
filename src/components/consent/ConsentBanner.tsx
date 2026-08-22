import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { initMeasurement, track } from '../../lib/analytics'
import { getConsent, setConsent, useConsent } from '../../lib/consent'

/**
 * GDPR-style consent gate. Nothing measurable (analytics scripts, ads) loads
 * before an explicit choice; declining keeps the site fully functional.
 */
export function ConsentBanner() {
  const consent = useConsent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (getConsent() === 'granted') initMeasurement()
  }, [])

  if (!mounted || consent !== null) return null

  function accept(): void {
    setConsent('granted')
    initMeasurement()
    track('consent_choice', { choice: 'granted' })
  }

  function decline(): void {
    // Declined users are never tracked — by design there is no event for this.
    setConsent('denied')
  }

  return (
    <div
      role="dialog"
      aria-label="Privacy choices"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">
        We use cookies for anonymous analytics and, if you accept, personalized advertising. The
        tools work either way.{' '}
        <Link
          to="/privacy"
          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Privacy policy
        </Link>
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={decline}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={accept}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Accept all
        </button>
      </div>
    </div>
  )
}
