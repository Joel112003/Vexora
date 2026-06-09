import { motion, AnimatePresence } from 'framer-motion';

const getPillStyle = (point) => {
  if (point >= 10) return { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', color: '#c084fc' };
  if (point >= 5)  return { bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.4)',  color: '#fbbf24' };
  if (point >= 2)  return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', color: '#34d399' };
  return             { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  color: '#f87171' };
};

const CrashHistory = ({ history }) => {
  if (!history?.length) return null;

  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-600 mr-1">
        History
      </span>
      <AnimatePresence initial={false}>
        {[...history].reverse().slice(0, 20).map((point, i) => {
          const s = getPillStyle(point);
          return (
            <motion.span
              key={`${point}-${i}`}
              initial={{ opacity: 0, scale: 0.7, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 24 }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold tabular-nums"
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.color,
              }}
            >
              {Number(point).toFixed(2)}×
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CrashHistory;