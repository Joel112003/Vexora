import { motion }         from 'framer-motion';
import { useAuthStore }   from '../store/authStore';
import { useBetHistory }  from '../hooks/useBetHistory';
import { useBalance }     from '../hooks/useBalance';
import GameCard from '../common/ui/GameCard';
import coinImg from '../assets/Coin.jpeg';
import minesImg from '../assets/Mine.jpeg';
import diceImg from '../assets/Dice.jpeg';
import crashImg from '../assets/Crash.jpeg';
import StatCard           from '../common/ui/StatCard';

const ease = [0.16, 1, 0.3, 1];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

// game cards config
const GAMES = [
  {
    title:       'Dice',
    description: 'Pick a target and direction. Roll the dice and win up to 95x.',
    path:        '/app/dice',
    emoji:       '🎲',
    image:       diceImg,
    color:       '#6c5ce7',
  },
  {
    title:       'Coinflip',
    description: 'Heads or tails. Simple 50/50 with 1.96x payout.',
    path:        '/app/coinflip',
    emoji:       '🪙',
    image:       coinImg,
    color:       '#00cec9',
  },
  {
    title:       'Mines',
    description: 'Reveal safe tiles on a 5x5 grid. Cash out before hitting a mine.',
    path:        '/app/mines',
    emoji:       '💣',
    image:       minesImg,
    color:       '#e17055',
  },
  {
    title:       'Crash',
    description: 'Watch the multiplier climb. Cash out before it crashes.',
    path:        '/app/crash',
    emoji:       '🚀',
    image:       crashImg,
    color:       '#fdcb6e',
  },
];

const DashboardPage = () => {
  const { user }            = useAuthStore();
  const { data: balance }   = useBalance();
  const { data: betsData } = useBetHistory();
  const bets = Array.isArray(betsData) ? betsData : betsData?.bets ?? [];

  // calculate stats from bet history
  const wins   = bets.filter((b) => b.outcome === 'win').length;
  const totalWagered = bets.reduce((sum, b) => sum + b.betAmount, 0);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative flex flex-col gap-12"
    >
      <div className="pointer-events-none absolute -top-28 right-6 h-72 w-72 rounded-full bg-emerald-500/12 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 left-6 h-72 w-72 rounded-full bg-emerald-400/12 blur-[160px]" />

      {/* Welcome header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 via-black/40 to-black/80 px-8 py-10 lg:px-10 lg:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-300/80">
            — Vexora dashboard
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mt-4 leading-[1.05]">
            Welcome back, <span className="text-emerald-300 italic">{user?.username}</span>.
          </h1>
          <p className="text-sm lg:text-base text-zinc-300 mt-4 max-w-2xl">
            You have{' '}
            <span className="text-emerald-200 font-semibold">
              {(balance ?? user?.balance ?? 0).toLocaleString()} coins
            </span>{' '}
            ready for the next play. Track performance, watch your streak, and jump into a table.
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Balance"
          value={(balance ?? user?.balance ?? 0).toLocaleString()}
          sub="demo coins"
        />
        <StatCard
          label="Total bets"
          value={bets.length}
          sub="last 10 shown"
        />
        <StatCard
          label="Wins"
          value={wins}
          sub={bets.length > 0 ? `${Math.round((wins / bets.length) * 100)}% win rate` : '—'}
        />
        <StatCard
          label="Wagered"
          value={totalWagered.toLocaleString()}
          sub="total coins"
        />
      </motion.div>

      {/* Game cards */}
      <motion.div variants={itemVariants}>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-3xl text-white">Featured games</h2>
            <p className="text-sm text-zinc-400 mt-2">Choose a table and test your streak.</p>
          </div>
          <span className="hidden sm:inline-block text-xs text-emerald-300/80 uppercase tracking-[0.3em]">
            Live tables
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GAMES.map((game) => (
            <GameCard key={game.path} {...game} />
          ))}
        </div>
      </motion.div>

      {/* Recent bets */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-3xl text-white">Recent bets</h2>
          <span className="text-xs text-zinc-500 uppercase tracking-[0.3em]">Last 10</span>
        </div>
        {bets.length > 0 ? (
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] px-4 py-4">Game</th>
                  <th className="text-right text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] px-4 py-4">Bet</th>
                  <th className="text-right text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] px-4 py-4">Multiplier</th>
                  <th className="text-right text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] px-4 py-4">Payout</th>
                  <th className="text-right text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] px-4 py-4">Result</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet, i) => (
                  <tr
                    key={bet._id}
                    className={`
                      border-b border-brand-border last:border-0
                      ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}
                    `}
                  >
                    <td className="px-4 py-4 text-white capitalize">
                      {bet.gameType}
                    </td>
                    <td className="px-4 py-4 text-right text-zinc-300">
                      {bet.betAmount}
                    </td>
                    <td className="px-4 py-4 text-right text-zinc-300">
                      {bet.multiplier > 0 ? `${bet.multiplier}x` : '—'}
                    </td>
                    <td className="px-4 py-4 text-right text-zinc-300">
                      {bet.payout > 0 ? bet.payout : '—'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em]
                        ${bet.outcome === 'win'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-rose-500/15 text-rose-300'
                        }
                      `}>
                        {bet.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-dashed border-emerald-400/20 rounded-2xl p-8 text-center">
            <p className="text-zinc-400">No bets yet. Pick a game to start your streak.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;