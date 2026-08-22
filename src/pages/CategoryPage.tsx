import { Link, useParams } from 'react-router'
import { ToolCard } from '../components/ToolCard'
import { CATEGORY_META, isToolCategory } from '../lib/categories'
import { visibleTools } from '../lib/tools'
import { NotFoundPage } from './NotFoundPage'

export function CategoryPage() {
  const { category } = useParams()
  if (!isToolCategory(category)) return <NotFoundPage />

  const meta = CATEGORY_META[category]
  const tools = visibleTools.filter((tool) => tool.category === category)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-slate-900 dark:text-slate-100">{meta.label}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span aria-hidden className="mr-2">
          {meta.icon}
        </span>
        {meta.label}
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{meta.blurb}</p>

      {tools.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-slate-500">No tools here yet — check back soon.</p>
      )}
    </div>
  )
}
