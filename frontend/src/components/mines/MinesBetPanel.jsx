import { motion } from 'framer-motion';

const QuickBtn = ({ label, onClick, disabled }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="px-3 py-2 rounded-xl text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-zinc-400 bg-zinc-700/50 border border-zinc-600/40 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {label}
  </motion.button>
);

const MinesBetPanel = ({
  betAmount, onChange, balance, gameActive,
  starting, cashingOut, revealed, potentialPayout,
  onStart, onCashout,
}) => {
  const half = () => onChange(Math.max(1, parseFloat((betAmount / 2).toFixed(2))));
  const dbl  = () => onChange(Math.min(balance, parseFloat((betAmount * 2).toFixed(2))));
  const max  = () => onChange(balance);

  return (
    <div className="flex flex-col gap-4">
      {/* Bet input */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
            Bet Amount
          </label>
          <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
            Balance: <span className="text-zinc-300 font-semibold">{balance.toLocaleString()}</span>
            <span className="text-amber-400 ml-1">🪙</span>
          </span>
        </div>

        <div className="flex gap-2 items-stretch">
          <div className="flex-1 flex items-center bg-zinc-800/80 border border-zinc-700/50 rounded-2xl focus-within:border-emerald-500/50 focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.1)] transition-all duration-200">
            <span className="pl-4 text-amber-400 text-sm select-none">🪙</span>
            <input
              type="number"
              min={1}
              max={balance}
              step={1}
              value={betAmount}
              disabled={gameActive}
              onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
              className="flex-1 bg-transparent text-white font-mono text-base tabular-nums px-3 py-3.5 focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex gap-1.5 items-center">
            <QuickBtn label="½"   onClick={half} disabled={gameActive} />
            <QuickBtn label="2×"  onClick={dbl}  disabled={gameActive} />
            <QuickBtn label="Max" onClick={max}  disabled={gameActive} />
          </div>
        </div>
      </div>

      {/* CTA button */}
      {!gameActive ? (
        <motion.button
          onClick={onStart}
          disabled={starting}
          whileHover={{ scale: starting ? 1 : 1.015 }}
          whileTap={{ scale: starting ? 1 : 0.975 }}
          animate={
            !starting
              ? { boxShadow: ['0 0 20px rgba(16,185,129,0.25)', '0 0 36px rgba(16,185,129,0.45)', '0 0 20px rgba(16,185,129,0.25)'] }
              : {}
          }
          transition={!starting ? { repeat: Infinity, duration: 2.4, ease: 'easeInOut' } : {}}
          className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-500/40 disabled:cursor-not-allowed text-zinc-900 text-[13px] font-mono font-black uppercase tracking-[0.35em] transition-colors duration-200 focus:outline-none"
        >
          {starting ? (
            <span className="flex items-center justify-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="inline-block w-4 h-4 border-2 border-zinc-900/40 border-t-zinc-900 rounded-full"
              />
              Starting…
            </span>
          ) : (
            '💣 Place Bet & Start'
          )}
        </motion.button>
      ) : (
        <motion.button
          onClick={onCashout}
          disabled={cashingOut || revealed === 0}
          whileHover={{ scale: (cashingOut || revealed === 0) ? 1 : 1.015 }}
          whileTap={{ scale: (cashingOut || revealed === 0) ? 1 : 0.975 }}
          animate={
            revealed > 0 && !cashingOut
              ? { boxShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 40px rgba(16,185,129,0.55)', '0 0 20px rgba(16,185,129,0.3)'] }
              : {}
          }
          transition={revealed > 0 && !cashingOut ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : {}}
          className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-zinc-700/50 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-900 text-[13px] font-mono font-black uppercase tracking-[0.35em] transition-colors duration-200 focus:outline-none"
        >
          {cashingOut ? (
            <span className="flex items-center justify-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="inline-block w-4 h-4 border-2 border-zinc-900/40 border-t-zinc-900 rounded-full"
              />
              Cashing out…
            </span>
          ) : revealed === 0 ? (
            'Reveal a tile first'
          ) : (
            `💰 Cash Out ${potentialPayout.toFixed(2)} 🪙`
          )}
        </motion.button>
      )}
    </div>
  );
};

export default MinesBetPanel;