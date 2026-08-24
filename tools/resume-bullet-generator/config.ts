import type { ToolConfig } from '../../src/engine/schema'

/**
 * Resume Bullet Generator — turns one plain achievement into three polished
 * bullet variants (concise, ownership, highlight) via live customCompute.
 */
export default {
  slug: 'resume-bullet-generator',
  title: 'Resume Bullet Generator',
  metaTitle: 'Resume Bullet Generator — Strong Achievement Lines',
  metaDescription:
    'Turn one plain achievement into three strong, metric-ready resume bullets instantly. XYZ formula built in — free and private in your browser.',
  category: 'generators',
  tags: ['resume', 'career', 'job search', 'writing'],
  icon: '📄',
  status: 'draft',
  description:
    'Paste one accomplishment in plain words and get three polished resume bullet variants — concise, ownership-framed, and highlight-reel — plus a coaching tip to make each line stronger.',
  howItWorks:
    'Strong bullets follow the XYZ formula popularized by Google’s recruiters: “Accomplished [X] as measured by [Y], by doing [Z].” Each variant here opens with an action verb of your choice, states what you achieved, and appends your metric when you supply one — so every line reads as action plus result instead of a list of duties.\n\nNumbers do the persuading: “improved customer retention” is weaker than “improved retention from 71% to 89%.” If you lack an exact figure, an honest approximation (“roughly $40K”), a scope (“across four regions”), or a frequency (“every week”) still adds credibility — just never invent numbers you can’t defend in an interview.\n\nYou get three tones because resumes differ: the concise bullet fits tight experience sections, the ownership framing signals end-to-end accountability for leadership-track roles, and the highlight-reel line works at the top of a resume or in a cover letter. Pick whichever matches the voice of the rest of your document.\n\nEverything runs locally in your browser — nothing you type is stored, logged, or sent anywhere.',
  inputs: [
    {
      id: 'role',
      label: 'Your role',
      type: 'text',
      default: 'Sales Associate',
      placeholder: 'Sales Associate',
      help: 'e.g., Marketing Coordinator',
    },
    {
      id: 'achievement',
      label: 'One achievement',
      type: 'text',
      default: 'regional sales growth through three new enterprise accounts',
      placeholder: 'e.g., cut onboarding time in half',
      help: 'What did you accomplish? Plain words are fine.',
    },
    {
      id: 'metric',
      label: 'Metric (optional)',
      type: 'text',
      default: '32% revenue increase',
      placeholder: 'e.g., 15 hours saved weekly',
      help: 'Numbers make bullets credible.',
    },
    {
      id: 'verbStyle',
      label: 'Opening verb',
      type: 'select',
      default: 0,
      options: [
        { value: 0, label: 'Led' },
        { value: 1, label: 'Drove' },
        { value: 2, label: 'Delivered' },
      ],
      help: 'Sets the action verb that opens bullet one.',
    },
  ],
  outputs: [
    { id: 'bullet1', label: 'Concise bullet', format: 'text', primary: true },
    { id: 'bullet2', label: 'Ownership framing', format: 'text' },
    { id: 'bullet3', label: 'Highlight-reel framing', format: 'text' },
    { id: 'coachingTip', label: 'Make it stronger', format: 'text' },
  ],
  faqs: [
    {
      question: 'What is the XYZ formula on a resume?',
      answer:
        'Popularized by Google recruiters, XYZ says every bullet should read: accomplished [X] as measured by [Y], by doing [Z]. It forces each line to pair an action with a measurable result, which is how hiring managers quickly tell real impact from a list of responsibilities.',
    },
    {
      question: 'What if I don’t have any hard numbers?',
      answer:
        'Use honest approximations, scope, or frequency instead: “about 20% faster,” “a team of five,” “weekly for two semesters.” Some context beats vague claims — but never invent figures. Anything on your resume is fair game for interview probing, so keep every number defensible.',
    },
    {
      question: 'How many bullets should each job get?',
      answer:
        'Three to five is the sweet spot for recent roles, and fewer for older ones. Lead with your strongest, most relevant achievement — recruiters skim in seconds, so the first line under each role carries the most weight.',
    },
    {
      question: 'Will keywords in my bullets help with ATS?',
      answer:
        'Yes, when they mirror language from the job posting naturally — the skills, tools, and outcomes the employer actually names. Stuffing in extra keywords reads poorly to humans and can hurt ATS ranking, so repeat only terms that truthfully describe your work.',
    },
  ],
  keywords: [
    'resume bullet points generator',
    'achievement bullet generator',
    'xyz resume formula',
    'resume accomplishments examples',
    'resume writer free tool',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const achievement = String(inputs.achievement ?? '').trim()
    if (!achievement) {
      throw new Error('Describe one achievement first — even rough words work.')
    }
    const metric = String(inputs.metric ?? '').trim()
    const verbStyle = Number(inputs.verbStyle) || 0
    const verb = ['Led', 'Drove', 'Delivered'][Math.min(Math.max(verbStyle, 0), 2)]!

    // Lowercase the first character unless the opening word looks like an
    // acronym: 'Grew regional…' → 'grew regional…', 'SEO improvements' stays.
    const lc = (s: string): string => {
      const first = s.charAt(0)
      const second = s.charAt(1)
      const looksLikeAcronym =
        /[A-Z]/.test(first) && second !== '' && second === second.toUpperCase() && /[A-Z]/.test(second)
      return looksLikeAcronym ? s : first.toLowerCase() + s.slice(1)
    }

    return {
      bullet1: `${verb} ${lc(achievement)}${metric ? `, ${metric}` : ''}.`,
      bullet2: `Owned ${lc(achievement)}${metric ? `, delivering ${metric}` : ''}.`,
      bullet3: `Key contribution: ${achievement}${metric ? ` (${metric})` : ''}.`,
      coachingTip:
        'Add timeframe and baseline next: “in 6 months, up from $1.1M” — recruiters weigh context as much as results.',
    }
  },
} satisfies ToolConfig
