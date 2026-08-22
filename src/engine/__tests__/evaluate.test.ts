import { describe, expect, it } from 'vitest'
import { evaluate, extractIdentifiers, FormulaError, parseFormula } from '../evaluate'

describe('evaluate', () => {
  it('respects operator precedence', () => {
    expect(evaluate('2 + 3 * 4', {})).toBe(14)
    expect(evaluate('(2 + 3) * 4', {})).toBe(20)
    expect(evaluate('10 - 2 - 3', {})).toBe(5)
    expect(evaluate('2 * 3 % 4', {})).toBe(2)
  })

  it('supports unary minus and right-associative power', () => {
    expect(evaluate('-2 ^ 2', {})).toBe(-4)
    expect(evaluate('2 ^ 3 ^ 2', {})).toBe(512)
    expect(evaluate('(-2) ^ 2', {})).toBe(4)
  })

  it('binds identifiers from scope', () => {
    expect(evaluate('bill * tipPercent / 100', { bill: 85, tipPercent: 18 })).toBeCloseTo(15.3)
    expect(evaluate('(targetIncome + expenses) / billableHours', { targetIncome: 60000, expenses: 10000, billableHours: 1000 })).toBe(70)
  })

  it('supports ternaries and comparisons', () => {
    expect(evaluate('rate > 0 ? ceil(10 / rate) : 5', { rate: 2 })).toBe(5)
    expect(evaluate('rate > 0 ? ceil(10 / rate) : 5', { rate: 0 })).toBe(5)
    expect(evaluate('x == 1 ? 100 : 200', { x: 1 })).toBe(100)
    expect(evaluate('a <= b', { a: 1, b: 1 })).toBe(1)
  })

  it('supports logic operators', () => {
    expect(evaluate('a && b ? 1 : 0', { a: 1, b: 0 })).toBe(0)
    expect(evaluate('a || b ? 1 : 0', { a: 0, b: 1 })).toBe(1)
    expect(evaluate('!a', { a: 0 })).toBe(1)
  })

  it('supports the function library', () => {
    expect(evaluate('round(2.5)', {})).toBe(3)
    expect(evaluate('floor(2.9)', {})).toBe(2)
    expect(evaluate('ceil(2.1)', {})).toBe(3)
    expect(evaluate('abs(-5)', {})).toBe(5)
    expect(evaluate('min(3, 1, 2)', {})).toBe(1)
    expect(evaluate('max(3, 1, 2)', {})).toBe(3)
    expect(evaluate('sqrt(16)', {})).toBe(4)
    expect(evaluate('pow(2, 10)', {})).toBe(1024)
    expect(evaluate('log(1)', {})).toBe(0)
    expect(evaluate('clamp(42, 0, 10)', {})).toBe(10)
  })

  it('handles the savings-goal shape: conditional compound formula', () => {
    const formula =
      'annualRate > 0 ? max(0, ceil(log((goal + monthly/(annualRate/100/12)) / (current + monthly/(annualRate/100/12))) / log(1 + annualRate/100/12))) : max(0, ceil((goal - current) / monthly))'
    // With 4% annual rate: balance crosses 10k during month 34 -> ceil 34
    expect(evaluate(formula, { goal: 10000, current: 1000, monthly: 250, annualRate: 4 })).toBe(34)
    // Zero rate falls to the linear branch: 9000 / 250 = 36 exactly
    expect(evaluate(formula, { goal: 10000, current: 1000, monthly: 250, annualRate: 0 })).toBe(36)
    // Goal already reached clamps to zero
    expect(evaluate(formula, { goal: 1000, current: 1000, monthly: 250, annualRate: 4 })).toBe(0)
  })

  it('throws FormulaError on division by zero', () => {
    expect(() => evaluate('10 / x', { x: 0 })).toThrow(FormulaError)
    expect(() => evaluate('10 % x', { x: 0 })).toThrow(FormulaError)
  })

  it('throws FormulaError on unknown identifiers and functions', () => {
    expect(() => evaluate('foo + 1', { bar: 1 })).toThrow(/Missing input "foo"/)
    expect(() => evaluate('nope(1)', {})).toThrow(/Unknown function "nope"/)
  })

  it('throws FormulaError on syntax errors', () => {
    expect(() => evaluate('2 +', {})).toThrow(FormulaError)
    expect(() => evaluate('2 + * 3', {})).toThrow(FormulaError)
    expect(() => evaluate('', {})).toThrow(FormulaError)
    expect(() => evaluate('2 3', {})).toThrow(FormulaError)
    expect(() => evaluate('max(1, 2', {})).toThrow(FormulaError)
  })

  it('throws on non-finite results', () => {
    expect(() => evaluate('10 ^ 1000', {})).toThrow(FormulaError)
  })

  it('parses repeatedly via cache without drift', () => {
    const first = parseFormula('1 + 2 * 3')
    const second = parseFormula('1 + 2 * 3')
    expect(second).toBe(first)
  })
})

describe('extractIdentifiers', () => {
  it('extracts variables but not function names', () => {
    expect(extractIdentifiers('max(a, b) / c')).toEqual(['a', 'b', 'c'])
  })

  it('returns an empty list for constant formulas', () => {
    expect(extractIdentifiers('2 + 2')).toEqual([])
  })
})
