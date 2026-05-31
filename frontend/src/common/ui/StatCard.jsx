const StatCard = ({ label, value, sub }) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
      <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em] mb-3 relative">
        {label}
      </p>
      <p className="text-white text-2xl font-semibold relative">{value}</p>
      {sub && (
        <p className="text-zinc-500 text-xs mt-2 relative">{sub}</p>
      )}
    </div>
  );
};

export default StatCard;