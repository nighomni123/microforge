# QA Checklist — per tool, before the publishing checklist

## Functional
- [ ] All inputs accept and coerce values correctly (decimals, commas typed by users)
- [ ] Clearing an input shows guidance, never NaN/undefined/Infinity text
- [ ] Division-by-zero paths show the friendly error banner
- [ ] Min/max violations show range hints and don't crash results
- [ ] Copy result copies the formatted value (clipboard permission denied = silent fail, no crash)
- [ ] Share uses native sheet on mobile; clipboard fallback elsewhere; Cancel is silent
- [ ] customCompute tools: empty-input state reads sensibly; error messages human

## Rendering & hydration
- [ ] View-source shows prerendered content AND computed default result
- [ ] No hydration mismatch warnings in console after interactive load
- [ ] Dark mode: toggle persists across reload; no flash on first paint
- [ ] Draft badge shows in dev for draft tools; drafts absent from prod routes/sitemap

## Responsive & performance
- [ ] 375px, 768px, 1440px spot-check: no horizontal scroll, no overlapping sticky elements
- [ ] Sticky ad doesn't cover the Calculate button or result (footer padding OK)
- [ ] Lighthouse mobile pass ≥ 90s on Performance/SEO/Best Practices for a fresh page
- [ ] JS bundle unchanged-size sanity (~106 KB gzip total currently) — investigate big jumps

## Policy red-team (2 minutes, be adversarial)
- [ ] Can any UI element trick-tap an ad? (buttons near ad frames)
- [ ] Any accidental-click zone created between sticky ad and content?
- [ ] Does any copy imply human review, certification, or guaranteed outcomes?
- [ ] Are emoji icons original choices (no brand logos)?

## Registry gates (automated — must already pass)
```
pnpm test            # includes: every formula tool computes finite defaults
tsx scripts/validate-tools.ts   # schema + identifier + primary-output checks
```
