import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore }   from './store/authStore';
import ProtectedRoute     from './components/ProtectedRoute';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DashboardPage      from './pages/DashboardPage';
import DicePage           from './pages/DicePage';
import CoinflipPage       from './pages/CoinflipPage';
import MinesPage          from './pages/MinesPage';
import CrashPage          from './pages/CrashPage';
import MainLayout         from './layouts/MainLayout';
import LandingPage from "./pages/LandingPage"

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />


        {/* Public routes — redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/app" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/app" replace /> : <RegisterPage />}
        />

        {/* Protected routes — all wrapped in MainLayout */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* index = default child route at "/app" */}
          <Route index element={<DashboardPage />} />
          <Route path="dice"    element={<DicePage />} />
          <Route path="coinflip" element={<CoinflipPage />} />
          <Route path="mines"   element={<MinesPage />} />
          <Route path="crash"   element={<CrashPage />} />
        </Route>

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;