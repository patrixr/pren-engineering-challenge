import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './layouts/MainLayout'
import PatientManagement from './pages/PatientManagement'
import { OrganisationProvider } from './providers/OrganisationsProvider'
import ResultUpload from './pages/ResultUpload'
import KitActivation from './pages/KitActivation'
import Seeding from './pages/Seeding'

const queryClient = new QueryClient()

function App() {
  return (
    <div data-theme="cupcake">
      <QueryClientProvider client={queryClient}>
        <OrganisationProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/patients" element={<PatientManagement />} />
                <Route path="/results" element={<ResultUpload />} />
                <Route path="/kits" element={<KitActivation />} />
                <Route path="/seeding" element={<Seeding />} />
                <Route path="/" element={<Navigate to="/patients" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </OrganisationProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
