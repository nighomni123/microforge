import type { ToolConfig } from '../../src/engine/schema'

/**
 * Word Counter — classic utilities demand (wordcounter.net-class traffic).
 * Pure client-side counting: autoCompute on every keystroke, zero uploads.
 */
export default {
  slug: 'word-counter',
  title: 'Word Counter',
  metaTitle: 'Word Counter — Words, Characters & Reading Time',
  metaDescription:
    'Free online word counter. See live word, character, sentence and paragraph counts plus reading time — your text never leaves your browser.',
  category: 'utilities',
  tags: ['writing', 'word-count', 'text-analysis', 'productivity'],
  icon: '🔢',
  status: 'live',
  description:
    'Count words, characters, sentences and paragraphs in real time, with an instant reading-time estimate — completely free and nothing leaves your browser.',
  howItWorks:
    'Paste or type your text and every statistic updates as you go. We split on whitespace to count words, tally every character (with and without spaces), and detect sentences by splitting on periods, exclamation marks and question marks. Paragraphs are counted wherever you leave a blank line.\n\nThe reading-time estimate divides your word count by 200, the average adult silent-reading speed in words per minute, rounded to a tenth of a minute. Everything runs locally in your browser — your text is never uploaded, stored, or seen by anyone else, unlike counters that park your drafts behind an account wall.',
  inputs: [
    {
      id: 'text',
      label: 'Your text',
      type: 'text',
      default: 'Paste or type your text here to see live counts.',
      placeholder: 'Paste your essay, article, or post here…',
      help: 'Counts update live as you type or paste.',
      multiline: true,
    },
  ],
  outputs: [
    { id: 'words', label: 'Words', format: 'number', decimals: 0, primary: true },
    { id: 'characters', label: 'Characters', format: 'number', decimals: 0 },
    { id: 'charsNoSpaces', label: 'Characters (no spaces)', format: 'number', decimals: 0 },
    { id: 'sentences', label: 'Sentences', format: 'number', decimals: 0 },
    { id: 'paragraphs', label: 'Paragraphs', format: 'number', decimals: 0 },
    { id: 'readingTimeMin', label: 'Reading time (minutes)', format: 'number', decimals: 1 },
  ],
  faqs: [
    {
      question: 'Is my text uploaded anywhere?',
      answer:
        'No. Every count is calculated locally in your browser with JavaScript — your text never reaches a server, is never stored, and disappears the moment you close the tab.',
    },
    {
      question: 'How is the reading time estimated?',
      answer:
        'We divide your word count by 200 — the widely cited average adult silent-reading speed in words per minute — and round to the nearest tenth of a minute. Faster or slower readers can scale the figure accordingly.',
    },
    {
      question: 'What counts as a sentence?',
      answer:
        'Any stretch of text separated by a period, exclamation mark, or question mark. Ellipses and abbreviations can occasionally split a sentence early, so treat the sentence count as a very close estimate rather than a grammar ruling.',
    },
    {
      question: 'What are the character limits for common platforms?',
      answer:
        'As general knowledge: posts on X are capped at 280 characters, a single SMS segment fits 160, and search-engine meta descriptions start getting truncated around 155. Platforms change limits often, so double-check before publishing.',
    },
  ],
  keywords: [
    'word counter',
    'character counter',
    'letter counter',
    'words per page',
    'reading time calculator',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const text = String(inputs.text ?? '')
    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length
    const characters = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = text
      .split(/[.!?]+/)
      .filter((part) => part.trim() !== '').length
    let paragraphs = text
      .split(/\n\s*\n/)
      .filter((block) => block.trim() !== '').length
    if (paragraphs === 0 && text.trim() !== '') paragraphs = 1
    const readingTimeMin = words === 0 ? 0 : Math.round((words / 200) * 10) / 10
    return { words, characters, charsNoSpaces, sentences, paragraphs, readingTimeMin }
  },
} satisfies ToolConfig
