import type { ToolConfig } from '../../src/engine/schema'

/**
 * Savings Goal Calculator — proves conditional + log/pow formulas:
 * compound-growth months with a zero-rate fallback branch.
 */
export default {
  slug: 'savings-goal-calculator',
  title: 'Savings Goal Calculator',
  metaTitle: 'Savings Goal Calculator — Months to Your Goal',
  metaDescription:
    'See exactly how many months until you reach your savings goal with monthly deposits and compound interest. Free, instant, no sign-up.',
  category: 'calculators',
  tags: ['savings', 'goals', 'compound interest'],
  icon: '🎯',
  status: 'live',
  currencyCode: 'USD',
  description:
    'Set a savings goal, your current balance, and a monthly deposit — see the exact number of months (and years) until you get there.',
  howItWorks:
    'With a positive interest rate the calculator solves the compound-growth equation for time: how many months until your balance, growing monthly and topped up by your deposit, first reaches the goal.\n\nAt 0% interest it simply divides the remaining gap by your monthly deposit.\n\nThe result is the optimistic case: it assumes the rate holds and you never miss a deposit. Use it to compare plans — deposit amounts and rates move the date more than intuition suggests.',
  inputs: [
    {
      id: 'goal',
      label: 'Savings goal',
      type: 'currency',
      default: 10000,
      min: 1,
      step: 100,
      help: 'The total amount you want to reach.',
    },
    {
      id: 'current',
      label: 'Current savings',
      type: 'currency',
      default: 1000,
      min: 0,
      step: 100,
      help: 'What you already have set aside.',
    },
    {
      id: 'monthly',
      label: 'Monthly deposit',
      type: 'currency',
      default: 250,
      min: 1,
      step: 10,
      help: 'What you can add every month.',
    },
    {
      id: 'annualRate',
      label: 'Annual interest rate',
      type: 'percent',
      default: 4,
      min: 0,
      max: 30,
      step: 0.5,
      help: 'APY your savings account pays. Use 0 for cash under the mattress.',
    },
  ],
  outputs: [
    {
      id: 'months',
      label: 'Months to reach your goal',
      formula:
        'annualRate > 0 ? max(0, ceil(log((goal + monthly/(annualRate/100/12)) / (current + monthly/(annualRate/100/12))) / log(1 + annualRate/100/12))) : max(0, ceil((goal - current) / monthly))',
      format: 'number',
      decimals: 0,
      primary: true,
    },
    {
      id: 'years',
      label: 'That is (years)',
      formula: 'months / 12',
      format: 'number',
      decimals: 1,
    },
    {
      id: 'totalDeposits',
      label: 'You will have deposited',
      formula: 'current + monthly * months',
      format: 'currency',
      decimals: 0,
    },
  ],
  faqs: [
    {
      question: 'How is the months-to-goal calculated?',
      answer:
        'For a positive interest rate it solves the standard future-value formula for time — the same compound-interest math banks use, rearranged to output months. At 0% interest it falls back to dividing the remaining amount by your monthly deposit.',
    },
    {
      question: 'Why does the result say 0 months?',
      answer:
        'That means your current savings already meet or exceed the goal. Congratulations — raise the goal or redirect the monthly deposit to your next target.',
    },
    {
      question: 'What interest rate should I enter?',
      answer:
        'Use the APY of your savings account (often shown as “4.00% APY”). For investments, be conservative: historical stock returns average around 7–10% a year before inflation, but individual years vary wildly.',
    },
    {
      question: 'Does it account for inflation?',
      answer:
        'No — the goal is treated as a fixed nominal amount. If your target is years away, either raise the goal by expected inflation (2–3% a year) or mentally treat the result as a minimum timeline.',
    },
  ],
  keywords: [
    'savings goal calculator',
    'how long to save',
    'savings calculator with interest',
    'when will I reach my savings goal',
  ],
} satisfies ToolConfig
