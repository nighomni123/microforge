/**
 * Tiny, safe formula evaluator for config-driven tools.
 *
 * No `eval` / `new Function` — a hand-rolled tokenizer + recursive-descent
 * parser. Supports: numbers, identifiers, + - * / % ^, unary -, comparisons,
 * && || !, ternary ?:, parentheses, and a small function library.
 *
 * All failures throw FormulaError with a user-friendly message so the UI can
 * render them inline instead of crashing the page.
 */

export class FormulaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FormulaError'
  }
}

type Token =
  | { t: 'num'; v: number; pos: number }
  | { t: 'id'; v: string; pos: number }
  | { t: 'op'; v: string; pos: number }

const MULTI_OPS = ['<=', '>=', '==', '!=', '&&', '||']
const SINGLE_OPS = '+-*/%^<>(),?:!'

function tokenize(src: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]!
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (/[0-9]/.test(c)) {
      let j = i
      while (j < src.length && /[0-9.]/.test(src[j]!)) j++
      const raw = src.slice(i, j)
      const v = Number(raw)
      if (!Number.isFinite(v)) throw new FormulaError(`Invalid number "${raw}"`)
      tokens.push({ t: 'num', v, pos: i })
      i = j
      continue
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j]!)) j++
      tokens.push({ t: 'id', v: src.slice(i, j), pos: i })
      i = j
      continue
    }
    const two = src.slice(i, i + 2)
    if (MULTI_OPS.includes(two)) {
      tokens.push({ t: 'op', v: two, pos: i })
      i += 2
      continue
    }
    if (SINGLE_OPS.includes(c)) {
      tokens.push({ t: 'op', v: c, pos: i })
      i += 1
      continue
    }
    throw new FormulaError(`Unexpected character "${c}" in formula`)
  }
  return tokens
}

export type Node =
  | { k: 'num'; v: number }
  | { k: 'id'; name: string }
  | { k: 'un'; op: string; a: Node }
  | { k: 'bin'; op: string; a: Node; b: Node }
  | { k: 'call'; name: string; args: Node[] }
  | { k: 'tern'; c: Node; a: Node; b: Node }

class Parser {
  private pos = 0
  constructor(private readonly tokens: Token[]) {}

  parse(): Node {
    const node = this.ternary()
    if (this.pos !== this.tokens.length) {
      throw new FormulaError('Unexpected trailing input in formula')
    }
    return node
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos]
  }

  private eatOp(v: string): boolean {
    const t = this.peek()
    if (t && t.t === 'op' && t.v === v) {
      this.pos++
      return true
    }
    return false
  }

  private expectOp(v: string): void {
    if (!this.eatOp(v)) throw new FormulaError(`Expected "${v}" in formula`)
  }

  private ternary(): Node {
    const cond = this.or()
    if (this.eatOp('?')) {
      const a = this.ternary()
      this.expectOp(':')
      const b = this.ternary()
      return { k: 'tern', c: cond, a, b }
    }
    return cond
  }

  private or(): Node {
    let a = this.and()
    while (this.eatOp('||')) a = { k: 'bin', op: '||', a, b: this.and() }
    return a
  }

  private and(): Node {
    let a = this.cmp()
    while (this.eatOp('&&')) a = { k: 'bin', op: '&&', a, b: this.cmp() }
    return a
  }

  private cmp(): Node {
    const a = this.add()
    for (const op of ['==', '!=', '<=', '>=', '<', '>'] as const) {
      const t = this.peek()
      if (t && t.t === 'op' && t.v === op) {
        this.pos++
        return { k: 'bin', op, a, b: this.add() }
      }
    }
    return a
  }

  private add(): Node {
    let a = this.mul()
    for (;;) {
      if (this.eatOp('+')) a = { k: 'bin', op: '+', a, b: this.mul() }
      else if (this.eatOp('-')) a = { k: 'bin', op: '-', a, b: this.mul() }
      else return a
    }
  }

  private mul(): Node {
    let a = this.unary()
    for (;;) {
      if (this.eatOp('*')) a = { k: 'bin', op: '*', a, b: this.unary() }
      else if (this.eatOp('/')) a = { k: 'bin', op: '/', a, b: this.unary() }
      else if (this.eatOp('%')) a = { k: 'bin', op: '%', a, b: this.unary() }
      else return a
    }
  }

  private unary(): Node {
    if (this.eatOp('-')) return { k: 'un', op: '-', a: this.unary() }
    if (this.eatOp('+')) return this.unary()
    if (this.eatOp('!')) return { k: 'un', op: '!', a: this.unary() }
    return this.power()
  }

  private power(): Node {
    const base = this.primary()
    if (this.eatOp('^')) return { k: 'bin', op: '^', a: base, b: this.unary() }
    return base
  }

  private primary(): Node {
    const t = this.peek()
    if (!t) throw new FormulaError('Unexpected end of formula')
    if (t.t === 'num') {
      this.pos++
      return { k: 'num', v: t.v }
    }
    if (t.t === 'id') {
      this.pos++
      if (this.eatOp('(')) {
        const args: Node[] = []
        if (!this.eatOp(')')) {
          do {
            args.push(this.ternary())
          } while (this.eatOp(','))
          this.expectOp(')')
        }
        return { k: 'call', name: t.v, args }
      }
      return { k: 'id', name: t.v }
    }
    if (t.t === 'op' && t.v === '(') {
      this.pos++
      const node = this.ternary()
      this.expectOp(')')
      return node
    }
    throw new FormulaError(`Unexpected token "${t.v}" in formula`)
  }
}

/** Function library available inside formulas. */
export const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  min: Math.min,
  max: Math.max,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sqrt: Math.sqrt,
  log: Math.log,
  log10: Math.log10,
  pow: Math.pow,
  clamp: (v, lo, hi) => Math.min(Math.max(v, lo), hi),
}

const parseCache = new Map<string, Node>()

export function parseFormula(src: string): Node {
  const cached = parseCache.get(src)
  if (cached) return cached
  const tokens = tokenize(src)
  if (tokens.length === 0) throw new FormulaError('Formula is empty')
  const node = new Parser(tokens).parse()
  parseCache.set(src, node)
  return node
}

function collectIdentifiers(node: Node, out: Set<string>): void {
  switch (node.k) {
    case 'id':
      out.add(node.name)
      break
    case 'un':
      collectIdentifiers(node.a, out)
      break
    case 'bin':
      collectIdentifiers(node.a, out)
      collectIdentifiers(node.b, out)
      break
    case 'tern':
      collectIdentifiers(node.c, out)
      collectIdentifiers(node.a, out)
      collectIdentifiers(node.b, out)
      break
    case 'call':
      for (const arg of node.args) collectIdentifiers(arg, out)
      break
    case 'num':
      break
  }
}

/** Variable identifiers referenced by a formula (function names excluded). */
export function extractIdentifiers(formula: string): string[] {
  const found = new Set<string>()
  collectIdentifiers(parseFormula(formula), found)
  return [...found]
}

function evalNode(node: Node, scope: Record<string, number>): number {
  switch (node.k) {
    case 'num':
      return node.v
    case 'id': {
      if (!(node.name in scope)) throw new FormulaError(`Missing input "${node.name}"`)
      const value = scope[node.name]!
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new FormulaError(`Input "${node.name}" is not a valid number`)
      }
      return value
    }
    case 'un': {
      const a = evalNode(node.a, scope)
      if (node.op === '-') return -a
      if (node.op === '!') return a === 0 ? 1 : 0
      return a
    }
    case 'call': {
      const fn = FUNCTIONS[node.name]
      if (!fn) throw new FormulaError(`Unknown function "${node.name}"`)
      return fn(...node.args.map((arg) => evalNode(arg, scope)))
    }
    case 'tern':
      return evalNode(node.c, scope) !== 0 ? evalNode(node.a, scope) : evalNode(node.b, scope)
    case 'bin': {
      const a = evalNode(node.a, scope)
      const b = evalNode(node.b, scope)
      switch (node.op) {
        case '+':
          return a + b
        case '-':
          return a - b
        case '*':
          return a * b
        case '/':
          if (b === 0) throw new FormulaError('Division by zero — check your inputs')
          return a / b
        case '%':
          if (b === 0) throw new FormulaError('Division by zero — check your inputs')
          return a % b
        case '^':
          return Math.pow(a, b)
        case '==':
          return a === b ? 1 : 0
        case '!=':
          return a !== b ? 1 : 0
        case '<':
          return a < b ? 1 : 0
        case '<=':
          return a <= b ? 1 : 0
        case '>':
          return a > b ? 1 : 0
        case '>=':
          return a >= b ? 1 : 0
        case '&&':
          return a !== 0 && b !== 0 ? 1 : 0
        case '||':
          return a !== 0 || b !== 0 ? 1 : 0
        default:
          throw new FormulaError(`Unsupported operator "${node.op}"`)
      }
    }
  }
}

/** Evaluate a formula against a numeric scope. Throws FormulaError on failure. */
export function evaluate(formula: string, scope: Record<string, number>): number {
  const result = evalNode(parseFormula(formula), scope)
  if (!Number.isFinite(result)) {
    throw new FormulaError('Formula produced a result too large to display')
  }
  return result
}
