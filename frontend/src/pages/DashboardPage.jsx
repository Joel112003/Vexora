import { motion }         from 'framer-motion';
import { useAuthStore }   from '../store/authStore';
import { useBetHistory }  from '../hooks/useBetHistory';
import { useBalance }     from '../hooks/useBalance';
import GameCard from '../common/ui/GameCard';
import StatCard           from '../common/ui/StatCard';

// game cards config
const GAMES = [
  {
    title:       'Dice',
    description: 'Pick a target and direction. Roll the dice and win up to 95x.',
    path:        '/dice',
    emoji:       '🎲',
    color:       '#6c5ce7',
  },
  {
    title:       'Coinflip',
    description: 'Heads or tails. Simple 50/50 with 1.96x payout.',
    path:        '/coinflip',
    emoji:       '🪙',
    color:       '#00cec9',
  },
  {
    title:       'Mines',
    description: 'Reveal safe tiles on a 5x5 grid. Cash out before hitting a mine.',
    path:        '/mines',
    emoji:       '💣',
    color:       '#e17055',
  },
  {
    title:       'Crash',
    description: 'Watch the multiplier climb. Cash out before it crashes.',
    path:        '/crash',
    emoji:       '🚀',
    color:       '#fdcb6e',
  },
];

const DashboardPage = () => {
  const { user }            = useAuthStore();
  const { data: balance }   = useBalance();
  const { data: bets = [] } = useBetHistory();

  // calculate stats from bet history
  const wins   = bets.filter((b) => b.outcome === 'win').length;
  const totalWagered = bets.reduce((sum, b) => sum + b.betAmount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.3  }}
      className="flex flex-col gap-8"
    >

      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.username} 👋
        </h1>
        <p className="text-gray-400">
          You have{' '}
          <span className="text-yellow-400 font-semibold">
            {(balance ?? user?.balance ?? 0).toLocaleString()} coins
          </span>{' '}
          to play with.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>

      {/* Game cards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GAMES.map((game) => (
            <GameCard key={game.path} {...game} />
          ))}
        </div>
      </div>

      {/* Recent bets */}
      {bets.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent bets</h2>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Game</th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3">Bet</th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3">Multiplier</th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3">Payout</th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3">Result</th>
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
                    <td className="px-4 py-3 text-white capitalize">
                      {bet.gameType}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {bet.betAmount}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {bet.multiplier > 0 ? `${bet.multiplier}x` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {bet.payout > 0 ? bet.payout : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`
                        inline-block px-2 py-0.5 rounded-full text-xs font-medium
                        ${bet.outcome === 'win'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
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
        </div>
      )}

    </motion.div>
  );
};

export default DashboardPage;