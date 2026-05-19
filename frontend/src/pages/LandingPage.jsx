import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ─── helpers ─── */
const rand = (min, max) => Math.random() * (max - min) + min;

const Particle = ({ x, y, delay, size, duration, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`, top: `${y}%`,
      width: size, height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: 'blur(1px)',
    }}
    animate={{ y: [0, -60, 0], opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.5] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const particles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: rand(0, 100), y: rand(0, 100),
  delay: rand(0, 6),
  size: rand(2, 6),
  duration: rand(3, 7),
  color: i % 3 === 0
    ? 'rgba(245,158,11,0.9)'
    : i % 3 === 1
      ? 'rgba(251,191,36,0.7)'
      : 'rgba(180,83,9,0.6)',
}));

/* ─── Animated counter ─── */
const Counter = ({ to, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const inc = to / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += inc;
      if (current >= to) { setCount(to); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, (duration * 1000) / steps);
    return () => clearInterval(interval);
  }, [started, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Game card ─── */
const GameCard = ({ icon, name, tag, gradient, delay, glow }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative rounded-2xl overflow-hidden cursor-pointer group"
    style={{ aspectRatio: '3/4' }}
  >
    {/* Glow on hover */}
    <motion.div
      className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
      style={{ background: glow, filter: 'blur(15px)' }}
    />

    {/* Card bg */}
    <div className="absolute inset-0" style={{ background: gradient }} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* Border */}
    <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors duration-300" />
    <div className="absolute top-0 left-4 right-4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />

    {/* Content */}
    <div className="absolute inset-0 flex flex-col justify-between p-6">
      <div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {icon}
        </div>
        {tag && (
          <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-full"
            style={{
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b',
              fontFamily: 'Barlow, sans-serif',
            }}>
            {tag}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-white text-xl font-bold tracking-[0.1em] uppercase"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          {name}
        </h3>
        <p className="text-gray-400 text-xs mt-1 tracking-wide"
          style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
          Play now →
        </p>
      </div>
    </div>
  </motion.div>
);

/* ─── Stat card ─── */
const StatCard = ({ value, suffix, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="text-center py-8 px-6 rounded-2xl relative overflow-hidden"
    style={{
      background: 'linear-gradient(145deg, rgba(20,16,8,0.9), rgba(8,7,4,0.95))',
      border: '1px solid rgba(245,158,11,0.12)',
    }}
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[1px]"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }} />
    <div
      className="text-4xl font-bold mb-2"
      style={{
        fontFamily: 'Rajdhani, sans-serif',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.3))',
      }}
    >
      <Counter to={value} suffix={suffix} />
    </div>
    <p className="text-gray-500 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'Barlow, sans-serif' }}>
      {label}
    </p>
  </motion.div>
);

/* ─── Main Landing Page ─── */
const LandingPage = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    { name: 'Alex R.', role: 'High Roller', text: 'The most immersive casino platform I\'ve ever played on. The animations are insane.', coins: '₿ 2.4M' },
    { name: 'Mia K.', role: 'Pro Player', text: 'Interface is buttery smooth. Feels like a real casino, minus the smoke.', coins: '₿ 890K' },
    { name: 'Jordan T.', role: 'Crash King', text: 'Crash game is absolutely addictive. The UI makes everything more thrilling.', coins: '₿ 5.1M' },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: '#050508',
        fontFamily: "'Rajdhani', 'Barlow', sans-serif",
        color: 'white',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: rgba(245,158,11,0.3); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(5,5,8,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(245,158,11,0.08)',
        }}
      >
        <div className="h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rotate-45 border-2 border-amber-500/70 rounded-sm flex items-center justify-center"
              animate={{ boxShadow: ['0 0 10px rgba(245,158,11,0.3)', '0 0 25px rgba(245,158,11,0.6)', '0 0 10px rgba(245,158,11,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm -rotate-45" style={{ fontFamily: 'serif' }}>♠</span>
            </motion.div>
            <span className="text-xl font-bold tracking-[0.15em] uppercase"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Casino Demo
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Games', 'Leaderboard', 'Promotions', 'About'].map((item) => (
              <span key={item}
                className="text-sm tracking-[0.1em] uppercase text-gray-500 hover:text-amber-400 cursor-pointer transition-colors"
                style={{ fontFamily: 'Barlow, sans-serif' }}>
                {item}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <motion.span
                className="text-sm tracking-[0.1em] uppercase text-gray-400 hover:text-amber-400 cursor-pointer transition-colors px-4 py-2 rounded-lg"
                style={{ border: '1px solid rgba(245,158,11,0.15)', fontFamily: 'Barlow, sans-serif' }}
                whileHover={{ borderColor: 'rgba(245,158,11,0.4)' }}
              >
                Sign In
              </motion.span>
            </Link>
            <Link to="/register">
              <motion.span
                className="text-sm font-bold tracking-[0.1em] uppercase px-5 py-2 rounded-lg cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Play Free
              </motion.span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-20 rounded-full"
            style={{ background: 'radial-gradient(ellipse, #b45309 0%, transparent 60%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)', filter: 'blur(40px)' }} />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

          {/* Diagonal glow strips */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(245,158,11,1) 60px, rgba(245,158,11,1) 61px)' }} />
        </div>

        {/* Particles */}
        {particles.map((p) => <Particle key={p.id} {...p} />)}

        {/* Corner ornaments */}
        {['top-24 left-8', 'top-24 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-20 h-20 opacity-20 pointer-events-none`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-amber-500 to-transparent" />
          </div>
        ))}

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.25)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-amber-500"
            />
            <span className="text-amber-400/80 text-xs tracking-[0.25em] uppercase"
              style={{ fontFamily: 'Barlow, sans-serif' }}>
              Now Live — 5 Games Available
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6"
            style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
          >
            <span className="block text-white">The Ultimate</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #d97706 70%, #f59e0b 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.5))',
                animation: 'shine 3s linear infinite',
              }}
            >
              Casino
            </span>
            <span className="block text-white">Experience</span>
          </motion.h1>

          <style>{`
            @keyframes shine {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}</style>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}
          >
            Dice, Coinflip, Mines, Crash & more. Play with
            <span className="text-amber-400"> 1,000 free demo coins </span>
            — no deposit required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(245,158,11,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="relative px-10 py-4 rounded-xl font-bold text-sm tracking-[0.2em] uppercase overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '15px',
                }}
              >
                <span className="relative z-10">🎰 Play for Free</span>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
              </motion.button>
            </Link>

            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02, borderColor: 'rgba(245,158,11,0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 rounded-xl font-semibold text-sm tracking-[0.15em] uppercase text-gray-300 hover:text-amber-400 transition-colors"
                style={{
                  border: '1px solid rgba(245,158,11,0.2)',
                  fontFamily: 'Barlow, sans-serif',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                Sign In →
              </motion.button>
            </Link>
          </motion.div>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-8 mt-16"
          >
            {[
              { value: '99.2', suffix: '%', label: 'Uptime' },
              { value: '12', suffix: 'ms', label: 'Avg Latency' },
              { value: '100', suffix: '%', label: 'Provably Fair' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold"
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  {s.value}{s.suffix}
                </div>
                <div className="text-[11px] text-gray-600 tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'Barlow, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] text-gray-700 tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Barlow, sans-serif' }}>Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-amber-500/40 to-transparent" />
        </motion.div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(245,158,11,0.02) 50%, transparent)' }} />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={48200} suffix="+" label="Active Players" delay={0} />
          <StatCard value={2100000} suffix="+" label="Games Played" delay={0.1} />
          <StatCard value={99} suffix="%" label="Satisfaction Rate" delay={0.2} />
          <StatCard value={5} suffix="" label="Live Games" delay={0.3} />
        </div>
      </section>

      {/* ── GAMES SECTION ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-amber-500/60 text-xs tracking-[0.35em] uppercase mb-3"
              style={{ fontFamily: 'Barlow, sans-serif' }}>Our Games</p>
            <h2 className="text-5xl font-bold uppercase tracking-[0.1em]"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'linear-gradient(135deg, #fff, #a3a3a3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Choose Your Game
            </h2>
            <div className="w-24 h-[1px] mx-auto mt-6"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)' }} />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: '⚄', name: 'Dice', tag: 'Classic', gradient: 'linear-gradient(145deg, #1a0a00, #3d1500)', glow: 'rgba(245,158,11,0.3)', delay: 0 },
              { icon: '🪙', name: 'Coinflip', tag: 'Quick', gradient: 'linear-gradient(145deg, #0a1500, #1a3000)', glow: 'rgba(16,185,129,0.3)', delay: 0.08 },
              { icon: '💣', name: 'Mines', tag: '🔥 Hot', gradient: 'linear-gradient(145deg, #14000a, #300014)', glow: 'rgba(239,68,68,0.3)', delay: 0.16 },
              { icon: '📈', name: 'Crash', tag: 'High Risk', gradient: 'linear-gradient(145deg, #000e1a, #001a35)', glow: 'rgba(59,130,246,0.3)', delay: 0.24 },
              { icon: '🎰', name: 'Coming Soon', tag: 'Soon™', gradient: 'linear-gradient(145deg, #0a0010, #14002a)', glow: 'rgba(139,92,246,0.3)', delay: 0.32 },
            ].map((g) => <GameCard key={g.name} {...g} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(245,158,11,0.3) 50px, rgba(245,158,11,0.3) 51px)' }} />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-500/60 text-xs tracking-[0.35em] uppercase mb-3" style={{ fontFamily: 'Barlow, sans-serif' }}>Simple Steps</p>
            <h2 className="text-5xl font-bold uppercase tracking-[0.1em]"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'linear-gradient(135deg, #fff, #a3a3a3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Get Started in 60 Seconds
            </h2>
            <div className="w-24 h-[1px] mx-auto mt-6"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)' }} />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), rgba(245,158,11,0.2), transparent)' }} />

            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free in seconds. No deposit needed, ever.', icon: '🎭' },
              { step: '02', title: 'Claim Free Coins', desc: 'Get 1,000 demo coins instantly to start playing.', icon: '🪙' },
              { step: '03', title: 'Play & Win', desc: 'Pick any game, place your bets, feel the rush.', icon: '🏆' },
            ].map(({ step, title, desc, icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl p-8 text-center"
                style={{
                  background: 'linear-gradient(145deg, rgba(20,16,8,0.8), rgba(8,7,4,0.9))',
                  border: '1px solid rgba(245,158,11,0.1)',
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />

                <div className="text-4xl mb-4">{icon}</div>

                <div className="text-6xl font-bold mb-3 opacity-10"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f59e0b' }}>
                  {step}
                </div>

                <h3 className="text-white text-xl font-bold tracking-[0.1em] uppercase mb-3"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-500/60 text-xs tracking-[0.35em] uppercase mb-3" style={{ fontFamily: 'Barlow, sans-serif' }}>Players Say</p>
            <h2 className="text-4xl font-bold uppercase tracking-[0.1em] mb-12"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'linear-gradient(135deg, #fff, #a3a3a3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              Trusted by Thousands
            </h2>

            <div
              className="relative rounded-2xl p-8 overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(20,16,8,0.9), rgba(8,7,4,0.95))',
                border: '1px solid rgba(245,158,11,0.1)',
              }}
            >
              <div className="absolute top-0 left-8 right-8 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />

              <div className="text-4xl mb-6 opacity-30" style={{ color: '#f59e0b' }}>"</div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-gray-300 text-lg leading-relaxed mb-6"
                    style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
                    {testimonials[activeTestimonial].text}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontFamily: 'Rajdhani' }}>
                      {testimonials[activeTestimonial].name[0]}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm tracking-wide"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="text-amber-500/60 text-xs tracking-wide">
                        {testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].coins}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === activeTestimonial ? 20 : 6,
                      height: 6,
                      background: i === activeTestimonial ? '#f59e0b' : 'rgba(245,158,11,0.2)',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] opacity-15 rounded-full"
            style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 60%)', filter: 'blur(60px)' }} />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-6">🎰</div>
            <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-[0.1em] mb-6"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.3))',
              }}>
              Ready to Play?
            </h2>
            <p className="text-gray-400 mb-10 text-lg" style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
              Join thousands of players. Start with 1,000 free coins.
            </p>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(245,158,11,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="relative px-14 py-5 rounded-xl font-bold text-base tracking-[0.25em] uppercase overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '16px',
                }}
              >
                <span className="relative z-10">Create Free Account →</span>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-12 px-6"
        style={{ borderTop: '1px solid rgba(245,158,11,0.08)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rotate-45 border border-amber-500/50 rounded-sm flex items-center justify-center">
                <span className="text-xs -rotate-45" style={{ fontFamily: 'serif' }}>♠</span>
              </div>
              <span className="text-lg font-bold tracking-[0.15em] uppercase"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                Casino Demo
              </span>
            </div>

            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Support', 'Responsible Gaming'].map((item) => (
                <span key={item} className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors tracking-wide"
                  style={{ fontFamily: 'Barlow, sans-serif' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(245,158,11,0.05)' }}>
            <p className="text-xs text-gray-700 tracking-wide text-center"
              style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
              © 2025 Casino Demo. For entertainment purposes only. 18+ · Play Responsibly
            </p>
            <div className="flex items-center gap-2">
              {['🔒 SSL Secured', '✅ Provably Fair', '🛡️ Licensed'].map((badge) => (
                <span key={badge} className="text-[10px] text-gray-700 tracking-wide px-2 py-1 rounded-full"
                  style={{ border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'Barlow, sans-serif' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;