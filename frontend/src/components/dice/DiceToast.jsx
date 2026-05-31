import { useEffect, useRef, useState } from 'react';
import { createPortal }               from 'react-dom';
import { motion, AnimatePresence }    from 'framer-motion';

/* ── Floating emoji particles ── */
const WIN_PARTICLES  = ['🪙','💰','✨','🎉','🪙','💰','✨','🎊'];
const LOSS_PARTICLES = ['💀','😬','🎲','💸','😅','🎲','💀','😬'];

const Particle = ({ emoji, delay, x }) => (
  <motion.span
    initial={{ opacity: 0, y: 0, x, scale: 0.4 }}
    animate={{ opacity: [0, 1, 1, 0], y: -100, scale: [0.4, 1.3, 1, 0.7] }}
    transition={{ delay, duration: 1.4, ease: 'easeOut' }}
    className="absolute pointer-events-none select-none text-xl"
    style={{ bottom: 16, left: `calc(50% + ${x}px)` }}
  >
    {emoji}
  </motion.span>
);

/* ── Glow pulse ring (win only) ── */
const GlowRing = () => (
  <motion.div
    className="absolute inset-0 rounded-2xl pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.5, 0] }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    style={{ boxShadow: 'inset 0 0 80px rgba(16,185,129,0.25)' }}
  />
);

/* ── Progress bar ── */
const ProgressBar = ({ duration, win }) => (
  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl overflow-hidden bg-black/20">
    <motion.div
      className={`h-full origin-left ${win ? 'bg-emerald-400' : 'bg-red-400'}`}
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0 }}
      transition={{ duration: duration / 1000, ease: 'linear' }}
    />
  </div>
);

/* ── Toast content ── */
const ToastContent = ({ toast, onClose }) => {
  const { result, direction, target, win, id } = toast;
  const AUTO_DISMISS = 4200;

  useEffect(() => {
    const t = setTimeout(onClose, AUTO_DISMISS);
    return () => clearTimeout(t);
  }, [onClose]);

  const particles = win ? WIN_PARTICLES : LOSS_PARTICLES;

  return (
    <motion.div
      key={id}
      layout
      initial={{ opacity: 0, y: 80, scale: 0.88 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 60, scale: 0.92  }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-xl
        shadow-2xl w-80 cursor-pointer select-none
        ${win
          ? 'bg-zinc-900/95 border-emerald-500/40 shadow-emerald-500/20'
          : 'bg-zinc-900/95 border-red-500/35   shadow-red-500/15'
        }
      `}
      onClick={onClose}
    >
      {/* Ambient glow background */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          win ? 'bg-emerald-500/6' : 'bg-red-500/6'
        }`}
      />

      {win && <GlowRing />}

      {/* Particle burst */}
      {particles.map((emoji, i) => (
        <Particle
          key={i}
          emoji={emoji}
          delay={i * 0.07}
          x={(i - particles.length / 2) * 34}
        />
      ))}

      {/* Body */}
      <div className="relative z-10 flex items-start gap-4 px-5 py-5 pb-6">

        {/* Icon badge */}
        <motion.div
          initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
          animate={{ scale: 1,   rotate: 0,   opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.08 }}
          className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            ${win
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : 'bg-red-500/20   border border-red-500/30'
            }
          `}
        >
          {win ? '🎉' : '💸'}
        </motion.div>

        {/* Text block */}
        <div className="flex-1 min-w-0">

          {/* Status line */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-[10px] font-mono uppercase tracking-[0.45em] mb-0.5 ${
              win ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {win ? 'You Win!' : 'No Luck'}
          </motion.p>

          {/* Roll number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1   }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.14 }}
            className={`text-4xl font-mono font-black tabular-nums leading-none mb-1 ${
              win ? 'text-emerald-300' : 'text-red-300'
            }`}
          >
            {result.roll}
          </motion.div>

          {/* Sub-line */}
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-xs font-mono text-zinc-400 tabular-nums"
          >
            {win
              ? `+${result.payout?.toFixed(2)} 🪙  ·  ${result.multiplier?.toFixed(4)}×`
              : `Needed ${direction} ${target}`
            }
          </motion.p>
        </div>

        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="flex-shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors mt-0.5 text-base leading-none"
        >
          ✕
        </button>
      </div>

      <ProgressBar duration={AUTO_DISMISS} win={win} />
    </motion.div>
  );
};

/* ── Portal-mounted toast container ── */
const DiceToast = ({ toasts, onDismiss }) => {
  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastContent
              toast={toast}
              onClose={() => onDismiss(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default DiceToast;
