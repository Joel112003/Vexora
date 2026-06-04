import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ label, value, accent }) => (
  <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl px-4 py-3 flex flex-col gap-1">
    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600">{label}</p>
    <motion.p
      key={String(value)}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`text-base font-mono font-bold tabular-nums ${accent ?? 'text-white'}`}
    >
      {value}
    </motion.p>
  </div>
);

const MinesStatsBar = ({ gameActive, multiplier, potentialPayout, revealed, safeCount, mineCount }) => (
  <AnimatePresence>
    {gameActive && (
      <motion.div
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-2 pt-1">
          <StatCard label="Multiplier"   value={`${multiplier.toFixed(4)}×`} accent="text-sky-400" />
          <StatCard label="Cash out"     value={`${potentialPayout.toFixed(2)} 🪙`} accent="text-emerald-400" />
          <StatCard label="Revealed"     value={`${revealed} / ${safeCount}`} accent="text-zinc-300" />
          <StatCard label="Mines left"   value={mineCount} accent="text-red-400" />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MinesStatsBar;