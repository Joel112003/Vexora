import { motion } from 'framer-motion';
import MineTile from './MineTile';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.018, delayChildren: 0.05 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 22 } },
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center gap-3 py-12"
  >
    <div className="relative">
      <span className="text-5xl block">💣</span>
      <motion.span
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center text-5xl blur-sm"
      >
        💣
      </motion.span>
    </div>
    <p className="text-zinc-600 text-sm text-center leading-relaxed font-mono">
      Set your bet and mines<br />then hit Start
    </p>
  </motion.div>
);

const MinesGrid = ({ grid, gameActive, revealing, cashingOut, onReveal }) => {
  if (grid.length === 0) return <EmptyState />;

  return (
    <motion.div
      key="grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-5 gap-2 w-full"
    >
      {grid.map((tile) => (
        <motion.div key={tile.index} variants={tileVariants}>
          <MineTile
            tile={tile}
            gameActive={gameActive}
            revealing={revealing}
            cashingOut={cashingOut}
            onReveal={onReveal}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MinesGrid;