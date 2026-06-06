import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useCoinflip } from '../hooks/useGame';
import { useBalance } from '../hooks/useBalance';
import BetInput from '../common/ui/BetInput';
import Button from '../common/ui/Button';
import CoinDisplay   from '../components/coinflip/CoinDisplay';
import ChoicePicker  from '../components/coinflip/ChoicePicker';
import ResultBanner  from '../components/coinflip/ResultBanner';
import FlipHistory   from '../components/coinflip/FlipHistory';

const ease = [0.16, 1, 0.3, 1];

const Ring = ({ delay, size }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ width: size, height: size, border: '1px solid rgba(85,211,150,0.06)' }}
    animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.04, 1] }}
    transition={{ repeat: Infinity, duration: 3, delay, ease: 'easeInOut' }}
  />
);

const CoinflipPage = () => {
  const { user }          = useAuthStore();
  const { data: balance } = useBalance();
  const [betAmount, setBetAmount]     = useState(100);
  const [choice, setChoice]           = useState('heads');
  const [activeSide, setActiveSide]   = useState('heads');
  const [isFlipping, setIsFlipping]   = useState(false);
  const [showWinBurst, setShowBurst]  = useState(false);
  const [result, setResult]           = useState(null);
  const [flipHistory, setFlipHistory] = useState([]);
  const burstTimer = useRef(null);

  const { mutate: placeBet, isPending } = useCoinflip();

  const payout = parseFloat((betAmount * 1.96).toFixed(2));

  const handleFlip = () => {
    setIsFlipping(true);
    setResult(null);
    if (burstTimer.current) clearTimeout(burstTimer.current);
    setShowBurst(false);

    placeBet(
      { betAmount, choice },
      {
        onSuccess: (res) => {
          const data = res.data.data;
          // API shape: data.result = { result: 'heads'|'tails', choice, win, multiplier, payout }
          const outcome = (data.result && typeof data.result === 'object') ? data.result : data;
          const coinSide  = outcome.result   ?? 'heads';   // 'heads' | 'tails' string
          const didWin    = outcome.win      ?? false;
          const finalPay  = outcome.payout   ?? payout;
          const newBal    = data.newBalance  ?? data.balance ?? undefined;

          setTimeout(() => {
            setIsFlipping(false);
            setActiveSide(coinSide);

            if (didWin) {
              setShowBurst(true);
              burstTimer.current = setTimeout(() => setShowBurst(false), 1200);
            }

            const normalized = {
              result:     coinSide,
              win:        didWin,
              multiplier: outcome.multiplier,
              payout:     finalPay,
              betAmount,
              newBalance: newBal,
            };
            setResult(normalized);
            setFlipHistory((prev) => [normalized, ...prev].slice(0, 6));
          }, 900);
        },
        onError: (err) => {
          setIsFlipping(false);
          setResult({ error: err.response?.data?.message || 'Flip failed' });
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 px-4 py-8"
      style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
    >
      {/* ── Left: arena ── */}
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <p className="text-[9px] tracking-[0.38em] uppercase mb-2" style={{ color: 'rgba(85,211,150,0.5)' }}>
            Vexora · Games
          </p>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#fff', lineHeight: 1.05 }}>
            Coinflip
          </h1>
          <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>
            50 / 50 chance · 1.96× payout · provably fair
          </p>
        </div>

        {/* Arena */}
        <div
          className="relative rounded-2xl flex flex-col items-center gap-6 px-8 py-10 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Rings */}
          <Ring size={180} delay={0}   />
          <Ring size={280} delay={0.5} />
          <Ring size={380} delay={1}   />

          {/* Coin */}
          <CoinDisplay
            side={activeSide}
            isFlipping={isFlipping}
            showWinBurst={showWinBurst}
          />

          {/* Status */}
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {isFlipping
              ? 'Flipping…'
              : result
                ? result.win ? 'You won!' : 'Better luck next time'
                : `${choice} selected · ready to flip`}
          </p>

          {/* Choice picker */}
          <ChoicePicker
            choice={choice}
            onChange={(c) => { setChoice(c); setActiveSide(c); setResult(null); }}
            disabled={isFlipping || isPending}
          />

          {/* Result banner */}
          <AnimatePresence mode="wait">
            {result && !isFlipping && (
              <ResultBanner key={result.result ?? result.error} result={result} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right: bet panel ── */}
      <div className="flex flex-col gap-4">
        {/* Bet controls */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-[9px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Place your bet
          </p>

          <BetInput
            value={betAmount}
            onChange={setBetAmount}
            disabled={isFlipping || isPending}
            balance={balance ?? user?.balance ?? 0}
          />

          {/* Payout display */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(85,211,150,0.05)', border: '1px solid rgba(85,211,150,0.12)' }}
          >
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Win payout</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.12em' }}>at 1.96×</p>
            </div>
            <span
              className="text-base font-semibold"
              style={{
                background: 'linear-gradient(135deg, #55D396, #B6F4D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🪙 {payout.toLocaleString()}
            </span>
          </div>

          {/* Flip button */}
          <Button
            onClick={handleFlip}
            loading={isFlipping || isPending}
            fullWidth
          >
            ⟳ Flip coin
          </Button>
        </div>

        {/* Odds info */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-[9px] tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Odds</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[['Win chance', '49.5%'], ['Multiplier', '1.96×']].map(([label, val]) => (
              <div
                key={label}
                className="rounded-lg p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-[9px] tracking-[0.22em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{val}</p>
              </div>
            ))}
          </div>

          <p className="text-[9px] tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Recent flips</p>
          <FlipHistory history={flipHistory} />
        </div>
      </div>
    </motion.div>
  );
};

export default CoinflipPage;