import { describe, expect, it } from 'vitest'
import { computeFormulaOutputs } from '../../engine/compute'
import { allTools, getRelated, getTool, liveTools, visibleTools } from '../tools'

describe('tool registry', () => {
  it('loads at least five shipped tools', () => {
    expect(allTools.length).toBeGreaterThanOrEqual(5)
  })

  it('has unique kebab-case slugs', () => {
    const slugs = new Set<string>()
    for (const tool of allTools) {
      expect(slugs.has(tool.slug), `duplicate slug ${tool.slug}`).toBe(false)
      slugs.add(tool.slug)
      expect(tool.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })

  it('exposes exactly one primary output per tool', () => {
    for (const tool of allTools) {
      expect(tool.outputs.filter((output) => output.primary), tool.slug).toHaveLength(1)
    }
  })

  it('computes every formula tool successfully with default inputs', () => {
    for (const tool of allTools) {
      if (typeof (tool as { customCompute?: unknown }).customCompute === 'function') continue
      const scope: Record<string, number> = {}
      for (const input of tool.inputs) {
        if (input.type !== 'text' && typeof input.default === 'number') {
          scope[input.id] = input.default
        }
      }
      const results = computeFormulaOutputs(tool.outputs, scope)
      for (const result of results) {
        expect(Number.isFinite(result.value), `${tool.slug}.${result.id}`).toBe(true)
      }
    }
  })

  it('returns related tools excluding the current one', () => {
    const tool = getTool('tip-split-calculator')
    expect(tool).toBeDefined()
    const related = getRelated(tool!, 3)
    expect(related.length).toBeGreaterThan(0)
    expect(related.every((t) => t.slug !== tool!.slug)).toBe(true)
  })

  it('never exposes drafts in the published set', () => {
    for (const tool of liveTools) {
      expect(tool.status, `${tool.slug} should be live`).toBe('live')
    }
    expect(visibleTools.length).toBeGreaterThanOrEqual(liveTools.length)
  })
})
