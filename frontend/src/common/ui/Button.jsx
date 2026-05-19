import { motion } from 'framer-motion';
import { useState } from 'react';

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
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };

  const variantStyles = {
    primary: {
      wrapper: 'from-amber-500 via-yellow-500 to-amber-600',
      inner: 'from-amber-400/20 via-yellow-300/10 to-transparent',
      glow: 'rgba(245,158,11,0.4)',
      text: 'text-black font-bold tracking-widest',
      border: 'border-amber-400/50',
    },
    secondary: {
      wrapper: 'from-gray-700 via-gray-800 to-gray-900',
      inner: 'from-white/10 via-white/5 to-transparent',
      glow: 'rgba(255,255,255,0.1)',
      text: 'text-white font-semibold tracking-wider',
      border: 'border-gray-600/50',
    },
    danger: {
      wrapper: 'from-red-600 via-red-700 to-red-800',
      inner: 'from-red-400/20 via-red-300/10 to-transparent',
      glow: 'rgba(239,68,68,0.4)',
      text: 'text-white font-bold tracking-widest',
      border: 'border-red-500/50',
    },
    success: {
      wrapper: 'from-emerald-500 via-emerald-600 to-emerald-700',
      inner: 'from-emerald-400/20 via-emerald-300/10 to-transparent',
      glow: 'rgba(16,185,129,0.4)',
      text: 'text-white font-bold tracking-widest',
      border: 'border-emerald-500/50',
    },
  };

  const style = variantStyles[variant] || variantStyles.primary;

  return (
    <motion.button
      type={type}
      onClick={(e) => {
        addRipple(e);
        onClick?.(e);
      }}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative overflow-hidden
        ${fullWidth ? 'w-full' : ''}
        disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
        outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50
        rounded-xl
        ${className}
      `}
      style={{
        filter: disabled || loading ? 'none' : undefined,
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-xl opacity-0 pointer-events-none"
        whileHover={{ opacity: disabled || loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{
          background: `linear-gradient(135deg, ${style.glow}, transparent, ${style.glow})`,
          filter: 'blur(4px)',
        }}
      />

      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.wrapper} rounded-xl`} />

      {/* Inner highlight */}
      <div className={`absolute inset-0 bg-gradient-to-b ${style.inner} rounded-xl`} />

      {/* Top shine line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-white/30 rounded-full" />

      {/* Border */}
      <div className={`absolute inset-0 rounded-xl border ${style.border}`} />

      {/* Ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{ left: r.x, top: r.y, x: '-50%', y: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Content */}
      <div className={`relative px-6 py-3.5 flex items-center justify-center gap-2 text-sm uppercase ${style.text}`}>
        {loading ? (
          <>
            <motion.span
              className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            />
            <span className="tracking-widest">Processing...</span>
          </>
        ) : (
          children
        )}
      </div>
    </motion.button>
  );
};

export default Button;