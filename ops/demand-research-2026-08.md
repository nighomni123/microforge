# Demand Research — Parallel search-MCP validation sweep (Aug 2026)

Method: 14 probes through `https://search.parallel.ai/mcp` (`web_search` tool),
each probing demand + incumbent quality for a candidate idea cluster.
Client kept at `scripts/research-mcp.py` — rerun any time:
`python3 scripts/research-mcp.py "<objective>" "query1" "query2"`

## Probe results

| # | Hypothesis | Verdict | Evidence |
|---|---|---|---|
| P1 | Final-grade calculator ("what do I need on my final") | ❌ RogerHub owns it; genuinely excellent multi-mode tool, cult following | rogerhub.com/final-grade-calculator |
| P4 | Weight-plate calculator | ❌ ≥6 clean incumbents incl. strengthlevel.com | strengthlevel.com/plate-barbell-racking-calculator |
| P4 | Printable running pace band | ❌ runcalc.app + runbundle do it well | runcalc.app/pace-charts |
| P5 | Cron explainer/generator | ❌ ≥8 free clean tools | crontab guru clones everywhere |
| P5 | JSON→TypeScript converter | ❌ multiple clean client-side tools | codercrafter.in, techcybo |
| P6 | AC BTU room sizing | ❌ ~8 incumbents, several ENERGY-STAR-table-exact | pickhvac.com, countstruction.com |
| P8 | BNPL true-cost reveal | ❌ 5 dedicated sites incl. exact-match domains | bnplcalculator.com, truecostofbnpl.com |
| P9 | Paycheck/take-home accuracy | ⚠️ **REAL gap**: Reddit complaints SmartAsset "not updated for W4 changes"; but incumbents are big brands (ADP, PaycheckCity) and fix needs annual 50-state table maintenance | reddit.com/r/personalfinance 1cllsdp |
| P10 | Nanny vs daycare compare | ❌ saturated incl. nannyvsdaycare.com exact-match domain | — |
| P11 | Job offer comparator | ❌ 9 incumbents, some sophisticated (vesting, tax drag) | moneywizards.ca/en/decisions/job-offer |
| P12 | Deposit-demand-letter generator | ❌ entire niche sites w/ verified state law | securitydepositlaws.com, demandletterlab.com |
| P13 | 529→Roth rollover (SECURE 2.0, 2024!) | ❌ **10 calculators within 2 years of the law**, one editorially reviewed | 529plancalculator.com, agentcalc.com |
| P14 | ChatGPT-sub vs API breakeven | ❌ 8+ tools; one updates pricing daily | pricepertoken.com, costgoat.com |

## Conclusion (hard truth)

**The standalone English-language micro-calculator is a solved category.**
Every candidate — commodity, decision-tool, artifact-generator, even
weeks-old regulatory niches — ships with multiple free, clean competitors.
The backlog's "Competition Gap" dimension assumed gaps exist at the tool
level; in 2026 they don't. Scoring ideas 7+ on Gap is wishful thinking.

## Where evidence says advantage remains

1. **Freshness velocity + visible sourcing.** Incumbents rot (W4 complaint
   is years old). A tool whose tables live in versioned JSON, refreshed on a
   schedule, showing "verified for 2026 · sources: IRS Pub 15-T, [state] DOR"
   wins trust the brands can't fake. Moat = maintenance discipline, not code.
2. **Suites with memory, not lone calculators.** Single intents are owned;
   journeys aren't ("I'm moving out": deposit-deadline tracker → letter →
   walkthrough checklist → utility setup). Factory cross-links + localStorage
   make this cheap to assemble from configs.
3. **Community distribution > SERP.** Every saturated incumbent won SEO.
   New entrants win by being *shared* (r/powerlifting, r/RunningShoeGeeks,
   Discord servers). Build what a specific community begs for this month;
   let MCP probes of subreddit complaints drive selection.
4. **Non-English long-tail.** All 14 probes came back US/EN saturated;
   localized versions of proven intents remain thin (deferred — now
   evidence-backed as the largest untouched arbitrage).

## Decision applied to current portfolio

- The 9 drafted tools stay drafts: fine code, weak organic prospects.
  Flip at most rent-split + calorie-deficit as portfolio filler; expect
  little traffic without community distribution.
- New-build bar raised: no build without (a) MCP probe showing <3 real
  competitors OR a documented staleness/complaint gap, AND (b) a named
  distribution channel (subreddit/community/newsletter).

## Round 2 — community/pain-language probes (10 more)

Searched pain language ("how do you all…", "spreadsheet", "nightmare")
instead of "[niche] calculator", targeting passion communities:

| Community | Pain probed | Verdict |
|---|---|---|
| r/ukpersonalfinance | take-home w/ student loans + sacrifice | ❌ payslipcheck.co.uk, taxcal.uk et al., all 2026/27-fresh |
| India r/IndiaInvestments | new-vs-old regime | ❌ govt's own calculator + taxmath.in, sum.money… |
| r/EtsySellers | true profit after fees | ❌ 8+, one badged "Verified August 7 2026" |
| Gig driver subs | net hourly after gas/depreciation | ❌ 10+ incl. 2026 tips-tax-aware tools |
| Van life | solar/battery sizing | ❌ 9+ full electrical designers |
| r/dndnext | encounter balance / loot split | ❌ Kobold Plus + dndmetrics (15k-encounter model) + d20-loot-tracker |
| r/weddingplanning | seating chart solver | ❌ SeatCanvas, seating-chart-maker.com, wedibox |
| Planted tanks | EI fertilizer dosing | ❌ Rotala Butterfly is a 15-year community standard |
| Teachers | weighted + drop-lowest gradebook | ⚠️ thinnest found: people still hand-roll Excel SMALL() formulas on math forums; but demand signals are old forum threads, LMSs bundle the feature, teachers = weak RPM |

## Verdict after 24 probes

No idea-shaped hole exists in this market at any freshness level, any
geography tested, or any niche passion tested. Every category winner got
there through community embeddedness or brand, not through the tool being
unbuilt. Further ideation sweeps have negative expected value.

Structural options that remain open:
1. Embed in ONE community and build what they beg for (slow, human)
2. Suite-with-memory workflow play (unproven demand)
3. B2B embeddable widgets for niche publishers (different business)
4. Run existing 5 live tools as zero-investment experiments; watch for
   organic signal before investing anything further
