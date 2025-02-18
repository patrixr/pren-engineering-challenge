import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OrganisationProvider } from '../src/context/OrganisationContext'

export const WithProviders = ({ children, queryClient }: {
  children: React.ReactNode,
  queryClient?: QueryClient
}) => {
  return <QueryClientProvider client={queryClient ?? new QueryClient()}>
    <OrganisationProvider>
      {children}
    </OrganisationProvider>
  </QueryClientProvider>
}