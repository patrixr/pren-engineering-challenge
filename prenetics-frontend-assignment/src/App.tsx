import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import PatientManagement from './pages/PatientManagement'
import ResultUpload from './pages/ResultUpload'
import KitActivation from './pages/KitActivation'

function App() {
  return (
    <div data-theme="retro">
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
    </div>
  )
}

export default App
