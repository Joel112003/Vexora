const FlipHistory = ({ history }) => {
  if (!history.length) return (
    <p className="text-[11px] text-center py-3" style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.2em' }}>
      No flips yet
    </p>
  );

  return (
    <div className="flex flex-col gap-2">
      {history.map((h, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: h.win ? '#55D396' : '#f43f5e' }}
            />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {h.result === 'heads' ? '👑' : '🌕'} {h.result}
            </span>
          </div>
          <span
            className="text-[10px] tracking-wider"
            style={{ color: h.win ? 'rgba(85,211,150,0.7)' : 'rgba(244,63,94,0.6)' }}
          >
            {h.win ? `+${h.payout}` : `−${h.betAmount}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FlipHistory;