import { track } from './analytics'

/**
 * Affiliate click handling.
 *
 * Intent-matched affiliate offers are surfaced at the moment of action
 * (e.g. a loan comparison right after a car-loan result). Clicks are
 * consent-gated through the same `track()` pipeline as everything else, so a
 * visitor who denies consent is never measured, and the outbound link always
 * opens with `rel="sponsored nofollow noopener"` to stay policy-safe.
 */

/** Fire an affiliate_click event (consent-gated, no-op when denied). */
export function trackAffiliateClick(toolSlug: string, label: string): void {
  track('affiliate_click', { tool: toolSlug, label })
}

/**
 * Policy-safe link attributes shared by every affiliate anchor.
 * `sponsored` (not `nofollow` alone) is the correct signal for paid links;
 * `noopener` guards window.opener; `target="_blank"` keeps the tool open.
 */
export const AFFILIATE_REL = 'sponsored nofollow noopener noreferrer' as const

/** Identifies an offer in the DOM so clicks can be attributed without scraping. */
export function affiliateDomId(toolSlug: string, index: number): string {
  return `mf-affiliate-${toolSlug}-${index}`
}