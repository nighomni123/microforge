# Scoring Model — which ideas earn a build slot

Never build an idea because it sounds fun. Build it because the math says so.

## The formula

```
Priority = Demand×0.30 + CompetitionGap×0.20 + BuildSpeed×0.15 + Monetization×0.25 + LowRisk×0.10
```

Score each dimension 1–10, then compute. **Threshold: ≥ 7.0 to enter the build queue.**
Anything below 7 goes back to the backlog with a note on what would raise it.

**Hard floors (enforced at the spec stage):**
- **Monetization ≥ 6** — the factory ships a product, not a portfolio. If the only
  revenue path is "maybe 10-second-bounce display ads," it does not build.
- **Build Speed ≥ 6** unless Distribution is a named, active community — slow builds
  need a moat that an existing template cannot provide.

## Why the weights changed (2026-Q3)

The original 0.15 weight on Monetization treated revenue as a soft signal and let
plenty of clean, unspendable utilities into the build queue. Once `affiliate` offers
became a first-class field on every config, intent-matched tools earn a real cut at
the moment of intent — and the build queue should reflect that, not filter against
it. Lower Build Speed weight + a hard monetization floor keeps the factory's unit
economics honest without losing the speed advantage.

## Dimension rubrics

### 1. Demand (weight 0.35)
| Score | Evidence |
|---|---|
| 9–10 | High search volume AND growing trend AND active complaints ("why is there no simple…") |
| 7–8 | Clear search volume or steady evergreen queries |
| 4–6 | Some interest; mostly seasonal or thin long-tail |
| 1–3 | You invented the need yourself |

Evidence sources: Google Trends, autocomplete depth, "People also ask", Play Store top charts, Reddit/Quora question frequency.

### 2. Competition Gap (weight 0.20)
| Score | Situation |
|---|---|
| 9–10 | Top results are broken, ancient, ad-stuffed, or login-walled |
| 7–8 | Competitors exist but reviews show consistent unhappiness |
| 4–6 | Solid incumbents; you'd compete on polish only |
| 1–3 | Google itself or a dominant app owns the query |

### 3. Build Speed (weight 0.20)
| Score | Definition |
|---|---|
| 9–10 | One config file from an existing template (`pnpm gen` + edit) |
| 7–8 | Config + one small customCompute function |
| 4–6 | New interaction pattern (timer engine, canvas game) |
| 1–3 | Backend, auth, paid APIs, or heavy content production |

### 4. Monetization (weight 0.25, hard floor ≥ 6)
Ask: can this tool monetize at the moment of intent, not just at the moment of impression?
| Score | Signals |
|---|---|
| 8–10 | Intent-rich result screen with a clear next-action affiliate (loan, tax, banking, software); or repeat-use tool suited to Pro/sync tier |
| 6–7 | Single-visit utility with display ad support once traffic consolidates |
| 2–5 | Ten-second bounce usage with no affiliate hook (converters, simple lorem-ipsum, etc.) — these do not build |

### 5. Low Risk (weight 0.10)
Start at 10 and subtract for: medical/financial advice adjacency (−3), trademark-adjacent naming (−5), gambling-like mechanics (−5), child-directed complexity (−3), data sensitivity (−3).

## Worked example

**Rent Split Calculator**: Demand 8, Gap 6, Speed 9, Money 6, Risk 9.
```
8×0.30 + 6×0.20 + 9×0.15 + 6×0.25 + 9×0.10 = 2.4 + 1.2 + 1.35 + 1.50 + 0.90 = 7.35 → BUILD
```

## Decision rules after launch

Review every live product at day 7 and day 14 (see publishing-checklist.md):

- **Kill** — no organic impressions trend, bounce > 85%, zero conversions to related tools after ~500 visits.
- **Improve ONE thing at a time** — has traffic but weak engagement: fix copy, FAQ targeting, or ad placement. Never ship two changes at once; you won't know what worked.
- **Scale** — returning visitors, rising impressions, revenue per visitor positive: build sibling tools (same template), internal-link them aggressively, add rewarded formats carefully.
