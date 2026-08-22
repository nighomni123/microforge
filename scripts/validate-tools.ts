/**
 * Build-time gate for the factory: every tool config must be valid before a
 * deploy ships. Run via `pnpm build` (or standalone: tsx scripts/validate-tools.ts).
 *
 * Checks beyond the Zod schema:
 * - slug matches folder name, is unique, and is not a reserved route
 * - formula identifiers resolve to inputs or earlier outputs
 * - every output computes to a finite number from default inputs
 * - exactly one primary output per tool
 * - duplicate metaTitles warn (SEO differentiation)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { computeFormulaOutputs } from '../src/engine/compute'
import { extractIdentifiers } from '../src/engine/evaluate'
import { ToolConfigSchema } from '../src/engine/schema'

const RESERVED_SLUGS = new Set([
  'about',
  'contact',
  'privacy',
  'terms',
  'category',
  'categories',
  'tools',
  'admin',
  'api',
  'assets',
])

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const toolsDir = path.join(projectRoot, 'tools')

let failures = 0
let warnings = 0

function fail(message: string): void {
  failures++
  console.error(`  ✗ ${message}`)
}

function warn(message: string): void {
  warnings++
  console.warn(`  ⚠ ${message}`)
}

const slugs = new Set<string>()
const metaTitles = new Map<string, string>()

const entries = fs.existsSync(toolsDir)
  ? fs.readdirSync(toolsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : []

if (entries.length === 0) {
  console.error('No tool directories found in ./tools — nothing to validate.')
  process.exit(1)
}

for (const entry of entries) {
  const dirName = entry.name
  console.log(`Validating ${dirName}…`)

  const configFile = path.join(toolsDir, dirName, 'config.ts')
  if (!fs.existsSync(configFile)) {
    fail(`${dirName}: missing config.ts`)
    continue
  }

  let config: unknown
  try {
    const module = await import(pathToFileURL(configFile).href)
    config = module.default
  } catch (err) {
    fail(`${dirName}: config failed to load — ${err instanceof Error ? err.message : String(err)}`)
    continue
  }

  const parsed = ToolConfigSchema.safeParse(config)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ')
    fail(`${dirName}: invalid config — ${issues}`)
    continue
  }
  const cfg = parsed.data

  if (cfg.slug !== dirName) fail(`slug "${cfg.slug}" must match folder name "${dirName}"`)
  if (slugs.has(cfg.slug)) fail(`duplicate slug "${cfg.slug}"`)
  slugs.add(cfg.slug)
  if (RESERVED_SLUGS.has(cfg.slug)) fail(`slug "${cfg.slug}" is a reserved route`)

  const hasCustomCompute =
    typeof (config as { customCompute?: unknown }).customCompute === 'function'
  const inputIds = new Set(cfg.inputs.map((input) => input.id))

  if (cfg.outputs.filter((output) => output.primary).length !== 1) {
    fail('exactly one output must have primary: true')
  }

  const scope: Record<string, number> = {}
  for (const input of cfg.inputs) {
    if (input.type !== 'text' && typeof input.default === 'number') scope[input.id] = input.default
  }
  const previousOutputIds = new Set<string>()

  for (const output of cfg.outputs) {
    if (output.format === 'text' && !hasCustomCompute) {
      fail(`output "${output.id}": format "text" requires customCompute`)
    }
    if (!hasCustomCompute && !output.formula) {
      fail(`output "${output.id}": formula required when customCompute is absent`)
    }
    if (hasCustomCompute && !output.formula) continue

    try {
      for (const identifier of extractIdentifiers(output.formula!)) {
        if (!inputIds.has(identifier) && !previousOutputIds.has(identifier)) {
          fail(`output "${output.id}": unknown identifier "${identifier}"`)
        }
      }
      const value = computeFormulaOutputs([output], scope)[0]!.value
      if (!Number.isFinite(value)) {
        fail(`output "${output.id}": default inputs produce a non-finite result`)
      }
      scope[output.id] = value // later outputs may chain on earlier ones
    } catch (err) {
      fail(`output "${output.id}": ${err instanceof Error ? err.message : 'formula error'}`)
    }
    previousOutputIds.add(output.id)
  }

  if (cfg.inputs.some((input) => input.type === 'text') && !hasCustomCompute) {
    warn('text inputs are ignored by formula evaluation (fine for display-only fields)')
  }

  const existingOwner = metaTitles.get(cfg.metaTitle)
  if (existingOwner) warn(`metaTitle "${cfg.metaTitle}" already used by ${existingOwner}`)
  else metaTitles.set(cfg.metaTitle, cfg.slug)
}

console.log('')
if (failures > 0) {
  console.error(`${failures} problem(s) across ${entries.length} tool(s). Fix before building.`)
  process.exit(1)
}
console.log(`All ${entries.length} tool config(s) valid.${warnings > 0 ? ` (${warnings} warning(s))` : ''}`)
