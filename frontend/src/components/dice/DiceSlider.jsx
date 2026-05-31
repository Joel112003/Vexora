import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const DiceSlider = ({ target, onChange, direction, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);

  // Map target [2..98] → position [0..100]%
  const pct = ((target - 2) / 96) * 100;

  const winPct  = direction === 'over' ? 100 - pct : pct;
  const losePct = 100 - winPct;

  // Green zone position on the track
  const greenLeft  = direction === 'over' ? pct   : 0;
  const greenWidth = direction === 'over' ? 100 - pct : pct;

  // Handle mouse/touch drag for real-time updates without going through React state lag
  const handlePointerMove = (clientX) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const val = Math.round(2 + ratio * 96);
    onChange(val);
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

        {/* Green win zone — CSS transition for instant feel, no spring lag */}
        <div
          className="absolute h-[6px] rounded-full pointer-events-none"
          style={{
            left: `${greenLeft}%`,
            width: `${greenWidth}%`,
            background: 'linear-gradient(90deg, #059669, #34d399)',
            transition: 'left 0ms, width 0ms', // zero delay — follows pointer exactly
            boxShadow: '0 0 8px rgba(52,211,153,0.4)',
          }}
        />

        {/* Native range input — invisible but handles all interaction */}
        <input
          type="range"
          min={2}
          max={98}
          step={1}
          value={target}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
          onMouseMove={(e) => { if (isDragging) handlePointerMove(e.clientX); }}
          onTouchMove={(e) => { if (isDragging) handlePointerMove(e.touches[0].clientX); }}
          className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ zIndex: 20 }}
        />

        {/* Custom thumb — plain div, position from state (already instant) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${pct}%`,
            transform: 'translateX(-50%)',
            zIndex: 10,
            transition: 'left 0ms', // zero — no lag whatsoever
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