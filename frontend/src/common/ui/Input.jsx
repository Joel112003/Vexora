import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const C = {
  bgCard:       '#0d1410',
  bgField:      '#111a14',
  border:       'rgba(85,211,150,0.08)',
  borderFocus:  'rgba(85,211,150,0.4)',
  borderError:  'rgba(239,68,68,0.5)',
  green:        '#55D396',
  white:        '#FFFFFF',
  offWhite:     '#E8EDE9',
  muted:        '#6B7B6E',
  error:        '#ef4444',
};
const FONT_BODY    = `'Barlow', 'Inter', sans-serif`;

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  rightElement,
  inputStyle,
  fontWeight = 500,
  labelWeight = 600,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const lifted   = focused || hasValue;
  const rightPadding = rightElement ? 44 : 14;

  const handleFocus = (e) => {
    setFocused(true);
    inputProps.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    inputProps.onBlur?.(e);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ position:'relative' }}>
        {/* Focus ring */}
        <motion.div
          style={{ position:'absolute', inset:-2, borderRadius:13, pointerEvents:'none', border:'1.5px solid' }}
          animate={{ borderColor: error ? C.borderError : focused ? C.borderFocus : 'transparent', opacity: error||focused ? 1 : 0 }}
          transition={{ duration:0.18 }}
        />

        {/* Field box */}
        <div style={{
          position:'relative', borderRadius:11, height:56, overflow:'hidden',
          backgroundColor: C.bgField,
          border:`1px solid ${error ? C.borderError : focused ? 'rgba(85,211,150,0.25)' : C.border}`,
          transition:'border-color 0.2s ease',
        }}>
          {/* Floating label */}
          {label && (
            <motion.label
              htmlFor={inputProps.id}
              style={{ position:'absolute', left:14, pointerEvents:'none', zIndex:2, fontFamily:FONT_BODY, fontWeight:labelWeight, transformOrigin:'left center' }}
              animate={{
                top:  lifted ? '8px' : '50%',
                y:    lifted ? '0%' : '-50%',
                fontSize: lifted ? '10px' : '14px',
                letterSpacing: lifted ? '0.1em' : '0',
                color: error ? C.error : focused ? C.green : C.muted,
              }}
              transition={{ duration:0.17, ease:[0.4,0,0.2,1] }}
            >
              {lifted ? label.toUpperCase() : label}
            </motion.label>
          )}

          <input
            {...inputProps}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={label ? (lifted ? placeholder : '') : placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              position:'relative', zIndex:1, width:'100%', height:'100%',
              background:'transparent', border:'none', outline:'none',
              padding: label ? `24px ${rightPadding}px 8px 14px` : `0 ${rightPadding}px 0 14px`,
              fontFamily: FONT_BODY, fontSize:15, fontWeight,
              color: C.offWhite, letterSpacing:'0.1px',
              ...inputStyle,
            }}
          />

          {rightElement && (
            <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', zIndex:3, display:'flex', alignItems:'center' }}>
              {rightElement}
            </div>
          )}

          {/* Bottom accent */}
          <motion.div
            style={{ position:'absolute', bottom:0, left:0, height:1.5, background: error ? C.error : C.green, transformOrigin:'left' }}
            animate={{ scaleX: focused ? 1 : 0 }}
            transition={{ duration:0.22, ease:[0.4,0,0.2,1] }}
            initial={{ scaleX:0 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{opacity:0,y:-4,height:0}} animate={{opacity:1,y:0,height:'auto'}} exit={{opacity:0,y:-4,height:0}}
            transition={{duration:0.16}}
            style={{ display:'flex', alignItems:'center', gap:6, paddingLeft:4, overflow:'hidden' }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill={C.error} style={{flexShrink:0}}>
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
            <span style={{ fontFamily:FONT_BODY, fontSize:12, fontWeight:500, color: C.error }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;