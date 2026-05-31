import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';
import { useBalance } from '../hooks/useBalance';
import { useTopup } from '../hooks/useTopup';
import Button from '../common/ui/Button';
import brandLogo from '../assets/vexora_brand.jpeg';

const navLinks = [
  { path: '/app/dashboard', label: 'Dashboard', icon: '⬡' },
  { path: '/app/dice',      label: 'Dice',      icon: '⚄' },
  { path: '/app/coinflip',  label: 'Coinflip',  icon: '◉' },
  { path: '/app/mines',     label: 'Mines',     icon: '⊛' },
  { path: '/app/crash',     label: 'Crash',     icon: '◈' },
];

const Navbar = () => {
  const { user, logout: clearAuth }    = useAuthStore();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { mutate: topup,  isPending: toppingUp  } = useTopup();
  const { data: balance } = useBalance();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const displayBalance = (balance ?? user?.balance ?? 0).toLocaleString();
  const showTopup = (balance ?? user?.balance ?? 0) < 500;

  const isActive = (path) =>
    path === '/app/dashboard' ? location.pathname === '/app/dashboard' : location.pathname.startsWith(path);

  const showToast = (tone, message, ttl = 2200) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ tone, message });
    toastTimerRef.current = setTimeout(() => setToast(null), ttl);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        showToast('success', 'Signed out. See you soon.', 1800);
        setTimeout(() => {
          clearAuth();
          navigate('/', { replace: true });
        }, 1000);
      },
      onError: () => {
        showToast('error', 'Signed out locally. Please sign in again.', 2400);
        setTimeout(() => {
          clearAuth();
          navigate('/', { replace: true });
        }, 1200);
      },
    });
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono:wght@400;500;600&display=swap');`}</style>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-6 right-6 z-[70]"
          >
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{
                background: 'linear-gradient(135deg, rgba(12,16,14,0.98), rgba(8,12,10,0.98))',
                borderColor: toast.tone === 'success' ? 'rgba(52,211,153,0.4)' : 'rgba(244,63,94,0.35)',
                boxShadow:
                  toast.tone === 'success'
                    ? '0 18px 45px -22px rgba(52,211,153,0.45)'
                    : '0 18px 45px -22px rgba(244,63,94,0.5)',
              }}
            >
              <span
                className={
                  toast.tone === 'success'
                    ? 'size-1.5 rounded-full bg-emerald-300'
                    : 'size-1.5 rounded-full bg-rose-400'
                }
              />
              <p
                className={
                  toast.tone === 'success'
                    ? 'text-[12px] text-emerald-100 tracking-[0.02em]'
                    : 'text-[12px] text-rose-200 tracking-[0.02em]'
                }
              >
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(4,8,6,0.98) 0%, rgba(6,10,8,0.95) 100%)',
          borderBottom: '1px solid rgba(85,211,150,0.16)',
          backdropFilter: 'blur(20px)',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        }}
      >
        {/* Top gold line */}
        <div className="h-[1px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(85,211,150,0.5) 30%, rgba(85,211,150,0.7) 50%, rgba(85,211,150,0.5) 70%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/app/dashboard" className="shrink-0 flex items-center gap-2.5 group">
            <motion.div
              className="relative w-8 h-8 overflow-hidden rounded-lg"
              whileHover={{ rotate: 4, scale: 1.03 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 18px rgba(85,211,150,0.25)' }}
            >
              <img src={brandLogo} alt="Vexora" className="h-full w-full object-cover" />
            </motion.div>
            <span
              className="text-xl tracking-[0.12em] uppercase"
              style={{
                fontFamily: 'Instrument Serif, ui-serif, serif',
                background: 'linear-gradient(135deg, #55D396, #B6F4D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(85,211,150,0.3))',
              }}
            >
              Vexora
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    className="relative px-4 py-2 rounded-lg flex items-center gap-1.5 group"
                    whileHover={{ y: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(85,211,150,0.15), rgba(85,211,150,0.05))',
                          border: '1px solid rgba(85,211,150,0.22)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`text-xs relative z-10 ${active ? 'text-emerald-300' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                      {link.icon}
                    </span>
                    <span
                      className={`relative z-10 text-[11px] uppercase tracking-[0.28em] transition-colors ${
                        active ? 'text-emerald-300' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    >
                      {link.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side: balance + actions */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Balance display */}
            <motion.div
              key={displayBalance}
              initial={{ scale: 1.15, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(8,16,12,0.92), rgba(6,12,10,0.9))',
                border: '1px solid rgba(85,211,150,0.22)',
                boxShadow: '0 0 15px rgba(85,211,150,0.08), inset 0 1px 0 rgba(85,211,150,0.12)',
              }}
            >
              <motion.span
                className="text-base"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                🪙
              </motion.span>
              <span
                className="font-bold text-sm tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #55D396, #B6F4D6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {displayBalance}
              </span>
            </motion.div>

            {/* Top up */}
            <AnimatePresence>
              {showTopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                >
                  <Button variant="primary" loading={toppingUp} onClick={() => topup()} className="!py-2 !px-3 !text-[10px]">
                    + Coins
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username */}
            <span className="text-[10px] text-zinc-500 hidden sm:block tracking-[0.28em] uppercase">
              {user?.username}
            </span>

            {/* Logout */}
            <Button variant="secondary" loading={loggingOut} onClick={handleLogout} className="!py-2 !px-3 !text-[10px]">
              Logout
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1 p-2 rounded-lg"
              style={{ border: '1px solid rgba(85,211,150,0.2)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-5 h-[1px] bg-emerald-300/70"
                  animate={mobileOpen ? {
                    rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                    y: i === 0 ? 6 : i === 2 ? -6 : 0,
                    opacity: i === 1 ? 0 : 1,
                  } : { rotate: 0, y: 0, opacity: 1 }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(85,211,150,0.1)' }}
            >
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                      <div
                        className="px-4 py-2 rounded-lg flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium transition-all"
                        style={{
                          background: active ? 'rgba(85,211,150,0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${active ? 'rgba(85,211,150,0.35)' : 'rgba(255,255,255,0.06)'}`,
                          color: active ? '#55D396' : '#6b7280',
                        }}
                      >
                        <span>{link.icon}</span>
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom shadow line */}
        <div className="h-[1px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(85,211,150,0.08) 50%, transparent)' }} />
      </nav>
    </>
  );
};

export default Navbar;