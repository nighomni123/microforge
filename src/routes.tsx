import type { RouteObject } from 'react-router'
import { Layout } from './components/layout/Layout'
import { AboutPage } from './pages/AboutPage'
import { CategoryPage } from './pages/CategoryPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { ToolPage } from './pages/ToolPage'

/**
 * Single source of truth for routing:
 * - client: rendered via useRoutes() inside BrowserRouter
 * - prerender: passed straight into createMemoryRouter()
 */
export const routeObjects: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'category/:category', element: <CategoryPage /> },
      { path: ':category/:slug', element: <ToolPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
