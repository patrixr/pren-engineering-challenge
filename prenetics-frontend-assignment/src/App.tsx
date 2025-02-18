import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './layouts/MainLayout'
import PatientManagement from './pages/PatientManagement'
import { OrganisationProvider } from './context/OrganisationContext'
import ResultUpload from './pages/ResultUpload'
import KitActivation from './pages/KitActivation'

const queryClient = new QueryClient()

function App() {
  return (
    <div data-theme="cupcake">
      <OrganisationProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/patients" element={<PatientManagement />} />
                <Route path="/results" element={<ResultUpload />} />
                <Route path="/kits" element={<KitActivation />} />
                <Route path="/" element={<Navigate to="/patients" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </OrganisationProvider>
    </div>
  )
}

export default App
