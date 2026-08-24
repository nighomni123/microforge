import type { ToolConfig } from '../../src/engine/schema'

/**
 * Password Generator — CSPRNG-backed password generation with rejection
 * sampling (bias-free modulo), per-pool presence guarantees, and an entropy
 * estimate. Runs on button press (autoCompute: false).
 *
 * globalThis.crypto.getRandomValues is available in browsers AND Node ≥19,
 * so this is safe both for SSR/prerendered defaults and client-side runs.
 */
export default {
  slug: 'password-generator',
  title: 'Password Generator',
  metaTitle: 'Password Generator — Strong Random Passwords',
  metaDescription:
    'Generate strong random passwords instantly in your browser using its built-in crypto engine — unbiased randomness, never transmitted or stored.',
  category: 'utilities',
  tags: ['password', 'security', 'cryptography', 'generator'],
  icon: '🔐',
  status: 'draft',
  description:
    'Create strong, random passwords backed by your device’s cryptographic random number generator. Choose a length and character sets, press generate, and copy — nothing ever leaves your browser.',
  howItWorks:
    'Every character comes from crypto.getRandomValues, the cryptographically secure pseudorandom number generator (CSPRNG) built into your browser and Node.js. Unlike Math.random — whose predictable sequences are fine for games and animations but worthless for secrets — a CSPRNG draws from your operating system’s entropy pool, so the next character stays unguessable even after an attacker has seen every previous one.\n\nRandomness quality matters more than most people realize. The common shortcut — taking a random 32-bit integer modulo the pool size — silently skews results whenever the pool size does not divide evenly into 2³², making some characters measurably likelier than others. This tool uses rejection sampling instead: any raw value falling in the biased remainder range is discarded and redrawn, so every character in your selected pool is exactly equally likely.\n\nStrength is measured in entropy bits: length × log₂(pool size). A 16-character password drawn from a 96-character pool carries roughly 105 bits — far beyond any realistic brute-force effort. The Entropy (bits) output updates with your settings, so you can see precisely what each choice costs, including the tiny price of excluding look-alike characters such as l, 1, I, O and 0.\n\nHonest guidance: a reputable password manager plus a unique generated password for every site beats any memorization trick. Generation happens entirely on your device — nothing is transmitted, logged, or stored — but treat any password as exposed once you have copied and pasted it on a shared or monitored machine.',
  inputs: [
    {
      id: 'length',
      label: 'Length',
      type: 'number',
      default: 16,
      min: 6,
      max: 128,
      step: 1,
      help: 'How many characters. 16+ recommended; longer is stronger.',
    },
    {
      id: 'uppercase',
      label: 'Uppercase letters',
      type: 'select',
      default: 1,
      options: [
        { value: 1, label: 'Include A–Z' },
        { value: 0, label: 'No uppercase' },
      ],
    },
    {
      id: 'digits',
      label: 'Digits',
      type: 'select',
      default: 1,
      options: [
        { value: 1, label: 'Include 0–9' },
        { value: 0, label: 'No digits' },
      ],
    },
    {
      id: 'symbols',
      label: 'Symbols',
      type: 'select',
      default: 1,
      options: [
        { value: 1, label: 'Include !@#$…' },
        { value: 0, label: 'No symbols' },
      ],
    },
    {
      id: 'avoidAmbiguous',
      label: 'Ambiguity',
      type: 'select',
      default: 0,
      options: [
        { value: 0, label: 'Keep all characters' },
        { value: 1, label: 'Exclude look-alikes (l, 1, I, O, 0)' },
      ],
      help: 'Removes easily confused characters for manual typing.',
    },
  ],
  outputs: [
    { id: 'password', label: 'Your password', format: 'text', primary: true },
    { id: 'entropyBits', label: 'Entropy (bits)', format: 'number', decimals: 1 },
    { id: 'strengthText', label: 'Strength estimate', format: 'text' },
    { id: 'charsetSize', label: 'Character pool size', format: 'number', decimals: 0 },
  ],
  faqs: [
    {
      question: 'Are these passwords safe to use?',
      answer:
        'Yes. Every password is generated locally in your browser with its built-in cryptographic engine — nothing is sent to a server, logged, or stored. One caveat: treat any password as exposed once you have copied and pasted it on a shared or monitored machine.',
    },
    {
      question: 'How long should my password be?',
      answer:
        'Sixteen characters or more suits most accounts. Twenty or more is wise for master accounts — your email or banking login — where whoever controls them controls everything else. Longer always wins: each extra character multiplies an attacker’s work.',
    },
    {
      question: 'Why exclude look-alike characters?',
      answer:
        'Characters like l, 1, I, O and 0 are easy to misread when you type a password by hand. Excluding them shrinks the pool slightly, costing a fraction of a bit per character — the Entropy (bits) output shows the exact difference so you can decide.',
    },
    {
      question: 'Is Math.random weaker than crypto randomness?',
      answer:
        'Yes. Math.random produces predictable sequences meant for animations and games, not secrets — its output can be reconstructed from a few observed values. This tool uses crypto.getRandomValues, which draws from your operating system’s entropy pool and is designed to resist prediction.',
    },
  ],
  keywords: [
    'password generator',
    'random password generator',
    'strong password generator',
    'secure password maker',
    'generate password online',
  ],
  autoCompute: false,
  actionLabel: 'Generate password',
  customCompute(inputs) {
    const length = Math.min(128, Math.max(6, Math.round(Number(inputs.length ?? 16))))
    const avoidAmbiguous = Number(inputs.avoidAmbiguous ?? 0) === 1

    // Character pools. Lowercase is always enabled; look-alike characters are
    // stripped from every affected pool only when explicitly requested.
    let lower = 'abcdefghijklmnopqrstuvwxyz'
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let digitChars = '0123456789'
    if (avoidAmbiguous) {
      lower = lower.replace(/[l]/g, '')
      upper = upper.replace(/[IO]/g, '')
      digitChars = digitChars.replace(/[01]/g, '')
    }
    const symbolChars = '!@#$%^&*()-_=+[]{};:,.<?'

    const pools: string[] = [lower]
    if (Number(inputs.uppercase ?? 1) === 1) pools.push(upper)
    if (Number(inputs.digits ?? 1) === 1) pools.push(digitChars)
    if (Number(inputs.symbols ?? 1) === 1) pools.push(symbolChars)

    const charset = pools.join('')
    if (!charset) throw new Error('Enable at least one character set.')

    // Rejection sampling: discard values in the biased remainder above the
    // largest exact multiple of `size` below 2^32, refilling the rolling
    // buffer from the CSPRNG as it drains.
    const buffer = new Uint32Array(64)
    let cursor = buffer.length
    const nextIndex = (size: number): number => {
      const limit = Math.floor(0x100000000 / size) * size
      for (;;) {
        if (cursor >= buffer.length) {
          globalThis.crypto.getRandomValues(buffer)
          cursor = 0
        }
        const value = buffer[cursor++]!
        if (value < limit) return value % size
      }
    }

    const chars: string[] = new Array<string>(length)
    for (let i = 0; i < length; i++) chars[i] = charset[nextIndex(charset.length)]!

    // Guarantee at least one character from every enabled pool when the
    // length allows it, replacing a uniformly random position per shortfall.
    if (length >= pools.length) {
      for (const pool of pools) {
        if (!chars.some((char) => pool.includes(char))) {
          chars[nextIndex(length)] = pool[nextIndex(pool.length)]!
        }
      }
    }

    const charsetSize = charset.length
    const entropyBits = Math.round(length * Math.log2(charsetSize) * 10) / 10
    const strengthText =
      entropyBits < 28
        ? 'Very weak'
        : entropyBits < 40
          ? 'Weak'
          : entropyBits < 60
            ? 'Fair'
            : entropyBits < 80
              ? 'Strong'
              : 'Excellent'

    return { password: chars.join(''), entropyBits, strengthText, charsetSize }
  },
} satisfies ToolConfig
