import { useEffect, useRef } from 'react'
import { loadAdsense } from '../../lib/ads'
import { useConsent } from '../../lib/consent'

export type AdSlotName = 'incontent' | 'sticky' | 'sidebar'

/**
 * Ad unit with policy-safe defaults:
 * - Ships zero third-party code unless VITE_ADSENSE_* env vars are configured.
 * - Loads only after explicit consent; reserved space prevents CLS either way.
 * - Dev builds show a labeled placeholder so placements can be QA'd without ads.
 */
const RESERVED: Record<AdSlotName, string> = {
  incontent: 'min-h-[250px] w-full',
  sticky: 'h-[60px]',
  sidebar: 'min-h-[600px] w-full',
}

export function AdSlot({ slot }: { slot: AdSlotName }) {
  const consent = useConsent()
  const env = import.meta.env
  const client = env.VITE_ADSENSE_CLIENT as string | undefined
  const slotId = env[`VITE_ADSENSE_SLOT_${slot.toUpperCase()}`] as string | undefined
  const pushed = useRef(false)

  useEffect(() => {
    if (!client || !slotId || consent !== 'granted' || pushed.current) return
    pushed.current = true
    loadAdsense(client)
    try {
      const w = window as unknown as { adsbygoogle?: object[] }
      ;(w.adsbygoogle = w.adsbygoogle ?? []).push({})
    } catch {
      /* ad blockers etc. */
    }
  }, [client, slotId, consent])

  if (!client || !slotId) {
    if (import.meta.env.DEV) {
      return (
        <div
          role="presentation"
          className={`flex ${RESERVED[slot]} items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700`}
        >
          Ad slot · {slot} · configure VITE_ADSENSE_*
        </div>
      )
    }
    return null
  }

  if (consent !== 'granted') {
    return <div aria-hidden="true" className={RESERVED[slot]} />
  }

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slotId}
      data-full-width-responsive="true"
    />
  )
}
