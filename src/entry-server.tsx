import { renderToString } from 'react-dom/server'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routeObjects } from './routes'

/** Render a URL to static HTML. Consumed by scripts/prerender.tsx at build time. */
export function render(url: string): string {
  const router = createMemoryRouter(routeObjects, { initialEntries: [url] })
  return renderToString(<RouterProvider router={router} />)
}
