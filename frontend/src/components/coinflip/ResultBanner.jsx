import { motion } from 'framer-motion';

const ResultBanner = ({ result }) => {
  if (!result) return null;
  const isWin = result.win;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-2xl border p-5 text-center"
      style={{
        background: isWin ? 'rgba(85,211,150,0.08)' : 'rgba(244,63,94,0.08)',
        borderColor: isWin ? 'rgba(85,211,150,0.28)' : 'rgba(244,63,94,0.25)',
      }}
    >
      <div
        className="text-base font-semibold mb-1 tracking-wide"
        style={{ color: isWin ? '#55D396' : '#f43f5e' }}
      >
        {isWin
          ? `+${(result.payout ?? 0).toLocaleString()} coins`
          : `−${(result.betAmount ?? 0).toLocaleString()} coins`}
      </div>
      <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Landed {result.result ?? '—'} · {isWin ? 'you won!' : 'better luck next time'}
      </p>
      {result.newBalance != null && (
        <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em' }}>
          🪙 {(result.newBalance ?? 0).toLocaleString()} balance
        </p>
      )}
    </motion.div>
  );
};

export default ResultBanner;