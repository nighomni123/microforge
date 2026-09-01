import type { ToolConfig } from '../../src/engine/schema'

/**
 * VAT Calculator — currency-neutral add/remove VAT tool.
 * customCompute flips the math based on the direction select:
 * adding multiplies net by the rate; removing DIVIDES gross by 1 + rate.
 */
export default {
  slug: 'vat-calculator',
  title: 'VAT Calculator',
  metaTitle: 'VAT Calculator — Add or Remove Value Added Tax',
  metaDescription:
    'Work out VAT instantly in any currency: add or remove it from a price using common UK and EU rates, and see net, VAT, and gross together.',
  category: 'calculators',
  tags: ['vat', 'tax', 'invoice'],
  icon: '🧾',
  status: 'live',
  description:
    'A fast, currency-neutral VAT calculator: enter an amount plus a rate, say whether your figure excludes or includes VAT, and get the net, VAT, and gross values instantly.',
  howItWorks:
    'To add VAT, enter a price that excludes it: the calculator multiplies your amount by the rate as a decimal, so 100.00 at 20% gains 20.00 of VAT and becomes a 120.00 gross total.\n\nTo remove VAT, switch direction and enter a price that already includes it. The calculator divides by 1 plus the rate instead — 120.00 ÷ 1.20 = 100.00 at 20%. This reverse math trips people up: subtracting 20% straight off 120.00 gives 96.00, which is wrong, because the VAT was worked out on the smaller net figure rather than on the gross one.\n\nThe preset rates are common standards — UK standard and reduced, Germany, France reduced, Netherlands/Spain, and Scandinavia — so adapt mentally for other countries’ rates. The calculator is deliberately currency-neutral: it works on plain numbers, whether your price is in pounds, euros, kroner, or anything else.',
  inputs: [
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
      default: 100,
      min: 0,
      step: 0.01,
      help: 'Price in any currency — excluding VAT unless you pick “Remove” below.',
    },
    {
      id: 'rate',
      label: 'VAT rate',
      type: 'select',
      default: 20,
      options: [
        { value: 20, label: '20% — UK standard' },
        { value: 5, label: '5% — UK reduced' },
        { value: 19, label: '19% — Germany' },
        { value: 20.6, label: '20.6% — France reduced' },
        { value: 21, label: '21% — NL / ES standard' },
        { value: 25, label: '25% — SE / DK / NO' },
      ],
    },
    {
      id: 'direction',
      label: 'Direction',
      type: 'select',
      default: 0,
      options: [
        { value: 0, label: 'Add VAT — I have a net price' },
        { value: 1, label: 'Remove VAT — I have a gross price' },
      ],
    },
  ],
  outputs: [
    { id: 'summaryText', label: 'Summary', format: 'text', primary: true },
    { id: 'net', label: 'Net (excl. VAT)', format: 'number', decimals: 2 },
    { id: 'vat', label: 'VAT amount', format: 'number', decimals: 2 },
    { id: 'gross', label: 'Gross (incl. VAT)', format: 'number', decimals: 2 },
  ],
  faqs: [
    {
      question: 'How do I remove VAT from a gross price?',
      answer:
        'Divide the gross price by 1 plus the rate. At 20%: a 120.00 gross price ÷ 1.20 gives a 100.00 net price and 20.00 of VAT. Subtracting 20% directly would give 96.00 — wrong, because VAT is a share of the net price, not of the gross.',
    },
    {
      question: 'Is VAT the same thing as sales tax?',
      answer:
        'No. In most countries VAT is included in the displayed price and collected at every stage of production and sale, whereas US-style sales tax is added at the register on top of the sticker price. That difference is why this tool works in both directions.',
    },
    {
      question: 'What are the current UK VAT rates?',
      answer:
        'Commonly they stand at 20% standard, 5% reduced (for example domestic energy), and 0% zero-rated (most food, children’s clothing, books). Rates can change at budget statements, so check gov.uk for the figures currently in force before filing anything official.',
    },
    {
      question: 'Does the calculator store my amounts?',
      answer:
        'No. Everything runs client-side inside your browser tab: the figures you type never leave your device, nothing is saved between visits, and refreshing the page clears the form completely.',
    },
  ],
  keywords: [
    'vat calculator',
    'add vat calculator',
    'remove vat from gross',
    'vat backwards calculator',
    'uk vat calculator',
  ],
  affiliate: {
    heading: 'Run the numbers for your business',
    offers: [
      {
        label: 'Invoicing made easy',
        url: 'https://example.com/affiliate/invoicing-placeholder',
        note: 'Generate VAT-compliant invoices without the spreadsheet math.',
      },
    ],
  },
  autoCompute: true,
  customCompute(inputs) {
    const amount = Number(inputs.amount)
    const rate = Number(inputs.rate)
    const direction = Number(inputs.direction ?? 0)

    if (!Number.isFinite(amount)) throw new Error('Enter a valid amount.')
    if (amount < 0) throw new Error('The amount cannot be negative.')
    if (!Number.isFinite(rate) || rate < 0) throw new Error('Enter a VAT rate of zero or more.')

    const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100

    let net: number
    let vat: number
    let gross: number

    if (direction === 1) {
      // Remove VAT from a gross price: divide by 1 + rate (never subtract the %).
      gross = round2(amount)
      net = round2(gross / (1 + rate / 100))
      vat = round2(gross - net)
    } else {
      // Add VAT to a net price.
      net = round2(amount)
      vat = round2((net * rate) / 100)
      gross = round2(net + vat)
    }

    const summaryText = `Net ${net.toFixed(2)} + VAT ${vat.toFixed(2)} = Gross ${gross.toFixed(2)} (at ${String(rate)}%)`

    return { summaryText, net, vat, gross }
  },
} satisfies ToolConfig
