import type { ToolConfig } from '../../src/engine/schema'

/**
 * Calorie Deficit Calculator — Mifflin-St Jeor BMR → activity multiplier (TDEE)
 * → deficit target with a safety floor. Formula chain with select-driven
 * constants. Health-adjacent: framed as an estimate everywhere, never advice.
 */
export default {
  slug: 'calorie-deficit-calculator',
  title: 'Calorie Deficit Calculator',
  metaTitle: 'Calorie Deficit Calculator — TDEE & Daily Target',
  metaDescription:
    'Estimate your TDEE with the Mifflin-St Jeor formula and see the daily calories for a safe, steady deficit. An estimate, not medical advice.',
  category: 'calculators',
  tags: ['calories', 'tdee', 'weight loss'],
  icon: '🍎',
  status: 'draft',
  description:
    'Enter your stats, activity level, and weekly loss goal to see your maintenance calories and a sensible daily target — based on the widely used Mifflin-St Jeor equation.',
  howItWorks:
    'The calculator works in three steps. First it estimates your basal metabolic rate (BMR) — the calories your body burns at complete rest — using the Mifflin-St Jeor equation, which takes sex, age, height, and weight.\n\nSecond, it multiplies BMR by an activity multiplier (from 1.2 for mostly sedentary days to 1.9 for heavy daily training) to estimate total daily energy expenditure (TDEE), a.k.a. your maintenance calories.\n\nThird, it subtracts a deficit based on your goal: each kilogram of body fat stores roughly 7,700 kcal, so losing 0.5 kg per week means eating about 550 kcal less per day than you burn.\n\nA hard floor of 1,200 kcal/day is applied — eating below that works against you by costing muscle and energy. This is a population-level estimate: real metabolism varies ±10% or more, and health conditions, medication, and training history all matter. Treat it as a starting point to adjust from, not a prescription, and talk to a professional before significant changes.',
  inputs: [
    {
      id: 'sex',
      label: 'Sex',
      type: 'select',
      default: 0,
      options: [
        { value: 0, label: 'Male' },
        { value: 1, label: 'Female' },
      ],
      help: 'Used only for the Mifflin-St Jeor constant.',
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      default: 30,
      min: 15,
      max: 90,
      step: 1,
      help: 'Years.',
    },
    {
      id: 'heightCm',
      label: 'Height',
      type: 'number',
      default: 175,
      min: 120,
      max: 220,
      step: 1,
      help: 'Centimeters.',
    },
    {
      id: 'weightKg',
      label: 'Weight',
      type: 'number',
      default: 80,
      min: 35,
      max: 250,
      step: 0.5,
      help: 'Kilograms.',
    },
    {
      id: 'activity',
      label: 'Activity level',
      type: 'select',
      default: 1.375,
      options: [
        { value: 1.2, label: 'Sedentary — desk job, little exercise' },
        { value: 1.375, label: 'Lightly active — 1–3 workouts/week' },
        { value: 1.55, label: 'Moderately active — 3–5 workouts/week' },
        { value: 1.725, label: 'Very active — 6–7 workouts/week' },
        { value: 1.9, label: 'Athlete — physical job + daily training' },
      ],
      help: 'When torn between two levels, pick the lower one.',
    },
    {
      id: 'weeklyLossKg',
      label: 'Weekly loss goal',
      type: 'select',
      default: 0.5,
      options: [
        { value: 0.25, label: 'Slow — 0.25 kg/week' },
        { value: 0.5, label: 'Steady — 0.5 kg/week' },
        { value: 0.75, label: 'Fast — 0.75 kg/week' },
        { value: 1, label: 'Aggressive — 1 kg/week' },
      ],
      help: 'Slower rates are easier to sustain and protect muscle.',
    },
  ],
  outputs: [
    {
      id: 'bmr',
      label: 'BMR — calories at rest',
      formula: '10 * weightKg + 6.25 * heightCm - 5 * age + (sex == 0 ? 5 : -161)',
      format: 'number',
      decimals: 0,
    },
    {
      id: 'maintenance',
      label: 'Maintenance calories/day',
      formula: 'bmr * activity',
      format: 'number',
      decimals: 0,
    },
    {
      id: 'dailyDeficit',
      label: 'Planned daily deficit',
      formula: 'weeklyLossKg * 1100',
      format: 'number',
      decimals: 0,
    },
    {
      id: 'targetIntake',
      label: 'Target intake/day',
      formula: 'max(1200, maintenance - dailyDeficit)',
      format: 'number',
      decimals: 0,
      primary: true,
    },
  ],
  faqs: [
    {
      question: 'How accurate is the Mifflin-St Jeor equation?',
      answer:
        'For most adults it lands within about 10% of measured resting metabolism, which is why dietitians use it as a default. Individual variation comes from genetics, muscle mass, thyroid function, and medication — treat the result as a starting number to adjust after two weeks of real-world data.',
    },
    {
      question: 'Why can’t I just cut 1,500 calories a day and go faster?',
      answer:
        'Very aggressive deficits accelerate muscle loss, tank training quality and sleep, and almost always rebound. The calculator caps your plan at 1 kg/week and floors intake at 1,200 kcal because slower rates preserve muscle and are dramatically easier to stick to.',
    },
    {
      question: 'What if my target hits the 1,200 kcal floor?',
      answer:
        'It means your chosen rate is too aggressive for your size — the math says the deficit would push you below the floor. Pick a slower weekly goal instead; you will still lose weight and keep more muscle and sanity doing it.',
    },
    {
      question: 'Should I eat back calories burned in workouts?',
      answer:
        'No double-counting needed: your activity multiplier already includes average weekly exercise. Wearable “calories burned” numbers are notoriously overstated, so logging them on top usually erases your deficit without you noticing.',
    },
    {
      question: 'Is this medical advice?',
      answer:
        'No. It is a standard estimation formula for healthy adults. If you are pregnant, managing a chronic condition, taking weight-affecting medication, or have any history of disordered eating, work with a qualified professional instead of a website.',
    },
  ],
  keywords: [
    'calorie deficit calculator',
    'tdee calculator',
    'how many calories to lose weight',
    'mifflin st jeor calculator',
    'maintenance calories calculator',
  ],
} satisfies ToolConfig
