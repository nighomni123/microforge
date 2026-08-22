import { describe, expect, it } from 'vitest'
import { currencySymbol, formatValue } from '../format'

describe('formatValue', () => {
  it('formats currency', () => {
    expect(formatValue(1234.5, { format: 'currency', decimals: 2, currencyCode: 'USD' })).toBe('$1,234.50')
  })

  it('formats plain numbers', () => {
    expect(formatValue(12345.678, { format: 'number', decimals: 1 })).toBe('12,345.7')
  })

  it('formats percents', () => {
    expect(formatValue(18.5, { format: 'percent', decimals: 1 })).toBe('18.5%')
  })

  it('passes text through', () => {
    expect(formatValue('Strong', { format: 'text' })).toBe('Strong')
  })

  it('renders an em dash for non-finite numbers', () => {
    expect(formatValue(Number.NaN, { format: 'currency' })).toBe('—')
    expect(formatValue(Number.POSITIVE_INFINITY, { format: 'number' })).toBe('—')
  })

  it('falls back gracefully on invalid currency codes', () => {
    expect(formatValue(5, { format: 'currency', currencyCode: 'NOPE' })).toBe('$5.00')
  })
})

describe('currencySymbol', () => {
  it('maps common codes', () => {
    expect(currencySymbol('USD')).toBe('$')
    expect(currencySymbol('EUR')).toBe('€')
  })

  it('falls back to the code itself', () => {
    expect(currencySymbol('NOPE')).toBe('NOPE')
  })
})
