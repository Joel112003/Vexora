import { motion, AnimatePresence  } from 'framer-motion';

const QuickBtn = ({ label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-3 py-2 rounded-xl text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-zinc-400 bg-zinc-700/50 border border-zinc-600/40 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {label}
  </button>
);

const Spinner = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
    className="inline-block w-4 h-4 border-2 border-zinc-900/40 border-t-zinc-900 rounded-full"
  />
);

const CrashBetPanel = ({
  betAmount, onBetChange, autoCashout, onAutoCashoutChange,
  balance, canBet, canCashout, phase, myBet, cashedOut, didLose,
  multiplier, placingBet, cashingOut, message,
  onPlaceBet, onCashout,
}) => {
  const half = () => onBetChange(Math.max(1, parseFloat((betAmount / 2).toFixed(2))));
  const dbl  = () => onBetChange(Math.min(balance, parseFloat((betAmount * 2).toFixed(2))));
  const max  = () => onBetChange(balance);

  const potentialPayout = myBet ? parseFloat((myBet.betAmount * multiplier).toFixed(2)) : 0;

  return (
    <div className="flex flex-col gap-5">

      {/* Bet amount */}
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
              step={1}
              value={betAmount}
              disabled={!canBet}
              onChange={(e) => onBetChange(Math.max(1, Number(e.target.value)))}
              className="flex-1 bg-transparent text-white font-mono text-base tabular-nums px-3 py-3.5 focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex gap-1.5 items-center">
            <QuickBtn label="½"   onClick={half} disabled={!canBet} />
            <QuickBtn label="2×"  onClick={dbl}  disabled={!canBet} />
            <QuickBtn label="Max" onClick={max}  disabled={!canBet} />
          </div>
        </div>
      </div>

      {/* Auto cashout */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
            Auto Cashout
          </label>
          <span className="text-[10px] font-mono text-zinc-600">Optional</span>
        </div>
        <div className="flex items-center bg-zinc-800/80 border border-zinc-700/50 rounded-2xl focus-within:border-sky-500/50 focus-within:shadow-[0_0_0_2px_rgba(56,189,248,0.1)] transition-all duration-200">
          <span className="pl-4 text-sky-400 text-xs font-mono select-none">AT</span>
          <input
            type="number"
            min={1.01}
            step={0.1}
            value={autoCashout}
            disabled={!canBet}
            onChange={(e) => onAutoCashoutChange(e.target.value)}
            placeholder="e.g. 2.00"
            className="flex-1 bg-transparent text-white font-mono text-base tabular-nums px-3 py-3.5 focus:outline-none disabled:opacity-50 placeholder:text-zinc-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="pr-4 text-zinc-500 font-mono text-sm">×</span>
        </div>
        <p className="text-[10px] font-mono text-zinc-600">
          Auto-exits when multiplier reaches this value
        </p>
      </div>

      <div className="h-px bg-zinc-700/40" />

      {/* CTA button */}
      <AnimatePresence mode="wait">
        {canBet ? (
          <motion.button
            key="place"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={onPlaceBet}
            disabled={placingBet}
            whileHover={{ scale: placingBet ? 1 : 1.015 }}
            whileTap={{ scale: placingBet ? 1 : 0.975 }}
            className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-500/40 disabled:cursor-not-allowed text-zinc-900 text-[13px] font-mono font-black uppercase tracking-[0.35em] transition-colors duration-200 focus:outline-none shadow-[0_0_24px_rgba(16,185,129,0.35)]"
          >
            {placingBet
              ? <span className="flex items-center justify-center gap-3"><Spinner />Placing…</span>
              : '🚀 Place Bet'}
          </motion.button>

        ) : canCashout ? (
          <motion.button
            key="cashout"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={onCashout}
            disabled={cashingOut}
            whileHover={{ scale: cashingOut ? 1 : 1.015 }}
            whileTap={{ scale: cashingOut ? 1 : 0.975 }}
            className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-500/40 disabled:cursor-not-allowed text-zinc-900 text-[13px] font-mono font-black uppercase tracking-[0.3em] transition-colors duration-200 focus:outline-none shadow-[0_0_32px_rgba(16,185,129,0.5)]"
          >
            {cashingOut
              ? <span className="flex items-center justify-center gap-3"><Spinner />Cashing Out…</span>
              : <span>💰 Cash Out {multiplier.toFixed(2)}× — 🪙 {potentialPayout}</span>}
          </motion.button>

        ) : (
          <motion.div
            key="waiting-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-5 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 text-zinc-500 text-[12px] font-mono font-bold uppercase tracking-[0.3em] text-center"
          >
            {phase === 'waiting' && myBet   ? '✅ Bet placed — waiting for round' :
             phase === 'crashed'             ? '⏳ Waiting for next round…'       :
             phase === 'running' && !myBet   ? '🔒 Round in progress'             :
             '⏳ Waiting…'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* My bet confirmation during waiting */}
      <AnimatePresence>
        {myBet && phase === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl px-4 py-3 text-center">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 mb-1">Your bet this round</p>
              <p className="text-white font-mono font-semibold tabular-nums">
                🪙 {myBet.betAmount}
                {myBet.autoCashout && (
                  <span className="text-sky-400 text-xs ml-2 font-normal">
                    · auto at {myBet.autoCashout}×
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loss state */}
      <AnimatePresence>
        {didLose && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/25 rounded-2xl px-4 py-3 text-center"
          >
            <p className="text-red-400 font-mono text-sm">
              💥 Lost 🪙 {myBet?.betAmount} — better luck next time
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General message */}
      <AnimatePresence>
        {message && !didLose && !cashedOut && (
          <motion.p
            key={message}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-mono text-zinc-500 text-center"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrashBetPanel;