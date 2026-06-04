import { motion } from 'framer-motion';

const MINE_COUNTS = [1, 3, 5, 10, 15, 20, 24];

const MineCountPicker = ({ mineCount, onChange, disabled }) => {
  const safeCount = 25 - mineCount;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
          Mines
        </label>
        <span className="text-[11px] font-mono text-zinc-500">
          <span className="text-red-400 font-semibold">{mineCount}</span>
          {' '}mines ·{' '}
          <span className="text-emerald-400 font-semibold">{safeCount}</span>
          {' '}safe
        </span>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {MINE_COUNTS.map((c) => (
          <motion.button
            key={c}
            onClick={() => !disabled && onChange(c)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.06 } : {}}
            whileTap={!disabled ? { scale: 0.94 } : {}}
            className={[
              'px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all duration-150',
              'focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
              mineCount === c
                ? 'bg-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.4)]'
                : 'bg-zinc-800/70 border border-zinc-700/50 text-zinc-400 hover:border-red-500/40 hover:text-red-400',
            ].join(' ')}
          >
            {c}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MineCountPicker;