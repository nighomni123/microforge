import { Link } from 'react-router'
import { SITE } from '../lib/site'

export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight">About {SITE.name}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-600 dark:text-slate-400">
        <p>
          {SITE.name} is a collection of small, focused web tools. Each one does a single job —
          calculate something, generate something, decide something — and gets out of your way.
        </p>
        <p>
          No accounts. No downloads. Your inputs stay in your browser, and every tool loads fast
          enough to use on a phone in a hurry.
        </p>
        <p>
          The collection grows steadily. If a tool saves you time, share it with someone who needs
          it — that is how new tools get prioritized.
        </p>
      </div>
      <p className="mt-8">
        <Link
          to="/"
          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Browse all tools →
        </Link>
      </p>
    </div>
  )
}
