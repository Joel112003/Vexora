import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence }      from 'framer-motion';
import WinBurst                         from './WinBurst';

/* ─────────────────────────────────────────────────────────────────────────────
   DiceSlider
   Props
     target      – current target number (2-98)
     onChange    – (val: number) => void
     direction   – 'over' | 'under'
     disabled    – bool
     win         – bool | null   (null = no result yet, true/false = result)
     resultRoll  – number | null  the roll that just resolved
   ───────────────────────────────────────────────────────────────────────────── */

const WIN_COLOR_NORMAL  = 'linear-gradient(90deg, #059669, #34d399)';
const WIN_COLOR_FLASH   = 'linear-gradient(90deg, #34d399, #55D396, #ffffff66, #55D396, #34d399)';
const WIN_GLOW_NORMAL   = '0 0 8px rgba(52,211,153,0.4)';
const WIN_GLOW_FLASH    = '0 0 20px rgba(85,211,150,0.85), 0 0 40px rgba(85,211,150,0.35)';

const BADGE_GLOW_WIN    = '0 0 24px rgba(85,211,150,0.7), 0 0 8px rgba(85,211,150,0.9)';
const BADGE_GLOW_NORMAL = '0 0 8px rgba(52,211,153,0.35)';

const DiceSlider = ({ target, onChange, direction, disabled, win, resultRoll }) => {
  const [isDragging,   setIsDragging]   = useState(false);
  const [flashTrack,   setFlashTrack]   = useState(false);   // track color flash
  const [burstActive,  setBurstActive]  = useState(false);   // ripple rings
  const [badgeGlowing, setBadgeGlowing] = useState(false);   // badge spring+glow
  const trackRef = useRef(null);
  const cleanupRef = useRef(null);

  // ── Trigger win celebration whenever a new win arrives ──────────────────────
  useEffect(() => {
    if (win !== true || resultRoll == null) return;

    // Clear any leftover timer from the previous roll
    if (cleanupRef.current) clearTimeout(cleanupRef.current);

    // Fire all effects simultaneously
    setFlashTrack(true);
    setBurstActive(true);
    setBadgeGlowing(true);

    // Track flash: revert after 600 ms
    const flashTimer = setTimeout(() => setFlashTrack(false), 600);

    // Full cleanup after 1 800 ms
    cleanupRef.current = setTimeout(() => {
      setBurstActive(false);
      setBadgeGlowing(false);
    }, 1800);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(cleanupRef.current);
    };
  }, [win, resultRoll]);

  // ── Geometry ────────────────────────────────────────────────────────────────
  // Map target [2..98] → position [0..100]%
  const pct = ((target - 2) / 96) * 100;

  // Where the result dot sits (if we have a result)
  const resultPct = resultRoll != null ? ((resultRoll - 2) / 96) * 100 : null;

  const winPct  = direction === 'over' ? 100 - pct : pct;
  const losePct = 100 - winPct;

  // Green zone
  const greenLeft  = direction === 'over' ? pct  : 0;
  const greenWidth = direction === 'over' ? 100 - pct : pct;

  // ── Pointer drag helpers ─────────────────────────────────────────────────────
  const handlePointerMove = (clientX) => {
    if (!trackRef.current || disabled) return;
    const rect  = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(Math.round(2 + ratio * 96));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Labels row */}
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-mono uppercase tracking-[0.35em] text-zinc-500">
          Target — roll {direction}{' '}
          <span className="text-emerald-400 font-semibold">{target}</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-zinc-600">WIN</span>
            <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
              {winPct.toFixed(1)}%
            </span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-zinc-600">LOSE</span>
            <span className="text-xs font-mono font-bold text-rose-400 tabular-nums">
              {losePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Track container */}
      <div
        ref={trackRef}
        className="relative h-10 flex items-center select-none"
      >
        {/* Background rail */}
        <div className="absolute inset-x-0 h-[6px] rounded-full bg-zinc-800 border border-zinc-700/50" />

        {/* Green win zone — flashes on win */}
        <div
          className="absolute h-[6px] rounded-full pointer-events-none"
          style={{
            left:       `${greenLeft}%`,
            width:      `${greenWidth}%`,
            background: flashTrack ? WIN_COLOR_FLASH : WIN_COLOR_NORMAL,
            transition: flashTrack
              ? 'background 80ms ease-out, box-shadow 80ms ease-out'
              : 'background 400ms ease-in, box-shadow 400ms ease-in, left 0ms, width 0ms',
            boxShadow:  flashTrack ? WIN_GLOW_FLASH : WIN_GLOW_NORMAL,
          }}
        />

        {/* Native range input — invisible, handles all interaction */}
        <input
          type="range"
          min={2}
          max={98}
          step={1}
          value={target}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={()   => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
          onMouseMove={(e)  => { if (isDragging) handlePointerMove(e.clientX); }}
          onTouchMove={(e)  => { if (isDragging) handlePointerMove(e.touches[0].clientX); }}
          className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ zIndex: 20 }}
        />

        {/* Custom thumb */}
        <div
          className="absolute pointer-events-none"
          style={{
            left:      `${pct}%`,
            transform: 'translateX(-50%)',
            zIndex:    10,
            transition:'left 0ms',
          }}
        >
          <motion.div
            animate={{ scale: isDragging ? 1.35 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className={`
              w-5 h-5 rounded-full border-2 border-emerald-400 bg-white
              ${isDragging
                ? 'shadow-[0_0_0_4px_rgba(52,211,153,0.25),0_0_20px_rgba(52,211,153,0.5)]'
                : 'shadow-[0_0_12px_rgba(52,211,153,0.5)]'
              }
            `}
          />
        </div>

        {/* ── Result dot + WinBurst (shown after a roll) ──────────────────── */}
        <AnimatePresence>
          {resultPct != null && (
            <motion.div
              key={resultRoll}
              className="absolute pointer-events-none"
              style={{
                left:      `${resultPct}%`,
                transform: 'translateX(-50%)',
                zIndex:    15,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            >
              {/* The result number badge */}
              <motion.div
                animate={
                  badgeGlowing
                    ? { scale: [1, 1.35, 1], boxShadow: BADGE_GLOW_WIN }
                    : { scale: 1, boxShadow: BADGE_GLOW_NORMAL }
                }
                transition={
                  badgeGlowing
                    ? { type: 'spring', stiffness: 350, damping: 18, duration: 0.55 }
                    : { duration: 0.4 }
                }
                className={`
                  relative flex items-center justify-center
                  min-w-[28px] h-7 px-1.5 rounded-lg
                  text-[10px] font-mono font-black tabular-nums select-none
                  border
                  ${win
                    ? 'bg-emerald-500 text-zinc-900 border-emerald-400'
                    : 'bg-rose-500/90 text-white border-rose-400'
                  }
                `}
                style={{
                  top:       -38,
                  position:  'relative',
                }}
              >
                {resultRoll}

                {/* Green radial glow pulse — only on win */}
                <AnimatePresence>
                  {badgeGlowing && (
                    <motion.div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(85,211,150,0.55) 0%, transparent 70%)',
                      }}
                      initial={{ opacity: 0.9, scale: 0.8 }}
                      animate={{ opacity: [0.9, 0.4, 0], scale: [0.8, 1.6, 2.2] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.0, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Connecting stem */}
              <div
                className={`
                  absolute left-1/2 -translate-x-1/2
                  w-[2px] h-3 rounded-full
                  ${win ? 'bg-emerald-400' : 'bg-rose-400'}
                `}
                style={{ top: -10 }}
              />

              {/* Dot on the track */}
              <motion.div
                animate={badgeGlowing ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                transition={badgeGlowing ? { type: 'spring', stiffness: 400, damping: 16 } : {}}
                className={`
                  w-3 h-3 rounded-full border-2
                  ${win
                    ? 'bg-emerald-400 border-white shadow-[0_0_10px_rgba(85,211,150,0.8)]'
                    : 'bg-rose-400 border-white shadow-[0_0_8px_rgba(248,113,113,0.7)]'
                  }
                `}
                style={{ marginTop: 2, marginLeft: 2 }}
              />

              {/* WinBurst ripple rings — centred on the track dot */}
              <div
                className="absolute"
                style={{ left: 6, top: 8, width: 0, height: 0 }}
              >
                <WinBurst active={burstActive} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Target value callout above thumb while dragging */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute pointer-events-none"
            style={{ left: `${pct}%`, transform: 'translateX(-50%)', top: -26 }}
          >
            <div className="bg-emerald-500 text-zinc-900 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md">
              {target}
            </div>
          </motion.div>
        )}
      </div>

      {/* Scale markers */}
      <div className="flex justify-between text-[10px] font-mono text-zinc-700 tabular-nums px-0.5">
        {[2, 26, 50, 74, 98].map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
    </div>
  );
};

export default DiceSlider;