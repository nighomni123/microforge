import type { ToolConfig } from '../engine/schema'

/** details/summary accordions — crawlable, keyboard-accessible, zero JS. */
export function Faq({ faqs }: { faqs: ToolConfig['faqs'] }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold tracking-tight">
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group bg-white p-4 open:bg-slate-50 dark:bg-slate-900 dark:open:bg-slate-800/60"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span aria-hidden className="shrink-0 text-slate-400 transition group-open:rotate-45">
                ＋
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
