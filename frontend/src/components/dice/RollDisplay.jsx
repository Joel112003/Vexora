import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CountUpDigit = ({ digit, index }) => (
  <motion.span
    key={digit}
    initial={{ opacity: 0, y: 14, rotateX: -90 }}
    animate={{ opacity: 1, y: 0,  rotateX: 0   }}
    transition={{ type: 'spring', stiffness: 260, damping: 22, delay: index * 0.04 }}
    className="inline-block tabular-nums"
    style={{ transformOrigin: 'center bottom', perspective: 400 }}
  >
    {digit}
  </motion.span>
);

const RollDisplay = ({ result, direction, target, isPending }) => {
  const [displayRoll, setDisplayRoll] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!result || isPending) return;
    let interval;
    setIsAnimating(true);
    setDisplayRoll(null);
    let frame = 0;
    const total = 18;
    interval = setInterval(() => {
      setDisplayRoll(Math.floor(Math.random() * 99) + 1);
      frame++;
      if (frame >= total) {
        clearInterval(interval);
        setDisplayRoll(result.roll);
        setIsAnimating(false);
      }
    }, 45);

    return () => { if (interval) clearInterval(interval); };
  }, [result, isPending]);

  const show = result || isPending;
  if (!show) return null;

  const digits = String(displayRoll ?? '??').split('');
  const settled = !isAnimating && !isPending && result;

  return (
    <AnimatePresence>
      <motion.div
        key="roll-display"
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
        exit={{    opacity: 0, height: 0, marginTop: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="overflow-hidden"
      >
        <div
          className={`
            relative rounded-2xl border px-6 py-5 flex items-center justify-between gap-4
            transition-colors duration-500
            ${settled
              ? result.win
                ? 'border-emerald-500/30 bg-emerald-500/6'
                : 'border-red-500/25   bg-red-500/5'
              : 'border-zinc-700/50 bg-zinc-800/40'
            }
          `}
        >
          {/* Left: label + rolled number */}
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-mono uppercase tracking-[0.45em] text-zinc-500">
              {isPending ? 'Rolling…' : 'Last Roll'}
            </p>

            <div
              className={`text-5xl font-mono font-black tabular-nums leading-none transition-colors duration-300 ${
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
                  transition={{ repeat: Infinity, duration: 0.75 }}
                >
                  ··
                </motion.span>
              ) : (
                <span>
                  {digits.map((d, i) => (
                    <CountUpDigit
                      key={`${d}-${i}-${result?.roll}`}
                      digit={d}
                      index={i}
                    />
                  ))}
                </span>
              )}
            </div>

            {settled && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                className="text-[10px] font-mono text-zinc-500 tabular-nums"
              >
                Needed {direction} {target}
              </motion.p>
            )}
          </div>

          {/* Right: win/loss badge */}
          {settled && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ type: 'spring', stiffness: 340, damping: 20, delay: 0.15 }}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center
                w-20 h-20 rounded-xl border text-center
                ${result.win
                  ? 'bg-emerald-500/15 border-emerald-500/30'
                  : 'bg-red-500/12    border-red-500/25'
                }
              `}
            >
              <span className="text-2xl mb-0.5">{result.win ? '🎉' : '💸'}</span>
              <span
                className={`text-[9px] font-mono uppercase tracking-[0.35em] ${
                  result.win ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {result.win ? 'Win' : 'Loss'}
              </span>
              {result.win && (
                <span className="text-xs font-mono font-bold text-emerald-300 mt-0.5 tabular-nums">
                  +{result.payout?.toFixed(2)}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RollDisplay;
