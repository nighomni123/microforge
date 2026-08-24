import type { ToolConfig } from '../../src/engine/schema'

/**
 * Rent Split Calculator — two fairness models side by side: even halves and
 * income-proportional shares. Pure formula chain over a shared pool.
 */
export default {
  slug: 'rent-split-calculator',
  title: 'Rent Split Calculator',
  metaTitle: 'Rent Split Calculator — Fair Share by Income',
  metaDescription:
    'Split rent and utilities fairly between two people. See the even split and an income-proportional share side by side — instant, no sign-up.',
  category: 'calculators',
  tags: ['rent', 'roommates', 'split'],
  icon: '🏠',
  status: 'draft',
  currencyCode: 'USD',
  description:
    'Enter the monthly rent, utilities, and both incomes to see what a fair split looks like — equal halves versus proportional to what each person earns.',
  howItWorks:
    'Everything you both owe — rent plus monthly utilities — is pooled into one number, then split two ways.\n\nThe even split is simply half each. The income-based split divides the pool in proportion to what each person earns, so someone making $60k against a partner making $90k covers 40% of the total instead of 50%.\n\nNeither model is “correct” — even splits feel fairest when incomes are similar or the smaller room is nicer; income-proportional splits keep housing affordable relative to each paycheck. The calculator shows both so you can argue about philosophy with numbers on the table instead of vibes.',
  inputs: [
    {
      id: 'totalRent',
      label: 'Monthly rent',
      type: 'currency',
      default: 2400,
      min: 0,
      step: 25,
      help: 'Total for the whole place.',
    },
    {
      id: 'utilities',
      label: 'Monthly utilities',
      type: 'currency',
      default: 200,
      min: 0,
      step: 10,
      help: 'Electricity, internet, water — the predictable stuff.',
    },
    {
      id: 'yourIncome',
      label: 'Your yearly income',
      type: 'currency',
      default: 60000,
      min: 0,
      step: 1000,
      help: 'Pre-tax is fine — only the ratio matters.',
    },
    {
      id: 'roommateIncome',
      label: 'Roommate’s yearly income',
      type: 'currency',
      default: 90000,
      min: 0,
      step: 1000,
      help: 'Their pre-tax yearly income.',
    },
  ],
  outputs: [
    {
      id: 'sharedPool',
      label: 'Monthly pool (rent + utilities)',
      formula: 'totalRent + utilities',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'yourShareEqual',
      label: 'Your share if split evenly',
      formula: 'sharedPool / 2',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'yourShareByIncome',
      label: 'Your share if split by income',
      formula: 'sharedPool * yourIncome / (yourIncome + roommateIncome)',
      format: 'currency',
      decimals: 0,
      primary: true,
    },
    {
      id: 'roommateShare',
      label: 'Roommate pays (income-based)',
      formula: 'sharedPool - yourShareByIncome',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'savingsVsEqual',
      label: 'You save vs even split',
      formula: 'yourShareEqual - yourShareByIncome',
      format: 'currency',
      decimals: 0,
    },
  ],
  faqs: [
    {
      question: 'Is splitting rent by income actually fair?',
      answer:
        'It depends what “fair” means to you. Income-proportional splits cost each person the same share of their take-home pay, which keeps the apartment equally affordable for both. Even splits are simpler and feel fair when incomes are close. Couples with large income gaps usually land on proportional; roommates who want zero money talk prefer even.',
    },
    {
      question: 'What happens when one of us gets a raise?',
      answer:
        'Re-run this calculator — that is the point of agreeing on a method up front. Proportional splits adjust automatically with the new numbers; even splits never change. Write whichever rule you choose into the roommate agreement before move-in.',
    },
    {
      question: 'How do I factor in rooms of different sizes?',
      answer:
        'Treat the better room as a premium: agree on an adjustment amount ($100–$300/month is typical), add it to that person’s share, and subtract it from the other. This calculator splits the base fairly — apply the room premium on top of whatever model you pick.',
    },
    {
      question: 'What about deposits and move-out math?',
      answer:
        'Split the security deposit the same way you split rent — proportionally if that is your model — and put it in writing. At move-out, deductions should come out of each person’s deposit in the same ratio unless damage is clearly attributable to one party.',
    },
  ],
  keywords: [
    'rent split calculator',
    'split rent by income',
    'how to split rent with a roommate',
    'fair rent calculator',
    'roommate rent division',
  ],
} satisfies ToolConfig
