import { useState }     from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useDice }      from '../hooks/useGame';
import BetInput         from '../common/ui/BetInput';
import Button           from '../common/ui/Button';

const ease = [0.16, 1, 0.3, 1];

const DicePage = () => {
  const { user }   = useAuthStore();
  const [betAmount, setBetAmount] = useState(10);
  const [target,    setTarget]    = useState(50);
  const [direction, setDirection] = useState('over');
  const [result,    setResult]    = useState(null);

  const { mutate: placeBet, isPending } = useDice();

  // chance and multiplier preview — updates live as user moves the slider
  const chance     = direction === 'over' ? 100 - target : target - 1;
  const multiplier = parseFloat((95 / chance).toFixed(4));
  const payout     = parseFloat((betAmount * multiplier).toFixed(2));

  const handleBet = () => {
    placeBet(
      { betAmount, target, direction },
      {
        onSuccess: (res) => setResult(res.data.data),
        onError:   (err) => setResult({ error: err.response?.data?.message }),
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="max-w-3xl mx-auto flex flex-col gap-8"
    >
      <div className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 via-black/60 to-black px-7 py-8">
        <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-emerald-500/20 blur-[120px]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-300/80">
          — Dice table
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-white mt-4">Dice</h1>
        <p className="text-sm lg:text-base text-zinc-300 mt-3 max-w-2xl">
          Pick a target and direction. Roll wins if the number goes your way.
        </p>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-3xl p-7 flex flex-col gap-6">

        {/* Direction toggle */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-mono uppercase tracking-[0.3em] text-emerald-300/70">Direction</label>
          <div className="grid grid-cols-2 gap-3">
            {['over', 'under'].map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`
                  py-3.5 rounded-xl font-semibold text-sm capitalize transition-all
                  ${direction === d
                    ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(85,211,150,0.35)]'
                    : 'bg-brand-bg border border-brand-border text-zinc-400 hover:text-white'
                  }
                `}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Target slider */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-mono uppercase tracking-[0.3em] text-emerald-300/70">
              Target — roll {direction} {target}
            </label>
            <span className="text-sm text-white font-semibold">{target}</span>
          </div>
          <input
            type="range"
            min={2}
            max={98}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isPending}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>2</span>
            <span>98</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Win chance', value: `${chance}%` },
            { label: 'Multiplier', value: `${multiplier}x` },
            { label: 'Payout',     value: `🪙 ${payout}`  },
          ].map(({ label, value }) => (
            <div key={label} className="bg-brand-bg rounded-xl p-4 text-center border border-white/5">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">{label}</p>
              <p className="text-white font-semibold text-lg">{value}</p>
            </div>
          ))}
        </div>

        <BetInput
          value={betAmount}
          onChange={setBetAmount}
          disabled={isPending}
          balance={user?.balance ?? 0}
        />

        <Button onClick={handleBet} loading={isPending} fullWidth height={46} fontSize={12}>
          <span className="uppercase tracking-[0.25em]">Roll dice</span>
        </Button>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.result?.roll ?? result.error}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1   }}
            exit={{    opacity: 0, scale: 0.95 }}
            className={`
              rounded-3xl p-7 text-center border
              ${result.error
                ? 'bg-red-500/10 border-red-500/30'
                : result.result?.win
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }
            `}
          >
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <>
                <div className="text-5xl font-bold text-white mb-3">
                  {result.result.roll}
                </div>
                <p className={`text-lg font-semibold mb-1 ${
                  result.result.win ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {result.result.win ? `+${result.result.payout} coins` : 'Better luck next time'}
                </p>
                <p className="text-gray-400 text-sm">
                  Rolled {result.result.roll} — needed {direction} {target}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Balance: 🪙 {result.balance.toLocaleString()}
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DicePage;