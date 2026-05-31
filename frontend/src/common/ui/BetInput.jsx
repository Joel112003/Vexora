
const QUICK_AMOUNTS = [10, 25, 50, 100, 250];

const BetInput = ({ value, onChange, disabled, balance }) => {
  const handleHalf = () => onChange(Math.max(1, Math.floor(value / 2)));
  const handleDouble = () => onChange(Math.min(balance, value * 2));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-400">Bet amount</label>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 text-sm">
            🪙
          </span>
          <input
            type="number"
            min={1}
            max={balance}
            value={value}
            onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
            disabled={disabled}
            className="w-full pl-8 pr-4 py-3 rounded-lg bg-brand-bg border border-brand-border
                       text-white outline-none focus:ring-2 focus:ring-brand-primary
                       focus:border-transparent disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleHalf}
          disabled={disabled}
          className="px-3 py-3 rounded-lg bg-brand-card border border-brand-border
                     text-gray-400 hover:text-white text-sm disabled:opacity-50"
        >
          ½
        </button>
        <button
          onClick={handleDouble}
          disabled={disabled}
          className="px-3 py-3 rounded-lg bg-brand-card border border-brand-border
                     text-gray-400 hover:text-white text-sm disabled:opacity-50"
        >
          2×
        </button>
      </div>

      {/* Quick amounts */}
      <div className="flex gap-2 flex-wrap">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onChange(amount)}
            disabled={disabled || amount > balance}
            className="px-3 py-1.5 rounded-md bg-brand-card border border-brand-border
                       text-xs text-gray-400 hover:text-white hover:border-gray-500
                       disabled:opacity-30 transition-colors"
          >
            {amount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BetInput;