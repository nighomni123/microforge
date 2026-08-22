# Prompt: SEO Page Copy

```text
Write search metadata for a web tool page. Natural language only — if a phrase
sounds stuffed, rewrite it.

Tool: [WHAT IT DOES, one sentence]
Primary keyword: [KEYWORD]
Audience: [WHO + THEIR SITUATION]

Deliver exactly:
1. metaTitle — 50–60 chars including the keyword, no clickbait
2. metaDescription — 120–155 chars, states what it does + one concrete benefit
3. H1 — plain descriptive
4. Intro paragraph — ≤ 40 words shown directly under the H1
5. "How it works" — 80–150 words explaining the actual math/logic transparently
6. Five FAQ pairs (question phrased like real searches; answers 40–60 words, honest,
   no guarantees). At least one should handle the most common misconception.
7. Six keyword phrases for internal linking, ordered by intent strength

Constraints: no superlatives you can't defend, no "best/free/instant" stacking,
no fabricated statistics, US English.
```

Paste outputs into the tool's `config.ts` fields (metaTitle, metaDescription,
description, howItWorks, faqs, keywords).
