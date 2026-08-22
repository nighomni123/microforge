import { evaluate, FormulaError } from './evaluate'
import type { ToolOutput } from './schema'

export interface ComputedOutput {
  id: string
  value: number
}

/**
 * Evaluate formula outputs in declaration order. Each output may reference
 * input ids and the ids of outputs declared before it (e.g. a "total" output
 * can reference the "tip" output declared above it).
 */
export function computeFormulaOutputs(
  outputs: readonly ToolOutput[],
  scope: Record<string, number>,
): ComputedOutput[] {
  const values: Record<string, number> = { ...scope }
  const results: ComputedOutput[] = []
  for (const output of outputs) {
    if (!output.formula) throw new FormulaError(`Output "${output.id}" has no formula`)
    const value = evaluate(output.formula, values)
    results.push({ id: output.id, value })
    values[output.id] = value
  }
  return results
}
