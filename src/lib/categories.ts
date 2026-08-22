import type { ToolCategory } from '../engine/schema'

/** Display metadata per category. Header uses `short` to stay mobile-friendly. */
export const CATEGORY_META: Record<
  ToolCategory,
  { label: string; short: string; icon: string; blurb: string }
> = {
  calculators: {
    label: 'Calculators',
    short: 'Calc',
    icon: '🧮',
    blurb: 'Fast answers to everyday money and life math.',
  },
  generators: {
    label: 'Generators',
    short: 'Gen',
    icon: '🎲',
    blurb: 'Random picks, ideas and instant creations.',
  },
  converters: {
    label: 'Converters',
    short: 'Convert',
    icon: '🔁',
    blurb: 'Turn one thing into another in a keystroke.',
  },
  planners: {
    label: 'Planners',
    short: 'Plan',
    icon: '🗺️',
    blurb: 'Break big goals into small, clear steps.',
  },
  trackers: {
    label: 'Trackers',
    short: 'Track',
    icon: '📈',
    blurb: 'Keep streaks and progress in your browser.',
  },
  timers: {
    label: 'Timers',
    short: 'Time',
    icon: '⏱️',
    blurb: 'Focus, intervals and countdowns.',
  },
  quizzes: {
    label: 'Quizzes',
    short: 'Quiz',
    icon: '❓',
    blurb: 'Quick tests of knowledge and reflexes.',
  },
  utilities: {
    label: 'Utilities',
    short: 'Utils',
    icon: '🛠️',
    blurb: 'Small helpers you will reach for weekly.',
  },
}

export function isToolCategory(value: string | undefined): value is ToolCategory {
  return value !== undefined && Object.prototype.hasOwnProperty.call(CATEGORY_META, value)
}
