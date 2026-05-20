import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';
import { useBalance } from '../hooks/useBalance';
import { useTopup } from '../hooks/useTopup';
import Button from '../common/ui/Button';

const navLinks = [
  { path: '/app',         label: 'Dashboard', icon: '⬡' },
  { path: '/app/dice',     label: 'Dice',      icon: '⚄' },
  { path: '/app/coinflip', label: 'Coinflip',  icon: '◉' },
  { path: '/app/mines',    label: 'Mines',     icon: '⊛' },
  { path: '/app/crash',    label: 'Crash',     icon: '◈' },
];

const Navbar = () => {
  const { user }    = useAuthStore();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { mutate: topup,  isPending: toppingUp  } = useTopup();
  const { data: balance } = useBalance();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayBalance = (balance ?? user?.balance ?? 0).toLocaleString();
  const showTopup = (balance ?? user?.balance ?? 0) < 500;

  const isActive = (path) =>
    path === '/app' ? location.pathname === '/app' : location.pathname.startsWith(path);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Barlow:wght@300;400;500&display=swap');`}</style>

      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(5,5,8,0.98) 0%, rgba(8,7,4,0.95) 100%)',
          borderBottom: '1px solid rgba(245,158,11,0.12)',
          backdropFilter: 'blur(20px)',
          fontFamily: 'Rajdhani, sans-serif',
        }}
      >
        {/* Top gold line */}
        <div className="h-[1px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.6) 30%, rgba(245,158,11,0.8) 50%, rgba(245,158,11,0.6) 70%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/app" className="shrink-0 flex items-center gap-2.5 group">
            <motion.div
              className="relative w-8 h-8"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="w-8 h-8 rotate-45 border-2 border-amber-500/70 rounded-sm flex items-center justify-center"
                style={{ boxShadow: '0 0 15px rgba(245,158,11,0.3)' }}>
                <span className="text-xs -rotate-45" style={{ fontFamily: 'serif' }}>♠</span>
              </div>
            </motion.div>
            <span
              className="text-xl font-bold tracking-[0.12em] uppercase"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.3))',
              }}
            >
              Casino
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
                          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                          border: '1px solid rgba(245,158,11,0.2)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`text-xs relative z-10 ${active ? 'text-amber-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                      {link.icon}
                    </span>
                    <span
                      className={`relative z-10 text-sm font-medium tracking-[0.08em] uppercase transition-colors ${
                        active ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'
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
                background: 'linear-gradient(135deg, rgba(20,16,8,0.9), rgba(12,10,4,0.9))',
                border: '1px solid rgba(245,158,11,0.2)',
                boxShadow: '0 0 15px rgba(245,158,11,0.08), inset 0 1px 0 rgba(245,158,11,0.1)',
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
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
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
            <span className="text-xs text-gray-600 hidden sm:block tracking-[0.1em] uppercase"
              style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
              {user?.username}
            </span>

            {/* Logout */}
            <Button variant="secondary" loading={loggingOut} onClick={() => logout()} className="!py-2 !px-3 !text-[10px]">
              Logout
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1 p-2 rounded-lg"
              style={{ border: '1px solid rgba(245,158,11,0.15)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-5 h-[1px] bg-amber-500/60"
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
              style={{ borderTop: '1px solid rgba(245,158,11,0.08)' }}
            >
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                      <div
                        className="px-4 py-2 rounded-lg flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium transition-all"
                        style={{
                          background: active ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${active ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                          color: active ? '#f59e0b' : '#6b7280',
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
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.05) 50%, transparent)' }} />
      </nav>
    </>
  );
};

export default Navbar;