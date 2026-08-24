import type { ToolConfig } from '../../src/engine/schema'

/**
 * Case Converter — seven transforms over one text input, chosen by a select.
 * autoCompute: true, so the result refreshes as the user types or switches case.
 */
function capitalizeWord(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export default {
  slug: 'case-converter',
  title: 'Case Converter',
  metaTitle: 'Case Converter — UPPER, lower, Title, camel & More',
  metaDescription:
    'Convert any text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case in one click. Free, fast, nothing uploaded.',
  category: 'utilities',
  tags: ['developer-tools', 'text-formatting', 'writing'],
  icon: '🔠',
  status: 'live',
  description:
    'Convert text between seven cases — UPPER, lower, Title, Sentence, camelCase, snake_case and kebab-case — instantly, free, and entirely in your browser.',
  howItWorks:
    'Pick a target case and paste your text; the conversion runs as you type. Title Case capitalizes the first letter of every word, Sentence case lowercases everything then re-capitalizes after periods, exclamation marks and question marks, and the programmer cases (camelCase, snake_case, kebab-case) first strip stray punctuation, split on word boundaries, and rejoin with the right convention.\n\nLike every tool here, the conversion happens locally in your browser — nothing is uploaded, logged, or stored, so it is safe for client copy, credentials-adjacent snippets, or anything else you would rather not paste into a random website.',
  inputs: [
    {
      id: 'text',
      label: 'Your text',
      type: 'text',
      default: 'the quick brown fox jumps over the lazy dog',
      placeholder: 'Type or paste the text to convert…',
      help: 'Works with single words, headlines, or whole paragraphs.',
      multiline: true,
    },
    {
      id: 'operation',
      label: 'Target case',
      type: 'select',
      default: 2,
      options: [
        { value: 0, label: 'UPPER CASE' },
        { value: 1, label: 'lower case' },
        { value: 2, label: 'Title Case' },
        { value: 3, label: 'Sentence case' },
        { value: 4, label: 'camelCase' },
        { value: 5, label: 'snake_case' },
        { value: 6, label: 'kebab-case' },
      ],
    },
  ],
  outputs: [
    { id: 'converted', label: 'Result', format: 'text', primary: true },
    { id: 'charCount', label: 'Characters', format: 'number', decimals: 0 },
  ],
  faqs: [
    {
      question: 'Which cases do programmers actually need?',
      answer:
        'camelCase dominates in JavaScript variables and JSON keys, snake_case is the convention in Python, Ruby and SQL column names, and kebab-case is standard for URLs, CSS class names and file names. This tool converts any phrase into all three so your naming stays consistent across languages.',
    },
    {
      question: 'Does Title Case follow a specific style guide?',
      answer:
        'Style guides disagree: AP skips short prepositions, Chicago has long sub-rule lists, and titles like “the” or “of” are treated differently everywhere. We use one honest, predictable rule — capitalize the first letter of every word — so you always know exactly what you will get.',
    },
    {
      question: 'Is there a keyboard shortcut for changing case?',
      answer:
        'Some apps have one: Microsoft Word cycles cases with Shift+F3, Google Docs hides it under Format → Text → Capitalization, and VS Code offers transform-to-uppercase or transform-to-lowercase commands. This converter covers every case in one place and works anywhere, including phones and apps without shortcuts.',
    },
  ],
  keywords: [
    'case converter',
    'uppercase to lowercase',
    'title case converter',
    'camelcase converter',
    'convert to snake_case',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const raw = String(inputs.text ?? '')
    if (raw.trim() === '') {
      throw new Error('Enter some text to convert.')
    }
    const operation = Number(inputs.operation)
    const tokens = raw
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)

    let converted = ''
    switch (operation) {
      case 0:
        converted = raw.toUpperCase()
        break
      case 1:
        converted = raw.toLowerCase()
        break
      case 2:
        converted = raw.replace(/\S+/g, (word) => capitalizeWord(word))
        break
      case 3:
        converted = raw
          .toLowerCase()
          .replace(/(^|[.!?]\s+|\n\s*)(\S)/g, (_match, prefix: string, ch: string) => prefix + ch.toUpperCase())
        break
      case 4:
        if (tokens.length === 0) throw new Error('camelCase needs at least one letter or number.')
        converted = tokens
          .map((token, index) => (index === 0 ? token.toLowerCase() : capitalizeWord(token.toLowerCase())))
          .join('')
        break
      case 5:
        if (tokens.length === 0) throw new Error('snake_case needs at least one letter or number.')
        converted = tokens.map((token) => token.toLowerCase()).join('_')
        break
      case 6:
        if (tokens.length === 0) throw new Error('kebab-case needs at least one letter or number.')
        converted = tokens.map((token) => token.toLowerCase()).join('-')
        break
      default:
        throw new Error('Unknown target case — please re-select an option.')
    }

    return { converted, charCount: converted.length }
  },
} satisfies ToolConfig
