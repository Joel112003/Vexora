import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Clay UI — Input
 * Canvas: #fffaf0 | Hairline: #e5e5e5 | Focus: ink border
 * Floating label, cream background, 12px rounded
 */
const Input = ({ label, type = 'text', value, onChange, placeholder, error }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const lifted = focused || hasValue;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ position: 'relative' }}>
        {/* Focus ring — ink outline */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '14px',
            pointerEvents: 'none',
            border: '2px solid',
          }}
          animate={{
            borderColor: error
              ? '#ef4444'
              : focused
              ? '#0a0a0a'
              : 'transparent',
            opacity: error ? 1 : focused ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Field box */}
        <div
          style={{
            position: 'relative',
            background: '#fffaf0',
            border: `1px solid ${error ? '#ef4444' : focused ? '#0a0a0a' : '#e5e5e5'}`,
            borderRadius: '12px',
            height: '56px',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease',
          }}
        >
          {/* Floating label */}
          {label && (
            <motion.label
              style={{
                position: 'absolute',
                left: '16px',
                pointerEvents: 'none',
                zIndex: 2,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                transformOrigin: 'left center',
              }}
              animate={{
                top: lifted ? '8px' : '50%',
                y: lifted ? '0%' : '-50%',
                fontSize: lifted ? '10px' : '14px',
                letterSpacing: lifted ? '0.08em' : '0',
                color: error ? '#ef4444' : focused ? '#0a0a0a' : '#9a9a9a',
              }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            >
              {lifted ? label.toUpperCase() : label}
            </motion.label>
          )}

          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={lifted ? '' : placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: label ? '24px 16px 8px' : '0 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 400,
              color: '#0a0a0a',
              letterSpacing: '0',
            }}
          />

          {/* Bottom accent line on focus */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              background: error ? '#ef4444' : '#0a0a0a',
              transformOrigin: 'left',
            }}
            animate={{ scaleX: focused ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            initial={{ scaleX: 0 }}
          />
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              paddingLeft: '4px',
              overflow: 'hidden',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#ef4444" style={{ flexShrink: 0 }}>
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              color: '#ef4444',
              letterSpacing: '0',
            }}>
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;