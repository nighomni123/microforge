# Prompt: Config Code Generation

After the spec is human-approved, generate the config file itself:

```text
Generate a tools/<slug>/config.ts file for a micro-tool factory using this exact
TypeScript shape (zod-validated at build time):

import type { ToolConfig } from '../../src/engine/schema'

export default {
  slug: '<kebab-case>',
  title: string, metaTitle (50-60 chars), metaDescription (30-155 chars),
  category: one of calculators|generators|converters|planners|trackers|timers|quizzes|utilities,
  tags: string[], icon: single emoji, status: 'draft',
  currencyCode?: 'USD' | other ISO code when money involved,
  description (30-400 chars), howItWorks (30-2000 chars),
  inputs: [...], outputs: [...], faqs: [{question, answer}], keywords: string[]
} satisfies ToolConfig

Rules:
- Formulas only use: identifiers of inputs or earlier outputs, + - * / % ^,
  ternary, comparisons, && || !, min/max/abs/floor/ceil/round/sqrt/log/log10/pow/clamp
- Exactly one output has primary: true
- Every input has a numeric default (except text inputs) so the page renders a live example
- No trademarked names anywhere; plain descriptive title
- FAQ answers are honest and specific; no medical/financial guarantees
- If customCompute is needed, write it as a clean named function above the default export

SPEC:
[PASTE APPROVED SPEC]
```

Then human-review: check defaults produce sane results, formulas match spec edge
cases, and copy sounds human — AI config text ships under your name.
