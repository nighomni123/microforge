# Weekly Workflow — the factory cadence

The factory is a loop, not a project. Same rhythm every week; volume scales with
practice. Automation level: **1 — manual but templated** (prove it works before
automating).

## Monday — Mine (2–3h)
Run [demand-mining-playbook.md](demand-mining-playbook.md).
Output: 5+ scored candidate rows appended to [idea-backlog.md](idea-backlog.md).

## Tuesday — Select (1h)
Re-score the whole backlog quickly. Pick the top 1–3 with Priority ≥ 7.0 that
reuse existing templates (Build Speed 9 first). Write one-line MVP scope each.

## Wednesday — Spec & copy (1–2h)
For each pick, generate the config's non-code half with [prompts/](prompts/):
- `seo-prompt.md` → metaTitle/metaDescription/FAQs/keywords
- `spec-prompt.md` → inputs, outputs, formula sketch, edge cases
Paste results into a scratch doc; human-edit everything (you are the quality gate).

## Thursday — Build (< 1h per tool)
```bash
pnpm gen <slug> "Tool Title" --category calculators
# edit tools/<slug>/config.ts: replace TODOs with Wednesday's copy
pnpm dev   # open /<category>/<slug>, click through every input
```
Formula-only tools should take ~30 min including FAQs.

## Friday — QA + publish
Run [qa-checklist.md](qa-checklist.md) then [publishing-checklist.md](publishing-checklist.md).
Flip `status: 'live'`, `pnpm build`, deploy.
If AdSense env vars are configured and the tool earns placements, verify slots render.

## Saturday — Distribute (30m, value-first)
- Share genuinely-useful answers in relevant communities where allowed
- Internal-link the new tool from 2 older related tool pages (edit their howItWorks/FAQ text if natural)
- No link spam — one good Reddit comment beats ten drive-by drops

## Sunday — Review (30m)
Fill Revenue/Retention columns for live rows in idea-backlog.md:
impressions, clicks, sessions, bounce, ad RPM (if ads on), related_click rate.
Mark kill/improve/scale per scoring-model decision rules. Queue next week's picks.

## Monthly
- Retire or merge dead tools (keep URLs alive with redirects to siblings)
- Review template friction: anything done manually twice → propose a template upgrade
- Back up ops/ and review backlog health (aim: ≥ 10 scored-ready ideas at all times)
