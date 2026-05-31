import { useNavigate } from 'react-router-dom';
import { motion }      from 'framer-motion';

const GameCard = ({ title, description, path, emoji, image, color }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="bg-brand-card border border-brand-border rounded-3xl p-0
                 cursor-pointer transition-colors hover:border-emerald-400/40
                 flex flex-col gap-0 relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-[80px]"
        style={{ background: color + '25' }}
      />
      {image ? (
        <div className="relative h-44 w-full overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.32em] text-white/80" style={{ background: color + '35' }}>
            {title}
          </div>
        </div>
      ) : (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl m-6"
          style={{ background: color + '20', border: `1px solid ${color}40` }}
        >
          {emoji}
        </div>
      )}

      <div className="px-5 py-5 flex flex-col gap-3">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
        </div>

        <div className="mt-2 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.35em]" style={{ color }}>
          Play now →
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;