import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogin } from '../hooks/useAuth';
import Input from '../common/ui/Input.jsx';
import Button from '../common/ui/Button.jsx';

/* ─── TOKENS ─── */
const C = {
  bg:           '#040605',
  bgCard:       '#0d1410',
  bgSubtle:     '#111a14',
  bgLeft:       '#060d08',
  border:       'rgba(85,211,150,0.08)',
  borderMid:    'rgba(85,211,150,0.15)',
  borderStrong: 'rgba(85,211,150,0.28)',
  green:        '#55D396',
  greenDeep:    '#169A50',
  greenDim:     'rgba(85,211,150,0.1)',
  greenDimmer:  'rgba(85,211,150,0.06)',
  white:        '#FFFFFF',
  offWhite:     '#E8EDE9',
  muted:        '#6B7B6E',
  mutedLight:   '#8A9E8D',
  faint:        '#2A3A2D',
  error:        '#ef4444',
};

const FONT_DISPLAY = `'General Sans', 'DM Sans', sans-serif`;
const FONT_BODY    = `'Barlow', 'Inter', sans-serif`;

/* ─── VARIANTS ─── */
const card = {
  hidden:  { opacity: 0, y: 24, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const fieldVar = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: 0.28 + i * 0.08, duration: 0.36, ease: [0.4, 0, 0.2, 1] } }),
};
const heroStagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};
const heroChild = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── SUB-COMPONENTS ─── */

function StepItem({ number, text, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 12,
      backgroundColor: active ? C.white : 'rgba(255,255,255,0.04)',
      border: active ? 'none' : '1px solid rgba(255,255,255,0.06)',
      transition: 'all 0.2s',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: active ? C.bg : 'rgba(255,255,255,0.08)',
        fontFamily: FONT_DISPLAY, fontSize: 11, fontWeight: 600,
        color: active ? C.green : 'rgba(255,255,255,0.3)',
      }}>
        {number}
      </div>
      <span style={{
        fontFamily: FONT_BODY, fontSize: 13, fontWeight: active ? 500 : 400,
        color: active ? C.bg : 'rgba(255,255,255,0.45)',
        letterSpacing: '0.1px',
      }}>
        {text}
      </span>
    </div>
  );
}

function SocialButton({ icon: Icon, label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      type="button"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', height: 44, borderRadius: 12, cursor: 'pointer',
        backgroundColor: hovered ? C.bgSubtle : C.bgCard,
        border: `1px solid ${hovered ? C.borderMid : C.border}`,
        fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500,
        color: hovered ? C.offWhite : C.muted,
        transition: 'all 0.18s ease',
        outline: 'none',
      }}
    >
      <Icon size={15} color={hovered ? C.green : C.muted} />
      {label}
    </motion.button>
  );
}

/* ─── GOOGLE & GITHUB INLINE SVG ICONS ─── */
const GoogleIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = ({ size = 15, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || 'currentColor'}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

/* ─── MAIN COMPONENT ─── */
const LoginPage = () => {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { mutate: login, isPending, error } = useLogin();

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    login(form);
  };

  return (
    <main style={{
      display: 'flex', minHeight: '100vh', width: '100%',
      backgroundColor: C.bg, fontFamily: FONT_BODY,
      padding: '8px', gap: 8,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 1023px) { .left-panel { display: none !important; } }
        button { cursor: pointer; }
        input:focus { outline: none; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <motion.div
        className="left-panel"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', alignItems: 'flex-start',
          width: '52%', flexShrink: 0, borderRadius: 20,
          overflow: 'hidden', padding: '40px 40px 48px',
          background: C.bgLeft,
        }}
      >
        {/* Background Video */}
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>

        {/* Subtle bottom gradient so text stays readable */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to top, rgba(4,6,5,0.82) 0%, rgba(4,6,5,0.3) 55%, rgba(4,6,5,0.0) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Hero content */}
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 340 }}
        >
          {/* Logo */}
          <motion.div variants={heroChild} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <motion.div
              style={{
                width: 36, height: 36, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: C.greenDim, border: `1px solid ${C.borderStrong}`,
              }}
              animate={{ boxShadow: ['0 0 0px rgba(85,211,150,0)', '0 0 20px rgba(85,211,150,0.25)', '0 0 0px rgba(85,211,150,0)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div style={{ width: 10, height: 10, backgroundColor: C.green, borderRadius: 3 }} />
            </motion.div>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.white, letterSpacing: '-0.3px' }}>
              Vexora
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={heroChild} style={{ marginBottom: 8 }}>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 600,
              color: C.white, letterSpacing: '-1.5px', lineHeight: 1.1, margin: 0,
            }}>
              Welcome back.
            </h2>
          </motion.div>

          <motion.div variants={heroChild} style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
              Your table is set. Sign in to continue your session.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div variants={heroChild} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <StepItem number="1" text="Sign in to your account" active={true} />
            <StepItem number="2" text="Pick up where you left off" active={false} />
            <StepItem number="3" text="Claim today's rewards" active={false} />
          </motion.div>

          {/* Bottom trust line */}
          <motion.p
            variants={heroChild}
            style={{ fontFamily: FONT_BODY, fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 32, letterSpacing: '0.3px' }}
          >
            Play responsibly · 18+ only · Licensed &amp; Secure
          </motion.p>
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', overflowY: 'auto', position: 'relative',
      }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(85,211,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(85,211,150,0.025) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 360, height: 200, pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(85,211,150,0.07) 0%, transparent 70%)',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}
        >
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            {/* Mobile logo only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <motion.div
                style={{
                  width: 32, height: 32, borderRadius: 9, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: C.greenDim, border: `1px solid ${C.borderStrong}`,
                }}
                animate={{ boxShadow: ['0 0 0px rgba(85,211,150,0)', '0 0 20px rgba(85,211,150,0.2)', '0 0 0px rgba(85,211,150,0)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div style={{ width: 9, height: 9, backgroundColor: C.green, borderRadius: 2.5 }} />
              </motion.div>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: C.white, letterSpacing: '-0.2px' }}>
                Vexora
              </span>
            </div>

            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: C.white, letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 8px' }}>
              Sign in
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 300, color: C.muted, margin: 0 }}>
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Social buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}
          >
            <SocialButton icon={GoogleIcon} label="Google" />
            <SocialButton icon={GithubIcon} label="GitHub" />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          </motion.div>

          {/* Card */}
          <motion.div
            variants={card}
            initial="hidden"
            animate="visible"
            style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: '28px' }}
          >
            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '12px 16px', borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: C.error, flexShrink: 0 }} />
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.error, margin: 0 }}>
                      {error.response?.data?.message || 'Something went wrong'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { field: 'email',    label: 'Email',    type: 'email' },
                { field: 'password', label: 'Password', type: 'password' },
              ].map(({ field: f, label, type }, i) => (
                <motion.div key={f} custom={i} variants={fieldVar} initial="hidden" animate="visible">
                  <Input
                    label={label}
                    type={type}
                    value={form[f]}
                    onChange={handleChange(f)}
                    error={errors[f]}
                  />
                </motion.div>
              ))}

              {/* Forgot password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.48 }}
                style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}
              >
                <span
                  style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500, color: C.muted, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.offWhite}
                  onMouseLeave={e => e.currentTarget.style.color = C.muted}
                >
                  Forgot password?
                </span>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.54 }}
                style={{ marginTop: 4 }}
              >
                <Button type="submit" loading={isPending} fullWidth>Sign in</Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Register link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            style={{ textAlign: 'center', marginTop: 20 }}
          >
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <motion.span
                style={{
                  fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, color: C.offWhite,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '9px 18px', borderRadius: 9999, border: `1px solid ${C.border}`,
                }}
                whileHover={{ borderColor: C.borderMid, color: C.white, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create an account →
              </motion.span>
            </Link>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}
          >
            {['🎰 Instant Access', '🏆 Leaderboards', '🎁 Daily Rewards'].map(label => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', padding: '5px 12px',
                borderRadius: 9999, border: `1px solid ${C.border}`,
                backgroundColor: C.greenDim, fontFamily: FONT_BODY, fontSize: 11,
                fontWeight: 500, color: C.muted, letterSpacing: '0.3px',
              }}>
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default LoginPage;