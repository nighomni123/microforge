export interface FormatOptions {
  format: 'number' | 'currency' | 'percent' | 'text'
  decimals?: number
  currencyCode?: string
}

const NON_FINITE = '—'

/** Format a computed value for display. Never throws; never returns NaN. */
export function formatValue(value: number | string, options: FormatOptions): string {
  const { format } = options
  if (format === 'text') return String(value)
  if (typeof value !== 'number' || !Number.isFinite(value)) return NON_FINITE

  const decimals = options.decimals ?? (format === 'percent' ? 1 : 2)
  switch (format) {
    case 'currency': {
      const code = options.currencyCode ?? 'USD'
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: code,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value)
      } catch {
        return `$${value.toFixed(decimals)}`
      }
    }
    case 'percent':
      return `${value.toFixed(decimals)}%`
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
  }
}

/** Currency symbol for an ISO code, falling back to the code itself. */
export function currencySymbol(code: string): string {
  try {
    const parts = new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).formatToParts(0)
    return parts.find((part) => part.type === 'currency')?.value ?? code
  } catch {
    return code
  }
}
