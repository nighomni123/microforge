# Prompt: Demand Mining

Use weekly (Monday). Replace `[NICHE]` and paste output into scratch notes for scoring.

```text
Generate 30 micro-tool ideas for the [NICHE] niche based on what people commonly
search for and complain about. Constraints:
- Each must be buildable as a single-page web tool with no login and no backend
- Each must have one main action and one clear result
- Each must be monetizable with tasteful display ads around a result screen
- Exclude: medical diagnosis, legal advice, gambling, anything trademark-adjacent

For each idea provide:
1. Name (plain descriptive, no invented brands)
2. Target user and the exact situation they're in when they search
3. Core function (the one calculation/generation it performs)
4. The formula or logic in plain language
5. One keyword phrase they would type to find it
6. Why an existing solution fails them (ads, paywall, login, complexity)

Format as a table sorted by your estimate of search demand.
```

Follow-up prompt once you shortlist:

```text
For these 5 ideas, act as a skeptical investor. For each: give the single strongest
reason it could fail, the cheapest way to test demand this week without building,
and a score out of 10 for demand / competition gap / build speed / monetization /
risk-avoidance. Be harsh; I will only build scores above 7 weighted 0.35/0.20/0.20/
0.15/0.10 respectively.
```
