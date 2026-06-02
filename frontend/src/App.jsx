import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AuthGate from './components/AuthGate';
import ProtectedRoute       from './components/ProtectedRoute';
import LoginPage            from './pages/LoginPage';
import RegisterPage         from './pages/RegisterPage';
import ForgotPasswordPage   from './pages/ForgotPasswordPage';
import DashboardPage        from './pages/DashboardPage';
import DicePage             from './pages/DicePage';
import CoinflipPage         from './pages/CoinflipPage';
import MinesPage            from './pages/MinesPage';
import CrashPage            from './pages/CrashPage';
import MainLayout           from './layouts/MainLayout';
import LandingPage          from './pages/LandingPage';

function App() {
  const { user } = useAuthStore();

  return (
    <AuthGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/app/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/app/dashboard" replace /> : <RegisterPage />}
          />
          <Route
            path="/forgot-password"
            element={user ? <Navigate to="/app/dashboard" replace /> : <ForgotPasswordPage />}
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="dice"      element={<DicePage />} />
            <Route path="coinflip"  element={<CoinflipPage />} />
            <Route path="mines"     element={<MinesPage />} />
            <Route path="crash"     element={<CrashPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthGate>
  );
}

export default App;