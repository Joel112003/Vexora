import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRegister } from "../hooks/useAuth";
import Input from "../common/ui/Input.jsx";
import Button from "../common/ui/Button.jsx";

const Particle = ({ x, y, delay, size, duration }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: 'radial-gradient(circle, rgba(245,158,11,0.7) 0%, transparent 70%)',
      filter: 'blur(1px)',
    }}
    animate={{ y: [0, -35, 0], opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 3 + 3,
}));

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
    if (!form.confirmPassword)
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
      className="min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative"
      style={{ background: '#050508', fontFamily: "'Rajdhani', 'Barlow Condensed', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow:wght@300;400;500&display=swap');`}</style>

      {/* Backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[700px] h-[400px] opacity-15"
          style={{ background: 'radial-gradient(ellipse, #b45309 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-10"
          style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(245,158,11,0.3) 40px, rgba(245,158,11,0.3) 41px)' }} />
      </div>

      {particles.map((p) => <Particle key={p.id} {...p} />)}

      {/* Corner ornaments */}
      {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-16 h-16 opacity-25 pointer-events-none`}>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-amber-500 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-amber-500 to-transparent" />
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <motion.div
                className="w-14 h-14 rotate-45 border-2 border-amber-500/70 rounded-sm"
                animate={{ boxShadow: ['0 0 20px rgba(245,158,11,0.3)', '0 0 40px rgba(245,158,11,0.6)', '0 0 20px rgba(245,158,11,0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl" style={{ fontFamily: 'serif' }}>♦</span>
              </div>
            </div>
          </div>

          <h1
            className="text-4xl font-bold tracking-[0.15em] uppercase"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.4))',
            }}
          >
            Join the Table
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.2em] uppercase mt-2"
            style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
            Start with <span className="text-amber-500/80">1,000</span> free demo coins
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-[1px] rounded-2xl opacity-40"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.4), transparent 40%, rgba(245,158,11,0.1) 100%)' }} />

          <div
            className="relative rounded-2xl p-8 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(15,12,8,0.95) 0%, rgba(8,7,4,0.98) 100%)',
              border: '1px solid rgba(245,158,11,0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="absolute top-0 left-8 right-8 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />
            <div className="absolute top-0 left-0 right-0 h-40 opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 rounded-xl flex items-center gap-3"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <p className="text-sm text-red-400" style={{ fontFamily: 'Barlow, sans-serif' }}>
                      {error.response?.data?.message || "Something went wrong"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { field: 'username', label: 'Username', type: 'text', placeholder: 'coolplayer', delay: 0.3 },
                { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', delay: 0.35 },
                { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••', delay: 0.4 },
                { field: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', delay: 0.45 },
              ].map(({ field, label, type, placeholder, delay }) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay }}
                >
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
                transition={{ delay: 0.55 }}
                className="mt-1"
              >
                <Button type="submit" loading={isPending} fullWidth>
                  Claim Your Coins
                </Button>
              </motion.div>
            </form>

            {/* Bonus badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center justify-center gap-4 mt-5"
            >
              {['🎰 Instant Access', '🏆 Leaderboards', '🎁 Daily Rewards'].map((badge) => (
                <span key={badge} className="text-[10px] text-gray-600 tracking-wide"
                  style={{ fontFamily: 'Barlow, sans-serif' }}>
                  {badge}
                </span>
              ))}
            </motion.div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.15))' }} />
              <span className="text-[10px] text-gray-700 tracking-[0.25em] uppercase" style={{ fontFamily: 'Barlow, sans-serif' }}>Have an account?</span>
              <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.15), transparent)' }} />
            </div>

            <p className="text-center">
              <Link to="/login">
                <motion.span
                  className="inline-block text-amber-500/80 hover:text-amber-400 transition-colors tracking-widest uppercase text-xs cursor-pointer"
                  whileHover={{ letterSpacing: '0.35em' }}
                  transition={{ duration: 0.3 }}
                >
                  Sign In →
                </motion.span>
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[10px] text-gray-700 mt-6 tracking-[0.25em] uppercase"
          style={{ fontFamily: 'Barlow, sans-serif' }}
        >
          Play responsibly · 18+ only · Licensed & Secure
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;