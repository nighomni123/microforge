import { Link } from 'react-router'
import { CATEGORY_META } from '../../lib/categories'
import { liveCategories, liveTools } from '../../lib/tools'
import { SITE } from '../../lib/site'

export function Footer() {
  const categories = liveCategories()
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        <div>
          <p className="font-bold">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-slate-500 dark:text-slate-400">
            {SITE.tagline} Everything runs in your browser.
          </p>
        </div>
        <div>
          <p className="font-semibold">Tools</p>
          <ul className="mt-2 space-y-1.5 text-slate-600 dark:text-slate-400">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  to={`/category/${category}`}
                >
                  {CATEGORY_META[category].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Site</p>
          <ul className="mt-2 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <Link className="hover:text-indigo-600 dark:hover:text-indigo-400" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-indigo-600 dark:hover:text-indigo-400" to="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link className="hover:text-indigo-600 dark:hover:text-indigo-400" to="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="hover:text-indigo-600 dark:hover:text-indigo-400" to="/terms">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {SITE.name} · Free
        tools, no sign-up{liveTools.length > 0 ? ` · ${liveTools.length} tools and counting` : ''}.
      </div>
    </footer>
  )
}
