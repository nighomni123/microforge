import type { ToolConfig } from '../../src/engine/schema'

/** Tip Split Calculator — demonstrates chained outputs (tip → total → per person). */
export default {
  slug: 'tip-split-calculator',
  title: 'Tip Split Calculator',
  metaTitle: 'Tip Split Calculator — Per Person, With Tip',
  metaDescription:
    'Split any restaurant bill fairly: enter the total, tip percent, and party size to get tip, grand total, and amount per person instantly.',
  category: 'calculators',
  tags: ['tipping', 'restaurant', 'split'],
  icon: '🍽️',
  status: 'live',
  currencyCode: 'USD',
  description:
    'Enter the bill, tip percent, and how many people are splitting — get the tip, grand total, and exact amount per person in real time.',
  howItWorks:
    'The tip is the bill multiplied by your tip percent. The grand total is the bill plus that tip, and each person’s share is the grand total divided by the party size.\n\nThe math is simple — the value is avoiding the mental arithmetic at the table. Change any number and every figure updates instantly.',
  inputs: [
    {
      id: 'bill',
      label: 'Bill amount',
      type: 'currency',
      default: 85,
      min: 0,
      step: 0.01,
      help: 'The pre-tip total on the check.',
    },
    {
      id: 'tipPercent',
      label: 'Tip',
      type: 'percent',
      default: 18,
      min: 0,
      max: 100,
      step: 1,
      help: '18–20% is customary for good table service in the US.',
    },
    {
      id: 'partySize',
      label: 'People splitting',
      type: 'number',
      default: 2,
      min: 1,
      max: 50,
      step: 1,
      help: 'Everyone pays the same share.',
    },
  ],
  outputs: [
    {
      id: 'tipAmount',
      label: 'Tip',
      formula: 'bill * tipPercent / 100',
      format: 'currency',
      decimals: 2,
    },
    {
      id: 'total',
      label: 'Grand total',
      formula: 'bill + tipAmount',
      format: 'currency',
      decimals: 2,
    },
    {
      id: 'perPerson',
      label: 'Per person',
      formula: 'total / partySize',
      format: 'currency',
      decimals: 2,
      primary: true,
    },
  ],
  faqs: [
    {
      question: 'How much should I tip?',
      answer:
        'In the United States, 18–20% of the pre-tax bill is standard for good restaurant service; 15% is acceptable for basic service. Other countries differ a lot — in much of Europe and Asia, service is included and small rounding is enough.',
    },
    {
      question: 'Should I tip on the total including tax?',
      answer:
        'Etiquette guides usually suggest tipping on the pre-tax amount, but many people simply tip on the final total for simplicity. The difference on a typical check is small — pick one convention and be consistent.',
    },
    {
      question: 'What if we are splitting unevenly?',
      answer:
        'This calculator splits equally. For uneven splits, use each person’s own items: run the calculator once per person with their bill, or use the grand total and per-person figure as a fair baseline for discussion.',
    },
    {
      question: 'Does the per-person amount round up?',
      answer:
        'No — it shows the exact share to the cent. If your group prefers to round up to whole dollars, round the per-person figure up; the difference goes to the tip.',
    },
  ],
  keywords: [
    'tip split calculator',
    'tip calculator per person',
    'split bill with tip',
    'restaurant bill splitter',
  ],
} satisfies ToolConfig
