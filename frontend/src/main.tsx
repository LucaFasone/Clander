import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from './hooks/useAuth.ts'

const queryClient = new QueryClient()

const router = createRouter({ routeTree, context: {queryClient, authentication: undefined!}})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp () {
  const authentication = useAuth()
  return <RouterProvider router={router} context={{authentication}}/>

}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InnerApp/>
    </QueryClientProvider>
  </React.StrictMode>,
)
