import type { ToolConfig } from '../../src/engine/schema'

/**
 * Age Calculator — the category's highest-volume keyword ("age calculator").
 * Calendar-exact age in years → months → days using real month lengths
 * (leap years included), an optional as-of date, and zero storage.
 *
 * customCompute is pure except where noted: with a blank as-of date it may
 * read today's clock (explicitly allowed for this tool).
 */

const FORMAT_HINT = 'Use the YYYY-MM-DD format, e.g. 1990-08-15.'
const MS_PER_DAY = 86_400_000

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

interface Ymd {
  y: number
  m: number
  d: number
}

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

/** Real length of a month, leap years included. */
function daysInMonth(y: number, m: number): number {
  return m === 2 && isLeapYear(y) ? 29 : MONTH_LENGTHS[m - 1]
}

/** Strict YYYY-MM-DD parser with a real-calendar validity check. */
function parseYmd(raw: string | number): Ymd {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(raw).trim())
  if (!match) throw new Error(FORMAT_HINT)
  const ymd = { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) }
  if (ymd.m < 1 || ymd.m > 12 || ymd.d < 1 || ymd.d > daysInMonth(ymd.y, ymd.m)) {
    throw new Error(FORMAT_HINT)
  }
  return ymd
}

/**
 * Midnight of a civil date pinned to UTC, so differences between two dates
 * are exact whole days regardless of the visitor's timezone or DST shifts.
 */
function utcMidnight({ y, m, d }: Ymd): Date {
  const date = new Date(Date.UTC(y, m - 1, d))
  date.setUTCFullYear(y) // Date.UTC presets years 0–99 as 1900+
  return date
}

function dayNumber(ymd: Ymd): number {
  return utcMidnight(ymd).getTime() / MS_PER_DAY
}

/** Today as a local civil date (the one deliberate use of the clock here). */
function todayLocal(): Ymd {
  const now = new Date()
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() }
}

/**
 * Whole years and months between two ordered dates, plus the leftover days.
 * Anniversary anchors clamp to the last day of short months, so a Feb 29
 * milestone falls on Feb 28 in common years instead of spilling into March.
 */
function calendarDiff(from: Ymd, to: Ymd): { years: number; months: number; days: number } {
  let months = (to.y - from.y) * 12 + (to.m - from.m)
  const anchorFor = (total: number): Ymd => {
    const monthIndex = from.m - 1 + total
    const y = from.y + Math.floor(monthIndex / 12)
    const m = (monthIndex % 12) + 1
    return { y, m, d: Math.min(from.d, daysInMonth(y, m)) }
  }
  if (dayNumber(anchorFor(months)) > dayNumber(to)) months -= 1
  const anchor = anchorFor(months)
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: dayNumber(to) - dayNumber(anchor),
  }
}

function unit(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

/** Days until the next occurrence of the birth month/day (today = 0). */
function nextBirthdayDays(dob: Ymd, asOf: Ymd): number {
  const build = (y: number): Ymd => ({
    y,
    m: dob.m,
    d: Math.min(dob.d, daysInMonth(y, dob.m)),
  })
  let next = build(asOf.y)
  if (dayNumber(next) < dayNumber(asOf)) next = build(asOf.y + 1)
  return dayNumber(next) - dayNumber(asOf)
}

export default {
  slug: 'age-calculator',
  title: 'Age Calculator',
  metaTitle: 'Age Calculator — Exact Age in Years, Months, Days',
  metaDescription:
    'Find your exact age in years, months, and days — plus days until your next birthday. Optional as-of date; nothing you type is stored.',
  category: 'calculators',
  tags: ['age', 'birthday', 'dates'],
  icon: '🎂',
  status: 'draft',
  autoCompute: true,
  description:
    'Calculate your exact age — not an approximation — from your date of birth: full years, remaining months and days, total days lived, and a countdown to your next birthday.',
  howItWorks:
    'This calculator measures age the way birth certificates and official forms do: it counts complete calendar years first, then the leftover whole months, then the remaining days. Every month is measured at its real length — 28, 29, 30, or 31 days — and leap years are handled by the actual Gregorian rules, so there is no drift around February or month boundaries.\n\nYou get far more precise results than the 365.25-day-per-year shortcut many sites take. Want to know how old you were on a specific date — a graduation, a historic landing, the day a contract was signed? Fill in the optional “age at” field with that date; leave it blank and today is used automatically.\n\nBirthdays on February 29 are treated fairly too: in non-leap years the anniversary anchors to the last day of February rather than sliding into March. Everything runs locally in your browser — your dates are never sent anywhere and nothing is stored.',
  inputs: [
    {
      id: 'dob',
      label: 'Date of birth',
      type: 'text',
      default: '1990-08-15',
      placeholder: 'YYYY-MM-DD',
      help: 'Type your birth date as year-month-day.',
    },
    {
      id: 'asOf',
      label: 'Age at date (optional)',
      type: 'text',
      default: '',
      placeholder: 'YYYY-MM-DD',
      help: 'Leave blank to use today.',
    },
  ],
  outputs: [
    { id: 'ageText', label: 'Exact age', format: 'text', primary: true },
    { id: 'totalDays', label: 'Total days alive', format: 'number', decimals: 0 },
    { id: 'totalWeeks', label: 'Total weeks', format: 'number', decimals: 0 },
    { id: 'totalHours', label: 'Total hours', format: 'number', decimals: 0 },
    { id: 'nextBirthdayIn', label: 'Days until next birthday', format: 'number', decimals: 0 },
  ],
  faqs: [
    {
      question: 'How is my age calculated exactly?',
      answer:
        'The calculator counts complete calendar years between your birth date and the target date, then the whole months left over, then the remaining days — using each month’s true length, leap years included. For example, someone born on 1990-08-15 turns 35 only on 2035-08-15, and the months in between are counted as real calendar months, not fixed 30-day blocks.',
    },
    {
      question: 'Why does my age differ slightly from other websites?',
      answer:
        'Many age tools divide the total time by an average year of 365.25 days. That shortcut drifts by a day around leap years and uneven month lengths, so two sites can disagree. This calculator counts actual calendar years, months, and days — the same method used on official documents — so the result matches your records.',
    },
    {
      question: 'How do I see how old I was on a specific date?',
      answer:
        'Enter your date of birth as usual, then type the date you are curious about into the “Age at date (optional)” box — for example the day you graduated or a famous historical event. Leave that box blank and today’s date is used. Past and future dates both work, so you can also check how old you will be at a planned retirement date.',
    },
    {
      question: 'What about February 29 birthdays?',
      answer:
        'Leap-day birthdays are anchored to the end of the month: in common years the anniversary is counted on February 28 rather than drifting into March 1 or being skipped. The next-birthday countdown follows the same rule, and the years-months-days age stays calendar-exact either way.',
    },
  ],
  keywords: [
    'age calculator',
    'how old am i',
    'date of birth calculator',
    'calculate age from birthday',
    'age difference between dates',
  ],
  customCompute(inputs) {
    const dob = parseYmd(inputs.dob)
    const asOfRaw = String(inputs.asOf ?? '').trim()
    const asOf = asOfRaw === '' ? todayLocal() : parseYmd(asOfRaw)
    if (dayNumber(asOf) < dayNumber(dob)) {
      throw new Error('The “age at” date is earlier than the date of birth — check the order.')
    }

    const { years, months, days } = calendarDiff(dob, asOf)
    const totalDays = dayNumber(asOf) - dayNumber(dob)

    return {
      ageText: `${unit(years, 'year')}, ${unit(months, 'month')}, ${unit(days, 'day')}`,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      totalHours: totalDays * 24,
      nextBirthdayIn: nextBirthdayDays(dob, asOf),
    }
  },
} satisfies ToolConfig
