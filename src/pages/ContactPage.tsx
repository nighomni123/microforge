import { SITE } from '../lib/site'

export function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Contact</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-600 dark:text-slate-400">
        <p>Found a bug? A calculator giving a wrong answer? Want a tool that does not exist yet?</p>
        <p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {SITE.contactEmail}
          </a>
        </p>
        <p>
          We read everything and usually reply within a few days. Requests that help many people
          move to the top of the queue.
        </p>
      </div>
    </div>
  )
}
