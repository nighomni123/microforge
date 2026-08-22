import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-black text-indigo-600/20 dark:text-indigo-400/20">404</p>
      <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist or may still be in draft.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
      >
        Browse all tools
      </Link>
    </div>
  )
}
