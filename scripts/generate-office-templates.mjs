#!/usr/bin/env node
/**
 * generate-office-templates.mjs
 * ---------------------------------
 * Builds the downloadable Office template files for the MicroForge Templates
 * subdomain using the `officecli` CLI (AI-friendly CLI for .docx/.xlsx/.pptx).
 *
 * Each template is described declaratively as a list of officecli `batch`
 * commands. We run, per file:
 *     officecli close <file>   # release any lingering resident (best-effort)
 *     rm -f <file>
 *     officecli create --force <file>
 *     officecli batch <file> --input <batch.json>
 *     officecli validate <file>
 *
 * Usage:
 *     node scripts/generate-office-templates.mjs            # all templates
 *     node scripts/generate-office-templates.mjs resume     # filter by slug
 *
 * Output: <repo>/templates/files/<slug>.<ext>
 *
 * NOTE: officecli is an external CLI (installed at /usr/local/bin/officecli).
 * Run this locally to (re)generate the binary files; they are committed so the
 * static site can serve them without officecli present at deploy time.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync, openSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..')
const OUT_DIR = join(REPO, 'templates', 'files')

const OFFICECLI = 'officecli'
const HL = 'D9E1F2' // header fill (light indigo)
const HL2 = '4472C4' // accent fill (blue)
const TOT = 'FCE4D6' // total fill (light orange)
const WHITE = 'FFFFFF'

/* ----------------------------- command DSL ----------------------------- */

const C = (command, o = {}) => ({ command, ...o })

// --- xlsx ---
const xRename = (name) => C('set', { path: '/Sheet1', props: { name } })
const xSheet = (name) => C('add', { parent: '/', type: 'sheet', props: { name } })
const xCol = (sheet, col, width) =>
  C('add', { parent: `/${sheet}`, type: 'column', props: { name: col, width } })
const xCell = (sheet, ref, props) =>
  C('add', { parent: `/${sheet}/${ref}`, type: 'cell', props })
const xSetSheet = (sheet, props) => C('set', { path: `/${sheet}`, props })

// --- docx ---
const dPara = (text, props = {}) =>
  C('add', { parent: '/body', type: 'paragraph', props: { text, ...props } })
const dTable = (colWidths) =>
  C('add', { parent: '/body', type: 'table', props: { colWidths } })
const dRow = (tbl = 'tbl[1]') => C('add', { parent: `/body/${tbl}`, type: 'row' })
const dCell = (r, c, props, tbl = 'tbl[1]') =>
  C('set', { path: `/body/${tbl}/tr[${r}]/tc[${c}]`, props })

// --- pptx ---
const pSlide = (props) => C('add', { parent: '/', type: 'slide', props })
const pShape = (slide, props) =>
  C('add', { parent: `/${slide}`, type: 'shape', props })

// docx table: a `table` auto-creates tr[1] with N cells (N = column count).
// This helper also appends `dataRows` extra rows so callers can fill them.
const dTableN = (colWidths, dataRows) => {
  const cmds = [dTable(colWidths)]
  for (let i = 0; i < dataRows; i++) cmds.push(dRow())
  return cmds
}

/* ----------------------------- templates ----------------------------- */

const TEMPLATES = [
  /* ============================ EXCEL ============================ */
  {
    slug: 'monthly-budget-planner',
    ext: 'xlsx',
    format: 'Excel',
    title: 'Monthly Budget Planner',
    description:
      'Plan your spending with category budgets vs. actuals and live totals. Just type your numbers — the formulas do the math.',
    build: () => {
      const cats = [
        ['Rent / Mortgage', 1500],
        ['Groceries', 500],
        ['Transport', 180],
        ['Utilities', 220],
        ['Insurance', 140],
        ['Dining Out', 160],
        ['Entertainment', 90],
        ['Healthcare', 120],
        ['Savings', 400],
        ['Miscellaneous', 150],
      ]
      const cmds = [
        xRename('Budget'),
        xCol('Budget', 'A', 26),
        xCol('Budget', 'B', 16),
        xCol('Budget', 'C', 16),
        xCell('Budget', 'A1', { value: 'Monthly Budget Planner', bold: true, size: '14pt', fill: HL, merge: 'A1:C1' }),
        xCell('Budget', 'A2', { value: 'Category', bold: true, fill: HL }),
        xCell('Budget', 'B2', { value: 'Budgeted ($)', bold: true, fill: HL }),
        xCell('Budget', 'C2', { value: 'Actual ($)', bold: true, fill: HL }),
      ]
      cats.forEach(([name, amt], i) => {
        const r = i + 3
        cmds.push(xCell('Budget', `A${r}`, { value: name }))
        cmds.push(xCell('Budget', `B${r}`, { value: amt, numberformat: '$#,##0' }))
        cmds.push(xCell('Budget', `C${r}`, { value: 0, numberformat: '$#,##0' }))
      })
      const last = cats.length + 2 // row of last category data
      const total = last + 1
      cmds.push(xCell('Budget', `A${total}`, { value: 'Total', bold: true }))
      cmds.push(
        xCell('Budget', `B${total}`, {
          formula: `SUM(B3:B${last})`,
          bold: true,
          numberformat: '$#,##0',
          fill: TOT,
        }),
      )
      cmds.push(
        xCell('Budget', `C${total}`, {
          formula: `SUM(C3:C${last})`,
          bold: true,
          numberformat: '$#,##0',
          fill: TOT,
        }),
      )
      const remain = total + 1
      cmds.push(xCell('Budget', `A${remain}`, { value: 'Remaining', bold: true }))
      cmds.push(
        xCell('Budget', `B${remain}`, {
          formula: `B${total}-C${total}`,
          bold: true,
          numberformat: '$#,##0',
        }),
      )
      cmds.push(xSetSheet('Budget', { freeze: 'A3' }))
      return cmds
    },
  },
  {
    slug: 'invoice-template',
    ext: 'xlsx',
    format: 'Excel',
    title: 'Invoice Template',
    description:
      'A clean, printable invoice with automatic line totals, subtotal, tax and grand total. Replace the placeholders and send.',
    build: () => {
      const items = [
        ['Web design — homepage', 1, 1200],
        ['Landing page copy', 2, 350],
        ['Monthly retainer', 1, 900],
        ['Stock photo licensing', 3, 45],
        ['Hosting setup', 1, 120],
      ]
      const cmds = [
        xRename('Invoice'),
        xCol('Invoice', 'A', 40),
        xCol('Invoice', 'B', 10),
        xCol('Invoice', 'C', 14),
        xCol('Invoice', 'D', 16),
        xCell('Invoice', 'A1', { value: 'INVOICE', bold: true, size: '16pt', fill: HL2, 'font.color': WHITE, merge: 'A1:D1' }),
        xCell('Invoice', 'A3', { value: 'Invoice #', bold: true }),
        xCell('Invoice', 'B3', { value: 'INV-001' }),
        xCell('Invoice', 'A4', { value: 'Date', bold: true }),
        xCell('Invoice', 'B4', { value: 'YYYY-MM-DD' }),
        xCell('Invoice', 'A5', { value: 'Bill To', bold: true }),
        xCell('Invoice', 'B5', { value: 'Client Name' }),
        xCell('Invoice', 'A6', { value: 'From', bold: true }),
        xCell('Invoice', 'B6', { value: 'Your Company LLC' }),
        xCell('Invoice', 'A8', { value: 'Description', bold: true, fill: HL }),
        xCell('Invoice', 'B8', { value: 'Qty', bold: true, fill: HL }),
        xCell('Invoice', 'C8', { value: 'Unit Price', bold: true, fill: HL }),
        xCell('Invoice', 'D8', { value: 'Line Total', bold: true, fill: HL }),
      ]
      items.forEach(([desc, qty, price], i) => {
        const r = i + 9
        cmds.push(xCell('Invoice', `A${r}`, { value: desc }))
        cmds.push(xCell('Invoice', `B${r}`, { value: qty, numberformat: '#,##0' }))
        cmds.push(xCell('Invoice', `C${r}`, { value: price, numberformat: '$#,##0.00' }))
        cmds.push(
          xCell('Invoice', `D${r}`, {
            formula: `B${r}*C${r}`,
            numberformat: '$#,##0.00',
          }),
        )
      })
      const last = items.length + 8
      const sub = last + 1
      cmds.push(xCell('Invoice', `A${sub}`, { value: 'Subtotal', bold: true }))
      cmds.push(
        xCell('Invoice', `D${sub}`, { formula: `SUM(D9:D${last})`, bold: true, numberformat: '$#,##0.00', fill: TOT }),
      )
      const tax = sub + 1
      cmds.push(xCell('Invoice', `A${tax}`, { value: 'Tax (8%)', bold: true }))
      cmds.push(
        xCell('Invoice', `D${tax}`, { formula: `D${sub}*0.08`, bold: true, numberformat: '$#,##0.00', fill: TOT }),
      )
      const total = tax + 1
      cmds.push(xCell('Invoice', `A${total}`, { value: 'Total Due', bold: true }))
      cmds.push(
        xCell('Invoice', `D${total}`, { formula: `D${sub}+D${tax}`, bold: true, numberformat: '$#,##0.00', fill: TOT }),
      )
      return cmds
    },
  },
  {
    slug: 'expense-tracker',
    ext: 'xlsx',
    format: 'Excel',
    title: 'Expense Tracker',
    description:
      'Log daily spend and watch the running total update automatically, with a quick category breakdown by SUMIF.',
    build: () => {
      const rows = [
        ['2025-01-02', 'Groceries', 'Weekly shop', 86.4, 'Me'],
        ['2025-01-03', 'Transport', 'Metro card', 30, 'Me'],
        ['2025-01-04', 'Dining', 'Lunch with client', 42.5, 'Company'],
        ['2025-01-05', 'Utilities', 'Electricity', 64, 'Me'],
        ['2025-01-06', 'Groceries', 'Coffee + snacks', 18.2, 'Me'],
        ['2025-01-07', 'Transport', 'Taxi', 22, 'Company'],
        ['2025-01-08', 'Dining', 'Team dinner', 95, 'Company'],
        ['2025-01-09', 'Utilities', 'Internet', 40, 'Me'],
        ['2025-01-10', 'Other', 'Gift', 25, 'Me'],
        ['2025-01-11', 'Groceries', 'Weekend market', 51.3, 'Me'],
      ]
      const cmds = [
        xRename('Expenses'),
        xCol('Expenses', 'A', 12),
        xCol('Expenses', 'B', 16),
        xCol('Expenses', 'C', 30),
        xCol('Expenses', 'D', 12),
        xCol('Expenses', 'E', 14),
        xCell('Expenses', 'A1', { value: 'Expense Tracker', bold: true, size: '14pt', fill: HL, merge: 'A1:E1' }),
        xCell('Expenses', 'A2', { value: 'Date', bold: true, fill: HL }),
        xCell('Expenses', 'B2', { value: 'Category', bold: true, fill: HL }),
        xCell('Expenses', 'C2', { value: 'Description', bold: true, fill: HL }),
        xCell('Expenses', 'D2', { value: 'Amount', bold: true, fill: HL }),
        xCell('Expenses', 'E2', { value: 'Paid By', bold: true, fill: HL }),
      ]
      rows.forEach(([date, cat, desc, amt, who], i) => {
        const r = i + 3
        cmds.push(xCell('Expenses', `A${r}`, { value: date, numberformat: 'yyyy-mm-dd' }))
        cmds.push(xCell('Expenses', `B${r}`, { value: cat }))
        cmds.push(xCell('Expenses', `C${r}`, { value: desc }))
        cmds.push(xCell('Expenses', `D${r}`, { value: amt, numberformat: '$#,##0.00' }))
        cmds.push(xCell('Expenses', `E${r}`, { value: who }))
      })
      const last = rows.length + 2
      const total = last + 1
      cmds.push(xCell('Expenses', `A${total}`, { value: 'TOTAL', bold: true }))
      cmds.push(
        xCell('Expenses', `D${total}`, { formula: `SUM(D3:D${last})`, bold: true, numberformat: '$#,##0.00', fill: TOT }),
      )
      // category summary via SUMIF
      const cats = ['Groceries', 'Transport', 'Dining', 'Utilities', 'Other']
      const sumStart = total + 2
      cmds.push(xCell('Expenses', `A${sumStart - 1}`, { value: 'Summary by Category', bold: true }))
      cats.forEach((cat, i) => {
        const r = sumStart + i
        cmds.push(xCell('Expenses', `A${r}`, { value: cat }))
        cmds.push(
          xCell('Expenses', `D${r}`, {
            formula: `SUMIF(B3:B${last},A${r},D3:D${last})`,
            numberformat: '$#,##0.00',
          }),
        )
      })
      cmds.push(xSetSheet('Expenses', { freeze: 'A3' }))
      return cmds
    },
  },

  /* ============================ WORD ============================ */
  {
    slug: 'resume-template',
    ext: 'docx',
    format: 'Word',
    title: 'Resume Template',
    description:
      'A tidy, ATS-friendly resume with a header, summary, experience bullets and a skills table. Fill the [brackets] and you are done.',
    build: () => {
      const cmds = [
        dPara('[Your Name]', { style: 'Title' }),
        dPara('[Role] · [City, Country] · [email@domain.com] · [phone]', { style: 'Subtitle' }),
        dPara('Summary', { style: 'Heading2' }),
        dPara('[Two or three sentences on who you are and the impact you deliver.]'),
        dPara('Experience', { style: 'Heading2' }),
        dPara('[Job Title] — [Company], [City] · [Start]–[End]', { listStyle: 'bullet' }),
        dPara('[Achievement with a metric, e.g. cut onboarding time 30%.]', { listStyle: 'bullet' }),
        dPara('[Achievement with a metric, e.g. led a team of 5 to ship X.]', { listStyle: 'bullet' }),
        dPara('[Achievement with a metric, e.g. improved conversion 12%.]', { listStyle: 'bullet' }),
        dPara('Education', { style: 'Heading2' }),
        dPara('[Degree] — [School], [City] · [Year]', { listStyle: 'bullet' }),
        dPara('[Certification or honor]', { listStyle: 'bullet' }),
        dPara('Skills', { style: 'Heading2' }),
        ...dTableN('2500,2500,1500', 3),
      ]
      // header row cells (tr[1] already exists with 3 cells)
      cmds.push(dCell(1, 1, { text: 'Skill', bold: true, fill: HL }))
      cmds.push(dCell(1, 2, { text: 'Level', bold: true, fill: HL }))
      cmds.push(dCell(1, 3, { text: 'Years', bold: true, fill: HL }))
      const skills = [
        ['[Skill 1]', '[Expert]', '[8]'],
        ['[Skill 2]', '[Intermediate]', '[4]'],
        ['[Skill 3]', '[Beginner]', '[1]'],
      ]
      skills.forEach(([a, b, c], i) => {
        const r = i + 2
        cmds.push(dCell(r, 1, { text: a }))
        cmds.push(dCell(r, 2, { text: b }))
        cmds.push(dCell(r, 3, { text: c }))
      })
      return cmds
    },
  },
  {
    slug: 'cover-letter-template',
    ext: 'docx',
    format: 'Word',
    title: 'Cover Letter Template',
    description:
      'A professional cover letter scaffold: sender block, greeting, three body paragraphs and a sign-off. Swap in your details and send.',
    build: () => [
      dPara('[Your Name]', { bold: true }),
      dPara('[Street Address] · [City, State ZIP]'),
      dPara('[email@domain.com] · [(000) 000-0000]'),
      dPara('[Date]'),
      dPara('[Hiring Manager Name]'),
      dPara('[Company Name]'),
      dPara('[Company Address]'),
      dPara('Dear [Hiring Manager Name or "Hiring Team"],', { spaceBefore: '12pt' }),
      dPara(
        '[Opening paragraph: which role you are applying for and where you saw it, plus a hook about why you are excited.]',
        { spaceBefore: '6pt' },
      ),
      dPara(
        '[Body paragraph: one concrete accomplishment that maps to the role, with a number. Keep it to 2–3 sentences.]',
      ),
      dPara(
        '[Closing paragraph: restate interest, suggest a next step, and thank them for their time.]',
      ),
      dPara('Sincerely,', { spaceBefore: '12pt' }),
      dPara('[Your Name]'),
    ],
  },
  {
    slug: 'business-plan-template',
    ext: 'docx',
    format: 'Word',
    title: 'Business Plan Outline',
    description:
      'A complete business-plan skeleton with every standard section and a milestones table. Great starting point for a pitch or loan application.',
    build: () => {
      const cmds = [
        dPara('Business Plan', { style: 'Title' }),
        dPara('[Company Name] · [Month, Year]', { style: 'Subtitle' }),
        dPara('Executive Summary', { style: 'Heading2' }),
        dPara('[One paragraph: what you do, who you serve, and why now. End with your ask.]'),
        dPara('Company Overview', { style: 'Heading2' }),
        dPara('[Mission, legal structure, location, and founding story in 3–4 sentences.]'),
        dPara('Market Analysis', { style: 'Heading2' }),
        dPara('[Target market size, customer segments, and key competitors with your wedge.]'),
        dPara('Products & Services', { style: 'Heading2' }),
        dPara('[What you sell, pricing model, and what makes it defensible.]'),
        dPara('Marketing & Sales', { style: 'Heading2' }),
        dPara('[How you acquire customers and your sales motion.]'),
        dPara('Financial Plan', { style: 'Heading2' }),
        dPara('[Revenue model, 12-month projection highlights, and funding needs.]'),
        dPara('Milestones', { style: 'Heading2' }),
        ...dTableN('3000,2000,1800,1500', 4),
      ]
      cmds.push(dCell(1, 1, { text: 'Milestone', bold: true, fill: HL }))
      cmds.push(dCell(1, 2, { text: 'Target Date', bold: true, fill: HL }))
      cmds.push(dCell(1, 3, { text: 'Owner', bold: true, fill: HL }))
      cmds.push(dCell(1, 4, { text: 'Status', bold: true, fill: HL }))
      const ms = [
        ['[MVP launch]', '[Q3]', '[Founder]', '[Planned]'],
        ['[First 100 customers]', '[Q4]', '[Sales]', '[Planned]'],
        ['[Series A raise]', '[Q1]', '[CEO]', '[Planned]'],
        ['[Break-even]', '[Q2]', '[Finance]', '[Planned]'],
      ]
      ms.forEach(([a, b, c, d], i) => {
        const r = i + 2
        cmds.push(dCell(r, 1, { text: a }))
        cmds.push(dCell(r, 2, { text: b }))
        cmds.push(dCell(r, 3, { text: c }))
        cmds.push(dCell(r, 4, { text: d }))
      })
      return cmds
    },
  },

  /* ========================== POWERPOINT ========================== */
  {
    slug: 'pitch-deck-template',
    ext: 'pptx',
    format: 'PowerPoint',
    title: 'Pitch Deck Template',
    description:
      'A 6-slide investor pitch: title, problem, solution, market, business model and the ask — with accent shapes ready to recolor.',
    build: () => [
      pSlide({ layout: 'Title Slide', title: '[Company Name]', text: '[Tagline] · [Year]' }),
      pSlide({
        layout: 'Title and Content',
        title: 'The Problem',
        text: '[Who has the problem and why it hurts.]\n[Current workaround and its cost.]\n[Why now is the moment to fix it.]',
      }),
      pSlide({
        layout: 'Title and Content',
        title: 'Our Solution',
        text: '[What you built and how it works.]\n[The key insight competitors missed.]\n[Proof it works — metric or pilot.]',
      }),
      pSlide({
        layout: 'Title and Content',
        title: 'Market',
        text: '[Total addressable market size.]\n[Who you win first (beachhead).]\n[How you expand from there.]',
      }),
      pSlide({
        layout: 'Title and Content',
        title: 'Business Model',
        text: '[How you make money.]\n[Unit economics: CAC / LTV.]\n[Why it is durable.]',
      }),
      pSlide({ layout: 'Title Slide', title: 'The Ask', text: '[Raising $X to hit Y.]' }),
      pShape('slide[6]', {
        geometry: 'rect',
        x: '1cm',
        y: '5cm',
        width: '12cm',
        height: '2.2cm',
        fill: HL2,
        text: 'Raising $[X] · [use of funds in one line]',
        bold: true,
        color: WHITE,
        size: 20,
        align: 'center',
      }),
    ],
  },
  {
    slug: 'meeting-agenda-template',
    ext: 'pptx',
    format: 'PowerPoint',
    title: 'Meeting Agenda Template',
    description:
      'Run meetings that actually end. A title slide, timed agenda and an action-items slide with owners baked in.',
    build: () => [
      pSlide({ layout: 'Title Slide', title: 'Meeting Agenda', text: '[Date] · [Start–End]' }),
      pSlide({
        layout: 'Title and Content',
        title: 'Agenda',
        text: '[09:00] Welcome & goals — [owner]\n[09:10] Status update — [owner]\n[09:30] Decision needed — [owner]\n[09:50] Open discussion — all\n[10:00] Wrap-up & next steps — [owner]',
      }),
      pSlide({
        layout: 'Title and Content',
        title: 'Action Items',
        text: '[Action] — owner: [name] — due: [date]\n[Action] — owner: [name] — due: [date]\n[Action] — owner: [name] — due: [date]',
      }),
      pShape('slide[3]', {
        geometry: 'roundRect',
        x: '1cm',
        y: '5.2cm',
        width: '12cm',
        height: '1.8cm',
        fill: HL,
        text: 'Owner + due date on every action item',
        bold: true,
        size: 16,
        align: 'center',
      }),
    ],
  },
  {
    slug: 'project-status-template',
    ext: 'pptx',
    format: 'PowerPoint',
    title: 'Project Status Report',
    description:
      'A clean status deck: summary, highlights, risks and next steps — the four slides every weekly update needs.',
    build: () => [
      pSlide({ layout: 'Title Slide', title: 'Project Status', text: '[Project Name] · [Date]' }),
      pSlide({
        layout: 'Title and Content',
        title: 'Status Summary',
        text: 'Overall: [On Track / At Risk / Off Track]\nScope: [on plan / slipping]\nSchedule: [on plan / slipping]\nBudget: [on plan / over]',
      }),
      pSlide({
        layout: 'Title and Content',
        title: 'Highlights',
        text: '[Win or milestone shipped this period.]\n[Positive signal from users or metrics.]\n[Thing the team should be proud of.]',
      }),
      pSlide({
        layout: 'Title and Content',
        title: 'Risks & Blockers',
        text: '[Risk] — impact: [H/M/L] — mitigation: [plan]\n[Blocker] — owner: [name] — unblock by: [date]',
      }),
      pSlide({
        layout: 'Title and Content',
        title: 'Next Steps',
        text: '[Next step] — owner: [name] — due: [date]\n[Next step] — owner: [name] — due: [date]\n[Next step] — owner: [name] — due: [date]',
      }),
      pShape('slide[2]', {
        geometry: 'rect',
        x: '1cm',
        y: '5.2cm',
        width: '12cm',
        height: '1.6cm',
        fill: HL2,
        text: 'One line everyone should remember from this update',
        bold: true,
        color: WHITE,
        size: 15,
        align: 'center',
      }),
    ],
  },
]

/* ----------------------------- runner ----------------------------- */

// officecli keeps a background "resident" daemon alive across calls. We route
// its IO to a per-call log file (not a pipe) so the daemon can't hold our
// stdout pipe open and make the run look hung, while still capturing errors.
const LOG_DIR = tmpdir()

function runOfficeCli(args, logPath) {
  const fd = logPath ? openSync(logPath, 'w') : 'ignore'
  return execFileSync(OFFICECLI, args, { stdio: ['ignore', fd, fd] })
}

function generateOne(t, onlySlug) {
  if (onlySlug && t.slug !== onlySlug) return true
  const out = join(OUT_DIR, `${t.slug}.${t.ext}`)
  const name = `${t.slug}.${t.ext}`
  const logPath = join(LOG_DIR, `oc-${t.slug}.log`)
  try {
    // release any lingering resident, then remove so create --force is clean
    try {
      runOfficeCli(['close', out])
    } catch {
      /* not open — ignore */
    }
    rmSync(out, { force: true })
    runOfficeCli(['create', '--force', out], logPath)
    const batch = t.build()
    const tmp = join(tmpdir(), `officecli-${t.slug}.json`)
    writeFileSync(tmp, JSON.stringify(batch))
    try {
      runOfficeCli(['batch', out, '--input', tmp], logPath)
    } catch (err) {
      const detail = existsSync(logPath) ? readFileSync(logPath, 'utf8').trim() : String(err)
      throw new Error(`batch failed:\n${detail}`)
    }
    rmSync(tmp, { force: true })
    try {
      runOfficeCli(['validate', out], logPath)
    } catch (err) {
      const detail = existsSync(logPath) ? readFileSync(logPath, 'utf8').trim() : String(err)
      throw new Error(`validate failed:\n${detail}`)
    }
    // release the resident so daemons don't pile up across the 9 files
    try {
      runOfficeCli(['close', out])
    } catch {
      /* ignore */
    }
    console.log(`  ✓ ${name.padEnd(30)} ${batch.length} cmds  validated`)
    return true
  } catch (e) {
    console.error(`  ✗ ${name} FAILED`)
    console.error(e instanceof Error ? e.message : String(e))
    return false
  }
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const onlySlug = process.argv[2]
  console.log(`Generating Office templates → ${OUT_DIR}`)
  let ok = true
  for (const t of TEMPLATES) ok = generateOne(t, onlySlug) && ok
  if (!ok) {
    console.error('\nOne or more templates failed to generate.')
    process.exit(1)
  }
  console.log('\nAll templates generated and validated.')
}

export { TEMPLATES }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}

main()
