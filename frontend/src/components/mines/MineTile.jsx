import { motion } from 'framer-motion';

const MineTile = ({ tile, gameActive, revealing, cashingOut, onReveal }) => {
  const isClickable =
    tile.state === 'hidden' && gameActive && !revealing && !cashingOut;

  let stateClass;
  let tileStyle;

  if (tile.state === 'hidden') {
    if (isClickable) {
      stateClass = 'cursor-pointer border border-zinc-600/80 hover:border-emerald-500/60';
      tileStyle  = {
        background: 'linear-gradient(180deg, #52525b 0%, #3f3f46 55%, #27272a 100%)',
        boxShadow:  'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.5)',
      };
    } else {
      stateClass = 'cursor-default border border-zinc-700/40 opacity-40';
      tileStyle  = {
        background: 'linear-gradient(180deg, #3f3f46 0%, #27272a 100%)',
      };
    }
  } else if (tile.state === 'safe') {
    stateClass = 'border border-emerald-400/60';
    tileStyle  = {
      background: 'linear-gradient(180deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.1) 100%)',
      boxShadow:  '0 0 18px rgba(16,185,129,0.25), inset 0 1px 0 rgba(16,185,129,0.25)',
    };
  } else {
    stateClass = 'border border-red-400/60';
    tileStyle  = {
      background: 'linear-gradient(180deg, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.1) 100%)',
      boxShadow:  '0 0 18px rgba(239,68,68,0.28), inset 0 1px 0 rgba(239,68,68,0.25)',
    };
  }

  return (
    <motion.button
      onClick={() => isClickable && onReveal(tile.index)}
      disabled={!isClickable}
      whileHover={isClickable ? { scale: 1.07, y: -2 } : {}}
      whileTap={isClickable ? { scale: 0.88 } : {}}
      transition={{ type: 'spring', stiffness: 420, damping: 20 }}
      className={`w-full h-full rounded-xl flex items-center justify-center select-none focus:outline-none overflow-hidden transition-colors duration-150 ${stateClass}`}
      style={tileStyle}
    >
      {tile.state === 'safe' && (
        <motion.span
          initial={{ scale: 0, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 16 }}
          className="text-lg leading-none drop-shadow-[0_0_8px_rgba(16,185,129,0.9)] pointer-events-none"
        >
          💎
        </motion.span>
      )}

      {tile.state === 'mine' && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.35, 1], opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          className="text-lg leading-none drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] pointer-events-none"
        >
          💣
        </motion.span>
      )}
    </motion.button>
  );
};

export default MineTile;