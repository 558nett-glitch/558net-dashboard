import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomerProvider } from './context/CustomerContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { MonitoringOntPage } from './pages/MonitoringOntPage';
import { TagihanPage } from './pages/TagihanPage';
import { LaporanPage } from './pages/LaporanPage';
import { PengaturanPage } from './pages/PengaturanPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CustomerProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pelanggan"
                element={
                  <ProtectedRoute>
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monitoring-ont"
                element={
                  <ProtectedRoute>
                    <MonitoringOntPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tagihan"
                element={
                  <ProtectedRoute>
                    <TagihanPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/laporan"
                element={
                  <ProtectedRoute>
                    <LaporanPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pengaturan"
                element={
                  <ProtectedRoute>
                    <PengaturanPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </CustomerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
