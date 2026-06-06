import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useInitAuth } from '../hooks/useInitAuth';

/* ── Animated dice SVG ── */
const DiceIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="30" height="30" rx="6" stroke="#55D396" strokeWidth="1.5" />
    <circle cx="11" cy="11" r="2.5" fill="#55D396" />
    <circle cx="25" cy="11" r="2.5" fill="#55D396" />
    <circle cx="11" cy="25" r="2.5" fill="#55D396" />
    <circle cx="25" cy="25" r="2.5" fill="#55D396" />
    <circle cx="18" cy="18" r="2.5" fill="rgba(85,211,150,0.5)" />
  </svg>
);

/* ── Expanding concentric ring ── */
const Ring = ({ delay, size }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      border: '1px solid rgba(85,211,150,0.08)',
    }}
    animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.04, 1] }}
    transition={{ repeat: Infinity, duration: 3, delay, ease: 'easeInOut' }}
  />
);

/* ── Three bouncing dots ── */
const Dots = () => (
  <div className="flex items-center gap-1.5 mt-4">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1 h-1 rounded-full"
        style={{ background: 'rgba(85,211,150,0.4)' }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1], background: ['rgba(85,211,150,0.35)', 'rgba(85,211,150,0.9)', 'rgba(85,211,150,0.35)'] }}
        transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

/* ── Scanning loader bar ── */
const ScanBar = () => (
  <div
    className="relative overflow-hidden rounded-full"
    style={{ width: 120, height: 1, background: 'rgba(85,211,150,0.12)' }}
  >
    <motion.div
      className="absolute top-0 h-full rounded-full"
      style={{
        width: '40%',
        background: 'linear-gradient(90deg, transparent, #55D396, transparent)',
      }}
      animate={{ left: ['-40%', '100%'] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
    />
  </div>
);

/* ── Main BootSplash ── */
const BootSplash = () => {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'ready' | 'exit'

  // After 600ms simulate "ready" state so the exit feels intentional
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('ready'), 600);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: '#040a06' }}
    >
      {/* Rings */}
      <Ring size={160} delay={0} />
      <Ring size={260} delay={0.4} />
      <Ring size={380} delay={0.8} />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo container */}
        <motion.div
          className="relative mb-7 flex items-center justify-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute rounded-2xl"
            style={{
              inset: -12,
              background: 'rgba(85,211,150,0.07)',
              border: '1px solid rgba(85,211,150,0.1)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          {/* Icon box */}
          <div
            className="relative w-[68px] h-[68px] rounded-[18px] flex items-center justify-center"
            style={{
              background: 'rgba(85,211,150,0.1)',
              border: '1px solid rgba(85,211,150,0.28)',
            }}
          >
            <DiceIcon />
          </div>
        </motion.div>

        {/* Wordmark */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-2 uppercase tracking-[0.18em]"
          style={{
            fontFamily: 'Instrument Serif, ui-serif, serif',
            fontSize: 28,
            background: 'linear-gradient(135deg, #55D396 0%, #B6F4D6 50%, #55D396 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Vexora
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 text-[10px] uppercase tracking-[0.38em]"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.22)' }}
        >
          {phase === 'loading' ? 'Initialising session' : 'Almost there'}
        </motion.p>

        {/* Scan bar */}
        <ScanBar />

        {/* Dots */}
        <Dots />
      </div>
    </div>
  );
};

/* ── Auth gate with animated exit ── */
const AuthGate = ({ children }) => {
  const { isHydrating } = useAuthStore();
  useInitAuth();

  return (
    <>
      <AnimatePresence>
        {isHydrating && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50"
          >
            <BootSplash />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHydrating ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default AuthGate;