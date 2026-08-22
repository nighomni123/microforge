import type { ToolConfig } from '../../engine/schema'
import { track } from '../../lib/analytics'
import { getRelated } from '../../lib/tools'
import { ToolCard } from '../ToolCard'

/** Cross-promo block: same-category tools first (portfolio system, Phase 13). */
export function RelatedTools({ current }: { current: ToolConfig }) {
  const related = getRelated(current, 3)
  if (related.length === 0) return null
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-bold tracking-tight">
        Related tools
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {related.map((tool) => (
          <div
            key={tool.slug}
            onClick={() => track('related_click', { from: current.slug, to: tool.slug })}
          >
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </section>
  )
}
