import { useCallback, useEffect, useMemo, useState } from 'react'
import { computeFormulaOutputs } from '../../engine/compute'
import { FormulaError } from '../../engine/evaluate'
import { currencySymbol, formatValue } from '../../engine/format'
import type { ToolConfig, ToolInput } from '../../engine/schema'
import { track } from '../../lib/analytics'
import { ShareButton } from '../ShareButton'

type Values = Record<string, string>
type ResultMap = Record<string, string | number>

function defaultValues(config: ToolConfig): Values {
  const values: Values = {}
  for (const input of config.inputs) {
    values[input.id] = input.default !== undefined ? String(input.default) : ''
  }
  return values
}

/** Coerce raw input strings to a numeric scope; undefined when incomplete/invalid. */
function numericScope(config: ToolConfig, values: Values): Record<string, number> | undefined {
  const scope: Record<string, number> = {}
  for (const input of config.inputs) {
    if (input.type === 'text') continue
    const raw = values[input.id]
    if (raw === undefined || raw === '') return undefined
    const num = Number(raw)
    if (!Number.isFinite(num)) return undefined
    scope[input.id] = num
  }
  return scope
}

/**
 * Renders any tool config: inputs → live results. Formula tools compute
 * during render (so prerendered HTML contains real results); customCompute
 * tools run client-side only and never on the server.
 */
export function ToolRenderer({ config }: { config: ToolConfig }) {
  const [values, setValues] = useState<Values>(() => defaultValues(config))
  const [customResults, setCustomResults] = useState<ResultMap | null>(null)
  const [customError, setCustomError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const hasCustom = typeof config.customCompute === 'function'
  const autoCompute = config.autoCompute !== false

  const runCustom = useCallback(() => {
    if (!config.customCompute) return
    try {
      const inputs: Record<string, string | number> = {}
      for (const input of config.inputs) {
        const raw = values[input.id] ?? ''
        if (input.type === 'text') {
          inputs[input.id] = raw
        } else {
          const parsed = Number(raw)
          const fallback = typeof input.default === 'number' ? input.default : 0
          inputs[input.id] =
            raw === '' || !Number.isFinite(parsed) ? fallback : parsed
        }
      }
      setCustomResults(config.customCompute(inputs))
      setCustomError(null)
      track('tool_compute', { tool: config.slug }, 10_000)
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }, [config, values])

  useEffect(() => {
    if (hasCustom && autoCompute) runCustom()
  }, [hasCustom, autoCompute, runCustom])

  const formulaResult = useMemo<
    { results: ResultMap } | { error: string } | null
  >(() => {
    if (hasCustom) return null
    const scope = numericScope(config, values)
    if (!scope) return null
    try {
      return { results: Object.fromEntries(computeFormulaOutputs(config.outputs, scope).map((r) => [r.id, r.value])) }
    } catch (err) {
      return { error: err instanceof FormulaError ? err.message : 'Could not calculate — check your inputs' }
    }
  }, [config, values, hasCustom])

  const results: ResultMap | null = hasCustom ? customResults : formulaResult && 'results' in formulaResult ? formulaResult.results : null
  const error: string | null = hasCustom
    ? customError
    : formulaResult && 'error' in formulaResult
      ? formulaResult.error
      : null

  const primaryOutput = config.outputs.find((output) => output.primary) ?? config.outputs[0]!
  const secondaryOutputs = config.outputs.filter((output) => output !== primaryOutput)

  function formatOutput(id: string): string {
    const output = config.outputs.find((o) => o.id === id)!
    return formatValue(results![id], {
      format: output.format,
      decimals: output.decimals,
      currencyCode: config.currencyCode,
    })
  }

  async function copyResult(): Promise<void> {
    if (!results) return
    try {
      await navigator.clipboard.writeText(formatOutput(primaryOutput.id))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      track('result_copy', { tool: config.slug })
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section aria-label={`${config.title} tool`}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-2">
            {config.inputs.map((input) => (
              <ToolInputField
                key={input.id}
                input={input}
                value={values[input.id] ?? ''}
                currencyCode={config.currencyCode}
                onChange={(id, value) => setValues((prev) => ({ ...prev, [id]: value }))}
              />
            ))}
          </div>
          {(hasCustom && !autoCompute) || config.actionLabel ? (
            <button
              type="button"
              onClick={runCustom}
              disabled={!hasCustom}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {config.actionLabel ?? 'Calculate'}
            </button>
          ) : null}
        </div>

        {/* Result */}
        <div
          aria-live="polite"
          className="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900"
        >
          {error !== null ? (
            <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {error}
            </p>
          ) : results && results[primaryOutput.id] !== undefined ? (
            <>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {primaryOutput.label}
              </p>
              <p
                className={
                  primaryOutput.format === 'text'
                    ? 'mt-1 whitespace-pre-line break-words text-lg font-semibold leading-relaxed text-slate-800 dark:text-slate-200'
                    : 'mt-1 break-words text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-300'
                }
              >
                {formatValue(results[primaryOutput.id], {
                  format: primaryOutput.format,
                  decimals: primaryOutput.decimals,
                  currencyCode: config.currencyCode,
                })}
              </p>
              {secondaryOutputs.length > 0 && (
                <dl className="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
                  {secondaryOutputs.map((output) => (
                    <div key={output.id} className="flex items-start justify-between gap-3 py-2">
                      <dt className="shrink-0 text-slate-500 dark:text-slate-400">{output.label}</dt>
                      <dd
                        className={
                          output.format === 'text'
                            ? 'whitespace-pre-line text-right font-semibold'
                            : 'font-semibold'
                        }
                      >
                        {formatValue(results[output.id], {
                          format: output.format,
                          decimals: output.decimals,
                          currencyCode: config.currencyCode,
                        })}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          ) : (
            <p className="m-auto text-sm text-slate-400">
              {hasCustom && !autoCompute
                ? `Tap “${config.actionLabel ?? 'Calculate'}” to see your result.`
                : 'Enter your values to see the result.'}
            </p>
          )}

          {results && results[primaryOutput.id] !== undefined && (
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <button
                type="button"
                onClick={() => void copyResult()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <span aria-hidden>📋</span> {copied ? 'Copied!' : 'Copy result'}
              </button>
              <ShareButton title={config.title} path={`/${config.category}/${config.slug}`} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ToolInputField({
  input,
  value,
  onChange,
  currencyCode,
}: {
  input: ToolInput
  value: string
  currencyCode?: string
  onChange: (id: string, value: string) => void
}) {
  const fieldId = `field-${input.id}`
  const isText = input.type === 'text'
  const num = Number(value)
  const invalid = !isText && value !== '' && !Number.isFinite(num)
  const outOfRange =
    !invalid &&
    !isText &&
    value !== '' &&
    ((input.min !== undefined && num < input.min) || (input.max !== undefined && num > input.max))

  const prefix = input.type === 'currency' ? currencySymbol(currencyCode ?? 'USD') : undefined
  const suffix = input.type === 'percent' ? '%' : undefined

  return (
    <div className={isText ? 'sm:col-span-2' : ''}>
      <label htmlFor={fieldId} className="text-sm font-medium">
        {input.label}
      </label>
      <div
        className={`mt-1 flex items-center rounded-xl border bg-white focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-950 ${
          invalid || outOfRange
            ? 'border-red-400'
            : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        {prefix && <span className="pl-3 text-sm text-slate-400">{prefix}</span>}
        {input.type === 'select' ? (
          <select
            id={fieldId}
            value={value}
            onChange={(event) => onChange(input.id, event.target.value)}
            className="w-full rounded-xl bg-transparent px-3 py-2 outline-none"
          >
            {input.options!.map((option) => (
              <option key={option.value} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={fieldId}
            type={isText ? 'text' : 'number'}
            inputMode={isText ? undefined : 'decimal'}
            value={value}
            min={input.min}
            max={input.max}
            step={input.step}
            placeholder={input.placeholder}
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => onChange(input.id, event.target.value)}
            className="w-full rounded-xl bg-transparent px-3 py-2 outline-none"
          />
        )}
        {suffix && <span className="pr-3 text-sm text-slate-400">{suffix}</span>}
      </div>
      {input.help && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{input.help}</p>}
      {invalid && <p className="mt-1 text-xs text-red-500">Enter a valid number.</p>}
      {!invalid && outOfRange && (
        <p className="mt-1 text-xs text-red-500">
          Enter a value between {input.min ?? '-∞'} and {input.max ?? '∞'}.
        </p>
      )}
    </div>
  )
}
