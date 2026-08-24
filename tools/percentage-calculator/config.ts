import type { ToolConfig } from '../../src/engine/schema'

/**
 * Percentage Calculator — answers the three percentage questions people ask
 * simultaneously, live: X% of Y · X is what % of Y · % change X→Y.
 * Pure formula tool; no mode-switching needed (all three update at once).
 */
export default {
  slug: 'percentage-calculator',
  title: 'Percentage Calculator',
  metaTitle: 'Percentage Calculator — Of, Change & What Percent',
  metaDescription:
    'All three percentage questions answered at once: what is X% of Y, X is what percent of Y, and the percent change between two numbers. Live as you type.',
  category: 'calculators',
  tags: ['percentage', 'percent change', 'math'],
  icon: '📊',
  status: 'live',
  description:
    'Enter any two values and see every percentage answer at once — a percentage of a number, one number as a percent of another, and the percent change between them.',
  howItWorks:
    'Most percentage calculators make you pick a mode first. This one skips that: all three classic questions are answered simultaneously from the same two inputs.\n\nThe three formulas:\n\n• Percentage of a number: X ÷ 100 × Y. “What is 15% of 200?” → 15 ÷ 100 × 200 = 30.\n\n• One number as a percent of another: X ÷ Y × 100. “15 is what percent of 200?” → 7.5%.\n\n• Percent change: (Y − X) ÷ |X| × 100. Going 15 → 200 is a +1,233% increase; the sign tells you direction and the absolute value in the denominator keeps decreases working symmetrically.\n\nPercent change and percent difference are not the same thing — change compares an old value to a new one (direction matters), while difference compares two unrelated values against their average. Use this calculator for before/after questions; for comparing two independent measurements, divide their gap by their average instead.',
  inputs: [
    {
      id: 'x',
      label: 'Value X',
      type: 'number',
      default: 15,
      step: 0.01,
      help: 'The percentage in question one; the starting or smaller value elsewhere.',
    },
    {
      id: 'y',
      label: 'Value Y',
      type: 'number',
      default: 200,
      step: 0.01,
      help: 'The base number; the ending value for percent change.',
    },
  ],
  outputs: [
    {
      id: 'percentOfY',
      label: 'X% of Y',
      formula: 'x / 100 * y',
      format: 'number',
      decimals: 2,
      primary: true,
    },
    {
      id: 'xAsPercentOfY',
      label: 'X is what percent of Y',
      formula: 'x / y * 100',
      format: 'number',
      decimals: 2,
    },
    {
      id: 'pctChange',
      label: '% change from X to Y (+ = up)',
      formula: 'x != 0 ? (y - x) / abs(x) * 100 : y != 0 ? 100 : 0',
      format: 'number',
      decimals: 1,
    },
    {
      id: 'difference',
      label: 'Difference (Y − X)',
      formula: 'y - x',
      format: 'number',
      decimals: 2,
    },
  ],
  faqs: [
    {
      question: 'How do I calculate a percentage of a number?',
      answer:
        'Convert the percent to a decimal and multiply: 15% of 200 = 0.15 × 200 = 30. This calculator’s first result does exactly that — enter the percent as Value X and the number as Value Y.',
    },
    {
      question: 'How do I work out percent change?',
      answer:
        'Subtract the old value from the new one, divide by the OLD value, and multiply by 100. A negative result means a decrease. The third row of results above handles it — just put the starting figure in Value X and the ending figure in Value Y.',
    },
    {
      question: 'Why does percent change use the old value in the denominator?',
      answer:
        'Because change is measured relative to where you started. Going from 50 to 75 is a 50% increase (25 ÷ 50), but going from 75 back down to 50 is only a 33.3% decrease (25 ÷ 75). Same gap, different baselines — which is why discounts and rebounds never feel symmetrical.',
    },
    {
      question: 'What is the difference between percent change and percentage points?',
      answer:
        'Percentage points are simple subtraction between two percentages: interest rising from 4% to 6% is +2 points but a 50% change. News headlines mix these up constantly — if both figures are already percentages, subtract and say “points.”',
    },
  ],
  keywords: [
    'percentage calculator',
    'what is x percent of y',
    'percent change calculator',
    'percentage increase calculator',
    'calculate percentage of a number',
  ],
} satisfies ToolConfig
