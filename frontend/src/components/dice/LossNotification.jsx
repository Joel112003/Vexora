import { motion } from 'framer-motion';

const shakeVariants = {
  initial: { x: 0 },
  shake: {
    x: [0, -12, 12, -10, 10, -6, 6, -3, 3, 0],
    transition: { duration: 0.55, ease: 'easeInOut' },
  },
};

const LossNotification = ({ result, direction, target }) => {
  if (!result || result.win) return null;

  return (
    <motion.div
      key={result.roll}
      variants={shakeVariants}
      initial="initial"
      animate="shake"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-red-500/25 bg-red-500/6 bg-gradient-to-b from-red-500/8 to-transparent p-8 text-center"
      >
        {/* Roll number */}
        <div className="text-7xl font-mono font-black text-zinc-300 tabular-nums mb-3">
          {result.roll}
        </div>

        <p className="text-[11px] font-mono uppercase tracking-[0.5em] text-red-400 mb-2">
          No luck
        </p>

        <p className="text-lg font-mono text-zinc-400 tabular-nums">
          Rolled {result.roll} — needed{' '}
          <span className="text-zinc-300">{direction} {target}</span>
        </p>

        <p className="text-sm font-mono text-zinc-600 mt-2">
          Better luck next time
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LossNotification;