import { z } from 'zod'

export const TOOL_CATEGORIES = [
  'calculators',
  'generators',
  'converters',
  'planners',
  'trackers',
  'timers',
  'quizzes',
  'utilities',
] as const

export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

export const INPUT_TYPES = ['number', 'currency', 'percent', 'select', 'text'] as const
export const OUTPUT_FORMATS = ['number', 'currency', 'percent', 'text'] as const

const identifierSchema = z.string().regex(/^[a-z][a-zA-Z0-9_]*$/, 'must be a camelCase identifier')

export const ToolInputSchema = z
  .object({
    id: identifierSchema,
    label: z.string().min(1).max(80),
    type: z.enum(INPUT_TYPES),
    default: z.union([z.number(), z.string()]).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
    help: z.string().max(200).optional(),
    placeholder: z.string().max(80).optional(),
    options: z
      .array(
        z.object({
          value: z.number(),
          label: z.string().min(1).max(60),
        }),
      )
      .min(1)
      .optional(),
  })
  .superRefine((input, ctx) => {
    if (input.type === 'select') {
      if (!input.options) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'select inputs require options',
        })
      }
      if (typeof input.default !== 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['default'],
          message: 'select inputs require a numeric default matching one option value',
        })
      }
      if (
        input.options &&
        typeof input.default === 'number' &&
        !input.options.some((option) => option.value === input.default)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['default'],
          message: 'default must match one of the option values',
        })
      }
    }
    if (input.type !== 'select' && input.type !== 'text' && typeof input.default !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['default'],
        message: `${input.type} inputs require a numeric default`,
      })
    }
    if (input.type === 'text' && input.options) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['options'],
        message: 'options are only valid on select inputs',
      })
    }
  })

export type ToolInput = z.infer<typeof ToolInputSchema>

export const ToolOutputSchema = z.object({
  id: identifierSchema,
  label: z.string().min(1).max(80),
  formula: z.string().min(1).optional(),
  format: z.enum(OUTPUT_FORMATS),
  decimals: z.number().int().min(0).max(6).optional(),
  primary: z.boolean().optional(),
})

export type ToolOutput = z.infer<typeof ToolOutputSchema>

export const FaqItemSchema = z.object({
  question: z.string().min(10).max(200),
  answer: z.string().min(20).max(1000),
})

export const ToolConfigSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a kebab-case slug'),
  title: z.string().min(3).max(80),
  metaTitle: z.string().min(10).max(60),
  metaDescription: z.string().min(30).max(155),
  category: z.enum(TOOL_CATEGORIES),
  tags: z.array(z.string().min(2).max(30)).max(8).default([]),
  description: z.string().min(30).max(400),
  howItWorks: z.string().min(30).max(2000),
  inputs: z.array(ToolInputSchema).min(1).max(12),
  outputs: z.array(ToolOutputSchema).min(1).max(6),
  faqs: z.array(FaqItemSchema).min(2).max(10),
  keywords: z.array(z.string().min(2).max(60)).min(1).max(12),
  icon: z.string().min(1).max(8).default('🧮'),
  currencyCode: z
    .string()
    .regex(/^[A-Z]{3}$/, 'must be a 3-letter ISO currency code (e.g. USD)')
    .optional(),
  status: z.enum(['draft', 'live']).default('draft'),
  actionLabel: z.string().min(2).max(30).optional(),
  autoCompute: z.boolean().optional(),
})

export type ToolConfigData = z.infer<typeof ToolConfigSchema>

/**
 * A tool config as authored in tools/<slug>/config.ts.
 *
 * `customCompute` is the escape hatch for non-formula tools (generators,
 * randomizers, checkers): it receives coerced input values and returns an
 * output-id → value map. Formula outputs are not required when it is present.
 */
export type ToolConfig = ToolConfigData & {
  customCompute?: (inputs: Record<string, string | number>) => Record<string, string | number>
}
