import type { ToolAffiliate } from '../../engine/schema'
import { AFFILIATE_REL, affiliateDomId, trackAffiliateClick } from '../../lib/affiliate'

/**
 * Intent-matched affiliate offers, shown only when a tool config declares them.
 *
 * Container is visually quiet (no bright CTA banner) so it reads as a helpful
 * "next step" rather than ad spam; the small disclosure keeps it FTC-compliant
 * and honest for a trust-sensitive audience. Links carry the policy-safe
 * sponsored/nofollow/noopener rel set and are consent-gated on click tracking.
 */
export function AffiliateBlock({ toolSlug, affiliate }: { toolSlug: string; affiliate: ToolAffiliate }) {
  return (
    <section
      aria-label="Sponsored suggestions"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
        {affiliate.heading ?? 'Next step'}
      </h2>
      <ul className="mt-3 space-y-2">
        {affiliate.offers.map((offer, index) => (
          <li key={offer.url}>
            <a
              id={affiliateDomId(toolSlug, index)}
              href={offer.url}
              target="_blank"
              rel={AFFILIATE_REL}
              onClick={() => trackAffiliateClick(toolSlug, offer.label)}
              className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:border-indigo-700 dark:hover:bg-slate-800"
            >
              <span className="min-w-0">
                <span className="block font-medium text-slate-800 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">
                  {offer.label}
                </span>
                {offer.note && (
                  <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
                    {offer.note}
                  </span>
                )}
              </span>
              <span aria-hidden className="shrink-0 text-slate-400 transition group-hover:text-indigo-600">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        We may earn a commission from these links at no extra cost to you.
      </p>
    </section>
  )
}