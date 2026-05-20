import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRegister } from "../hooks/useAuth";
import Input from "../common/ui/Input.jsx";
import Button from "../common/ui/Button.jsx";

/* ─── Morphing clay blob ─── */
const Blob = ({ style, animate, transition }) => (
  <motion.div
    style={{
      position: 'absolute',
      pointerEvents: 'none',
      borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
      ...style,
    }}
    animate={animate}
    transition={transition}
  />
);

/* ─── Feature highlight tile ─── */
const FeatureTile = ({ emoji, label, bg, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -2, scale: 1.02 }}
    style={{
      flex: 1,
      minWidth: 0,
      background: bg,
      borderRadius: '16px',
      padding: '16px 12px',
      textAlign: 'center',
      cursor: 'default',
    }}
  >
    <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
    <div style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      fontWeight: 600,
      color: '#3a3a3a',
      lineHeight: 1.3,
    }}>
      {label}
    </div>
  </motion.div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.07, duration: 0.38, ease: [0.4, 0, 0.2, 1] },
  }),
};

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { mutate: register, isPending, error } = useRegister();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username || form.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword || form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    delete payload.confirmPassword;
    register(payload);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fffaf0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Background blobs */}
      <Blob
        style={{
          width: 500, height: 440,
          top: '-100px', left: '-80px',
          background: 'linear-gradient(135deg, #b8a4ed 0%, #a4d4c5 80%)',
          opacity: 0.2,
        }}
        animate={{ borderRadius: ['60% 40% 55% 45% / 50% 60% 40% 50%', '45% 55% 40% 60% / 60% 40% 55% 45%', '60% 40% 55% 45% / 50% 60% 40% 50%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Blob
        style={{
          width: 360, height: 320,
          bottom: '-60px', right: '-50px',
          background: 'linear-gradient(135deg, #e8b94a 0%, #ffb084 100%)',
          opacity: 0.22,
        }}
        animate={{ borderRadius: ['55% 45% 60% 40% / 45% 55% 45% 55%', '40% 60% 45% 55% / 55% 45% 60% 40%', '55% 45% 60% 40% / 45% 55% 45% 55%'] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <Blob
        style={{
          width: 180, height: 160,
          top: '55%', right: '5%',
          background: '#ff4d8b',
          opacity: 0.14,
        }}
        animate={{ borderRadius: ['50% 50% 60% 40%', '60% 40% 50% 50%', '50% 50% 60% 40%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.5,
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '28px' }}
        >
          {/* Logo blob */}
          <motion.div
            style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #b8a4ed 0%, #ff4d8b 100%)',
              borderRadius: '55% 45% 40% 60% / 50% 55% 45% 50%',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(184,164,237,0.32)',
            }}
            animate={{
              borderRadius: ['55% 45% 40% 60% / 50% 55% 45% 50%', '40% 60% 55% 45% / 55% 45% 50% 55%', '55% 45% 40% 60% / 50% 55% 45% 50%'],
              y: [0, -4, 0],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={{ fontSize: 22 }}>✦</span>
          </motion.div>

          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '40px',
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            color: '#0a0a0a',
            margin: 0,
          }}>
            Join the table
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#6a6a6a',
            marginTop: '8px',
          }}>
            Start with <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>1,000</strong> free demo coins
          </p>
        </motion.div>

        {/* Feature tiles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}
        >
          <FeatureTile emoji="🎰" label="Instant Access" bg="#faf5e8" delay={0.2} />
          <FeatureTile emoji="🏆" label="Leaderboards" bg="#f5f0e0" delay={0.25} />
          <FeatureTile emoji="🎁" label="Daily Rewards" bg="#ebe6d6" delay={0.3} />
        </motion.div>

        {/* Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: '#fffaf0',
            border: '1px solid #e5e5e5',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 2px 48px rgba(10,10,10,0.06), 0 1px 4px rgba(10,10,10,0.04)',
          }}
        >
          {/* API error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: '20px' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#ef4444', margin: 0 }}>
                    {error.response?.data?.message || "Something went wrong"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { field: 'username', label: 'Username', type: 'text', placeholder: 'coolplayer' },
              { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { field: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(({ field, label, type, placeholder }, i) => (
              <motion.div key={field} custom={i} variants={fieldVariants} initial="hidden" animate="visible">
                <Input
                  label={label}
                  type={type}
                  value={form[field]}
                  onChange={handleChange(field)}
                  placeholder={placeholder}
                  error={errors[field]}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 }}
            >
              <Button type="submit" loading={isPending} fullWidth>
                Claim your coins →
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#9a9a9a', fontWeight: 500 }}>
              Have an account?
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.78 }}
            style={{ textAlign: 'center' }}
          >
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <motion.span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0a0a0a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: '#f5f0e0',
                }}
                whileHover={{ background: '#ebe6d6', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign in →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Legal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: '#9a9a9a',
            marginTop: '16px',
            fontWeight: 500,
          }}
        >
          Play responsibly · 18+ only · Licensed &amp; Secure
        </motion.p>
      </div>
    </div>
  );
};

export default RegisterPage;