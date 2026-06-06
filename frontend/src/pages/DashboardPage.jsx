import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBalance } from '../hooks/useBalance';
import GameCard from '../common/ui/GameCard';
import coinImg  from '../assets/Coin.jpeg';
import minesImg from '../assets/Mine.jpeg';
import diceImg  from '../assets/Dice.jpeg';
import crashImg from '../assets/Crash.jpeg';

const ease = [0.16, 1, 0.3, 1];
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const GAMES = [
  { title: 'Dice',     description: 'Pick a target and direction. Win up to 95×.', path: '/app/dice',     emoji: '🎲', image: diceImg,  color: '#6c5ce7' },
  { title: 'Coinflip', description: 'Heads or tails. Simple 50/50 with 1.96× payout.', path: '/app/coinflip', emoji: '🪙', image: coinImg,  color: '#00cec9' },
  { title: 'Mines',    description: 'Reveal safe tiles on a 5×5 grid. Cash out before impact.', path: '/app/mines',    emoji: '💣', image: minesImg, color: '#e17055' },
  { title: 'Crash',    description: 'Watch the multiplier climb. Cash out before it crashes.', path: '/app/crash',    emoji: '🚀', image: crashImg, color: '#fdcb6e' },
];

// Quick-jump shortcut rows shown in the "Jump back in" card
const QUICK_LINKS = [
  { path: '/app/dice',  label: 'Dice',  emoji: '🎲', bg: 'rgba(108,92,231,0.12)', border: 'rgba(108,92,231,0.22)' },
  { path: '/app/crash', label: 'Crash', emoji: '🚀', bg: 'rgba(253,203,110,0.1)', border: 'rgba(253,203,110,0.2)' },
];

const DashboardPage = () => {
  const { user }          = useAuthStore();
  const { data: balance } = useBalance();
  const coins = (balance ?? user?.balance ?? 0).toLocaleString();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative flex flex-col gap-10 max-w-6xl w-full mx-auto px-4 py-8"
      style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-28 right-6 h-72 w-72 rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-6 h-60 w-60 rounded-full bg-emerald-400/8 blur-[160px]" />

      {/* ── Hero ── */}
      <motion.div variants={itemVariants}>
        <div
          className="relative rounded-2xl overflow-hidden px-8 py-10 lg:px-12 lg:py-14"
          style={{
            background: 'linear-gradient(135deg, rgba(85,211,150,0.09) 0%, rgba(4,8,6,0.7) 50%, rgba(4,8,6,0.95) 100%)',
            border: '1px solid rgba(85,211,150,0.14)',
          }}
        >
          {/* decorative circle */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full"
            style={{ background: 'rgba(85,211,150,0.06)', filter: 'blur(60px)' }} />

          <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: 'rgba(85,211,150,0.65)' }}>
            — Vexora · Dashboard
          </p>
          <h1
            className="leading-[1.05] mb-4"
            style={{ fontFamily: 'Instrument Serif, ui-serif, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff' }}
          >
            Welcome back,{' '}
            <em style={{ color: '#55D396', fontStyle: 'italic' }}>{user?.username}</em>.
          </h1>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}>
            You have{' '}
            <span style={{ color: 'rgba(85,211,150,0.9)', fontWeight: 600 }}>{coins} coins</span>
            {' '}ready for the next play. Pick a table and test your streak.
          </p>
        </div>
      </motion.div>

      {/* ── Balance + Quick jump ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Balance card */}
        <div
          className="rounded-2xl flex items-center justify-between p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(85,211,150,0.08), rgba(85,211,150,0.02))',
            border: '1px solid rgba(85,211,150,0.18)',
          }}
        >
          <div>
            <p className="text-[9px] tracking-[0.32em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>Current balance</p>
            <p
              className="font-bold leading-none mb-1.5"
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                background: 'linear-gradient(135deg, #55D396, #B6F4D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {coins}
            </p>
            <p className="text-[10px] tracking-[0.18em]" style={{ color: 'rgba(85,211,150,0.45)' }}>🪙 demo coins</p>
          </div>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(85,211,150,0.1)', border: '1px solid rgba(85,211,150,0.2)' }}
          >
            🪙
          </div>
        </div>

        {/* Quick jump */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.28)' }}>Jump back in</p>
          <div className="flex flex-col gap-2.5">
            {QUICK_LINKS.map((q) => (
              <Link key={q.path} to={q.path}>
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(85,211,150,0.2)';
                    e.currentTarget.style.background = 'rgba(85,211,150,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                      style={{ background: q.bg, border: `1px solid ${q.border}` }}>
                      {q.emoji}
                    </div>
                    <span className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>{q.label}</span>
                  </div>
                  <i className="ti ti-arrow-right text-sm" style={{ color: 'rgba(85,211,150,0.35)' }} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Game cards ── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[9px] tracking-[0.38em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.22)' }}>Featured games</p>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.85rem', color: '#fff' }}>
              Choose a table
            </h2>
          </div>
          <span className="hidden sm:block text-[10px] tracking-[0.28em] uppercase" style={{ color: 'rgba(85,211,150,0.5)' }}>
            Live tables
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GAMES.map((game) => (
            <GameCard key={game.path} {...game} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;