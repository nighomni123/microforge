import type { ToolConfig } from '../../src/engine/schema'

/**
 * Car Loan Calculator — amount financed, monthly payment, and total interest
 * from price, down payment, APR, and term using the standard PMT formula.
 */
export default {
  slug: 'car-loan-calculator',
  title: 'Car Loan Calculator',
  metaTitle: 'Car Loan Calculator — Monthly Payment & Interest',
  metaDescription:
    'Estimate your monthly car payment and total interest before you sign. Adjust price, down payment, rate, and term — free, instant, no sign-up.',
  category: 'calculators',
  tags: ['auto-loan', 'car-payment', 'financing', 'interest'],
  icon: '🚗',
  status: 'draft',
  currencyCode: 'USD',
  description:
    'Work out what a car really costs per month: enter the vehicle price, down payment, APR, and loan term to see the amount financed, the monthly payment, and the total interest you would pay over the life of the loan.',
  howItWorks:
    'This calculator uses the standard amortizing-loan (PMT) formula that banks and dealers use. First it subtracts your down payment from the vehicle price to get the amount financed. Then, if the rate is above zero, each payment is calculated as principal × r ÷ (1 − (1 + r)^−n), where r is the monthly interest rate (APR ÷ 12 ÷ 100) and n is the number of months. Every payment is the same size, but early ones go mostly to interest while later ones pay down more principal.\n\nA 0% APR offer is handled separately: the amount financed is simply divided evenly across the months, so no interest appears in the totals.\n\nKeep in mind what this tool does NOT include: sales tax, title, registration, dealer fees, add-ons, insurance, and any fees rolled into the deal are all excluded, so your real out-the-door financing can be higher than shown. Also remember that the interest rate you are offered depends heavily on your credit score, the lender, and whether the car is new or used — the rate you type here should be one you have actually been quoted.\n\nThis tool is for education and planning only; it is not financial advice or a loan offer.',
  inputs: [
    {
      id: 'vehiclePrice',
      label: 'Vehicle price',
      type: 'currency',
      default: 30000,
      min: 0,
      step: 500,
    },
    {
      id: 'downPayment',
      label: 'Down payment',
      type: 'currency',
      default: 3000,
      min: 0,
      step: 500,
      help: 'Cash plus trade-in value.',
    },
    {
      id: 'annualRate',
      label: 'Annual interest rate (APR)',
      type: 'percent',
      default: 6.5,
      min: 0,
      max: 35,
      step: 0.25,
    },
    {
      id: 'termMonths',
      label: 'Loan term',
      type: 'select',
      default: 60,
      options: [
        { value: 36, label: '36 months (3 years)' },
        { value: 48, label: '48 months (4 years)' },
        { value: 60, label: '60 months (5 years)' },
        { value: 72, label: '72 months (6 years)' },
      ],
    },
  ],
  outputs: [
    {
      id: 'loanAmount',
      label: 'Amount financed',
      formula: 'max(0, vehiclePrice - downPayment)',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'monthlyPayment',
      label: 'Monthly payment',
      formula:
        'loanAmount > 0 ? (annualRate > 0 ? loanAmount * (annualRate/100/12) / (1 - pow(1 + annualRate/100/12, -termMonths)) : loanAmount / termMonths) : 0',
      format: 'currency',
      decimals: 2,
      primary: true,
    },
    {
      id: 'totalPaid',
      label: 'Total paid over the loan',
      formula: 'monthlyPayment * termMonths',
      format: 'currency',
      decimals: 0,
    },
    {
      id: 'totalInterest',
      label: 'Total interest cost',
      formula: 'totalPaid - loanAmount',
      format: 'currency',
      decimals: 0,
    },
  ],
  faqs: [
    {
      question: 'How is my monthly car payment calculated?',
      answer:
        'Lenders use an amortization formula: the amount financed times the monthly interest rate, divided by (1 minus (1 + that rate) raised to the power of minus the number of payments). The result is a fixed payment where every installment is identical, but the split changes — early payments are mostly interest and later payments mostly reduce the balance. This calculator applies that exact formula so you can compare deals before you sit down with a finance manager.',
    },
    {
      question: 'What interest rate can I expect on a car loan?',
      answer:
        'It varies widely by credit tier: borrowers with excellent credit often see low single-digit APRs on new cars, while subprime borrowers can be offered rates several times higher. Used-car rates are usually higher than new-car rates, and longer terms often carry higher APRs too. Rather than guessing, get pre-qualified with two or three lenders — banks, credit unions, and the dealer — and use the actual quoted rates here. That is general information, not lending advice.',
    },
    {
      question: 'Why does a 72-month loan cost more if the payment looks smaller?',
      answer:
        'Stretching the term lowers each monthly payment because you are spreading the same debt over more installments — but you are also paying interest for two extra years. On a $27,000 loan at 6.5% APR, moving from 60 to 72 months drops the payment by roughly $45 yet adds well over $700 in total interest. Longer terms also risk being underwater on the car longer, since the vehicle depreciates faster than the balance falls. Compare total interest, not just the monthly figure.',
    },
    {
      question: 'How much does a bigger down payment help?',
      answer:
        'Every dollar of down payment is a dollar you do not borrow, so it reduces the payment immediately and cuts total interest twice over — less principal means less interest charged every month. Putting 10–20% down is a common guideline: on this calculator’s defaults ($30,000 price), raising the down payment from $3,000 to $6,000 trims about $65 off the monthly payment and roughly $900 off total interest at 6.5% over 60 months.',
    },
  ],
  keywords: [
    'car loan calculator',
    'auto loan payment calculator',
    'car financing calculator',
    'monthly car payment estimator',
    'total interest on car loan',
  ],
} satisfies ToolConfig
