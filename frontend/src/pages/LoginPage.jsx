import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin } from "../hooks/useAuth";
import Input from "../common/ui/Input.jsx";
import Button from "../common/ui/Button.jsx";

/* ─── Floating blob shapes (claymation-inspired) ─── */
const Blob = ({ style, animate, transition }) => (
  <motion.div
    style={{
      position: 'absolute',
      borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
      pointerEvents: 'none',
      ...style,
    }}
    animate={animate}
    transition={transition}
  />
);

/* ─── Badge pill ─── */
const Badge = ({ children, color = '#f5f0e0' }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    background: color,
    borderRadius: '9999px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 600,
    color: '#3a3a3a',
    letterSpacing: '0',
  }}>
    {children}
  </span>
);

/* ─── Staggered card entry ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { mutate: login, isPending, error } = useLogin();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login(form);
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
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Clay blobs — decorative background shapes */}
      <Blob
        style={{
          width: 420, height: 380,
          top: '-80px', right: '-60px',
          background: 'linear-gradient(135deg, #ffb084 0%, #ff4d8b 100%)',
          opacity: 0.22,
        }}
        animate={{ borderRadius: ['60% 40% 55% 45% / 50% 60% 40% 50%', '45% 55% 40% 60% / 60% 40% 55% 45%', '60% 40% 55% 45% / 50% 60% 40% 50%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Blob
        style={{
          width: 320, height: 300,
          bottom: '-60px', left: '-40px',
          background: 'linear-gradient(135deg, #b8a4ed 0%, #a4d4c5 100%)',
          opacity: 0.25,
        }}
        animate={{ borderRadius: ['55% 45% 60% 40% / 45% 55% 45% 55%', '40% 60% 45% 55% / 55% 45% 60% 40%', '55% 45% 60% 40% / 45% 55% 45% 55%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <Blob
        style={{
          width: 200, height: 180,
          top: '40%', left: '-30px',
          background: '#e8b94a',
          opacity: 0.18,
        }}
        animate={{ borderRadius: ['50% 50% 60% 40% / 40% 60% 50% 50%', '60% 40% 50% 50% / 50% 50% 40% 60%', '50% 50% 60% 40% / 40% 60% 50% 50%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Subtle dot pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.5,
      }} />

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>

        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          {/* Claymation logo blob */}
          <motion.div
            style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #ff4d8b 0%, #ffb084 100%)',
              borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(255,77,139,0.28)',
            }}
            animate={{
              borderRadius: ['40% 60% 55% 45% / 50% 45% 55% 50%', '55% 45% 40% 60% / 45% 55% 50% 50%', '40% 60% 55% 45% / 50% 45% 55% 50%'],
              y: [0, -4, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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
            Welcome back
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#6a6a6a',
            marginTop: '8px',
          }}>
            Sign in to your account
          </p>
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
            padding: '40px 36px',
            boxShadow: '0 2px 48px rgba(10,10,10,0.06), 0 1px 4px rgba(10,10,10,0.04)',
          }}
        >
          {/* API Error */}
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
              { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
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

            {/* Forgot password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}
            >
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#6a6a6a',
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationColor: 'transparent',
                transition: 'color 0.2s, text-decoration-color 0.2s',
              }}
              onMouseEnter={e => { e.target.style.color = '#0a0a0a'; e.target.style.textDecorationColor = '#0a0a0a'; }}
              onMouseLeave={e => { e.target.style.color = '#6a6a6a'; e.target.style.textDecorationColor = 'transparent'; }}
              >
                Forgot password?
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Button type="submit" loading={isPending} fullWidth>
                Sign in
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#9a9a9a', fontWeight: 500 }}>
              New here?
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ textAlign: 'center' }}
          >
            <Link to="/register" style={{ textDecoration: 'none' }}>
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
                  transition: 'background 0.2s',
                }}
                whileHover={{ background: '#ebe6d6', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create an account →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}
        >
          {[
            { label: '🎰 Instant Access', color: '#faf5e8' },
            { label: '🏆 Leaderboards', color: '#faf5e8' },
            { label: '🎁 Daily Rewards', color: '#faf5e8' },
          ].map(({ label, color }) => (
            <Badge key={label} color={color}>{label}</Badge>
          ))}
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

export default LoginPage;