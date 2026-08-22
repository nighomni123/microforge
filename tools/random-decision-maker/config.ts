import type { ToolConfig } from '../../src/engine/schema'

/**
 * Random Decision Maker — proves generator-style tools:
 * customCompute + explicit action button (autoCompute: false).
 */
export default {
  slug: 'random-decision-maker',
  title: 'Random Decision Maker',
  metaTitle: 'Random Decision Maker — Yes, No, or Pick for Me',
  metaDescription:
    'Can’t decide? Enter your options and let chance pick one instantly. Great for dinners, chores, names, and yes-or-no calls.',
  category: 'generators',
  tags: ['random', 'decisions', 'picker'],
  icon: '🎲',
  status: 'live',
  description:
    'Stuck choosing between options? List them, press the button, and get an instant random answer — from “what’s for dinner” to “who goes first”.',
  howItWorks:
    'Each pick uses JavaScript’s cryptographically-seeded Math.random equivalent of drawing lots: every option gets an equal 1-in-N chance, with no memory of previous picks.\n\nNothing you type is stored or sent anywhere — the list lives only in your current tab. Edit the list between picks as often as you like.',
  inputs: [
    {
      id: 'options',
      label: 'Your options',
      type: 'text',
      default: 'Pizza, Sushi, Tacos, Salad, Ramen',
      placeholder: 'Pizza, Sushi, Tacos…',
      help: 'Separate options with commas. Two or more works best.',
    },
  ],
  outputs: [
    { id: 'choice', label: 'Your answer', format: 'text', primary: true },
    { id: 'optionCount', label: 'Options considered', format: 'number', decimals: 0 },
  ],
  faqs: [
    {
      question: 'Is the pick truly random?',
      answer:
        'It uses your browser’s built-in pseudo-random number generator, which is unpredictable enough for everyday decisions. It is not certified for lotteries, giveaways with legal requirements, or cryptography.',
    },
    {
      question: 'Can I use it to pick names or teams?',
      answer:
        'Yes — paste any comma-separated list: names, chores, movies, exercises. It picks one item per press, so run it repeatedly to build an order for turns or teams.',
    },
    {
      question: 'How do I do a yes-or-no decision?',
      answer:
        'Just enter two options: “Yes, No”. Each outcome keeps a fair 50/50 chance, and re-rolling never biases future picks.',
    },
    {
      question: 'Are my options saved anywhere?',
      answer:
        'No. The list exists only while the page is open in your tab. Refreshing starts clean — nothing reaches a server.',
    },
  ],
  keywords: [
    'random decision maker',
    'yes or no decider',
    'random picker from list',
    'what should I eat decider',
  ],
  autoCompute: false,
  actionLabel: 'Pick for me',
  customCompute(inputs) {
    const raw = String(inputs.options ?? '')
    const options = raw
      .split(',')
      .map((option) => option.trim())
      .filter(Boolean)
    if (options.length < 2) {
      throw new Error('Add at least two options separated by commas.')
    }
    const choice = options[Math.floor(Math.random() * options.length)]!
    return { choice, optionCount: options.length }
  },
} satisfies ToolConfig
