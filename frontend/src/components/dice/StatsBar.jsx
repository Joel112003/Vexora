import { motion } from 'framer-motion';

const StatCard = ({ label, value, accent }) => (
  <div className="flex-1 bg-zinc-800/60 border border-zinc-700/50 rounded-2xl px-5 py-4 flex flex-col gap-1.5 min-w-0">
    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 truncate">{label}</p>
    <motion.p
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`text-xl font-mono font-semibold tabular-nums truncate ${accent ?? 'text-white'}`}
    >
      {value}
    </motion.p>
  </div>
);

const StatsBar = ({ winChance, multiplier, payout }) => {
  return (
    <div className="flex gap-3">
      <StatCard label="Win Chance" value={`${winChance.toFixed(1)}%`} accent="text-emerald-400" />
      <StatCard label="Multiplier" value={`${multiplier.toFixed(4)}×`} accent="text-sky-400" />
      <StatCard label="Payout" value={`${payout.toFixed(2)}`} accent="text-amber-400" />
    </div>
  );
};

export default StatsBar;