# Demand Mining Playbook — Monday's job

Goal per session: **50+ raw signals → 5 scored backlog rows.** Raw signals go in
scratch notes; only scored ideas enter [idea-backlog.md](idea-backlog.md).

## Source rotation (rotate daily, never skip the review mining)

| Source | What to pull | How |
|---|---|---|
| Google Autocomplete | "calculate …", "how much …", "generator …" seeds | Type seed + alphabet letters; note every suggestion |
| People Also Ask | Question phrasing for FAQ sections | Screenshot/copy 5–10 per niche |
| Google Trends | Rising vs stable vs dying | Compare 12-month curves of candidate keywords |
| Reddit (r/personalfinance, r/frugal, r/productivity, niche subs) | Pain posts | Search: `site:reddit.com "is there a free tool"` etc. |
| App Store / Play autocomplete | Mobile demand signals | Seed words; note install counts on top apps |
| Competitor reviews (1–3 stars) | Unmet needs + UX complaints | Read 30 recent low-star reviews per competitor |
| AnswerThePublic / Keyword Planner free tier | Question clusters | Export, dedupe against backlog |

## Pain-mining query bank

Run these verbatim, swapping `[X]` for your candidate topic:

- `"I wish there was an app" [X]`
- `"is there a free" [X] tool`
- `"why is there no simple" [X]`
- `best free [X] "without subscription"`
- `[X] app "too many ads"`
- `[X] site reddit` (find where people actually ask)
- `simple [X] calculator online free`

## Competitor complaint taxonomy (what you're hunting)

1. Too many ads / ads cover buttons
2. Forced login or signup wall
3. Paywalled basic feature
4. Confusing UI for a simple task
5. Broken on mobile
6. Outdated and unmaintained
7. Privacy concerns ("why does a calculator need my location?")

Each complaint is a feature requirement for your config. Three complaints about ads
⇒ your version ships with consent-gated, non-intrusive placements and says so in
the page intro.

## Session output format

For each candidate idea, capture before scoring:

```text
Idea: <one line>
Evidence: <2–3 links/quotes showing demand>
Top competitors: <links>
Their weakest point: <complaint or gap>
Keyword seeds: <3–5 phrases people actually type>
Risk flags: <YMYL? trademarks? regulated?>
```

Then score with [scoring-model.md](scoring-model.md). Only ≥ 7.0 enters the backlog.
