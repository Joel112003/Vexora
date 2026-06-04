import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence }           from 'framer-motion';
import { useAuthStore }                      from '../store/authStore';
import { useBalance }                        from '../hooks/useBalance';
import {
  useMinesStart,
  useMinesReveal,
  useMinesCashout,
} from '../hooks/useGame';
import MineTile from '../components/mines/MineTile';

const MINE_PRESETS = [1, 3, 5, 10, 15, 20, 24];
const ease         = [0.16, 1, 0.3, 1];

const applyRevealedTiles = (localGrid, serverGrid) =>
  localGrid.map((tile) => {
    const s = serverGrid.find((t) => t.index === tile.index);
    return s?.revealed && tile.state === 'hidden' ? { ...tile, state: 'safe' } : tile;
  });

const applyMineGrid = (serverGrid) =>
  serverGrid.map((t) => ({
    index: t.index,
    state: t.revealed ? (t.isMine !== false ? 'mine' : 'safe') : 'hidden',
  }));

const COINS = ['🪙', '💰', '✨', '🪙', '💎', '🪙', '✨', '💰'];

const FloatingCoin = ({ emoji, delay, x }) => (
  <motion.span
    initial={{ opacity: 0, y: 0, scale: 0.5 }}
    animate={{ opacity: [0, 1, 1, 0], y: -160, scale: [0.5, 1.3, 1, 0.6] }}
    transition={{ delay, duration: 1.6, ease: 'easeOut' }}
    className="absolute bottom-4 text-xl pointer-events-none select-none"
    style={{ left: `calc(50% + ${x}px)` }}
  >
    {emoji}
  </motion.span>
);

const ResultOverlay = ({ gameOver, payout, multiplier, onPlayAgain }) => (
  <AnimatePresence mode="wait">
    {gameOver && (
      <motion.div
        key={gameOver}
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -6 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className={`relative overflow-hidden rounded-2xl border p-6 text-center mb-4 ${
          gameOver === 'won'
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent'
            : 'border-red-500/30 bg-gradient-to-b from-red-500/8 to-transparent'
        }`}
      >
        {gameOver === 'won' && COINS.map((e, i) => (
          <FloatingCoin key={i} emoji={e} delay={i * 0.08} x={(i - COINS.length / 2) * 36} />
        ))}

        {gameOver === 'won' ? (
          <>
            <p className="text-[10px] font-mono uppercase tracking-[0.55em] text-emerald-400 mb-2">
              💰 Cashed out!
            </p>
            <motion.p
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              className="text-4xl font-mono font-black text-emerald-400 tabular-nums mb-2"
            >
              +{payout.toFixed(2)} 🪙
            </motion.p>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono uppercase tracking-[0.2em]">
              {multiplier.toFixed(4)}× multiplier
            </span>
          </>
        ) : (
          <>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, -5, 5, -3, 3, 0] }}
              transition={{ type: 'spring', stiffness: 280, damping: 16 }}
              className="text-4xl mb-2"
            >
              💥
            </motion.p>
            <p className="text-[10px] font-mono uppercase tracking-[0.55em] text-red-400 mb-1">
              Mine hit!
            </p>
            <p className="text-sm font-mono text-zinc-500">Better luck next time</p>
          </>
        )}

        <motion.button
          onClick={onPlayAgain}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 text-xs font-mono underline underline-offset-4 transition-colors ${
            gameOver === 'won'
              ? 'text-emerald-400/60 hover:text-emerald-400'
              : 'text-red-400/60 hover:text-red-400'
          }`}
        >
          {gameOver === 'won' ? 'Play again →' : 'Try again →'}
        </motion.button>
      </motion.div>
    )}
  </AnimatePresence>
);

const StatPill = ({ label, value, color = 'text-white' }) => (
  <div
    className="flex-1 rounded-xl px-3 py-2.5 flex flex-col gap-0.5"
    style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600">{label}</p>
    <motion.p
      key={String(value)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease }}
      className={`text-sm font-mono font-bold tabular-nums ${color}`}
    >
      {value}
    </motion.p>
  </div>
);

const gridContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.016, delayChildren: 0.04 } },
};
const gridTileVariants = {
  hidden:  { opacity: 0, scale: 0.75, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 24 } },
};

const MineGrid = ({ grid, gameActive, revealing, cashingOut, onReveal }) => {
  if (grid.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-8"
      >
        <div className="relative">
          <span className="text-5xl block">💣</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center text-5xl blur-sm pointer-events-none"
          >
            💣
          </motion.span>
        </div>
        <p className="text-[11px] font-mono text-zinc-600 text-center leading-relaxed uppercase tracking-[0.3em]">
          Set bet & mines<br />then Start
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="grid"
      variants={gridContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-5 gap-2 w-full"
    >
      {grid.map((tile) => (
        <motion.div
          key={tile.index}
          variants={gridTileVariants}
          className="w-full aspect-square"
        >
          <MineTile
            tile={tile}
            gameActive={gameActive}
            revealing={revealing}
            cashingOut={cashingOut}
            onReveal={onReveal}
          />
        </motion.div>
      ))}
    </motion.div>
  );

};

const MinesPage = () => {
  const { user }              = useAuthStore();
  const { data: liveBalance } = useBalance();
  const balance = liveBalance ?? user?.balance ?? 0;

  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);

  const [gameActive,      setGameActive]      = useState(false);
  const [grid,            setGrid]            = useState([]);
  const [multiplier,      setMultiplier]      = useState(1);
  const [potentialPayout, setPotentialPayout] = useState(0);
  const [revealed,        setRevealed]        = useState(0);
  const [gameOver,        setGameOver]        = useState(null);
  const [lastPayout,      setLastPayout]      = useState(0);
  const [lastMultiplier,  setLastMultiplier]  = useState(1);
  const [error,           setError]           = useState(null);

  const startGame  = useMinesStart();
  const revealTile = useMinesReveal();
  const cashout    = useMinesCashout();

  const starting   = startGame.isPending;
  const revealing  = revealTile.isPending;
  const cashingOut = cashout.isPending;
  const safeCount  = 25 - mineCount;

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3500);
    return () => clearTimeout(t);
  }, [error]);

  const handleStart = useCallback(() => {
    setError(null);
    setGameOver(null);
    setRevealed(0);
    setMultiplier(1);
    setPotentialPayout(0);
    setGrid([]);

    startGame.mutate(
      { betAmount, mineCount },
      {
        onSuccess: (res) => {
          const serverGrid = res.data.data.grid;
          setGrid(serverGrid.map((t) => ({ index: t.index, state: 'hidden' })));
          setGameActive(true);
        },
        onError: (err) => {
          setError(err?.response?.data?.message ?? 'Failed to start. Try again.');
          setGameActive(false);
        },
      },
    );
  }, [betAmount, mineCount, startGame]);

  const handleReveal = useCallback(
    (index) => {
      if (!gameActive || revealing || cashingOut) return;
      setError(null);

      revealTile.mutate(
        { index },
        {
          onSuccess: (res) => {
            const body = res.data;

            if (body.data?.autoWin) {
              const { potentialPayout: p, multiplier: m, grid: sg } = body.data;
              setGrid((prev) => applyRevealedTiles(prev, sg));
              setLastPayout(p);
              setLastMultiplier(m);
              setGameActive(false);
              setGameOver('won');
              return;
            }

            if (!body.success) {
              const sg = body.data?.grid ?? [];
              setGrid(applyMineGrid(sg));
              setGameActive(false);
              setGameOver('lost');
              return;
            }

            const { grid: sg, multiplier: m, potentialPayout: p, revealed: r } = body.data;
            setGrid((prev) => applyRevealedTiles(prev, sg));
            setMultiplier(m);
            setPotentialPayout(p);
            setRevealed(r);
          },
          onError: (err) => {
            setError(err?.response?.data?.message ?? 'Network error, try again.');
          },
        },
      );
    },
    [gameActive, revealing, cashingOut, revealTile],
  );

  const handleCashout = useCallback(() => {
    if (!gameActive || revealed === 0 || cashingOut) return;
    setError(null);

    cashout.mutate(undefined, {
      onSuccess: (res) => {
        const { payout: p, multiplier: m } = res.data.data;
        setLastPayout(p);
        setLastMultiplier(m);
        setGameActive(false);
        setGameOver('won');
      },
      onError: (err) => {
        setError(err?.response?.data?.message ?? 'Cashout failed.');
      },
    });
  }, [gameActive, revealed, cashingOut, cashout]);

  const handlePlayAgain = useCallback(() => {
    setGameOver(null);
    setGrid([]);
    setRevealed(0);
    setMultiplier(1);
    setPotentialPayout(0);
    setError(null);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050c07]" />
        <div className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[130px]" />
        <div className="absolute -bottom-40 -left-20 w-[560px] h-[560px] rounded-full bg-emerald-700/8 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(52,211,153,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52,211,153,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <div className="min-h-[calc(100dvh-64px)] flex items-start justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="w-full max-w-3xl flex flex-col gap-4"
        >
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[8px] font-mono uppercase tracking-[0.7em] text-emerald-500/50 mb-1">
                Vexora
              </p>
              <h1
                className="text-3xl font-black text-white leading-none"
                style={{ letterSpacing: '-0.03em' }}
              >
                💣 Mines
              </h1>
            </div>

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

          <ResultOverlay
            gameOver={gameOver}
            payout={lastPayout}
            multiplier={lastMultiplier}
            onPlayAgain={handlePlayAgain}
          />

          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 0 0 1px rgba(239,68,68,0.04), inset 0 1px 0 rgba(255,255,255,0.04)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.2) 30%, rgba(52,211,153,0.12) 70%, transparent)' }}
            />

            <div className="p-5 md:p-6">
              <div className="grid md:grid-cols-[256px_1fr] gap-5">

                <div className="flex flex-col gap-4">

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono uppercase tracking-[0.45em] text-zinc-500">
                        Mines
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        <span className="text-red-400 font-bold">{mineCount}</span> mines ·{' '}
                        <span className="text-emerald-400 font-bold">{safeCount}</span> safe
                      </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {MINE_PRESETS.map((c) => (
                        <motion.button
                          key={c}
                          onClick={() => !gameActive && setMineCount(c)}
                          disabled={gameActive}
                          whileHover={!gameActive ? { scale: 1.08 } : {}}
                          whileTap={!gameActive ? { scale: 0.92 } : {}}
                          className={[
                            'px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
                            mineCount === c
                              ? 'bg-red-500 text-white shadow-[0_0_14px_rgba(239,68,68,0.4)]'
                              : 'bg-white/4 border border-white/8 text-zinc-400 hover:border-red-500/40 hover:text-red-400',
                          ].join(' ')}
                        >
                          {c}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

                  <AnimatePresence>
                    {gameActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-1.5 mb-4">
                          <StatPill label="Multiplier"   value={`${multiplier.toFixed(4)}×`}       color="text-sky-400" />
                          <StatPill label="Cash out"     value={`${potentialPayout.toFixed(2)} 🪙`} color="text-emerald-400" />
                          <StatPill label="Revealed"     value={`${revealed} / ${safeCount}`}       color="text-zinc-300" />
                          <StatPill label="Mines"        value={mineCount}                           color="text-red-400" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono uppercase tracking-[0.45em] text-zinc-500">
                        Bet amount
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                        Bal: <span className="text-zinc-300 font-semibold">{Number(balance).toLocaleString()}</span>
                        <span className="text-amber-400 ml-0.5">🪙</span>
                      </span>
                    </div>

                    <div className="flex gap-2 items-stretch">
                      <div
                        className="flex-1 flex items-center rounded-xl focus-within:shadow-[0_0_0_2px_rgba(16,185,129,0.2)] transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <span className="pl-3 text-amber-400 text-sm select-none">🪙</span>
                        <input
                          type="number"
                          min={1}
                          max={balance}
                          step={1}
                          value={betAmount}
                          disabled={gameActive}
                          onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                          className="flex-1 bg-transparent text-white font-mono text-sm tabular-nums px-2 py-3 focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                      <div className="flex gap-1">
                        {[
                          ['½',   () => setBetAmount(Math.max(1, parseFloat((betAmount / 2).toFixed(2))))],
                          ['2×',  () => setBetAmount(Math.min(balance, parseFloat((betAmount * 2).toFixed(2))))],
                          ['Max', () => setBetAmount(balance)],
                        ].map(([label, fn]) => (
                          <motion.button
                            key={label}
                            onClick={fn}
                            disabled={gameActive}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2.5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-[0.1em] text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-emerald-400 transition-colors duration-150 focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                          >
                            {label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="px-3 py-2.5 rounded-xl border border-red-500/25 bg-red-500/8 text-red-300 text-xs font-mono text-center"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative mt-auto">
                    {!gameActive ? (
                      <>
                        {!starting && (
                          <motion.div
                            className="absolute -inset-0.5 rounded-2xl bg-emerald-500/15 blur-lg pointer-events-none"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                          />
                        )}
                        <motion.button
                          onClick={handleStart}
                          disabled={starting}
                          whileHover={{ scale: starting ? 1 : 1.015 }}
                          whileTap={{ scale: starting ? 1 : 0.975 }}
                          className="relative w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-emerald-500/30 disabled:cursor-not-allowed text-zinc-900 text-[12px] font-mono font-black uppercase transition-colors duration-150 focus:outline-none"
                          style={{ letterSpacing: '0.18em' }}
                        >
                          {starting ? (
                            <span className="flex items-center justify-center gap-2.5">
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                                className="inline-block w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full"
                              />
                              Starting…
                            </span>
                          ) : '💣 Place Bet & Start'}
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={handleCashout}
                        disabled={cashingOut || revealed === 0}
                        whileHover={{ scale: (cashingOut || revealed === 0) ? 1 : 1.015 }}
                        whileTap={{ scale: (cashingOut || revealed === 0) ? 1 : 0.975 }}
                        animate={
                          revealed > 0 && !cashingOut
                            ? { boxShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 40px rgba(16,185,129,0.55)', '0 0 20px rgba(16,185,129,0.3)'] }
                            : {}
                        }
                        transition={revealed > 0 && !cashingOut ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : {}}
                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-white/6 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-900 text-[12px] font-mono font-black uppercase transition-colors duration-200 focus:outline-none"
                        style={{ letterSpacing: '0.18em' }}
                      >
                        {cashingOut ? (
                          <span className="flex items-center justify-center gap-2.5">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                              className="inline-block w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full"
                            />
                            Cashing out…
                          </span>
                        ) : revealed === 0
                          ? 'Reveal a tile first'
                          : `💰 Cash Out  ${potentialPayout.toFixed(2)} 🪙`
                        }
                      </motion.button>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-2xl flex items-center justify-center p-4 min-h-[320px]"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <MineGrid
                    grid={grid}
                    gameActive={gameActive}
                    revealing={revealing}
                    cashingOut={cashingOut}
                    onReveal={handleReveal}
                  />
                </div>

              </div>
            </div>
          </div>

          <p className="text-center text-[9px] font-mono text-zinc-800 uppercase tracking-[0.35em]">
            97% RTP · Provably Fair · Vexora
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default MinesPage;