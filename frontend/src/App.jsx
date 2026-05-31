import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion }           from 'framer-motion';
import { useAuthStore }     from './store/authStore';
import { useInitAuth }      from './hooks/useInitAuth';
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

/* ── Boot splash shown while we probe the refresh cookie ── */
const BootSplash = () => (
  <div className="fixed inset-0 bg-[#050c07] flex items-center justify-center z-50">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
      className="flex flex-col items-center gap-4"
    >
      <span className="text-4xl">🎲</span>
      <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-emerald-500/60">
        Vexora
      </span>
    </motion.div>
  </div>
);

function App() {
  const { user, isHydrating } = useAuthStore();

  // Silently restore session from httpOnly refresh cookie on every boot.
  // Nothing is read from localStorage — zero XSS exposure.
  useInitAuth();

  // Show splash until the refresh call resolves (usually <300ms on LAN)
  if (isHydrating) return <BootSplash />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public routes — redirect to dashboard if already logged in */}
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

        {/* Protected routes — all wrapped in MainLayout */}
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

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;