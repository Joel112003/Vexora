import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useLogout } from '../hooks/useAuth';
import { useBalance } from '../hooks/useBalance';
import { useTopup } from '../hooks/useTopup';
import brandLogo from '../assets/vexora_brand.jpeg';

const navLinks = [
  { path: '/app/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { path: '/app/dice',      label: 'Dice',      icon: 'ti-cube' },
  { path: '/app/coinflip',  label: 'Coinflip',  icon: 'ti-coin' },
  { path: '/app/mines',     label: 'Mines',     icon: 'ti-bomb' },
  { path: '/app/crash',     label: 'Crash',     icon: 'ti-trending-up' },
];

const Navbar = () => {
  const { user, logout: clearAuth }    = useAuthStore();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { mutate: topup,  isPending: toppingUp  } = useTopup();
  const { data: balance } = useBalance();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const displayBalance = (balance ?? user?.balance ?? 0).toLocaleString();
  const showTopup = (balance ?? user?.balance ?? 0) < 500;

  const isActive = (path) =>
    path === '/app/dashboard'
      ? location.pathname === '/app/dashboard'
      : location.pathname.startsWith(path);

  const showToast = (tone, message, ttl = 2200) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ tone, message });
    toastTimerRef.current = setTimeout(() => setToast(null), ttl);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        showToast('success', 'Signed out. See you soon.', 1800);
        setTimeout(() => { clearAuth(); navigate('/', { replace: true }); }, 1000);
      },
      onError: () => {
        showToast('error', 'Signed out locally.', 2400);
        setTimeout(() => { clearAuth(); navigate('/', { replace: true }); }, 1200);
      },
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
      `}</style>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="fixed top-6 right-6 z-[70]"
          >
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 border" style={{
              background: 'linear-gradient(135deg, rgba(12,16,14,0.98), rgba(8,12,10,0.98))',
              borderColor: toast.tone === 'success' ? 'rgba(52,211,153,0.4)' : 'rgba(244,63,94,0.35)',
            }}>
              <span className={`size-1.5 rounded-full ${toast.tone === 'success' ? 'bg-emerald-300' : 'bg-rose-400'}`} />
              <p className={`text-[12px] tracking-[0.02em] ${toast.tone === 'success' ? 'text-emerald-100' : 'text-rose-200'}`}>
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/55"
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-64 z-[70] flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #030806 0%, #050c08 100%)',
              borderLeft: '1px solid rgba(85,211,150,0.18)',
              boxShadow: '-24px 0 60px rgba(0,0,0,0.6)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(85,211,150,0.1)' }}>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] tracking-[0.28em] uppercase text-emerald-400">{user?.username}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>Player</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ border: '1px solid rgba(85,211,150,0.2)', color: 'rgba(85,211,150,0.6)' }}
              >
                <i className="ti ti-x text-sm" />
              </button>
            </div>

            {/* Balance in drawer */}
            <div className="mx-4 my-4 p-4 rounded-xl flex items-center justify-between" style={{
              background: 'linear-gradient(135deg, rgba(85,211,150,0.08), rgba(85,211,150,0.04))',
              border: '1px solid rgba(85,211,150,0.18)',
            }}>
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Balance</div>
                <div className="flex items-center gap-1.5 text-base font-semibold" style={{
                  background: 'linear-gradient(135deg, #55D396, #B6F4D6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  🪙 {displayBalance}
                </div>
              </div>
              {showTopup && (
                <button
                  onClick={() => topup()}
                  disabled={toppingUp}
                  className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg transition-all"
                  style={{ border: '1px solid rgba(85,211,150,0.25)', color: 'rgba(85,211,150,0.7)' }}
                >
                  + Add
                </button>
              )}
            </div>

            {/* Nav links */}
            <div className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
              <div className="text-[9px] tracking-[0.35em] uppercase px-2 py-2 mt-1" style={{ color: 'rgba(255,255,255,0.18)' }}>Games</div>
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link key={link.path} to={link.path} onClick={() => setDrawerOpen(false)}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        background: active ? 'rgba(85,211,150,0.1)' : 'transparent',
                        border: `1px solid ${active ? 'rgba(85,211,150,0.22)' : 'transparent'}`,
                      }}
                    >
                      <i className={`ti ${link.icon} text-base`} style={{ color: active ? '#55D396' : 'rgba(85,211,150,0.45)', width: 18 }} />
                      <span className="text-[11px] tracking-[0.18em] uppercase" style={{ color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)' }}>
                        {link.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}

              <div className="h-px my-2" style={{ background: 'rgba(85,211,150,0.08)' }} />
              <div className="text-[9px] tracking-[0.35em] uppercase px-2 py-2" style={{ color: 'rgba(255,255,255,0.18)' }}>Account</div>

              <Link to="" onClick={() => setDrawerOpen(false)}>
                <motion.div whileHover={{ x: 2 }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[rgba(85,211,150,0.07)]" style={{ border: '1px solid transparent' }}>
                  <i className="ti ti-settings text-base" style={{ color: 'rgba(85,211,150,0.45)', width: 18 }} />
                  <span className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Settings</span>
                </motion.div>
              </Link>

              <div className="h-px my-2" style={{ background: 'rgba(85,211,150,0.08)' }} />

              <motion.button
                whileHover={{ x: 2 }}
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <i className="ti ti-logout text-base" style={{ color: 'rgba(244,63,94,0.55)', width: 18 }} />
                <span className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'rgba(244,63,94,0.55)' }}>
                  {loggingOut ? 'Signing out…' : 'Logout'}
                </span>
              </motion.button>
            </div>

            <div className="p-4" style={{ borderTop: '1px solid rgba(85,211,150,0.08)' }}>
              <p className="text-center text-[9px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.12)' }}>Vexora · v1.0.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="sticky top-0 z-50" style={{
        background: 'linear-gradient(180deg, rgba(4,8,6,0.98) 0%, rgba(6,10,8,0.95) 100%)',
        borderBottom: '1px solid rgba(85,211,150,0.16)',
        backdropFilter: 'blur(20px)',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      }}>
        <div className="h-[1px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(85,211,150,0.5) 30%, rgba(85,211,150,0.7) 50%, rgba(85,211,150,0.5) 70%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo only */}
          <Link to="/app/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              className="relative w-8 h-8 overflow-hidden rounded-lg"
              whileHover={{ rotate: 4, scale: 1.04 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 18px rgba(85,211,150,0.25)' }}
            >
              <img src={brandLogo} alt="Vexora" className="h-full w-full object-cover" />
            </motion.div>
            <span className="text-xl tracking-[0.12em] uppercase" style={{
              fontFamily: 'Instrument Serif, ui-serif, serif',
              background: 'linear-gradient(135deg, #55D396, #B6F4D6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(85,211,150,0.3))',
            }}>
              Vexora
            </span>
          </Link>

          {/* Right: balance + menu trigger */}
          <div className="flex items-center gap-2.5">
            <motion.div
              key={displayBalance}
              initial={{ scale: 1.12, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(8,16,12,0.92), rgba(6,12,10,0.9))',
                border: '1px solid rgba(85,211,150,0.22)',
                boxShadow: '0 0 15px rgba(85,211,150,0.08), inset 0 1px 0 rgba(85,211,150,0.12)',
              }}
            >
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>🪙</motion.span>
              <span className="font-bold text-sm tracking-wide" style={{
                background: 'linear-gradient(135deg, #55D396, #B6F4D6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {displayBalance}
              </span>
            </motion.div>

            {/* Hamburger */}
            <motion.button
              onClick={() => setDrawerOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1.5"
              style={{ border: '1px solid rgba(85,211,150,0.22)', background: 'rgba(85,211,150,0.05)' }}
              aria-label="Open menu"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-[18px] h-[1.5px] rounded-full" style={{ background: 'rgba(85,211,150,0.75)' }} />
              ))}
            </motion.button>
          </div>
        </div>

        <div className="h-[1px] w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(85,211,150,0.08) 50%, transparent)' }} />
      </nav>
    </>
  );
};

export default Navbar;