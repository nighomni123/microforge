import { Link, useParams } from 'react-router'
import { AdSlot } from '../components/ads/AdSlot'
import { Faq } from '../components/Faq'
import { RelatedTools } from '../components/tool/RelatedTools'
import { ToolRenderer } from '../components/tool/ToolRenderer'
import { CATEGORY_META, isToolCategory } from '../lib/categories'
import { getTool } from '../lib/tools'
import { NotFoundPage } from './NotFoundPage'

export function ToolPage() {
  const { category, slug } = useParams()
  const tool = getTool(slug)
  if (!tool || !isToolCategory(category) || tool.category !== category) {
    return <NotFoundPage />
  }

  return (
    <article className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link
          to={`/category/${tool.category}`}
          className="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {CATEGORY_META[tool.category].label}
        </Link>
        <span aria-hidden> / </span>
        <span className="text-slate-900 dark:text-slate-100">{tool.title}</span>
      </nav>

      <header className="mt-4">
        <span aria-hidden className="text-4xl">
          {tool.icon}
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{tool.title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{tool.description}</p>
      </header>

      {/* Desktop: content + sticky sidebar ad. Mobile: single column + sticky bottom banner. */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-10">
          <ToolRenderer config={tool} />
          <AdSlot slot="incontent" />
          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-2xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-400">
              {tool.howItWorks}
            </p>
          </section>
          <Faq faqs={tool.faqs} />
          <RelatedTools current={tool} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <AdSlot slot="sidebar" />
          </div>
        </aside>
      </div>
    </article>
  )
}
