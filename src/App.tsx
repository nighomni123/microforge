import { BrowserRouter, useRoutes } from 'react-router'
import { routeObjects } from './routes'

function AppRoutes() {
  return useRoutes(routeObjects)
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
