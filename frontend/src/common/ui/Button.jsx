import { useState } from 'react';
import { motion } from 'framer-motion';

const C = {
  green:     '#55D396',
  greenDeep: '#169A50',
  greenDim:  'rgba(85,211,150,0.1)',
  bg:        '#040605',
  border:    'rgba(85,211,150,0.15)',
  offWhite:  '#E8EDE9',
  muted:     '#6B7B6E',
  disabled:  '#2A3A2D',
};
const FONT_DISPLAY = `'General Sans', 'DM Sans', sans-serif`;

const VARIANTS = {
  primary: {
    bg:       C.green,
    hoverBg:  '#6AEAAA',
    border:   C.green,
    color:    C.bg,
    ripple:   'rgba(4,6,5,0.12)',
  },
  secondary: {
    bg:       'transparent',
    hoverBg:  C.greenDim,
    border:   C.border,
    color:    C.offWhite,
    ripple:   'rgba(85,211,150,0.08)',
  },
  ghost: {
    bg:       'transparent',
    hoverBg:  C.greenDim,
    border:   'transparent',
    color:    C.muted,
    ripple:   'rgba(85,211,150,0.06)',
  },
};

const Button = ({
  children,
  onClick,
  type     = 'button',
  loading  = false,
  disabled = false,
  variant  = 'primary',
  fullWidth = false,
  className = '',
}) => {
  const [ripples, setRipples] = useState([]);
  const [hovered, setHovered] = useState(false);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id   = Date.now();
    setRipples(p => [...p, { x: e.clientX-rect.left, y: e.clientY-rect.top, id }]);
    setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 600);
  };

  const v    = VARIANTS[variant] || VARIANTS.primary;
  const isOff = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={(e) => { if(isOff) return; addRipple(e); onClick?.(e); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={isOff}
      whileTap={{ scale: isOff ? 1 : 0.97 }}
      transition={{ type:'spring', stiffness:500, damping:30 }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        position:'relative', overflow:'hidden', outline:'none',
        width: fullWidth ? '100%' : 'auto',
        height:44,
        background: isOff ? C.disabled : hovered ? v.hoverBg : v.bg,
        border:`1px solid ${isOff ? C.disabled : v.border}`,
        borderRadius:10,
        cursor: isOff ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition:'background 0.18s ease, border-color 0.18s ease',
      }}
    >
      {ripples.map(r => (
        <motion.span
          key={r.id}
          style={{ position:'absolute', left:r.x, top:r.y, x:'-50%', y:'-50%', borderRadius:'50%', background: v.ripple, pointerEvents:'none', zIndex:0 }}
          initial={{ width:0, height:0, opacity:0.8 }}
          animate={{ width:260, height:260, opacity:0 }}
          transition={{ duration:0.5, ease:'easeOut' }}
        />
      ))}

      <div style={{
        position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0 20px',
        fontFamily: FONT_DISPLAY, fontSize:14, fontWeight:600, letterSpacing:'-0.1px',
        color: isOff ? C.muted : v.color,
      }}>
        {loading ? (
          <>
            <motion.span
              style={{ width:13, height:13, borderRadius:'50%', border:`1.5px solid ${v.color}`, borderTopColor:'transparent', display:'inline-block' }}
              animate={{ rotate:360 }} transition={{ duration:0.65, repeat:Infinity, ease:'linear' }}
            />
            <span>Processing…</span>
          </>
        ) : children}
      </div>
    </motion.button>
  );
};

export default Button;