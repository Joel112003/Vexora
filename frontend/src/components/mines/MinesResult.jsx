import { motion, AnimatePresence } from 'framer-motion';

const COINS = ['🪙', '💰', '✨', '🪙', '💰', '🪙', '✨', '💰'];

const FloatingCoin = ({ emoji, delay, x }) => (
  <motion.span
    initial={{ opacity: 0, y: 0, scale: 0.5 }}
    animate={{ opacity: [0, 1, 1, 0], y: -150, scale: [0.5, 1.2, 1, 0.7] }}
    transition={{ delay, duration: 1.5, ease: 'easeOut' }}
    className="absolute bottom-4 text-2xl pointer-events-none select-none"
    style={{ left: `calc(50% + ${x}px)` }}
  >
    {emoji}
  </motion.span>
);

// ── Win result ───────────────────────────────────────────────────────────────
const WinResult = ({ payout, multiplier }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88, y: -12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.92, y: -8 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent p-7 text-center"
  >
    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(16,185,129,0.07)] pointer-events-none" />

    {COINS.map((emoji, i) => (
      <FloatingCoin
        key={i}
        emoji={emoji}
        delay={i * 0.09}
        x={(i - COINS.length / 2) * 38}
      />
    ))}

    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="text-[10px] font-mono uppercase tracking-[0.55em] text-emerald-400 mb-3"
    >
      💰 Cashed out!
    </motion.p>

    <motion.p
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.12 }}
      className="text-5xl font-mono font-black text-emerald-400 tabular-nums mb-2"
    >
      +{payout.toFixed(2)} 🪙
    </motion.p>

    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.22 }}
      className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold tracking-[0.2em] uppercase"
    >
      {multiplier.toFixed(4)}× multiplier
    </motion.span>
  </motion.div>
);

// ── Loss result ──────────────────────────────────────────────────────────────
const shakeVariants = {
  initial: { x: 0 },
  shake: {
    x: [0, -14, 14, -10, 10, -6, 6, -3, 3, 0],
    transition: { duration: 0.55, ease: 'easeInOut' },
  },
};

const LossResult = () => (
  <motion.div
    variants={shakeVariants}
    initial="initial"
    animate="shake"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-red-500/25 bg-gradient-to-b from-red-500/8 to-transparent p-7 text-center"
    >
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="text-4xl mb-3"
      >
        💥
      </motion.p>
      <p className="text-[10px] font-mono uppercase tracking-[0.55em] text-red-400 mb-2">
        Mine hit!
      </p>
      <p className="text-base font-mono text-zinc-400">
        Better luck next time
      </p>
    </motion.div>
  </motion.div>
);

// ── Exported component ───────────────────────────────────────────────────────
const MinesResult = ({ gameOver, payout, multiplier, onPlayAgain }) => (
  <AnimatePresence mode="wait">
    {gameOver === 'won' && (
      <motion.div key="win" layout>
        <WinResult payout={payout} multiplier={multiplier} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-center"
        >
          <button
            onClick={onPlayAgain}
            className="text-xs font-mono text-emerald-400/70 hover:text-emerald-400 underline underline-offset-4 transition-colors"
          >
            Play again →
          </button>
        </motion.div>
      </motion.div>
    )}
    {gameOver === 'lost' && (
      <motion.div key="loss" layout>
        <LossResult />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-3 text-center"
        >
          <button
            onClick={onPlayAgain}
            className="text-xs font-mono text-red-400/70 hover:text-red-400 underline underline-offset-4 transition-colors"
          >
            Try again →
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MinesResult;