import { Link } from 'react-router'
import { CATEGORY_META } from '../lib/categories'
import { SITE } from '../lib/site'
import { visibleCategories, visibleTools } from '../lib/tools'
import { ToolCard } from '../components/ToolCard'

/** Portfolio hub: category sections with every visible tool (Phase 13). */
export function HomePage() {
  const categories = visibleCategories()
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-12">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Free micro-tools that do one thing well
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{SITE.description}</p>
      </section>

      {categories.map((category) => {
        const meta = CATEGORY_META[category]
        const tools = visibleTools.filter((tool) => tool.category === category)
        return (
          <section key={category} className="mt-14" aria-labelledby={`cat-${category}`}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 id={`cat-${category}`} className="text-2xl font-bold tracking-tight">
                <span aria-hidden className="mr-2">
                  {meta.icon}
                </span>
                {meta.label}
              </h2>
              <Link
                to={`/category/${category}`}
                className="shrink-0 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                View all →
              </Link>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{meta.blurb}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
