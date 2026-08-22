import { TOOL_CATEGORIES, ToolConfigSchema, type ToolCategory, type ToolConfig } from '../engine/schema'

const modules = import.meta.glob<{ default: ToolConfig }>('/tools/*/config.ts', { eager: true })

function categoryOrder(category: ToolCategory): number {
  return TOOL_CATEGORIES.indexOf(category)
}

function loadAll(): ToolConfig[] {
  const loaded: ToolConfig[] = []
  for (const path of Object.keys(modules).sort()) {
    const config = modules[path]!.default
    const parsed = ToolConfigSchema.safeParse(config)
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('; ')
      throw new Error(`Invalid tool config at ${path} — ${issues}`)
    }
    loaded.push(config)
  }
  return loaded.sort(
    (a, b) => categoryOrder(a.category) - categoryOrder(b.category) || a.title.localeCompare(b.title),
  )
}

const all = loadAll()

/** Every registered tool, including drafts. */
export const allTools: readonly ToolConfig[] = all

/** Published tools only. */
export const liveTools: readonly ToolConfig[] = all.filter((tool) => tool.status === 'live')

/** Tools shown in listings/navigation (drafts leak into dev previews only). */
export const visibleTools: readonly ToolConfig[] = import.meta.env.PROD ? liveTools : all

export function getTool(slug: string | undefined): ToolConfig | undefined {
  if (!slug) return undefined
  return visibleTools.find((tool) => tool.slug === slug)
}

/** Cross-promo: same-category tools first, then other live tools. */
export function getRelated(current: ToolConfig, count = 3): readonly ToolConfig[] {
  const sameCategory = visibleTools.filter(
    (tool) => tool.category === current.category && tool.slug !== current.slug,
  )
  const others = visibleTools.filter((tool) => tool.category !== current.category && tool.status === 'live')
  return [...sameCategory, ...others].slice(0, count)
}

function categoriesOf(tools: readonly ToolConfig[]): ToolCategory[] {
  const present = new Set(tools.map((tool) => tool.category))
  return TOOL_CATEGORIES.filter((category) => present.has(category))
}

/** Categories with at least one visible tool, in canonical order. */
export function visibleCategories(): ToolCategory[] {
  return categoriesOf(visibleTools)
}

/** Categories with at least one published tool, in canonical order. */
export function liveCategories(): ToolCategory[] {
  return categoriesOf(liveTools)
}
