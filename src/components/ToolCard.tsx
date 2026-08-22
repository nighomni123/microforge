import { Link } from 'react-router'
import type { ToolConfig } from '../engine/schema'

export function ToolCard({ tool }: { tool: ToolConfig }) {
  return (
    <Link
      to={`/${tool.category}/${tool.slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="flex items-start justify-between gap-2">
        <span aria-hidden className="text-3xl">
          {tool.icon}
        </span>
        {tool.status === 'draft' && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            draft
          </span>
        )}
      </div>
      <h3 className="mt-3 font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
        {tool.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {tool.description}
      </p>
    </Link>
  )
}
