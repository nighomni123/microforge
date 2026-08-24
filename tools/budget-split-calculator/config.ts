import type { ToolConfig } from '../../src/engine/schema'

/**
 * Budget Split Calculator — adjustable 50/30/20 rule for monthly take-home pay.
 * Pure formula tool: buckets derive from income × percentages, leftovers stay visible.
 */
export default {
  slug: 'budget-split-calculator',
  title: 'Budget Split Calculator',
  metaTitle: 'Budget Split Calculator — 50/30/20, Customizable',
  metaDescription:
    'Split your monthly take-home pay with the 50/30/20 rule or custom percentages and see exactly how many dollars go to needs, wants, and savings.',
  category: 'calculators',
  tags: ['budgeting', 'money', 'savings', 'personal finance'],
  icon: '💰',
  status: 'live',
  currencyCode: 'USD',
  description:
    'Apply the classic 50/30/20 budget rule to your monthly take-home pay — or set any split you like. Enter your income and three percentages to instantly see dollar amounts for needs, wants, and savings, plus anything left unallocated.',
  howItWorks:
    'The 50/30/20 rule is a simple way to divide your pay into three buckets: about half for needs, roughly a third for wants, and at least a fifth for savings and debt payoff. This calculator applies those percentages to your monthly take-home pay — and every percentage is adjustable, because real budgets rarely match the textbook.\n\nNeeds are obligations you cannot skip without consequences: rent or mortgage, utilities, groceries, insurance premiums, transport to work, and the minimum payments on any debts. Wants are lifestyle spending — dining out, subscriptions, hobbies, travel, entertainment, upgrades. If losing it would hurt but not sink you, it is probably a want.\n\nEach bucket is simply your income multiplied by its percentage. The “total allocated” line adds your three percentages together, and anything short of 100% appears as an unallocated amount — money with no job yet rather than money that disappears.\n\nResults assume take-home pay, meaning income after taxes and payroll deductions. Budgeting from gross salary makes every bucket look bigger than the cash you can actually spend.',
  inputs: [
    {
      id: 'monthlyTakeHome',
      label: 'Monthly take-home pay',
      type: 'currency',
      default: 4500,
      min: 1,
      step: 100,
      help: 'Your after-tax monthly income.',
    },
    {
      id: 'needsPercent',
      label: 'Needs percentage',
      type: 'percent',
      default: 50,
      min: 0,
      max: 100,
      step: 1,
      help: 'Share of income for must-pay obligations.',
    },
    {
      id: 'wantsPercent',
      label: 'Wants percentage',
      type: 'percent',
      default: 30,
      min: 0,
      max: 100,
      step: 1,
      help: 'Share for lifestyle spending you could trim.',
    },
    {
      id: 'savingsPercent',
      label: 'Savings percentage',
      type: 'percent',
      default: 20,
      min: 0,
      max: 100,
      step: 1,
      help: 'Share for saving, investing, and extra debt payoff.',
    },
  ],
  outputs: [
    {
      id: 'needsAmount',
      label: 'Needs (housing, groceries, bills)',
      formula: 'monthlyTakeHome * needsPercent / 100',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'wantsAmount',
      label: 'Wants (dining out, hobbies, fun)',
      formula: 'monthlyTakeHome * wantsPercent / 100',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'savingsAmount',
      label: 'Savings & debt payoff',
      formula: 'monthlyTakeHome * savingsPercent / 100',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'percentTotal',
      label: 'Total allocated',
      formula: 'needsPercent + wantsPercent + savingsPercent',
      format: 'percent',
      decimals: 0,
    },
    {
      id: 'leftoverPrimary',
      label: 'Unallocated per month',
      formula: 'monthlyTakeHome * (100 - percentTotal) / 100',
      format: 'currency',
      decimals: 0,
      primary: true,
    },
  ],
  faqs: [
    {
      question: 'What counts as a need versus a want in a budget?',
      answer:
        'Needs are expenses you cannot skip without real consequences: rent or mortgage, utilities, groceries, insurance, getting to work, and the minimum payments on your debts. Wants make life nicer but are optional: dining out, streaming subscriptions, hobbies, travel, and gadget upgrades. When money gets tight, wants flex first while needs stay covered.',
    },
    {
      question: 'Should I budget with my income before or after tax?',
      answer:
        'After tax. The 50/30/20 rule works on take-home pay — the amount that actually lands in your bank account each month. If you budget from your gross salary instead, every bucket looks bigger than the money you can truly spend, and the plan falls apart the first month.',
    },
    {
      question: 'Can I use different ratios than 50/30/20?',
      answer:
        'Yes — every percentage here is adjustable. Try 60/20/20 while rent eats half your pay, or raise the savings share once fixed costs shrink. Just watch the unallocated figure: until your three percentages add up to 100%, part of your paycheck has no job assigned yet.',
    },
    {
      question: 'Where should my savings bucket go first?',
      answer:
        'A common order is to build a small starter emergency fund (roughly $500–$1,000), then attack high-interest debt such as credit cards, and finally grow a full three-to-six-month emergency fund alongside retirement contributions. This is general education, not personalized financial advice — adapt it to your own situation.',
    },
  ],
  keywords: [
    '50 30 20 budget calculator',
    'budget split calculator',
    'monthly budget percentages',
    'needs vs wants budget',
    'take home pay budget',
  ],
} satisfies ToolConfig
