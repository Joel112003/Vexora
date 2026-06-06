import { AnimatePresence, motion } from 'framer-motion';

/* ────────────────────────────────────────────────────────────
   WinBurst — 3 concentric ripple rings centred on the result dot
   Mount / unmount via AnimatePresence in the parent.
   ──────────────────────────────────────────────────────────── */

const RINGS = [0, 1, 2]; // 3 rings, staggered 150 ms each

const Ring = ({ index }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 28,
      height: 28,
      top: '50%',
      left: '50%',
      marginLeft: -14,
      marginTop: -14,
      border: '2px solid rgba(85,211,150,0.5)',
      background: 'transparent',
    }}
    initial={{ scale: 1, opacity: 0.8 }}
    animate={{ scale: 2.5, opacity: 0 }}
    transition={{
      duration: 1.0,
      delay: index * 0.15,
      ease: [0.2, 0.8, 0.4, 1],
    }}
  />
);

const WinBurst = ({ active }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        key="win-burst"
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {RINGS.map((i) => (
          <Ring key={i} index={i} />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

export default WinBurst;
