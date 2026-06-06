import { motion, AnimatePresence } from 'framer-motion';

const FACES = {
  heads: { symbol: '👑', label: 'Heads', gradient: 'linear-gradient(135deg,#b8860b,#ffd700,#daa520)', border: '#daa520', glow: 'rgba(218,165,32,0.25)' },
  tails: { symbol: '🌕', label: 'Tails', gradient: 'linear-gradient(135deg,#3a3a6e,#5a5ab0,#7070c8)', border: '#7070c8', glow: 'rgba(112,112,200,0.25)' },
};

/* Concentric ring that pulses outward on win */
const WinRing = ({ delay }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ border: '2px solid rgba(85,211,150,0.6)', inset: 0 }}
    initial={{ scale: 1, opacity: 0.8 }}
    animate={{ scale: 2.6, opacity: 0 }}
    transition={{ duration: 0.9, delay, ease: 'easeOut' }}
  />
);

const CoinDisplay = ({ side, isFlipping, isWin, showWinBurst }) => {
  const face = FACES[side] ?? FACES['heads'];

  return (
    <div className="relative flex items-center justify-center">
      {/* Win burst rings */}
      <AnimatePresence>
        {showWinBurst && (
          <>
            <WinRing key="r1" delay={0}    />
            <WinRing key="r2" delay={0.15} />
            <WinRing key="r3" delay={0.30} />
          </>
        )}
      </AnimatePresence>

      {/* Coin */}
      <motion.div
        className="relative rounded-full flex items-center justify-center flex-col gap-1"
        style={{
          width: 128,
          height: 128,
          background: face.gradient,
          border: `3px solid ${face.border}`,
          boxShadow: `0 0 0 8px ${face.glow}, 0 0 40px ${face.glow}`,
        }}
        animate={
          isFlipping
            ? { rotateY: [0, 180, 360, 540, 720], scale: [1, 1.08, 1, 1.08, 1] }
            : showWinBurst
              ? { scale: [1, 1.18, 0.96, 1], boxShadow: [`0 0 0 8px ${face.glow}`, `0 0 0 12px rgba(85,211,150,0.35), 0 0 60px rgba(85,211,150,0.4)`, `0 0 0 8px ${face.glow}`, `0 0 0 8px ${face.glow}`] }
              : {}
        }
        transition={
          isFlipping
            ? { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <span style={{ fontSize: 46, lineHeight: 1, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}>
          {face.symbol}
        </span>
        <span
          className="text-[9px] tracking-[0.3em] uppercase font-semibold"
          style={{ color: face.border, opacity: 0.9 }}
        >
          {face.label}
        </span>
      </motion.div>
    </div>
  );
};

export default CoinDisplay;