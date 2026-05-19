const Input = ({ label, type = 'text', value, onChange, placeholder, error }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-lg bg-[#0f1117] border text-white
          placeholder-gray-600 outline-none transition-all duration-200
          focus:ring-2 focus:ring-brand-primary focus:border-transparent
          ${error
            ? 'border-red-500'
            : 'border-brand-border hover:border-gray-500'
          }
        `}
      />
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
};

export default Input;