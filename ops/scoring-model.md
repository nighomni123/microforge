# Scoring Model — which ideas earn a build slot

Never build an idea because it sounds fun. Build it because the math says so.

## The formula

```
Priority = Demand×0.35 + CompetitionGap×0.20 + BuildSpeed×0.20 + Monetization×0.15 + LowRisk×0.10
```

Score each dimension 1–10, then compute. **Threshold: ≥ 7.0 to enter the build queue.**
Anything below 7 goes back to the backlog with a note on what would raise it.

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

### 4. Monetization (weight 0.15)
Ask: will users *linger* near an ad without being annoyed?
| Score | Signals |
|---|---|
| 8–10 | Repeat-use tool with natural result-screen dwell time; rewarded-ad potential |
| 5–7 | Single-visit utility with clean result placement |
| 2–4 | Ten-second bounce usage (converters) |

### 5. Low Risk (weight 0.10)
Start at 10 and subtract for: medical/financial advice adjacency (−3), trademark-adjacent naming (−5), gambling-like mechanics (−5), child-directed complexity (−3), data sensitivity (−3).

## Worked example

**Rent Split Calculator**: Demand 8, Gap 6, Speed 9, Money 6, Risk 9.
```
8×0.35 + 6×0.20 + 9×0.20 + 6×0.15 + 9×0.10 = 2.8 + 1.2 + 1.8 + 0.9 + 0.9 = 7.60 → BUILD
```

## Decision rules after launch

Review every live product at day 7 and day 14 (see publishing-checklist.md):

- **Kill** — no organic impressions trend, bounce > 85%, zero conversions to related tools after ~500 visits.
- **Improve ONE thing at a time** — has traffic but weak engagement: fix copy, FAQ targeting, or ad placement. Never ship two changes at once; you won't know what worked.
- **Scale** — returning visitors, rising impressions, revenue per visitor positive: build sibling tools (same template), internal-link them aggressively, add rewarded formats carefully.
