import { useNavigate } from 'react-router-dom';
import { motion }      from 'framer-motion';

const GameCard = ({ title, description, path, emoji, color }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="bg-brand-card border border-brand-border rounded-2xl p-6
                 cursor-pointer transition-colors hover:border-gray-600
                 flex flex-col gap-4"
    >
      {/* Emoji icon with colored background */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: color + '20', border: `1px solid ${color}40` }}
      >
        {emoji}
      </div>

      <div>
        <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Play button */}
      <div
        className="mt-auto text-sm font-medium flex items-center gap-1.5"
        style={{ color }}
      >
        Play now →
      </div>
    </motion.div>
  );
};

export default GameCard;