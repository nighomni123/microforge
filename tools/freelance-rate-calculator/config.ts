import type { ToolConfig } from '../../src/engine/schema'

/**
 * Freelance Hourly Rate Calculator — the factory's reference implementation.
 * Pure formula tool: every output derives from inputs via the safe evaluator.
 */
export default {
  slug: 'freelance-rate-calculator',
  title: 'Freelance Hourly Rate Calculator',
  metaTitle: 'Freelance Hourly Rate Calculator — Free & Instant',
  metaDescription:
    'Work out the hourly rate you need to hit your income goal. Add expenses and billable hours — instant answer, no sign-up.',
  category: 'calculators',
  tags: ['freelance', 'pricing', 'income'],
  icon: '💼',
  status: 'live',
  currencyCode: 'USD',
  description:
    'Enter your target yearly income, business expenses, and realistic billable hours to see the minimum hourly rate that keeps you whole.',
  howItWorks:
    'Your billable hours have to cover three things: the income you want to take home, the cost of running your business, and all the hours you spend on work you cannot bill.\n\nThis calculator adds your target income and yearly expenses, then divides by your realistic billable hours. The result is the floor for your rate — charge below it and you are effectively paying to work.\n\nMost freelancers only bill 60–70% of their working time because of admin, marketing, and learning. When in doubt, lower the billable hours rather than the rate.',
  inputs: [
    {
      id: 'targetIncome',
      label: 'Target yearly income',
      type: 'currency',
      default: 60000,
      min: 0,
      step: 1000,
      help: 'What you want to actually earn, before taxes.',
    },
    {
      id: 'expenses',
      label: 'Yearly business expenses',
      type: 'currency',
      default: 10000,
      min: 0,
      step: 500,
      help: 'Software, hardware, insurance, coworking, accountant…',
    },
    {
      id: 'billableHours',
      label: 'Billable hours per year',
      type: 'number',
      default: 1000,
      min: 1,
      max: 4000,
      step: 10,
      help: 'Hours clients actually pay for. 1000 ≈ 20 h/week year-round.',
    },
  ],
  outputs: [
    {
      id: 'hourlyRate',
      label: 'Minimum hourly rate',
      formula: '(targetIncome + expenses) / billableHours',
      format: 'currency',
      decimals: 2,
      primary: true,
    },
    {
      id: 'monthlyRevenue',
      label: 'Monthly revenue needed',
      formula: '(targetIncome + expenses) / 12',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'weeklyHours',
      label: 'Billable hours per week',
      formula: 'billableHours / 52',
      format: 'number',
      decimals: 1,
    },
  ],
  faqs: [
    {
      question: 'How do I calculate my freelance hourly rate?',
      answer:
        'Add the yearly income you want to your yearly business expenses, then divide by the hours you can realistically bill in a year. This calculator does that instantly and also shows the monthly revenue target behind the rate.',
    },
    {
      question: 'Why only 1,000 billable hours per year?',
      answer:
        'A full-time year has about 2,080 working hours, but freelancers rarely bill more than 60% of that. Admin, sales, revisions and learning eat the rest. Billing 1,000 hours (about 20 per week) is a common, sustainable baseline.',
    },
    {
      question: 'Does this include taxes?',
      answer:
        'No — treat the result as a pre-tax business rate. Set your “target income” to what you need before taxes so the rate already covers your tax bill.',
    },
    {
      question: 'What if my calculated rate feels too high for my market?',
      answer:
        'Either reduce costs, raise your billable efficiency, or differentiate your offer so price is not the only factor. Competing below your break-even rate only works for a short sprint, never as a strategy.',
    },
  ],
  keywords: [
    'freelance hourly rate calculator',
    'what should I charge as a freelancer',
    'freelance rate formula',
    'hourly rate calculator from salary',
  ],
} satisfies ToolConfig
