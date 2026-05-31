import { motion } from 'framer-motion';

const COINS = ['🪙', '💰', '🪙', '✨', '🪙', '💰', '✨', '🪙'];

const FloatingCoin = ({ emoji, delay, x }) => (
  <motion.span
    initial={{ opacity: 0, y: 0, x, scale: 0.5 }}
    animate={{ opacity: [0, 1, 1, 0], y: -160, scale: [0.5, 1.2, 1, 0.8] }}
    transition={{ delay, duration: 1.6, ease: 'easeOut' }}
    className="absolute bottom-6 text-2xl pointer-events-none select-none"
    style={{ left: `calc(50% + ${x}px)` }}
  >
    {emoji}
  </motion.span>
);

const WinNotification = ({ result }) => {
  if (!result?.win) return null;

  return (
    <motion.div
      key={result.roll}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-emerald-500/8 bg-gradient-to-b from-emerald-500/10 to-transparent p-8 text-center"
    >
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(16,185,129,0.08)] pointer-events-none" />

      {/* Floating coins */}
      {COINS.map((emoji, i) => (
        <FloatingCoin
          key={i}
          emoji={emoji}
          delay={i * 0.09}
          x={(i - COINS.length / 2) * 38}
        />
      ))}

      {/* Roll number */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.05 }}
        className="text-7xl font-mono font-black text-white tabular-nums mb-3 drop-shadow-lg"
      >
        {result.roll}
      </motion.div>

      {/* WIN label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[11px] font-mono uppercase tracking-[0.5em] text-emerald-400 mb-2"
      >
        You win!
      </motion.p>

      {/* Payout */}
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="text-3xl font-mono font-bold text-emerald-400 tabular-nums mb-1"
      >
        +{result.payout?.toFixed(2)} 🪙
      </motion.p>

      {/* Multiplier badge */}
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.3 }}
        className="inline-block mt-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold tracking-[0.2em] uppercase"
      >
        {result.multiplier?.toFixed(4)}× multiplier
      </motion.span>
    </motion.div>
  );
};

export default WinNotification;