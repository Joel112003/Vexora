import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  className = '',
}) => {
  const base = `
    relative px-6 py-3 rounded-lg font-medium text-sm
    transition-all duration-200 outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: 'bg-brand-primary hover:bg-purple-700 text-white',
    secondary: 'bg-brand-card border border-brand-border hover:border-gray-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;