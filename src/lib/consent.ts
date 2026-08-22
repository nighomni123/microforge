import { useSyncExternalStore } from 'react'
import { storageGet, storageSet } from './storage'

export type ConsentChoice = 'granted' | 'denied'

const KEY = 'mf.consent.v1'

let initialized = false
let current: ConsentChoice | null = null
const listeners = new Set<() => void>()

function init(): void {
  if (initialized) return
  initialized = true
  const stored = storageGet(KEY)
  current = stored === 'granted' || stored === 'denied' ? stored : null
}

export function getConsent(): ConsentChoice | null {
  init()
  return current
}

export function setConsent(choice: ConsentChoice): void {
  init()
  if (current === choice) return
  current = choice
  storageSet(KEY, choice)
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** React hook: current consent choice (null = not asked yet; null on the server). */
export function useConsent(): ConsentChoice | null {
  return useSyncExternalStore(subscribe, getConsent, () => null)
}
