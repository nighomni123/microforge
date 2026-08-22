import { describe, expect, it } from 'vitest'
import { computeFormulaOutputs } from '../compute'
import { FormulaError } from '../evaluate'

describe('computeFormulaOutputs', () => {
  it('lets later outputs reference earlier ones', () => {
    const results = computeFormulaOutputs(
      [
        { id: 'tip', label: 'Tip', formula: 'bill * tipPercent / 100', format: 'currency' },
        { id: 'total', label: 'Total', formula: 'bill + tip', format: 'currency' },
        { id: 'perPerson', label: 'Per person', formula: 'total / partySize', format: 'currency', primary: true },
      ],
      { bill: 100, tipPercent: 20, partySize: 4 },
    )
    expect(results.map((r) => r.value)).toEqual([20, 120, 30])
  })

  it('surfaces division by zero as FormulaError', () => {
    expect(() =>
      computeFormulaOutputs([{ id: 'x', label: 'X', formula: '1 / people', format: 'number' }], { people: 0 }),
    ).toThrow(FormulaError)
  })

  it('throws when a formula output has no formula', () => {
    expect(() => computeFormulaOutputs([{ id: 'x', label: 'X', format: 'number' }], {})).toThrow(FormulaError)
  })
})
