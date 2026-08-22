import type { ToolConfig } from '../../src/engine/schema'

/**
 * Password Strength Checker — proves checker-style tools:
 * live customCompute on a text input, 100% client-side (privacy-safe).
 */

/** Offline-attack assumption: ~10 billion guesses per second. */
const GUESSES_PER_SECOND = 1e10

function humanTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 1) return 'instantly'
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  if (seconds < 31557600) return `${Math.round(seconds / 86400)} days`
  const years = seconds / 31557600
  if (years < 1000) return `about ${Math.round(years)} years`
  if (years < 1e6) return `${(years / 1000).toFixed(1)} thousand years`
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} million years`
  return 'billions of years'
}

export default {
  slug: 'password-strength-checker',
  title: 'Password Strength Checker',
  metaTitle: 'Password Strength Checker — Runs in Your Browser',
  metaDescription:
    'Type a password to see its estimated entropy and real-world crack time. Nothing is sent or stored — the check runs entirely offline.',
  category: 'utilities',
  tags: ['password', 'security', 'entropy'],
  icon: '🔐',
  status: 'live',
  description:
    'How strong is your password really? Estimate its entropy and how long an offline attack would take to crack it — without it ever leaving your browser.',
  howItWorks:
    'The checker estimates the “character pool” your password draws from — lowercase, uppercase, digits, and symbols are each worth a set of possible characters. Entropy in bits equals the password length times log2 of that pool size.\n\nCrack time assumes a determined attacker with fast offline hardware trying about 10 billion guesses per second against a stolen password database.\n\nImportant: this measures length and variety only. A long password made of a dictionary word or personal detail can still be weak in practice — uniqueness matters as much as entropy, so use a password manager.',
  inputs: [
    {
      id: 'password',
      label: 'Password to check',
      type: 'text',
      default: '',
      placeholder: 'Type or paste a password',
      help: 'Never leaves your browser — nothing is sent, logged, or stored.',
    },
  ],
  outputs: [
    { id: 'strength', label: 'Strength', format: 'text', primary: true },
    { id: 'entropy', label: 'Estimated entropy (bits)', format: 'number', decimals: 0 },
    { id: 'crackTime', label: 'Offline crack time', format: 'text' },
  ],
  faqs: [
    {
      question: 'Is it safe to type my password here?',
      answer:
        'Yes. This tool is a small script that runs locally in your browser tab. The password is never transmitted over the network, never logged, and disappears when you close or refresh the page. You can even disconnect from the internet and it will still work.',
    },
    {
      question: 'What does “entropy” mean for a password?',
      answer:
        'Entropy measures unpredictability in bits. Each bit doubles the search space: a 40-bit password has about a trillion possibilities, while 80-bit exceeds the number of seconds since the Big Bang many times over. Longer passwords with more character variety score higher.',
    },
    {
      question: 'What makes a password actually strong?',
      answer:
        'Length first (16+ characters), then randomness. Four random words (“rivers-copper-plum-haze”) beat a short soup of symbols. Just as important: never reuse passwords across sites, because attackers test leaked ones everywhere first.',
    },
    {
      question: 'My password scores well but starts with a common word. Is it safe?',
      answer:
        'Maybe not. This estimator assumes random characters; real attackers try dictionary words, names, dates, and leaked passwords first. Add true randomness — ideally generate passwords in a reputable password manager instead of inventing them.',
    },
  ],
  keywords: [
    'password strength checker',
    'how strong is my password',
    'password entropy calculator',
    'password crack time estimator',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const password = String(inputs.password ?? '')
    if (password.length === 0) {
      return {
        strength: 'Type a password above to check it',
        entropy: 0,
        crackTime: '—',
      }
    }

    let pool = 0
    if (/[a-z]/.test(password)) pool += 26
    if (/[A-Z]/.test(password)) pool += 26
    if (/[0-9]/.test(password)) pool += 10
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33

    const entropy = password.length * Math.log2(pool || 1)
    const guesses = Math.pow(2, entropy) / 2
    const seconds = guesses / GUESSES_PER_SECOND

    const strength =
      entropy < 28
        ? 'Very weak'
        : entropy < 50
          ? 'Weak'
          : entropy < 70
            ? 'Reasonable'
            : entropy < 90
              ? 'Strong'
              : 'Excellent'

    return {
      strength,
      entropy: Math.round(entropy),
      crackTime: humanTime(seconds),
    }
  },
} satisfies ToolConfig
