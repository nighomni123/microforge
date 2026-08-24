import type { ToolConfig } from '../../src/engine/schema'

/**
 * Lorem Ipsum Generator — deterministic filler text via a seeded PRNG
 * (mulberry32). Same settings always yield the same passage: no Math.random.
 */
const WORD_BANK = [
  'dolor', 'ipsum', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed',
  'eiusmod', 'tempor', 'incididunt', 'labore', 'magna', 'aliqua', 'veniam',
  'quis', 'nostrud', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'proident',
  'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'laborum',
]

function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return function next(): number {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function capitalizeFirst(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export default {
  slug: 'lorem-ipsum-generator',
  title: 'Lorem Ipsum Generator',
  metaTitle: 'Lorem Ipsum Generator — Placeholder Text Instantly',
  metaDescription:
    'Create 1 to 20 lorem ipsum placeholder paragraphs instantly for mockups, wireframes and design templates. Copy-ready filler text, generated free.',
  category: 'generators',
  tags: ['design', 'placeholder-text', 'mockups'],
  icon: '📝',
  status: 'live',
  description:
    'Generate clean lorem ipsum placeholder paragraphs for mockups, wireframes and templates — choose how many you need, optionally keep the classic opening, and copy instantly.',
  howItWorks:
    'Choose a paragraph count and the generator builds each paragraph from four to seven sentences of six to fourteen words, drawn from the standard lorem ipsum vocabulary with capitalized sentence starts and periods. A seeded pseudo-random generator (mulberry32) drives every pick, so the same settings always produce exactly the same passage — handy when a teammate needs to regenerate identical filler.\n\nBy default the first paragraph opens with the classic “Lorem ipsum dolor sit amet…”; switch it off for randomized text throughout. Everything is computed locally in your browser the moment you change a setting — nothing is fetched or uploaded.',
  inputs: [
    {
      id: 'paragraphs',
      label: 'Number of paragraphs',
      type: 'number',
      default: 3,
      min: 1,
      max: 20,
      step: 1,
      help: 'Between 1 and 20 paragraphs.',
    },
    {
      id: 'startWithLorem',
      label: 'Start with the classic opening?',
      type: 'select',
      default: 1,
      options: [
        { value: 1, label: 'Yes — “Lorem ipsum dolor sit amet…”' },
        { value: 0, label: 'No — randomized throughout' },
      ],
    },
  ],
  outputs: [
    { id: 'lorem', label: 'Your placeholder text', format: 'text', primary: true },
    { id: 'wordCount', label: 'Words generated', format: 'number', decimals: 0 },
  ],
  faqs: [
    {
      question: 'What is lorem ipsum, exactly?',
      answer:
        'It is scrambled pseudo-Latin derived from Cicero’s “De Finibus Bonorum et Malorum” (45 BC). An unknown printer in the 1500s jumbled the passage to make a type-specimen book, and the garbled text has been the printing and design industry’s standard dummy copy ever since.',
    },
    {
      question: 'Why use placeholder text instead of real copy?',
      answer:
        'Readable-looking but meaningless words keep reviewers focused on layout, typography and spacing instead of proofreading the content. Real copy is usually not written yet during design anyway, and lorem ipsum has a natural word-length distribution that mimics real language better than “text text text”.',
    },
    {
      question: 'Is lorem ipsum actual Latin?',
      answer:
        'It only looks like Latin. The fragments come from genuine classical prose, but after centuries of scrambling they form sentences with no coherent meaning — which is precisely the point: nothing distracts from the design.',
    },
  ],
  keywords: [
    'lorem ipsum generator',
    'placeholder text',
    'dummy text generator',
    'filler text',
    'lorem ipsum paragraphs',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const paragraphCount = Math.floor(Number(inputs.paragraphs))
    if (!Number.isFinite(paragraphCount) || paragraphCount < 1 || paragraphCount > 20) {
      throw new Error('Choose between 1 and 20 paragraphs.')
    }
    const startWithLorem = Number(inputs.startWithLorem) === 1
    const rand = mulberry32(paragraphCount * 7919 + (startWithLorem ? 1 : 0))
    const nextWord = (): string => WORD_BANK[Math.floor(rand() * WORD_BANK.length)]!

    const builtParagraphs: string[] = []
    for (let p = 0; p < paragraphCount; p++) {
      const sentenceCount = 4 + Math.floor(rand() * 4) // 4–7 sentences per paragraph
      const sentences: string[] = []
      for (let s = 0; s < sentenceCount; s++) {
        const wordTarget = 6 + Math.floor(rand() * 9) // 6–14 words per sentence
        const words: string[] = []
        if (p === 0 && s === 0 && startWithLorem) {
          words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet')
        }
        while (words.length < wordTarget) {
          words.push(nextWord())
        }
        const sentence = words
          .map((word, index) => (index === 0 ? capitalizeFirst(word) : word))
          .join(' ')
        sentences.push(`${sentence}.`)
      }
      builtParagraphs.push(sentences.join(' '))
    }

    const lorem = builtParagraphs.join('\n\n')
    const wordCount = lorem.split(/\s+/).filter(Boolean).length
    return { lorem, wordCount }
  },
} satisfies ToolConfig
