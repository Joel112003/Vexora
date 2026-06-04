import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useCoinflip } from '../hooks/useGame';
import BetInput from '../common/ui/BetInput';
import Button from '../common/ui/Button';

const CoinflipPage = () => {
  const { user } = useAuthStore();
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState('heads');
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);

  const { mutate: placeBet, isPending } = useCoinflip();

  const handleBet = () => {
    setFlipping(true);
    setResult(null);

    placeBet(
      { betAmount, choice },
      {
        onSuccess: (res) => {
          setTimeout(() => {
            setFlipping(false);
            setResult(res.data.data);
          }, 800);
        },
        onError: (err) => {
          setFlipping(false);
          setResult({ error: err.response?.data?.message || 'Coinflip failed' });
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Coinflip</h1>
        <p className="text-gray-400 text-sm">
          Heads or tails. 50/50 chance. 1.96x payout.
        </p>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex justify-center py-4">
          <motion.div
            animate={flipping ? {
              rotateY: [0, 180, 360, 540, 720],
              scale: [1, 1.1, 1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-yellow-500 flex items-center justify-center text-4xl shadow-lg"
          >
            {result && !result.error
              ? (result.result.result === 'heads' ? '👑' : '🌕')
              : (choice === 'heads' ? '👑' : '🌕')}
          </motion.div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-400">Your pick</label>
          <div className="flex gap-3">
            {[
              { value: 'heads', label: '👑 Heads' },
              { value: 'tails', label: '🌕 Tails' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setChoice(value)}
                disabled={isPending || flipping}
                className={`
                  flex-1 py-3 rounded-lg font-medium text-sm transition-all
                  ${choice === value
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-bg border border-brand-border text-gray-400 hover:text-white'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-brand-bg rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Payout on win</p>
          <p className="text-white font-semibold">
            🪙 {parseFloat((betAmount * 1.96).toFixed(2))} (1.96x)
          </p>
        </div>

        <BetInput
          value={betAmount}
          onChange={setBetAmount}
          disabled={isPending || flipping}
          balance={user?.balance ?? 0}
        />

        <Button
          onClick={handleBet}
          loading={isPending || flipping}
          fullWidth
        >
          Flip coin
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {result && !flipping && (
          <motion.div
            key={result.result?.result ?? result.error}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              rounded-2xl p-6 text-center border
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
                <div className="text-5xl mb-2">
                  {result.result.result === 'heads' ? '👑' : '🌕'}
                </div>
                <p className="text-lg font-semibold capitalize text-white mb-1">
                  {result.result.result}
                </p>
                <p className={`font-semibold mb-1 ${
                  result.result.win ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {result.result.win
                    ? `+${result.result.payout} coins`
                    : 'Better luck next time'
                  }
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

export default CoinflipPage;