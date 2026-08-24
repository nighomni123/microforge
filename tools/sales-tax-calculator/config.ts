import type { ToolConfig } from '../../src/engine/schema'

/**
 * Sales Tax Calculator — US state/local patchwork helper (USD).
 * customCompute mirrors the VAT tool: adding runs forward from the sticker
 * price; removing divides the out-the-door total by 1 + rate.
 */
export default {
  slug: 'sales-tax-calculator',
  title: 'Sales Tax Calculator',
  metaTitle: 'Sales Tax Calculator — Add or Remove US Sales Tax',
  metaDescription:
    'Add sales tax to a sticker price or remove it from a receipt total — set any combined state, county, and city rate up to 20%.',
  category: 'calculators',
  tags: ['sales tax', 'receipt', 'shopping', 'usa'],
  icon: '🛒',
  status: 'live',
  currencyCode: 'USD',
  description:
    'Calculate US sales tax in either direction: apply your combined state and local rate to a pre-tax price, or reverse the math on an out-the-door total to recover the original sticker price.',
  howItWorks:
    'There is no single national sales tax in the United States. Each state sets its own rate, and counties and cities often layer more on top, which is why combined rates range from zero to around ten percent. Enter the combined rate where you are buying — New York City charges 8.875%, California averages roughly 8.8% statewide, and Texas lands near 8.2%.\n\nAdding tax runs forward: the pre-tax price is multiplied by the rate as a decimal and the result is added on, so 100.00 at 8.875% carries 8.88 of tax and totals 108.88 at checkout. Removing tax reverses this for receipts — say an item rang up at $108.88 out-the-door and you want to know its pre-tax price. Here the calculator divides by 1 plus the rate: 108.88 ÷ 1.08875 = 100.00. Dividing matters; subtracting 8.875% straight off the total undercounts the tax, because it was figured on the smaller pre-tax amount.\n\nTwo local quirks to keep in mind: most states source the tax at the destination (where you receive the goods), while a handful source partly or fully from the seller’s origin; and shipping treatment varies by state — some tax delivery charges on taxable sales, others exempt them when separately stated.',
  inputs: [
    {
      id: 'price',
      label: 'Price before tax',
      type: 'number',
      default: 100,
      min: 0,
      step: 0.01,
    },
    {
      id: 'taxRate',
      label: 'Sales tax %',
      type: 'number',
      default: 8.875,
      min: 0,
      max: 20,
      step: 0.125,
      help: 'NYC 8.875%, CA avg ~8.8%, TX 8.2% — set yours.',
    },
    {
      id: 'direction',
      label: 'Direction',
      type: 'select',
      default: 0,
      options: [
        { value: 0, label: 'Add tax — sticker to total' },
        { value: 1, label: 'Remove tax — total back to pre-tax' },
      ],
    },
  ],
  outputs: [
    { id: 'summaryText', label: 'Summary', format: 'text', primary: true },
    { id: 'postTax', label: 'Total with tax', format: 'number', decimals: 2 },
    { id: 'tax', label: 'Tax amount', format: 'number', decimals: 2 },
    { id: 'preTax', label: 'Price before tax', format: 'number', decimals: 2 },
  ],
  faqs: [
    {
      question: 'Which sales tax rate applies to my purchase?',
      answer:
        'Usually the combined state + county + city rate where you take possession: most states are destination-based, though a handful (such as Texas and parts of California) source from the seller’s origin. Local rates change often, so confirm yours on your state Department of Revenue site before relying on a figure.',
    },
    {
      question: 'Is sales tax charged on shipping?',
      answer:
        'It varies by state: several large states generally tax delivery charges when the underlying sale is taxable, while others exempt shipping when it is separately stated on the invoice. If shipping is taxed where you are, simply include it in the price you enter so the totals come out right.',
    },
    {
      question: 'Why doesn’t the US have one national sales tax?',
      answer:
        'Because sales tax is levied by states and local governments, not the federal government. Each layer sets its own rate — a state base, plus county and city add-ons, plus special district taxes — which is why combined rates differ not just state to state but city to city.',
    },
    {
      question: 'How do I back the tax out of a receipt total?',
      answer:
        'Divide the total by 1 plus the rate as a decimal. A 108.88 total at 8.875% becomes 108.88 ÷ 1.08875 = a 100.00 pre-tax price and 8.88 of tax. Subtracting the percentage straight off the total would understate it, because the tax was charged on the smaller pre-tax figure.',
    },
  ],
  keywords: [
    'sales tax calculator',
    'add sales tax',
    'reverse sales tax calculator',
    'tax out of total',
    'purchase tax calculator',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const price = Number(inputs.price)
    const taxRate = Number(inputs.taxRate)
    const direction = Number(inputs.direction ?? 0)

    if (!Number.isFinite(price)) throw new Error('Enter a valid price.')
    if (price < 0) throw new Error('The price cannot be negative.')
    if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 20) {
      throw new Error('Set a sales tax rate between 0% and 20%.')
    }

    const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100

    let preTax: number
    let tax: number
    let postTax: number

    if (direction === 1) {
      // Remove tax from an out-the-door total: divide by 1 + rate.
      postTax = round2(price)
      preTax = round2(postTax / (1 + taxRate / 100))
      tax = round2(postTax - preTax)
    } else {
      // Add tax to a sticker price.
      preTax = round2(price)
      tax = round2((preTax * taxRate) / 100)
      postTax = round2(preTax + tax)
    }

    const summaryText = `${preTax.toFixed(2)} + ${tax.toFixed(2)} tax (${String(taxRate)}%) = ${postTax.toFixed(2)}`

    return { summaryText, postTax, tax, preTax }
  },
} satisfies ToolConfig
