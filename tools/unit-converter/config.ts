import type { ToolConfig } from '../../src/engine/schema'

/**
 * Unit Converter — Length. Select values carry their factor-to-metres,
 * so one division converts any supported pair of units.
 */
export default {
  slug: 'unit-converter',
  title: 'Unit Converter — Length',
  metaTitle: 'Unit Converter — Length, Metric & Imperial',
  metaDescription:
    'Convert length instantly in your browser: millimeters, centimeters, meters, kilometers, inches, feet, yards and miles between metric and imperial.',
  category: 'converters',
  tags: ['length', 'metric', 'imperial', 'conversion'],
  icon: '📐',
  status: 'live',
  description:
    'Convert any length between metric and imperial units — millimeters, centimeters, meters, kilometers, inches, feet, yards and miles — in one step. Conversion factors are the exact post-1959 international definitions, and results are shown to four decimal places.',
  howItWorks:
    'Pick the unit you are converting from and the unit you are converting to, then enter a value. Each unit option carries its conversion factor to meters, so the meter equivalent is simply value × fromUnit.\n\nTo reach the target unit, that meter figure is divided by the target unit\'s factor: result = value × fromUnit ÷ toUnit. Because every unit passes through the same canonical base, all 64 from/to combinations stay consistent.\n\nThe factors are the exact international yard-and-pound definitions agreed in 1959 — one inch equals exactly 25.4 millimeters, one foot exactly 0.3048 meters, one mile exactly 1609.344 meters. Results are displayed to four decimal places for readability; the underlying math uses the full precision of these factors.\n\nThis version converts length only. Weight, area and volume converters using the same engine are planned.',
  inputs: [
    {
      id: 'value',
      label: 'Value',
      type: 'number',
      default: 1,
      min: 0,
      help: 'How many?',
    },
    {
      id: 'fromUnit',
      label: 'From unit',
      type: 'select',
      default: 1,
      options: [
        { value: 0.001, label: 'Millimeters' },
        { value: 0.01, label: 'Centimeters' },
        { value: 1, label: 'Meters' },
        { value: 1000, label: 'Kilometers' },
        { value: 0.0254, label: 'Inches' },
        { value: 0.3048, label: 'Feet' },
        { value: 0.9144, label: 'Yards' },
        { value: 1609.344, label: 'Miles' },
      ],
      help: 'Unit you are converting from.',
    },
    {
      id: 'toUnit',
      label: 'To unit',
      type: 'select',
      default: 0.3048,
      options: [
        { value: 0.001, label: 'Millimeters' },
        { value: 0.01, label: 'Centimeters' },
        { value: 1, label: 'Meters' },
        { value: 1000, label: 'Kilometers' },
        { value: 0.0254, label: 'Inches' },
        { value: 0.3048, label: 'Feet' },
        { value: 0.9144, label: 'Yards' },
        { value: 1609.344, label: 'Miles' },
      ],
      help: 'Unit you are converting to.',
    },
  ],
  outputs: [
    {
      id: 'inMeters',
      label: '= meters',
      formula: 'value * fromUnit',
      format: 'number',
      decimals: 4,
    },
    {
      id: 'result',
      label: 'Result',
      formula: 'value * fromUnit / toUnit',
      format: 'number',
      decimals: 4,
      primary: true,
    },
  ],
  faqs: [
    {
      question: 'Which length units are supported?',
      answer:
        'Eight units, convertible in every direction: millimeters, centimeters, meters and kilometers on the metric side, and inches, feet, yards and miles on the imperial side. Pick any combination in the two dropdowns — for example miles to kilometers, cm to inches, or feet to meters.',
    },
    {
      question: 'Are the conversions exact?',
      answer:
        'Yes. Every factor is an exact definition, not an approximation: since the 1959 international agreement one inch equals exactly 25.4 millimeters, one foot exactly 0.3048 meters, one yard exactly 0.9144 meters and one mile exactly 1609.344 meters. Only the display rounds — results are shown to four decimal places.',
    },
    {
      question: 'Can it convert area or weight?',
      answer:
        'Not yet. This version handles length only; weight and area converters built on the same factor-based engine are planned as separate tools, so this page stays focused and fast.',
    },
    {
      question: 'Why does it convert through meters?',
      answer:
        'Using meters as the single canonical base keeps every unit pair consistent: eight units need only eight factors instead of 64 pairwise ones, and there is no chance of a mismatched table entry. Meters first, then one division into the target unit.',
    },
  ],
  keywords: [
    'unit converter',
    'length converter',
    'metric to imperial',
    'meters to feet converter',
    'cm to inches converter',
  ],
} satisfies ToolConfig
