import { motion, AnimatePresence } from 'framer-motion';

const getMultiplierColor = (mult, phase) => {
  if (phase === 'crashed') return '#f87171';
  if (mult >= 10) return '#c084fc';
  if (mult >= 5)  return '#fbbf24';
  if (mult >= 2)  return '#34d399';
  return '#ffffff';
};

const getMultiplierGlow = (mult, phase) => {
  if (phase === 'crashed') return '0 0 60px rgba(239,68,68,0.5)';
  if (mult >= 10) return '0 0 80px rgba(168,85,247,0.5)';
  if (mult >= 5)  return '0 0 60px rgba(234,179,8,0.4)';
  if (mult >= 2)  return '0 0 50px rgba(16,185,129,0.4)';
  return '0 0 30px rgba(255,255,255,0.1)';
};

const CrashMultiplier = ({ phase, multiplier, crashPoint, countdown, myBet, cashedOut }) => {
  const color = getMultiplierColor(multiplier, phase);
  const glow  = getMultiplierGlow(multiplier, phase);

  return (
    <div className="flex flex-col items-center justify-center gap-3 pointer-events-none select-none">
      <AnimatePresence mode="wait">

        {phase === 'waiting' ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="text-5xl"
            >
              ✈️
            </motion.div>
            <p className="text-zinc-500 font-mono text-sm tracking-[0.2em] uppercase">
              Next round in{' '}
              <motion.span
                key={countdown}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-amber-400 font-bold"
              >
                {countdown}s
              </motion.span>
            </p>
          </motion.div>

        ) : phase === 'crashed' ? (
          <motion.div
            key="crashed"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-1"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-4xl mb-1"
            >
              💥
            </motion.div>
            <motion.p
              className="font-mono font-black tabular-nums"
              style={{ fontSize: 'clamp(52px, 10vw, 88px)', color, textShadow: glow, lineHeight: 1 }}
            >
              {Number(crashPoint ?? multiplier).toFixed(2)}×
            </motion.p>
            <p className="text-red-400 font-mono text-sm tracking-[0.25em] uppercase mt-1">
              Crashed
            </p>
          </motion.div>

        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.p
              key={Math.floor(multiplier * 10)}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 0.08 }}
              className="font-mono font-black tabular-nums transition-colors duration-300"
              style={{ fontSize: 'clamp(52px, 10vw, 96px)', color, textShadow: glow, lineHeight: 1 }}
            >
              {multiplier.toFixed(2)}×
            </motion.p>

            {/* Live potential payout */}
            {myBet && !cashedOut && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-zinc-800/70 border border-zinc-700/40 rounded-xl px-4 py-2"
              >
                <span className="text-zinc-500 font-mono text-xs tracking-[0.2em] uppercase">Potential</span>
                <span className="text-emerald-400 font-mono font-bold text-sm tabular-nums">
                  🪙 {(myBet.betAmount * multiplier).toFixed(2)}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cashout success banner */}
      <AnimatePresence>
        {cashedOut && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="bg-emerald-500/15 border border-emerald-500/35 rounded-2xl px-6 py-3 text-center"
          >
            <p className="text-emerald-400 font-mono font-bold text-sm">
              ✅ Cashed out at {cashedOut.multiplier}× — +{cashedOut.payout} 🪙
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrashMultiplier;