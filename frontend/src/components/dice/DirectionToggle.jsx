import { motion } from 'framer-motion';

const DirectionToggle = ({ direction, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
        Direction
      </label>
      <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-800/80 border border-zinc-700/40 rounded-2xl">
        {['over', 'under'].map((d) => (
          <button
            key={d}
            onClick={() => !disabled && onChange(d)}
            disabled={disabled}
            className="relative py-3 rounded-xl text-sm font-mono font-semibold uppercase tracking-[0.2em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {direction === d && (
              <motion.div
                layoutId="direction-pill"
                className="absolute inset-0 rounded-xl bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.4)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-200 ${direction === d ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-200'}`}>
              {d === 'over' ? '↑ Over' : '↓ Under'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DirectionToggle;