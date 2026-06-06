import { useState }              from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }            from '../store/authStore';
import { useBalance }              from '../hooks/useBalance';
import { useDice }                 from '../hooks/useGame';
import DirectionToggle             from '../components/dice/DirectionToggle';
import DiceSlider                  from '../components/dice/DiceSlider';
import BetAmount                   from '../components/dice/BetAmount';
import StatsBar                    from '../components/dice/StatsBar';

const ease = [0.16, 1, 0.3, 1];

/* ── Error banner ── */
const ErrorBanner = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    className="px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/8 text-red-300 text-sm font-mono text-center"
  >
    {message}
  </motion.div>
);

const DicePage = () => {
  /* ── Real data ── */
  const { user }                        = useAuthStore();
  const { data: liveBalance }           = useBalance();
  const { mutate: rollDice, isPending } = useDice();

  const balance = liveBalance ?? user?.balance ?? 0;

  /* ── Local UI state ── */
  const [betAmount,  setBetAmount]  = useState(10);
  const [target,     setTarget]     = useState(50);
  const [direction,  setDirection]  = useState('over');
  const [error,      setError]      = useState(null);
  // Tracks the most recent roll so DiceSlider can show the result dot + win effects
  const [lastResult, setLastResult] = useState({ roll: null, win: null });

  /* ── Computed stats (shown before roll) ── */
  const winChance  = direction === 'over' ? 100 - target : target - 1;
  const multiplier = parseFloat((95 / Math.max(winChance, 0.1)).toFixed(4));
  const payout     = parseFloat((betAmount * multiplier).toFixed(2));

  /* ── Roll handler — real API ── */
  const onRoll = () => {
    if (isPending) return;
    setError(null);

    rollDice(
      { betAmount, target, direction },
      {
        onSuccess: (res) => {
          const data = res.data.data;
          // API returns: { roll, win, multiplier, payout, balance }
          setLastResult({ roll: data.roll, win: data.win });
        },
        onError: (err) => {
          const msg = err?.response?.data?.message ?? 'Roll failed. Please try again.';
          setError(msg);
        },
      }
    );
  };

  return (
    <>
      {/* ── Fixed ambient background ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050c07]" />
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full bg-emerald-600/14 blur-[130px]" />
        <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-700/10 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(52,211,153,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52,211,153,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      {/* ── Centered single-page layout ── */}
      <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="w-full max-w-md flex flex-col gap-4"
        >

          {/* ── Card header ── */}
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[8px] font-mono uppercase tracking-[0.7em] text-emerald-500/50 mb-1">
                Vexora
              </p>
              <h1
                className="text-3xl font-black text-white leading-none"
                style={{ letterSpacing: '-0.03em' }}
              >
                🎲 Dice
              </h1>
            </div>

            {/* Live balance */}
            <div className="text-right">
              <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-zinc-600 mb-0.5">Balance</p>
              <motion.p
                key={balance}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold text-white tabular-nums"
                style={{ letterSpacing: '-0.02em' }}
              >
                {Number(balance).toLocaleString()}
                <span className="text-amber-400 ml-1">🪙</span>
              </motion.p>
            </div>
          </div>

          {/* ── Main card ── */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 0 0 1px rgba(52,211,153,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {/* Inner top glow */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.15) 50%, transparent)' }}
            />

            <div className="p-6 flex flex-col gap-6">

              <DirectionToggle
                direction={direction}
                onChange={setDirection}
                disabled={isPending}
              />

              <DiceSlider
                target={target}
                onChange={setTarget}
                direction={direction}
                disabled={isPending}
                win={lastResult.win}
                resultRoll={lastResult.roll}
              />

              <StatsBar
                winChance={winChance}
                multiplier={multiplier}
                payout={payout}
              />

              <div
                className="h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent)' }}
              />

              <BetAmount
                value={betAmount}
                onChange={setBetAmount}
                balance={balance}
                disabled={isPending}
              />

              {/* Error */}
              <AnimatePresence>
                {error && <ErrorBanner key="err" message={error} />}
              </AnimatePresence>

              {/* Roll button */}
              <div className="relative">
                {!isPending && (
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl bg-emerald-500/15 blur-lg pointer-events-none"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  />
                )}
                <motion.button
                  onClick={onRoll}
                  disabled={isPending}
                  whileHover={{ scale: isPending ? 1 : 1.015 }}
                  whileTap={{ scale: isPending ? 1 : 0.975 }}
                  className="relative w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-500/25 disabled:cursor-not-allowed text-zinc-900 text-sm font-black uppercase transition-colors duration-150 focus:outline-none"
                  style={{ letterSpacing: '0.14em' }}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                        className="inline-block w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full"
                      />
                      Rolling…
                    </span>
                  ) : (
                    'Roll Dice'
                  )}
                </motion.button>
              </div>

            </div>
          </div>

          {/* ── Footer ── */}
          <p className="text-center text-[9px] font-mono text-zinc-800 uppercase tracking-[0.35em]">
            95% RTP · Provably Fair · Vexora
          </p>

        </motion.div>
      </div>
    </>
  );
};

export default DicePage;