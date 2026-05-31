import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Segmented-display digit (7-segment LCD look) ─── */
const SEG_MAP = {
  '0': [1,1,1,1,1,1,0],
  '1': [0,1,1,0,0,0,0],
  '2': [1,1,0,1,1,0,1],
  '3': [1,1,1,1,0,0,1],
  '4': [0,1,1,0,0,1,1],
  '5': [1,0,1,1,0,1,1],
  '6': [1,0,1,1,1,1,1],
  '7': [1,1,1,0,0,0,0],
  '8': [1,1,1,1,1,1,1],
  '9': [1,1,1,1,0,1,1],
  '?': [0,0,0,0,0,0,1],
};

const Seg = ({ on, win, className }) => (
  <div
    className={`rounded-sm transition-all duration-75 ${className}`}
    style={{
      background: on
        ? win ? '#34d399' : '#f87171'
        : 'rgba(255,255,255,0.04)',
      boxShadow: on
        ? win
          ? '0 0 6px rgba(52,211,153,0.8), 0 0 2px rgba(52,211,153,1)'
          : '0 0 6px rgba(248,113,113,0.8), 0 0 2px rgba(248,113,113,1)'
        : 'none',
    }}
  />
);

const SegDigit = ({ char, win, size = 1 }) => {
  const s = SEG_MAP[char] ?? SEG_MAP['?'];
  const w = 18 * size;
  const h = 30 * size;
  const t = 3 * size;

  return (
    <div className="relative flex-shrink-0" style={{ width: w, height: h }}>
      {/* Top horizontal */}
      <Seg on={!!s[0]} win={win} className="absolute"
        style={{ top: 0, left: t, right: t, height: t }} />
      {/* Top-right vertical */}
      <Seg on={!!s[1]} win={win} className="absolute"
        style={{ top: t, right: 0, width: t, height: h/2 - t - 1 }} />
      {/* Bottom-right vertical */}
      <Seg on={!!s[2]} win={win} className="absolute"
        style={{ bottom: t, right: 0, width: t, height: h/2 - t - 1 }} />
      {/* Bottom horizontal */}
      <Seg on={!!s[3]} win={win} className="absolute"
        style={{ bottom: 0, left: t, right: t, height: t }} />
      {/* Bottom-left vertical */}
      <Seg on={!!s[4]} win={win} className="absolute"
        style={{ bottom: t, left: 0, width: t, height: h/2 - t - 1 }} />
      {/* Top-left vertical */}
      <Seg on={!!s[5]} win={win} className="absolute"
        style={{ top: t, left: 0, width: t, height: h/2 - t - 1 }} />
      {/* Middle horizontal */}
      <Seg on={!!s[6]} win={win} className="absolute"
        style={{ top: '50%', left: t, right: t, height: t, marginTop: -Math.floor(t/2) }} />
    </div>
  );
};

const SegDisplay = ({ value, win }) => {
  const chars = String(value).split('');
  return (
    <div className="flex items-center gap-[6px]">
      {chars.map((c, i) => (
        <SegDigit key={i} char={c} win={win} size={1.6} />
      ))}
    </div>
  );
};

/* ─── Animated ticker that counts to the final number ─── */
const useTicker = (target, active) => {
  const [display, setDisplay] = useState('??');
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active || target == null) return;

    let frame = 0;
    const total = 16;
    const run = () => {
      frame++;
      if (frame >= total) {
        setDisplay(String(target));
        return;
      }
      setDisplay(String(Math.floor(Math.random() * 99) + 1));
      frameRef.current = setTimeout(run, 50);
    };
    frameRef.current = setTimeout(run, 0);
    return () => clearTimeout(frameRef.current);
  }, [target, active]);

  return display;
};

/* ─── Auto-dismiss sweep bar ─── */
const SweepBar = ({ duration, win }) => (
  <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
    <motion.div
      className={`h-full origin-left ${win ? 'bg-emerald-400' : 'bg-red-400'}`}
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0 }}
      transition={{ duration: duration / 1000, ease: 'linear' }}
    />
  </div>
);

/* ─── Main notification panel ─── */
const DISMISS_MS = 5000;

const NotificationPanel = ({ item, onClose }) => {
  const { result, direction, target, win } = item;
  const display = useTicker(result.roll, true);

  useEffect(() => {
    const t = setTimeout(onClose, DISMISS_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      key={item.id}
      initial={{ x: '110%', opacity: 0 }}
      animate={{ x: 0,      opacity: 1 }}
      exit={{    x: '110%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className="relative overflow-hidden cursor-pointer"
      style={{ width: 320 }}
      onClick={onClose}
    >
      {/* Panel shell */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: win
            ? 'linear-gradient(135deg, #020d07 0%, #040f0a 100%)'
            : 'linear-gradient(135deg, #0d0404 0%, #100505 100%)',
          border: win
            ? '1px solid rgba(52,211,153,0.2)'
            : '1px solid rgba(248,113,113,0.18)',
          boxShadow: win
            ? '0 8px 40px -8px rgba(52,211,153,0.25), inset 0 1px 0 rgba(52,211,153,0.08)'
            : '0 8px 40px -8px rgba(248,113,113,0.2), inset 0 1px 0 rgba(248,113,113,0.06)',
        }}
      >
        {/* Accent side stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: win
              ? 'linear-gradient(180deg, #34d399, #059669)'
              : 'linear-gradient(180deg, #f87171, #dc2626)',
          }}
        />

        {/* Content */}
        <div className="pl-5 pr-4 pt-4 pb-5 flex flex-col gap-3">

          {/* Top row: status label + close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: win ? '#34d399' : '#f87171' }}
              />
              <span
                className="text-[9px] font-mono uppercase tracking-[0.6em]"
                style={{ color: win ? '#34d399' : '#f87171' }}
              >
                {win ? 'Roll Won' : 'Roll Lost'}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-zinc-700 hover:text-zinc-400 transition-colors text-xs leading-none"
            >
              ✕
            </button>
          </div>

          {/* Segmented display + side info */}
          <div className="flex items-end justify-between gap-4">
            {/* LCD number */}
            <div>
              <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.3em] mb-2">
                RESULT
              </p>
              <SegDisplay value={display} win={win} />
            </div>

            {/* Right side: payout or reason */}
            <div className="text-right">
              {win ? (
                <>
                  <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.3em] mb-1">
                    Payout
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-black tabular-nums text-emerald-300"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    +{result.payout?.toFixed(2)}
                  </motion.p>
                  <p className="text-[9px] font-mono text-zinc-600 mt-0.5">
                    {result.multiplier?.toFixed(4)}× mult
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.3em] mb-1">
                    Needed
                  </p>
                  <p className="text-lg font-black text-zinc-400" style={{ letterSpacing: '-0.02em' }}>
                    {direction} {target}
                  </p>
                  <p className="text-[9px] font-mono text-zinc-600 mt-0.5">better luck</p>
                </>
              )}
            </div>
          </div>

          {/* Thin divider */}
          <div
            className="h-px"
            style={{
              background: win
                ? 'linear-gradient(90deg, rgba(52,211,153,0.15), transparent)'
                : 'linear-gradient(90deg, rgba(248,113,113,0.12), transparent)',
            }}
          />

          {/* Bottom: dismiss hint */}
          <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
            Click to dismiss
          </p>
        </div>

        <SweepBar duration={DISMISS_MS} win={win} />
      </div>
    </motion.div>
  );
};

/* ─── Portal-mounted container ─── */
const DiceNotification = ({ notification, onClose }) =>
  createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none flex flex-col items-end gap-3">
      <AnimatePresence mode="wait">
        {notification && (
          <div className="pointer-events-auto">
            <NotificationPanel
              key={notification.id}
              item={notification}
              onClose={onClose}
            />
          </div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );

export default DiceNotification;
