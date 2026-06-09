import { useState }        from 'react';
import { motion }          from 'framer-motion';
import { useAuthStore }    from '../store/authStore';
import { useCrash }        from '../hooks/useCrash';

import CrashCanvas         from '../components/crash/CrashCanvas';
import CrashMultiplier     from '../components/crash/CrashMultiplier';
import CrashStatusBadge    from '../components/crash/CrashStatusBadge';
import CrashHistory        from '../components/crash/CrashHistory';
import CrashBetPanel       from '../components/crash/CrashBetPanel';

const CrashPage = () => {
  const { user } = useAuthStore();

  const [betAmount,   setBetAmount]   = useState(10);
  const [autoCashout, setAutoCashout] = useState('');

  const {
    phase,
    multiplier,
    crashPoint,
    countdown,
    connected,
    myBet,
    cashedOut,
    history,
    message,
    placeBet,
    cashout,
    placingBet,
    cashingOut,
  } = useCrash();

  const canBet     = phase === 'waiting' && !myBet;
  const canCashout = phase === 'running' && !!myBet && !cashedOut;
  const didLose    = phase === 'crashed' && !!myBet && !cashedOut;

  const handlePlaceBet = () => {
    placeBet({
      betAmount,
      autoCashout: autoCashout ? parseFloat(autoCashout) : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto flex flex-col gap-5"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Crash</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Cash out before the rocket crashes.</p>
        </div>
        <CrashStatusBadge
          phase={phase}
          countdown={countdown}
          connected={connected}
        />
      </div>

      {/* ── History row ─────────────────────────────────────────── */}
      <CrashHistory history={history} />

      {/* ── Main layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Canvas + multiplier — takes up 3/5 width on large screens */}
        <div className="lg:col-span-3 flex flex-col gap-3">

          {/* Canvas card */}
          <div className="relative bg-zinc-900 border border-zinc-800/60 rounded-3xl overflow-hidden"
               style={{ height: 320 }}>
            <CrashCanvas
              phase={phase}
              multiplier={multiplier}
              crashPoint={crashPoint}
            />
          </div>

          {/* Multiplier display card */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-3xl p-8
                          flex items-center justify-center min-h-[200px]">
            <CrashMultiplier
              phase={phase}
              multiplier={multiplier}
              crashPoint={crashPoint}
              countdown={countdown}
              myBet={myBet}
              cashedOut={cashedOut}
            />
          </div>
        </div>

        {/* Bet panel — takes up 2/5 width on large screens */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800/60 rounded-3xl p-6">
          <CrashBetPanel
            betAmount={betAmount}
            onBetChange={setBetAmount}
            autoCashout={autoCashout}
            onAutoCashoutChange={setAutoCashout}
            balance={user?.balance ?? 0}
            canBet={canBet}
            canCashout={canCashout}
            phase={phase}
            myBet={myBet}
            cashedOut={cashedOut}
            didLose={didLose}
            multiplier={multiplier}
            placingBet={placingBet}
            cashingOut={cashingOut}
            message={message}
            onPlaceBet={handlePlaceBet}
            onCashout={cashout}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default CrashPage;