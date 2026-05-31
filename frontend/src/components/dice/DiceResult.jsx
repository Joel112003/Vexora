import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WinNotification  from './WinNotification';
import LossNotification from './LossNotification';

const CountUpDigit = ({ digit, index }) => (
  <motion.span
    key={digit}
    initial={{ opacity: 0, y: 20, rotateX: -90 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: index * 0.04,
    }}
    className="inline-block tabular-nums"
    style={{ transformOrigin: 'center bottom', perspective: 400 }}
  >
    {digit}
  </motion.span>
);

const DiceResult = ({ result, direction, target, isPending }) => {
  const [displayRoll, setDisplayRoll] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!result || isPending) return;
    let interval;
    const timeout = setTimeout(() => {
      setIsAnimating(true);
      setDisplayRoll(null);

      let frame = 0;
      const total = 22;
      interval = setInterval(() => {
        setDisplayRoll(Math.floor(Math.random() * 99) + 1);
        frame++;
        if (frame >= total) {
          clearInterval(interval);
          setDisplayRoll(result.roll);
          setIsAnimating(false);
        }
      }, 45);
    }, 0);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [result, isPending]);

  if (!result && !isPending) return null;

  const digits = String(displayRoll ?? '??').split('');

  return (
    <div className="flex flex-col gap-4">
      {/* Slot machine roll display */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-zinc-800/50 border border-zinc-700/40 p-8 flex flex-col items-center gap-4"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.45em] text-zinc-600">
          {isPending ? 'Rolling…' : 'Result'}
        </p>

        {/* Number display */}
        <div
          className={`text-8xl font-mono font-black tabular-nums leading-none transition-colors duration-300 ${
            isAnimating || isPending
              ? 'text-zinc-400'
              : result?.win
              ? 'text-emerald-400'
              : 'text-red-400'
          }`}
        >
          {isPending ? (
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              ··
            </motion.span>
          ) : (
            <span>
              {digits.map((d, i) => (
                <CountUpDigit key={`${d}-${i}-${result?.roll}`} digit={d} index={i} />
              ))}
            </span>
          )}
        </div>

        {/* Needed label */}
        {!isPending && !isAnimating && result && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-mono text-zinc-500 tabular-nums"
          >
            Needed {direction} {target}
          </motion.p>
        )}
      </motion.div>

      {/* Win / loss notification */}
      <AnimatePresence mode="wait">
        {!isAnimating && !isPending && result?.win && (
          <WinNotification key="win" result={result} />
        )}
        {!isAnimating && !isPending && result && !result.win && (
          <LossNotification key="loss" result={result} direction={direction} target={target} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiceResult;