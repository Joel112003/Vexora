import { motion } from 'framer-motion';

const QuickBtn = ({ label, onClick, disabled }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="px-3 py-2 rounded-xl text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-400 bg-zinc-700/50 border border-zinc-600/40 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {label}
  </motion.button>
);

const BetAmount = ({ value, onChange, balance, disabled }) => {
  const half  = () => onChange(Math.max(1, parseFloat((value / 2).toFixed(2))));
  const dbl   = () => onChange(Math.min(balance, parseFloat((value * 2).toFixed(2))));
  const max   = () => onChange(balance);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
          Bet Amount
        </label>
        <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
          Balance:{' '}
          <span className="text-zinc-300">{balance.toLocaleString()}</span>
          <span className="text-amber-400 ml-1">🪙</span>
        </span>
      </div>

      <div className="flex gap-2 items-stretch">
        {/* Input */}
        <div className="flex-1 relative flex items-center bg-zinc-800/80 border border-zinc-700/50 rounded-2xl focus-within:border-emerald-500/50 focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.12)] transition-all duration-200">
          <span className="pl-4 text-amber-400 text-sm select-none">🪙</span>
          <input
            type="number"
            min={1}
            max={balance}
            step={1}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
            className="flex-1 bg-transparent text-white font-mono text-base tabular-nums px-3 py-3.5 focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Quick buttons */}
        <div className="flex gap-1.5 items-center">
          <QuickBtn label="½"   onClick={half}  disabled={disabled} />
          <QuickBtn label="2×"  onClick={dbl}   disabled={disabled} />
          <QuickBtn label="Max" onClick={max}   disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default BetAmount;