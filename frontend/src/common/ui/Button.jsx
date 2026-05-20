import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Clay UI — Button
 * Canvas: #fffaf0 | Ink: #0a0a0a | Inter 600 14px
 * Variants: primary (ink), secondary (outlined cream), pink, teal, peach
 */
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
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  const variants = {
    primary: {
      bg: '#0a0a0a',
      border: '#0a0a0a',
      color: '#ffffff',
      hoverBg: '#1f1f1f',
      ripple: 'rgba(255,255,255,0.12)',
    },
    secondary: {
      bg: '#fffaf0',
      border: '#e5e5e5',
      color: '#0a0a0a',
      hoverBg: '#f5f0e0',
      ripple: 'rgba(10,10,10,0.06)',
    },
    pink: {
      bg: '#ff4d8b',
      border: '#ff4d8b',
      color: '#ffffff',
      hoverBg: '#e6356e',
      ripple: 'rgba(255,255,255,0.15)',
    },
    teal: {
      bg: '#1a3a3a',
      border: '#1a3a3a',
      color: '#ffffff',
      hoverBg: '#0f2525',
      ripple: 'rgba(255,255,255,0.12)',
    },
    peach: {
      bg: '#ffb084',
      border: '#ffb084',
      color: '#0a0a0a',
      hoverBg: '#ffa070',
      ripple: 'rgba(10,10,10,0.08)',
    },
  };

  const v = variants[variant] || variants.primary;
  const [hovered, setHovered] = useState(false);
  const isOff = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={(e) => {
        if (isOff) return;
        addRipple(e);
        onClick?.(e);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={isOff}
      whileTap={{ scale: isOff ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative overflow-hidden outline-none ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        background: hovered && !isOff ? v.hoverBg : isOff ? '#e5e5e5' : v.bg,
        border: `1px solid ${isOff ? '#e5e5e5' : v.border}`,
        borderRadius: '12px',
        padding: '0',
        cursor: isOff ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.2s ease, border-color 0.2s ease',
        height: '44px',
      }}
    >
      {/* Ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            x: '-50%',
            y: '-50%',
            borderRadius: '50%',
            background: v.ripple,
            pointerEvents: 'none',
            zIndex: 0,
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 280, height: 280, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '0 20px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0',
          color: isOff ? '#6a6a6a' : v.color,
        }}
      >
        {loading ? (
          <>
            <motion.span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: `2px solid ${v.color}`,
                borderTopColor: 'transparent',
                display: 'inline-block',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            />
            <span>Processing…</span>
          </>
        ) : (
          children
        )}
      </div>
    </motion.button>
  );
};

export default Button;