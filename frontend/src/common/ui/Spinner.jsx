import { motion } from 'framer-motion';

const Spinner = ({ size = 14, color = '#0f172a', thickness = 2 }) => (
  <motion.span
    aria-hidden="true"
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `${thickness}px solid ${color}`,
      borderTopColor: 'transparent',
      display: 'inline-block',
    }}
    animate={{ rotate: 360 }}
    transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
  />
);

export default Spinner;
