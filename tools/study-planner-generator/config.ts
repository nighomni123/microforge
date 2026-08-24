import type { ToolConfig } from '../../src/engine/schema'

/**
 * Study Planner Generator — deterministic round-robin study schedule.
 * customCompute builds a multi-line weekly plan; autoCompute keeps it live.
 */
export default {
  slug: 'study-planner-generator',
  title: 'Study Planner Generator',
  metaTitle: 'Study Planner Generator — Auto Weekly Schedule',
  metaDescription:
    'Turn your subjects and days-until-exam into a balanced weekly study rotation instantly — spaced repetition scheduling, free and no signup.',
  category: 'planners',
  tags: ['study', 'exam prep', 'revision', 'schedule', 'planning'],
  icon: '📚',
  status: 'draft',
  description:
    'Enter your subjects, days until the exam, and weekly study hours to get an instant weekly study plan that rotates every subject through fixed sessions with cycling topics.',
  howItWorks:
    'Your exam date and weekly hours are converted into a session budget: days until the exam become weeks (rounded up), hours divide into equal weekday sessions of roughly 25–120 minutes each.\n\nSubjects then rotate through those fixed slots round-robin, so every subject recurs week after week on the same weekdays. That rhythm builds a study habit and spaces out each subject’s reviews — spaced repetition beats last-minute cramming.\n\nTopics cycle through your chosen topic count per subject, so chapters come back around at growing intervals instead of being covered once and forgotten. The final week is labelled a revision pass — treat those sessions as time to revisit the topics you found hardest rather than start new material.\n\nEverything runs locally in your browser: nothing is stored or sent anywhere, and changing any input regenerates the plan instantly.',
  inputs: [
    {
      id: 'subjects',
      label: 'Subjects',
      type: 'text',
      default: 'Biology, History, Math',
      placeholder: 'Biology, History, Math…',
      help: 'Comma-separated subjects',
    },
    {
      id: 'daysAway',
      label: 'Days until exam',
      type: 'number',
      default: 14,
      min: 1,
      max: 180,
      step: 1,
    },
    {
      id: 'hoursPerWeek',
      label: 'Study hours per week',
      type: 'number',
      default: 12,
      min: 1,
      max: 60,
      step: 1,
    },
    {
      id: 'topicsPerSubject',
      label: 'Topics per subject',
      type: 'number',
      default: 6,
      min: 1,
      max: 30,
      step: 1,
      help: 'Chapters or topics to cover',
    },
  ],
  outputs: [
    { id: 'totalHours', label: 'Total study hours', format: 'number', decimals: 0 },
    { id: 'sessionsPerWeek', label: 'Sessions per week', format: 'number', decimals: 0 },
    { id: 'sessionMinutes', label: 'Minutes per session', format: 'number', decimals: 0 },
    { id: 'schedule', label: 'Your weekly plan', format: 'text', primary: true },
  ],
  faqs: [
    {
      question: 'How are topics assigned to each session?',
      answer:
        'Round-robin: the sessions cycle through your topic count for each subject (topic 1, 2, 3 … then back to 1), so no chapter is skipped and every topic reappears multiple times before the exam — which is exactly what makes the material stick.',
    },
    {
      question: 'Why does each subject sit on fixed weekdays?',
      answer:
        'Fixed slots turn studying into a habit you do not have to renegotiate daily, and they guarantee regular spacing between reviews of the same subject. Spaced repetition on a predictable schedule consistently outperforms cramming everything into the final days.',
    },
    {
      question: 'I have three exams in two weeks — can I plan for all of them?',
      answer:
        'Plan around the earliest exam first: set the days-until-exam to that date and list only that exam’s subjects. Once it is done, run the planner again for the next batch of subjects with the remaining days.',
    },
    {
      question: 'Can I print or share my plan?',
      answer:
        'Yes — use the Copy result button to grab the full weekly plan as plain text, then paste it into your notes app, a document, or a message. It formats cleanly wherever plain text is welcome.',
    },
  ],
  keywords: [
    'study planner generator',
    'study schedule maker',
    'exam study plan',
    'revision timetable generator',
    'spaced repetition planner',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const subjects = String(inputs.subjects ?? '')
      .split(',')
      .map((subject) => subject.trim())
      .filter(Boolean)
    if (subjects.length === 0) {
      throw new Error('Add at least one subject, separated by commas.')
    }

    const daysAway = Math.max(1, Number(inputs.daysAway) || 1)
    const hoursPerWeek = Math.max(1, Number(inputs.hoursPerWeek) || 1)
    const topicsPerSubject = Math.max(1, Math.round(Number(inputs.topicsPerSubject) || 1))

    const totalWeeks = Math.max(1, Math.ceil(daysAway / 7))
    const sessionsPerWeek = Math.max(1, Math.round(hoursPerWeek / 1.5))
    const sessionMinutes = Math.max(
      25,
      Math.min(120, Math.round((hoursPerWeek / sessionsPerWeek) * 60)),
    )
    const totalHours = Math.round((hoursPerWeek * daysAway) / 7)

    const lines: string[] = [
      `${totalWeeks}-week plan · ${totalHours}h total · ${sessionsPerWeek} sessions/week · ~${sessionMinutes} min each`,
    ]
    const shownWeeks = Math.min(totalWeeks, 8)
    for (let w = 1; w <= shownWeeks; w++) {
      lines.push(`WEEK ${w}${w === totalWeeks ? ' — revision pass' : ''}`)
      for (let s = 0; s < sessionsPerWeek; s++) {
        const slot = (w - 1) * sessionsPerWeek + s
        const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][s % 7]
        const subject = subjects[slot % subjects.length]
        const topicNum = (slot % topicsPerSubject) + 1
        lines.push(`  ${day}: ${subject} — topic ${topicNum} (~${sessionMinutes} min)`)
      }
    }
    if (totalWeeks > 8) {
      lines.push(`+ ${totalWeeks - 8} more weeks: keep rotating subjects/topics`)
    }

    return {
      totalHours,
      sessionsPerWeek,
      sessionMinutes,
      schedule: lines.join('\n'),
    }
  },
} satisfies ToolConfig
