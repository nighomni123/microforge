import { Link, NavLink } from 'react-router'
import { CATEGORY_META } from '../../lib/categories'
import { visibleCategories } from '../../lib/tools'
import { SITE } from '../../lib/site'
import { ThemeToggle } from '../ThemeToggle'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 ${
    isActive
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-slate-600 dark:text-slate-300'
  }`

export function Header() {
  const categories = visibleCategories().slice(0, 3)
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight">
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white"
          >
            M
          </span>
          {SITE.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          {categories.map((category) => (
            <NavLink key={category} to={`/category/${category}`} className={linkClass}>
              {CATEGORY_META[category].short}
            </NavLink>
          ))}
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
