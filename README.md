# MicroForge — Micro-Product Factory

A config-driven factory for shipping small, genuinely useful web tools: **one
config file = one published, SEO-ready, ad-slot-ready micro-product.**

Built from scratch around the operating loop:
**mine demand → score → spec → generate → QA → publish → measure → kill or scale.**

```
┌────────────┐   pnpm gen    ┌─────────────────┐   pnpm build   ┌──────────────┐
│ idea-backlog│ ───────────▶ │ tools/<slug>/    │ ─────────────▶ │ dist/ (static │
│ (ops/)      │              │ config.ts        │  validate →    │ HTML, sitemap,│
└────────────┘               └─────────────────┘  prerender →    │ robots)       │
                                                  sitemap        └──────────────┘
```

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:5173 — drafts visible, ad placeholders shown
pnpm test       # 31 engine/registry tests
pnpm build      # typecheck → validate configs → vite build → prerender → sitemap
pnpm preview    # serve dist/ — what production will serve
```

## Shipping a new tool (the whole point)

```bash
pnpm gen rent-split-calculator "Rent Split Calculator" --category calculators --icon 🏠
```

1. Edit `tools/rent-split-calculator/config.ts` — replace every TODO
   (copy prompts in `ops/prompts/` do most of the writing).
2. `pnpm dev` → click through it. The build validator enforces schema, formula
   identifiers, meta lengths, and that defaults compute a finite result.
3. Run `ops/qa-checklist.md` then `ops/publishing-checklist.md`.
4. Flip `status: 'live'` → `pnpm build` → deploy.

Formula-only tools: ~30–60 minutes. That is the unit economics of this factory.

## How a tool config works

See any file in `tools/*/config.ts`. The engine (`src/engine/`) provides:

- **Formula evaluator** — safe hand-rolled parser (no `eval`): `+ - * / % ^`,
  ternaries, comparisons, `&&/||/!`, and `min max abs floor ceil round sqrt log
  log10 pow clamp`. Outputs may chain on earlier outputs (`tip → total → perPerson`).
- **customCompute escape hatch** — for generators/checkers (see
  `tools/password-strength-checker/config.ts` and the random decision maker).
- **Input types**: `number | currency | percent | select | text`.
- **Output formats**: `number | currency | percent | text` with per-output decimals.

Formula tools compute **during prerender**, so the static HTML ships with real
results in it. `customCompute` tools stay client-side only.

## Architecture

| Path | Role |
|---|---|
| `tools/<slug>/config.ts` | **The factory input.** One file per product. |
| `src/engine/` | Schema (zod), evaluator, compute, formatting. |
| `src/lib/tools.ts` | Registry via `import.meta.glob`; drafts hidden in prod. |
| `src/lib/meta.ts` | Single source for titles/meta/canonical/JSON-LD per route. |
| `src/components/` | Layout, Seo, ToolRenderer, AdSlot, ConsentBanner, Faq, RelatedTools… |
| `scripts/validate-tools.ts` | Build gate: schema + formula + SEO-length checks. |
| `scripts/prerender.tsx` | Renders every route to `dist/<route>/index.html` (no puppeteer). |
| `scripts/sitemap.ts` | `dist/sitemap.xml` + `robots.txt` from the live registry. |
| `scripts/new-tool.ts` | The `pnpm gen` scaffolder. |
| `ops/` | Backlog, scoring model, playbooks, checklists, prompt library. |

**SEO stack**: prerendered semantic HTML, per-page title/description/canonical/OG,
`WebApplication` + `FAQPage` + `BreadcrumbList` JSON-LD, sitemap, clean URLs
(`/calculators/tip-split-calculator/`), 404.html, `_headers` caching.

**Ads & privacy**: ships with **zero** third-party code. AdSense slots activate
only via env vars, load only after explicit consent, reserve space (no CLS),
cap at 2 visible per viewport, and are dismissible when sticky. Analytics
(cookieless Umami default, GA4 optional) is consent-gated the same way.

## Environment variables (copy `.env.example` → `.env`)

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Canonical origin for sitemap/robots/canonical/OG. Set before deploying. |
| `VITE_ADSENSE_CLIENT` + `VITE_ADSENSE_SLOT_{INCONTENT,STICKY,SIDEBAR}` | Enable ad slots per placement. Empty = no ad code ships. |
| `VITE_UMAMI_URL` + `VITE_UMAMI_ID` | Cookieless analytics. |
| `VITE_GA_ID` | Optional GA4 instead. |

## Deploy (Cloudflare Pages — free)

1. Push this repo to GitHub.
2. Cloudflare Pages → connect repo → build command `pnpm build`, output dir `dist`.
3. Set `VITE_SITE_URL` (and later the ad/analytics vars) in the Pages project env.
4. Add your domain, submit `sitemap.xml` in Google Search Console.

Netlify works as-is; GitHub Pages needs `base` config — not wired by default.

## Rebranding

Everything brand-shaped lives in `src/lib/site.ts` (name, tagline, contact email)
plus `index.html`'s fallback title and `public/favicon.svg`. Run `pnpm og` after
changing brand colors to regenerate `public/og-default.png`.

## Operating cadence

`ops/weekly-workflow.md` is the loop: **Mon** mine → **Tue** score → **Wed** spec
→ **Thu** build → **Fri** QA+publish → **Sat** distribute → **Sun** review.
`ops/idea-backlog.md` holds 26 pre-scored ideas; the scoring threshold is 7.0.

## Guardrails baked in

- Build fails on: duplicate/reserved slugs, unknown formula identifiers, missing
  primary output, meta-length overflow, defaults that don't compute.
- Drafts are invisible in production routes and sitemap.
- No `eval`-family APIs anywhere; formulas can't do anything but arithmetic.
- Consent denied ⇒ site fully functional, zero measurement, zero ad code.

## Deliberately not built yet

Game template (canvas engine), Android/Capacitor template, demand-scraping
automation, localization — per the roadmap, prove the calculator pipeline first.
