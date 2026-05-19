import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = ({ label, type = 'text', value, onChange, placeholder, error }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative flex flex-col gap-1">
      <div className="relative group">
        {/* Animated glow border */}
        <motion.div
          className="absolute -inset-[1px] rounded-xl opacity-0 pointer-events-none"
          animate={{
            opacity: focused ? 1 : 0,
            background: error
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
          }}
          transition={{ duration: 0.3 }}
          style={{ filter: focused ? 'blur(0px)' : 'blur(4px)' }}
        />

        {/* Inner container */}
        <div
          className={`
            relative rounded-xl overflow-hidden
            transition-all duration-300
            ${error
              ? 'shadow-[0_0_20px_rgba(239,68,68,0.15)]'
              : focused
                ? 'shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                : 'shadow-none'
            }
          `}
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-[#0a0a0f] rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-xl" />

          {/* Animated top highlight */}
          <motion.div
            className="absolute top-0 left-4 right-4 h-[1px]"
            animate={{
              background: error
                ? 'linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)'
                : focused
                  ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.8), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            }}
            transition={{ duration: 0.3 }}
          />

          {label && (
            <motion.label
              className="absolute left-4 font-medium tracking-wide pointer-events-none z-10"
              animate={{
                top: focused || hasValue ? '8px' : '50%',
                y: focused || hasValue ? '0%' : '-50%',
                fontSize: focused || hasValue ? '10px' : '14px',
                color: error
                  ? '#f87171'
                  : focused
                    ? '#f59e0b'
                    : '#6b7280',
                letterSpacing: focused || hasValue ? '0.08em' : '0em',
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {label.toUpperCase()}
            </motion.label>
          )}

          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={focused || hasValue ? '' : placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              relative w-full bg-transparent text-white
              px-4 pb-3 outline-none z-10
              font-light tracking-wide text-[15px]
              placeholder-gray-700
              transition-all duration-200
              ${label ? 'pt-6' : 'pt-3'}
            `}
          />

          {/* Bottom border line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-800" />
          <motion.div
            className="absolute bottom-0 left-0 h-[1px]"
            animate={{
              width: focused ? '100%' : '0%',
              background: error
                ? '#ef4444'
                : 'linear-gradient(90deg, #f59e0b, #d97706)',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
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
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 px-1"
          >
            <svg className="w-3 h-3 text-red-500 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
            <span className="text-[11px] text-red-400 tracking-wide">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;