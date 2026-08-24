import type { ToolConfig } from '../../src/engine/schema'

/**
 * Date Difference Calculator — days/weeks/months between two dates plus a
 * business-day vs weekend-day split. Pure customCompute: same strict
 * YYYY-MM-DD validation as the age calculator, silent date swap, and a
 * hard cap so the day-by-day scan stays instant.
 */

const FORMAT_HINT = 'Use the YYYY-MM-DD format, e.g. 1990-08-15.'
const MS_PER_DAY = 86_400_000
/** ~200 years of elapsed days; keeps the Mon–Fri scan snappy in the browser. */
const MAX_TOTAL_DAYS = 73_000

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

interface Ymd {
  y: number
  m: number
  d: number
}

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

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

/**
 * Whole years and months between two ordered dates, plus the leftover days,
 * clamping anniversaries to the last day of short months.
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

function spanText({ years, months, days }: { years: number; months: number; days: number }): string {
  const parts: string[] = []
  if (years > 0) parts.push(unit(years, 'year'))
  if (months > 0) parts.push(unit(months, 'month'))
  if (days > 0 || parts.length === 0) parts.push(unit(days, 'day'))
  return parts.join(', ')
}

export default {
  slug: 'date-difference-calculator',
  title: 'Date Difference Calculator',
  metaTitle: 'Date Difference Calculator — Days Between Two Dates',
  metaDescription:
    'Count the days, weeks, and months between two dates — including business days versus weekend days. Handles any order; instant and private.',
  category: 'calculators',
  tags: ['dates', 'duration', 'workdays'],
  icon: '📅',
  status: 'draft',
  autoCompute: true,
  description:
    'Measure exactly how much time separates two dates: total days, weeks, a full calendar breakdown in months and days, and how many of those days are working days rather than weekend days.',
  howItWorks:
    'This calculator measures elapsed time between a start and an end date using the real calendar — leap years and unequal month lengths included. If you enter the later date first by mistake, it silently swaps them so the result is never negative.\n\nAlongside the total, it walks through each day in the range and classifies it: Monday through Friday count as business days, Saturday and Sunday as weekend days. Public holidays are not excluded because they vary by country and region — subtract them yourself if you need a holiday-free working-day figure.\n\nThe counts follow the elapsed-time convention: from January 1 to January 2 is one day, and the end date itself is not counted. If your event truly occupies both endpoints, just add one day to the totals. Ranges beyond roughly 200 years are capped to keep everything instant, and all calculation happens in your browser.',
  inputs: [
    {
      id: 'startDate',
      label: 'Start date',
      type: 'text',
      default: '2026-01-01',
      placeholder: 'YYYY-MM-DD',
      help: 'First day of the period.',
    },
    {
      id: 'endDate',
      label: 'End date',
      type: 'text',
      default: '2026-12-31',
      placeholder: 'YYYY-MM-DD',
      help: 'Last day of the period — measured as elapsed time.',
    },
  ],
  outputs: [
    { id: 'monthsText', label: 'Time span', format: 'text', primary: true },
    { id: 'totalDays', label: 'Total days', format: 'number', decimals: 0 },
    { id: 'totalWeeks', label: 'Total weeks', format: 'number', decimals: 1 },
    { id: 'businessDays', label: 'Business days (Mon–Fri)', format: 'number', decimals: 0 },
    { id: 'weekendDays', label: 'Weekend days', format: 'number', decimals: 0 },
  ],
  faqs: [
    {
      question: 'How are business days counted between two dates?',
      answer:
        'Every elapsed day in the range is checked individually: Monday through Friday add to the business-day total, Saturday and Sunday add to weekends. The split uses real calendar dates, so leap years and month boundaries are handled automatically. Public holidays are not removed — see below for why.',
    },
    {
      question: 'Are public holidays excluded from business days?',
      answer:
        'No. Public holidays differ by country, region, and even year, so this tool stays generic and counts only Saturdays and Sundays as non-business days. To estimate true working days, subtract the number of public holidays that fall on weekdays within your range using your own country’s holiday calendar.',
    },
    {
      question: 'Is the end date included in the difference?',
      answer:
        'The tool measures elapsed time: from January 1 to January 31 it reports 30 days, because the end point itself is not counted. That suits deadlines, ages, and project durations. If you need an inclusive count — for example a conference that runs on both the first and last day — simply add 1 to the day totals.',
    },
    {
      question: 'Can I use this to add or subtract days from a date?',
      answer:
        'Not directly — this tool measures the gap between two dates rather than shifting one. A quick workaround: to find the date 90 days after March 1, keep the start date and try end dates until the total shows 90. For frequent date math, a dedicated “add days to date” tool or your calendar app’s jump feature will be faster.',
    },
  ],
  keywords: [
    'date difference calculator',
    'days between dates',
    'business days calculator',
    'how many days until',
    'duration between two dates',
  ],
  customCompute(inputs) {
    let start = parseYmd(inputs.startDate)
    let end = parseYmd(inputs.endDate)
    if (dayNumber(end) < dayNumber(start)) [start, end] = [end, start]

    const totalDays = dayNumber(end) - dayNumber(start)
    if (totalDays > MAX_TOTAL_DAYS) {
      throw new Error('That range is over 200 years — narrow it down.')
    }

    let businessDays = 0
    let weekendDays = 0
    const cursor = utcMidnight(start)
    for (let i = 0; i < totalDays; i += 1) {
      const weekday = cursor.getUTCDay()
      if (weekday === 0 || weekday === 6) weekendDays += 1
      else businessDays += 1
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }

    return {
      monthsText: spanText(calendarDiff(start, end)),
      totalDays,
      totalWeeks: Math.round((totalDays / 7) * 10) / 10,
      businessDays,
      weekendDays,
    }
  },
} satisfies ToolConfig
