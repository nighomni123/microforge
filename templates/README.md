# MicroForge Templates — subdomain microsite

A small, dependency-free static site that serves the downloadable Office
templates for MicroForge. It is designed to be deployed as its **own
Cloudflare Pages project** so it lives on a subdomain of the MicroForge site
(e.g. `templates-microforge.pages.dev`, or a custom domain like
`templates.microforge.com`).

```
templates/
├── index.html        # hub page: hero, filter tabs, grid of 9 template cards
├── assets/
│   ├── styles.css    # visual identity matching the main MicroForge site
│   └── app.js        # filter tabs + search (progressive enhancement)
├── files/            # the generated .xlsx / .docx / .pptx downloads
├── sitemap.xml
├── robots.txt
├── _headers          # caching + security headers (Cloudflare Pages)
└── README.md
```

## Regenerating the template files

The Office files are generated with the `officecli` CLI (AI-friendly CLI for
`.docx`/`.xlsx`/`.pptx`). They are committed so the site can be served without
`officecli` present at deploy time, but you can regenerate them anytime:

```bash
node scripts/generate-office-templates.mjs            # all 9 templates
node scripts/generate-office-templates.mjs resume     # just one (slug filter)
```

The generator is fully declarative — every template is a list of `officecli`
`batch` commands in `scripts/generate-office-templates.mjs`. Edit a template
there, re-run, and the new binary lands in `templates/files/`.

## Deploying as a subdomain (Cloudflare Pages)

This folder is intended to be a **separate Pages project** from the main
MicroForge app, so it gets its own `*.pages.dev` subdomain (or a custom-domain
subdomain).

1. In Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**
   and authorize the same GitHub repo (`nighomni123/microforge`).
2. Project name: `templates-microforge`
   → live at `https://templates-microforge.pages.dev`
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** _(leave empty — the site is static, no build step)_
   - **Build output directory:** `templates`
   - **Root directory:** _(leave default — the whole repo is cloned)_
4. Deploy. The site is served straight from `templates/`.

### Optional: a real custom subdomain

To put it on `templates.microforge.com` (or `templates.yourdomain.com`):

1. In the `templates-microforge` Pages project → **Custom domains → Add a domain**.
2. Enter `templates.<yourdomain>` and follow the DNS verification steps
   (Cloudflare auto-adds the CNAME/AXFR records).

### Updating the canonical domain

The canonical URL, OpenGraph tags, JSON-LD and `sitemap.xml` currently assume
`https://templates-microforge.pages.dev`. If you deploy to a different domain,
search `templates/` for `templates-microforge.pages.dev` and replace it with
your real subdomain (also update `templates/robots.txt`).

## Linking from the main site

The main MicroForge header links "Tools" back to `microforge.pages.dev`, so the
two sites cross-link. Add a "Templates" nav entry there pointing at this
subdomain whenever you like.
