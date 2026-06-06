const CHOICES = [
  { value: 'heads', symbol: '👑', label: 'Heads', active: 'rgba(218,165,32,0.12)', activeBorder: 'rgba(218,165,32,0.45)', activeText: '#ffd700' },
  { value: 'tails', symbol: '🌕', label: 'Tails', active: 'rgba(112,112,200,0.12)', activeBorder: 'rgba(112,112,200,0.45)', activeText: '#b0b0ff' },
];

const ChoicePicker = ({ choice, onChange, disabled }) => (
  <div className="flex gap-3 w-full">
    {CHOICES.map(({ value, symbol, label, active, activeBorder, activeText }) => {
      const isActive = choice === value;
      return (
        <button
          key={value}
          onClick={() => onChange(value)}
          disabled={disabled}
          className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] tracking-[0.2em] uppercase font-mono font-medium"
          style={{
            background: isActive ? active : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isActive ? activeBorder : 'rgba(255,255,255,0.08)'}`,
            color: isActive ? activeText : 'rgba(255,255,255,0.35)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <span className="text-base">{symbol}</span>
          {label}
        </button>
      );
    })}
  </div>
);

export default ChoicePicker;