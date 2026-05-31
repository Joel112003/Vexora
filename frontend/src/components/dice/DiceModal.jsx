import { createPortal }           from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Confetti burst for wins ── */
const SPARKS = [
  { emoji: '🪙', x: -100, y: -120, r: -30 },
  { emoji: '✨', x:  80,  y: -140, r:  20 },
  { emoji: '💎', x: -140, y:  -60, r: -15 },
  { emoji: '⭐', x:  120, y:  -80, r:  35 },
  { emoji: '🪙', x:  -50, y: -160, r: -45 },
  { emoji: '✨', x:  110, y: -130, r:  10 },
];

const Spark = ({ emoji, x, y, r }) => (
  <motion.span
    initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 1, 0], x, y, rotate: r, scale: [0, 1.2, 1, 0.5] }}
    transition={{ duration: 1.6, ease: 'easeOut', times: [0, 0.2, 0.7, 1] }}
    className="absolute left-1/2 top-1/2 pointer-events-none select-none text-xl"
    style={{ marginLeft: -12, marginTop: -12 }}
  >
    {emoji}
  </motion.span>
);

/* ── Modal ── */
const DiceModal = ({ notification, onClose }) => {
  if (!notification) return null;
  const { result, direction, target, win } = notification;

  return createPortal(
    <AnimatePresence mode="wait">
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

          {/* Sparks (win only) */}
          {win && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {SPARKS.map((s, i) => (
                <Spark key={i} {...s} />
              ))}
            </div>
          )}

          {/* Card */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-xs overflow-hidden rounded-3xl"
            style={{
              background: win
                ? 'linear-gradient(160deg, #03100a 0%, #050e08 60%, #030b06 100%)'
                : 'linear-gradient(160deg, #100303 0%, #0e0505 60%, #0b0303 100%)',
              border: win
                ? '1px solid rgba(52,211,153,0.25)'
                : '1px solid rgba(248,113,113,0.2)',
              boxShadow: win
                ? '0 0 0 1px rgba(52,211,153,0.05), 0 32px 80px -16px rgba(52,211,153,0.35)'
                : '0 0 0 1px rgba(248,113,113,0.04), 0 32px 80px -16px rgba(248,113,113,0.3)',
            }}
          >
            {/* Top glow strip */}
            <div
              className="h-[3px] w-full"
              style={{
                background: win
                  ? 'linear-gradient(90deg, transparent, #34d399 30%, #6ee7b7 50%, #34d399 70%, transparent)'
                  : 'linear-gradient(90deg, transparent, #f87171 30%, #fca5a5 50%, #f87171 70%, transparent)',
              }}
            />

            {/* Radial glow behind content */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: win
                  ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(52,211,153,0.12), transparent)'
                  : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(248,113,113,0.1), transparent)',
              }}
            />

            <div className="relative flex flex-col items-center text-center px-8 pt-8 pb-8 gap-5">

              {/* Win/Loss label */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.06 }}
                  className="text-5xl"
                >
                  {win ? '🎉' : '💸'}
                </motion.span>

                <span
                  className="text-[9px] font-mono uppercase tracking-[0.65em]"
                  style={{ color: win ? '#34d399' : '#f87171' }}
                >
                  {win ? 'You Win!' : 'Better Luck Next Time'}
                </span>
              </motion.div>

              {/* Big roll number */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.12 }}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className="font-black tabular-nums leading-none"
                  style={{
                    fontSize: '5.5rem',
                    letterSpacing: '-0.05em',
                    color: win ? '#ecfdf5' : '#fef2f2',
                    textShadow: win
                      ? '0 0 80px rgba(52,211,153,0.5)'
                      : '0 0 80px rgba(248,113,113,0.45)',
                  }}
                >
                  {result.roll}
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                  needed {direction} {target}
                </span>
              </motion.div>

              {/* Divider */}
              <div
                className="w-full h-px"
                style={{
                  background: win
                    ? 'linear-gradient(90deg, transparent, rgba(52,211,153,0.2), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(248,113,113,0.15), transparent)',
                }}
              />

              {/* Payout / loss details */}
              {win ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Payout</span>
                  <span
                    className="text-4xl font-black tabular-nums text-emerald-300"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    +{result.payout?.toFixed(2)}
                    <span className="text-2xl ml-1.5">🪙</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {result.multiplier?.toFixed(4)}× multiplier
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-base font-mono text-zinc-500">
                    Rolled <span className="text-zinc-300 font-bold">{result.roll}</span>
                  </span>
                </motion.div>
              )}

              {/* CTA button */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-150"
                style={{
                  background: win ? '#10b981' : 'rgba(255,255,255,0.06)',
                  color: win ? '#022c22' : '#e4e4e7',
                  border: win ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {win ? '🎲  Roll Again' : 'Try Again'}
              </motion.button>

              <p className="text-[9px] font-mono text-zinc-800 -mt-2">
                tap anywhere to dismiss
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DiceModal;
