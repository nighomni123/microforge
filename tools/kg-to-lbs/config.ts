import type { ToolConfig } from '../../src/engine/schema'

/**
 * KG to Lbs Converter — pure formula tool.
 * One intent per page: type kilograms, read pounds instantly (plus oz, st, g).
 */
export default {
  slug: 'kg-to-lbs',
  title: 'KG to Lbs Converter',
  metaTitle: 'KG to Lbs Converter — Kilograms to Pounds',
  metaDescription:
    'Convert kilograms to pounds instantly — exact 2.20462 factor, with ounces, stones, and grams shown alongside. Free, no sign-up.',
  category: 'converters',
  tags: ['weight', 'conversion', 'units'],
  icon: '⚖️',
  status: 'draft',
  description:
    'Type any weight in kilograms and see it converted to pounds instantly, with ounces, stones, and grams calculated alongside for US and UK readers.',
  howItWorks:
    'The pound used today was fixed by the 1959 international yard and pound agreement between the United States and the Commonwealth countries: one kilogram equals exactly 2.2046226218 pounds. This page rounds that factor to 2.20462 — far more precision than any bathroom scale.\n\nBoth directions:\n• Kilograms to pounds: lbs = kg × 2.20462\n• Pounds to kilograms: kg = lbs ÷ 2.20462\n\nAlongside the main answer you also get ounces (kg × 35.27396), grams (kg × 1000), and stone (lbs ÷ 14) — the old 14-pound unit still used for body weight in the UK and Ireland.',
  inputs: [
    {
      id: 'kg',
      label: 'Kilograms',
      type: 'number',
      default: 70,
      min: 0,
      step: 0.1,
      help: 'Your weight in kilograms — the answer updates in pounds below.',
    },
  ],
  outputs: [
    {
      id: 'lbs',
      label: 'Pounds (lb)',
      formula: 'kg * 2.20462',
      format: 'number',
      decimals: 2,
      primary: true,
    },
    {
      id: 'ounces',
      label: 'Ounces (oz)',
      formula: 'kg * 35.27396',
      format: 'number',
      decimals: 1,
    },
    {
      id: 'stones',
      label: 'Stones (st)',
      formula: 'kg * 2.20462 / 14',
      format: 'number',
      decimals: 1,
    },
    {
      id: 'grams',
      label: 'Grams (g)',
      formula: 'kg * 1000',
      format: 'number',
      decimals: 0,
    },
  ],
  faqs: [
    {
      question: 'How many pounds are in a kilogram exactly?',
      answer:
        'Exactly 2.2046226218 pounds, fixed by the 1959 international yard and pound agreement. This converter uses 2.20462, so results agree with the exact figure to about five decimal places — more precision than any scale can measure.',
    },
    {
      question: 'How do I convert pounds back to kilograms?',
      answer:
        'Divide the pound value by 2.20462. For example, 150 lb ÷ 2.20462 ≈ 68.04 kg. Multiplying by 0.45359237 gives the identical result, because that is simply 1 ÷ 2.20462.',
    },
    {
      question: 'Why do athletes care about the kg vs lbs difference?',
      answer:
        'Combat sports and weightlifting list weight classes in kilograms internationally — a boxer cutting for lightweight targets 61.2 kg, not its pound equivalent. Athletes training or competing abroad must convert precisely, because missing a class by half a pound costs the match.',
    },
    {
      question: 'What is a stone?',
      answer:
        'A stone is 14 pounds (about 6.35 kg). It survives mainly in the UK and Ireland, where people still state their body weight in stones and pounds — “eleven stone four” means 158 lb. This page shows stones automatically.',
    },
  ],
  keywords: [
    'kg to lbs',
    'kilograms to pounds',
    'kg to pounds converter',
    'weight conversion',
    'kg to stones and pounds',
  ],
} satisfies ToolConfig
