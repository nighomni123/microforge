import type { ToolConfig } from '../../src/engine/schema'

/**
 * CM to Feet & Inches Converter — customCompute tool.
 * One intent per page: type centimeters, read feet-and-inches height instantly.
 * The inch roll-over (rounding up to 12″) is handled in JS, not formulas.
 */
export default {
  slug: 'cm-to-feet',
  title: 'CM to Feet & Inches Converter',
  metaTitle: 'CM to Feet & Inches Converter — Height Chart',
  metaDescription:
    'Convert centimeters to feet and inches instantly — see total inches, meters, and decimal feet too. Includes a quick-reference height chart.',
  category: 'converters',
  tags: ['height', 'conversion', 'units'],
  icon: '📏',
  status: 'live',
  description:
    'Enter your height in centimeters and see it in feet and inches instantly, with total inches, meters, and decimal feet alongside.',
  howItWorks:
    'One inch is defined as exactly 2.54 centimeters, so the whole conversion is one division: total inches = cm ÷ 2.54. The everyday reading then splits those inches into groups of twelve — divide by 12 for feet, and what remains is inches.\n\nRounding to the nearest inch can push a remainder from 11.x up to 12, so this tool rolls that case into the next foot: 182.8 cm is 71.97 total inches, which correctly reads 6′0″ instead of the nonsensical 5′12″.\n\nHeights mix units because context does: medical and scientific forms ask for centimeters, while everyday conversation in the US runs on feet and inches. That is why the answer shows both formats, plus total inches, meters, and decimal feet.',
  inputs: [
    {
      id: 'cm',
      label: 'Centimeters',
      type: 'number',
      default: 170,
      min: 0,
      step: 0.5,
      help: 'Your height in centimeters — the feet-and-inches answer appears instantly.',
    },
  ],
  outputs: [
    { id: 'heightText', label: 'Height', format: 'text', primary: true },
    { id: 'totalInches', label: 'Total inches', format: 'number', decimals: 1 },
    { id: 'meters', label: 'Meters (m)', format: 'number', decimals: 2 },
    { id: 'feetOnly', label: 'Feet (decimal)', format: 'number', decimals: 2 },
  ],
  faqs: [
    {
      question: 'How tall is 170 cm in feet and inches?',
      answer:
        '170 ÷ 2.54 = 66.93 total inches. That splits into 5 feet (60 inches) with 6.93 inches left over, which rounds to 7 — so 170 cm is 5′7″. Type any value above and this tool does the same split for you, including the roll-up when inches round to twelve.',
    },
    {
      question: 'What is the formula to convert cm to feet?',
      answer:
        'Divide centimeters by 2.54 to get total inches (1 in = 2.54 cm exactly), then divide those inches by 12 to get feet: feet = cm ÷ 2.54 ÷ 12. For decimal feet only, use cm ÷ 30.48, since one foot is exactly 30.48 cm.',
    },
    {
      question: 'Why do heights mix metric and imperial units?',
      answer:
        'Context decides the unit: hospitals, passports, and sports federations record height in centimeters, while daily conversation in the US sticks to feet and inches. People end up translating between them constantly, which is exactly what this page automates.',
    },
    {
      question: 'How does the rounding work?',
      answer:
        'The feet-and-inches figure rounds to the nearest whole inch; if that rounding reaches 12 inches it rolls into the next full foot rather than showing “5′12″”. The separate Total inches output keeps one decimal place, so nothing is hidden by the rounding.',
    },
  ],
  keywords: [
    'cm to feet',
    'centimeters to feet and inches',
    'height converter',
    '170 cm in feet',
    'cm to inches',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const cm = Number(inputs.cm ?? 0)
    if (!Number.isFinite(cm) || cm < 0) {
      return { heightText: 'Enter a height in centimeters above', totalInches: 0, meters: 0, feetOnly: 0 }
    }

    const totalInches = cm / 2.54
    let feet = Math.floor(totalInches / 12)
    let inches = Math.round(totalInches - feet * 12)
    if (inches === 12) {
      feet += 1
      inches = 0
    }

    return {
      heightText: `${feet}′ ${inches}″`,
      totalInches,
      meters: cm / 100,
      feetOnly: totalInches / 12,
    }
  },
} satisfies ToolConfig
