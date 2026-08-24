import type { ToolConfig } from '../../src/engine/schema'

/**
 * Wedding Budget Planner — guest-based cost estimate vs total budget,
 * with a month-by-month savings plan when the day runs over.
 */
export default {
  slug: 'wedding-budget-planner',
  title: 'Wedding Budget Planner',
  metaTitle: 'Wedding Budget Planner — Guest-Based Estimate',
  metaDescription:
    'Estimate your wedding cost from the guest list and compare it to your budget in seconds — see your headroom or a month-by-month savings plan.',
  category: 'planners',
  tags: ['wedding', 'budget', 'planning', 'events'],
  icon: '💍',
  status: 'live',
  currencyCode: 'USD',
  description:
    'Set a total budget, enter your guest count, plate price and per-guest extras, and see instantly whether the day fits your budget — plus how many months of saving it would take to close any gap.',
  howItWorks:
    'Your guest count is the single biggest cost driver at most weddings, because food and beverage scale linearly: every extra seat adds another plate plus its share of the bar, rentals and favors.\n\nThis planner multiplies your guests by the combined per-guest cost — the catering plate plus per-person extras such as venue rentals, the bar package beyond the plate, favors and place settings. The difference between that estimate and your total budget is your headroom.\n\nPositive headroom means you are currently under budget. A negative headroom triggers a savings plan: the tool divides the gap by what you can set aside each month and tells you exactly how many months it will take to close.\n\nTwo cautions: prices vary a lot by region and venue tier, and caterers commonly add a service charge and gratuity of 18–25% on top of the plate. Padding your per-plate figure by roughly that much is usually safer than discovering the fees on the final invoice.',
  inputs: [
    {
      id: 'totalBudget',
      label: 'Total budget',
      type: 'currency',
      default: 25000,
      min: 0,
      step: 500,
      help: 'Everything you are willing to spend on the day, all-in.',
    },
    {
      id: 'guestCount',
      label: 'Guest count',
      type: 'number',
      default: 80,
      min: 10,
      max: 500,
      step: 1,
      help: 'Head-count you actually expect to attend, not invitations sent.',
    },
    {
      id: 'costPerPlate',
      label: 'Cost per plate',
      type: 'currency',
      default: 120,
      min: 20,
      max: 500,
      step: 5,
      help: 'Catering per guest.',
    },
    {
      id: 'extrasPerGuest',
      label: 'Extras per guest',
      type: 'currency',
      default: 45,
      min: 0,
      max: 300,
      step: 5,
      help: 'Rentals, bar package beyond the plate, favors…',
    },
    {
      id: 'monthlySavings',
      label: 'Monthly savings',
      type: 'currency',
      default: 800,
      min: 1,
      step: 50,
      help: 'What you can put aside monthly toward the gap.',
    },
  ],
  outputs: [
    {
      id: 'perGuestCost',
      label: 'Cost per guest (plate + extras)',
      formula: 'costPerPlate + extrasPerGuest',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'estimatedTotal',
      label: 'Estimated total for the day',
      formula: 'guestCount * perGuestCost',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'headroom',
      label: 'Budget headroom (+ = under budget)',
      formula: 'totalBudget - estimatedTotal',
      format: 'currency',
      decimals: 0,
      primary: true,
    },
    {
      id: 'monthsToCloseGap',
      label: 'Months to close the gap',
      formula: 'headroom >= 0 ? 0 : ceil((estimatedTotal - totalBudget) / monthlySavings)',
      format: 'number',
      decimals: 0,
    },
  ],
  faqs: [
    {
      question: 'What does the average wedding cost?',
      answer:
        'It depends heavily on country, region and guest count. In the US, couples commonly report totals anywhere from about $15,000 to well over $40,000, with venue and catering usually the two largest line items. Rather than anchoring on an average, price your own shortlist of venues and caterers, then let the guest count drive the estimate — averages hide enormous regional variation.',
    },
    {
      question: 'What hidden fees surprise couples most often?',
      answer:
        'Catering service charges and gratuities of 18–25% on top of the plate, overtime once the party runs past the contracted hours, cake-cutting and corkage fees, vendor meals, delivery and setup charges, and sales tax stacked on quoted prices. Ask every vendor for an all-in written quote before signing so these costs live inside your budget instead of ambushing the final invoice.',
    },
    {
      question: 'What is the fastest way to cut wedding costs?',
      answer:
        'Trim the guest list first — food and beverage scale per person, so ten fewer guests saves more real money than almost any other change. Next comes date flexibility: off-season dates, Fridays and Sundays routinely unlock venue discounts. Only then simplify flowers, decor and stationery, which cost a lot but rarely change how the day actually feels.',
    },
    {
      question: 'How far ahead should we start saving?',
      answer:
        'Work backwards from the numbers this planner gives you: divide any negative headroom by your monthly savings to get the months needed, then add a buffer for overages. If the timeline feels too long, raise the monthly amount, trim the guest list, or lower the plate cost — each small change compounds across every guest.',
    },
  ],
  keywords: [
    'wedding budget calculator',
    'wedding cost per guest',
    'wedding budget planner',
    'average wedding cost',
    'how to budget for a wedding',
  ],
} satisfies ToolConfig
