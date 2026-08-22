/**
 * Factory scaffolder: `pnpm gen <slug> "<Title>" [--category calculators] [--icon 🧮]`
 *
 * Creates tools/<slug>/config.ts from a template that passes validation
 * immediately, then prints the path to publishable. Draft status means it is
 * invisible in production builds until you flip it to 'live'.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TOOL_CATEGORIES } from '../src/engine/schema'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const toolsDir = path.join(projectRoot, 'tools')

const args = process.argv.slice(2)
const positional = args.filter((arg) => !arg.startsWith('--'))
const flagValue = (name: string): string | undefined => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 ? (args[index + 1] as string | undefined) : undefined
}

const slug = positional[0]
const title = positional[1]
const category = flagValue('category') ?? 'calculators'
const icon = flagValue('icon') ?? '🧮'

function die(message: string): never {
  console.error(`✗ ${message}`)
  console.error('')
  console.error('Usage: pnpm gen <slug> "Tool Title" [--category calculators] [--icon 🧮]')
  console.error(`Categories: ${TOOL_CATEGORIES.join(', ')}`)
  process.exit(1)
}

if (!slug || !title) die('Both a slug and a quoted title are required.')
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  die(`Slug "${slug}" must be kebab-case (lowercase letters, numbers, hyphens).`)
}
if (!(TOOL_CATEGORIES as readonly string[]).includes(category)) {
  die(`Unknown category "${category}".`)
}
const targetDir = path.join(toolsDir, slug)
if (fs.existsSync(targetDir)) die(`${targetDir} already exists.`)

const config = `import type { ToolConfig } from '../../src/engine/schema'

/**
 * TODO before flipping status to 'live':
 * 1. Write a real metaTitle (50–60 chars) and metaDescription (80–155 chars).
 * 2. Define real inputs and at least one output formula (or customCompute).
 * 3. Write FAQs that target questions people actually search for.
 * 4. Check ops/publishing-checklist.md before launch.
 */
export default {
  slug: '${slug}',
  title: '${title.replace(/'/g, "\\'")}',
  metaTitle: 'TODO: Unique SEO title for ${slug} (50-60 chars)',
  metaDescription:
    'TODO: One-sentence value proposition with the main keyword, 80-155 characters long.',
  category: '${category}',
  tags: ['todo'],
  icon: '${icon}',
  status: 'draft',
  description: 'TODO: 1-3 sentence intro shown under the H1 on the tool page.',
  howItWorks: 'TODO: Explain the formula or logic in plain language. What does each input mean?',
  inputs: [
    {
      id: 'amount',
      label: 'Amount',
      type: 'number',
      default: 100,
      min: 0,
      step: 1,
      help: 'TODO: what this input means.',
    },
  ],
  outputs: [
    {
      id: 'result',
      label: 'Result',
      formula: 'amount * 2', // TODO: replace with the real formula
      format: 'number',
      decimals: 2,
      primary: true,
    },
  ],
  faqs: [
    {
      question: 'TODO: A question people actually search for?',
      answer:
        'TODO: A clear, honest answer of at least twenty characters so the schema is satisfied.',
    },
    {
      question: 'TODO: Another common question?',
      answer:
        'TODO: Another clear, honest answer of at least twenty characters for the FAQ schema.',
    },
  ],
  keywords: ['todo keyword one'],
} satisfies ToolConfig
`

fs.mkdirSync(targetDir, { recursive: true })
fs.writeFileSync(path.join(targetDir, 'config.ts'), config)

console.log(`✓ Created tools/${slug}/config.ts (${category}, draft)`)
console.log('')
console.log('Next steps:')
console.log(`  1. Edit tools/${slug}/config.ts — replace every TODO.`)
console.log('  2. pnpm build   → validates the config and prerenders the page.')
console.log(`     (dev preview: pnpm dev, then open /${category}/${slug})`)
console.log(`  3. Flip status to 'live' when it earns it — see ops/publishing-checklist.md.`)
