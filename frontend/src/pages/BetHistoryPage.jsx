import { useState }       from 'react';
import { motion }         from 'framer-motion';
import { useQuery }       from '@tanstack/react-query';
import { useAuthStore }   from '../store/authStore';
import { SkeletonRow }    from '../components/ui/Skeleton';
import api                from '../api/axios';

const FILTERS = ['all', 'dice', 'coinflip', 'mines', 'crash'];

const BetHistoryPage = () => {
  const { user }   = useAuthStore();
  const [filter,   setFilter]   = useState('all');
  const [page,     setPage]     = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['allBets', user?.id, filter, page],
    enabled:  !!user,

    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(filter !== 'all' && { gameType: filter }),
      });
      const res = await api.get(`/user/bets/all?${params}`);
      return res.data.data;
    },
  });

  const bets  = data?.bets  ?? [];
  const total = data?.total ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Bet history</h1>
        <p className="text-gray-400 text-sm">
          All your bets across every game.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium capitalize
              transition-colors
              ${filter === f
                ? 'bg-brand-primary text-white'
                : 'bg-brand-card border border-brand-border text-gray-400 hover:text-white'
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left text-gray-400 font-medium px-4 py-3">
                Game
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3">
                Bet
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3">
                Multiplier
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3">
                Payout
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3">
                Result
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3
                             hidden md:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-brand-border">
                  <td colSpan={6} className="px-4">
                    <SkeletonRow />
                  </td>
                </tr>
              ))
            ) : bets.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-12"
                >
                  No bets found
                </td>
              </tr>
            ) : (
              bets.map((bet, i) => (
                <motion.tr
                  key={bet._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
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
                  <td className="px-4 py-3 text-right text-gray-500
                                 text-xs hidden md:table-cell">
                    {new Date(bet.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border
                         text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 20 >= total}
              className="px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border
                         text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BetHistoryPage;