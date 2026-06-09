import { motion, AnimatePresence } from 'framer-motion';

const PHASE_CONFIG = {
  waiting: { label: (cd) => `Next round in ${cd}s`, bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  running: { label: () => 'Live',                   bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  crashed: { label: () => 'Crashed',                bg: 'bg-red-500/15',     border: 'border-red-500/30',     text: 'text-red-400',     dot: 'bg-red-400'     },
};

const CrashStatusBadge = ({ phase, countdown, connected }) => {
  const cfg = PHASE_CONFIG[phase] ?? PHASE_CONFIG.waiting;

  return (
    <div className="flex items-center gap-2.5">
      {/* Connection dot */}
      <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border ${
        connected
          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
          : 'bg-red-500/10 border-red-500/25 text-red-400'
      }`}>
        <motion.span
          animate={connected ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`}
        />
        {connected ? 'Live' : 'Connecting'}
      </div>

      {/* Phase badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.88, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 4 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}
        >
          {phase === 'running' && (
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
            />
          )}
          {cfg.label(countdown)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CrashStatusBadge;