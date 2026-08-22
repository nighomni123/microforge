import { Outlet } from 'react-router'
import { StickyAd } from '../ads/StickyAd'
import { ConsentBanner } from '../consent/ConsentBanner'
import { Seo } from '../Seo'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow dark:focus:bg-slate-900"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ConsentBanner />
      <StickyAd />
      <Seo />
    </div>
  )
}
