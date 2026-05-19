const StatCard = ({ label, value, sub }) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-5">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-white text-2xl font-bold">{value}</p>
      {sub && (
        <p className="text-gray-500 text-xs mt-1">{sub}</p>
      )}
    </div>
  );
};

export default StatCard;