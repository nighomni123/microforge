# Publishing Checklist — run before every launch

A tool goes `draft → live` only when every box below is checked for THAT tool.

## Product
- [ ] Solves one clear problem; works in under 3 interactions
- [ ] No login, no backend dependency for the core action
- [ ] Mobile: usable one-handed; inputs don't trigger zoom chaos (proper input types)
- [ ] Result visible without scrolling on typical phone (tool above the fold)
- [ ] Defaults produce a sensible example result on load

## Content & SEO
- [ ] metaTitle 50–60 chars, unique across the site (validator warns)
- [ ] metaDescription 80–155 chars, honest, contains the main keyword naturally
- [ ] H1 matches title intent; intro paragraph under 40 words
- [ ] ≥ 3 FAQs targeting real People-Also-Ask phrasings
- [ ] howItWorks explains the math/logic honestly (no fake authority claims)
- [ ] Prerendered HTML contains the computed default result (view-source check)

## Ads & consent
- [ ] Ad placements reviewed at 375px and desktop widths — nothing overlaps controls
- [ ] Max 2 ad slots visible per viewport; interstitials: none (web policy)
- [ ] Consent banner appears before any third-party script loads
- [ ] Declining consent leaves the tool 100% functional
- [ ] If AdSense env vars set: slots render, labels clear, no accidental-click zones

## Legal
- [ ] Privacy/Terms pages still accurate for this tool's data behavior
- [ ] Name/icon/description contain no trademarks or borrowed branding
- [ ] No misleading claims ("official", "instant approval", medical/financial promises)
- [ ] YMYL topics (health/finance) carry appropriate framing/disclaimers

## Analytics
- [ ] tool_compute fires (test with consent granted)
- [ ] related_click / share_click wired (automatic via components)
- [ ] No console errors on load, compute, copy, share

## Post-launch (calendar these)
- [ ] Day 2: indexed? (`site:` search or Search Console URL inspection)
- [ ] Day 7: first metrics review → backlog row updated
- [ ] Day 14: kill/improve/scale decision per scoring-model.md
