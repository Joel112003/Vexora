import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';


const C = {
  canvas:             '#fffaf0',
  surfaceSoft:        '#faf5e8',
  surfaceCard:        '#f5f0e0',
  surfaceStrong:      '#ebe6d6',
  surfaceDark:        '#0a1a1a',
  surfaceDarkElevated:'#1a2a2a',
  ink:                '#0a0a0a',
  bodyStrong:         '#1a1a1a',
  body:               '#3a3a3a',
  muted:              '#6a6a6a',
  mutedSoft:          '#9a9a9a',
  hairline:           '#e5e5e5',
  hairlineSoft:       '#f0f0f0',
  primary:            '#0a0a0a',
  primaryActive:      '#1f1f1f',
  primaryDisabled:    '#e5e5e5',
  onPrimary:          '#ffffff',
  onDark:             '#ffffff',
  onDarkSoft:         '#a0a0a0',
  pink:               '#ff4d8b',
  teal:               '#1a3a3a',
  lavender:           '#b8a4ed',
  peach:              '#ffb084',
  ochre:              '#e8b94a',
  mint:               '#a4d4c5',
  coral:              '#ff6b5a',
  success:            '#22c55e',
  warning:            '#f59e0b',
  error:              '#ef4444',
};

/* ─── TYPOGRAPHY TOKENS ─── */
const displayXl = { fontFamily:"'Inter',sans-serif", fontSize:72, fontWeight:500, lineHeight:1,    letterSpacing:'-2.5px' };
const displayLg = { fontFamily:"'Inter',sans-serif", fontSize:56, fontWeight:500, lineHeight:1.05, letterSpacing:'-2px'   };
const displayMd = { fontFamily:"'Inter',sans-serif", fontSize:40, fontWeight:500, lineHeight:1.1,  letterSpacing:'-1px'   };
const displaySm = { fontFamily:"'Inter',sans-serif", fontSize:32, fontWeight:500, lineHeight:1.15, letterSpacing:'-0.5px' };
const titleLg   = { fontFamily:"'Inter',sans-serif", fontSize:24, fontWeight:600, lineHeight:1.3,  letterSpacing:'-0.3px' };
const titleMd   = { fontFamily:"'Inter',sans-serif", fontSize:18, fontWeight:600, lineHeight:1.4  };
const bodyMd    = { fontFamily:"'Inter',sans-serif", fontSize:16, fontWeight:400, lineHeight:1.55 };
const bodySm    = { fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:400, lineHeight:1.55 };
const caption   = { fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:500, lineHeight:1.4  };
const capUpper  = { fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, lineHeight:1.4,  letterSpacing:'1.5px', textTransform:'uppercase' };
const btnType   = { fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:600, lineHeight:1    };
const navLink   = { fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:500, lineHeight:1.4  };

/* ─── RADIUS & SPACING ─── */
const R = { xs:6, sm:8, md:12, lg:16, xl:24, pill:9999 };
const S = { xxs:4, xs:8, sm:12, md:16, lg:24, xl:32, xxl:48, section:96 };

/* ════════════════════════════════════════════
   PRIMITIVE BUTTONS
════════════════════════════════════════════ */

function BtnPrimary({ children, onClick, large, style: ex }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        position:'relative', overflow:'hidden',
        height: large ? 52 : 44,
        padding: large ? '0 32px' : '0 20px',
        background: hov
          ? `linear-gradient(135deg, #1f1f1f 0%, #3a1a00 100%)`
          : `linear-gradient(135deg, ${C.primary} 0%, #2d1200 100%)`,
        color: C.onPrimary,
        border:'none', borderRadius: R.md,
        cursor:'pointer', transition:'background 0.3s',
        boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.12)',
        ...btnType, ...ex,
      }}
    >
      {hov && (
        <motion.span
          initial={{ x: '-100%', opacity: 0.6 }}
          animate={{ x: '200%', opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            position:'absolute', top:0, left:0, width:'60%', height:'100%',
            background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)',
            pointerEvents:'none',
          }}
        />
      )}
      {children}
    </motion.button>
  );
}

function BtnSecondary({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        height:44, padding:'0 20px',
        backgroundColor: hov ? C.surfaceCard : C.canvas,
        color: C.ink,
        border:`1px solid ${hov ? C.ink : C.hairline}`,
        borderRadius: R.md, cursor:'pointer',
        transition:'all 0.2s',
        boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        ...btnType,
      }}
    >{children}</motion.button>
  );
}

/* ════════════════════════════════════════════
   ANIMATED TICKER
════════════════════════════════════════════ */
const TickerItems = ['Provably Fair','Instant Settlement','1 000 Free Coins','5 Live Games','No Deposit Ever','SSL Encrypted','99.2% Uptime'];

const Ticker = () => {
  const content = [...TickerItems, ...TickerItems];
  return (
    <div style={{ overflow:'hidden', borderTop:`1px solid ${C.hairline}`, borderBottom:`1px solid ${C.hairline}`, padding:'14px 0', backgroundColor: C.surfaceSoft }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration:28, repeat:Infinity, ease:'linear' }}
        style={{ display:'flex', gap:0, width:'max-content' }}
      >
        {content.map((item, i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:28, padding:'0 28px', whiteSpace:'nowrap', ...capUpper, color: C.muted }}>
            {item}
            <span style={{ color: C.coral, fontSize:8 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ════════════════════════════════════════════
   LIVE BADGE
════════════════════════════════════════════ */
const LiveBadge = () => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 14px', borderRadius: R.pill, backgroundColor: C.surfaceCard, border:`1px solid ${C.hairline}`, ...caption, color: C.muted }}>
    <motion.span
      animate={{ opacity:[1, 0.3, 1] }}
      transition={{ duration:1.6, repeat:Infinity }}
      style={{ width:6, height:6, borderRadius:'50%', backgroundColor: C.coral, display:'inline-block' }}
    />
    5 games live
  </span>
);

/* ════════════════════════════════════════════
   STAT DISPLAY (count-up on scroll)
════════════════════════════════════════════ */
const StatDisplay = ({ value, label, delay: d }) => {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [displayed, setDisplayed] = useState('0');
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix   = value.replace(/[0-9.,]/g, '');

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const dur = 1800, start = performance.now();
    const tick = (now) => {
      const p    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.floor(ease * numeric).toLocaleString() + suffix);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplayed(value);
    };
    requestAnimationFrame(tick);
  }, [started]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:24 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ delay:d, duration:0.7, ease:[0.16,1,0.3,1] }}
      style={{ textAlign:'center' }}
    >
      <div style={{ ...displaySm, color: C.ink, lineHeight:1 }}>{displayed}</div>
      <div style={{ ...capUpper, color: C.muted, marginTop:8 }}>{label}</div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════
   GAME CARDS — Clay feature-card palette
   pink → teal → lavender → peach → ochre
════════════════════════════════════════════ */
const GAME_DATA = [
  { id:'dice',     label:'Dice',    sub:'Roll. Risk. Repeat.',   tag:'🔴 Live',      bg: C.pink,     textCol:'#ffffff', uiLine:'Rolling now · 3 players' },
  { id:'coinflip', label:'Coinflip',sub:'Heads or tails — fast', tag:'⚡ Quick',     bg: C.teal,     textCol:'#ffffff', uiLine:'Last flip · Heads won' },
  { id:'mines',    label:'Mines',   sub:'Navigate the field',    tag:'🔥 Hot',       bg: C.lavender, textCol: C.ink,    uiLine:'9 mines · 3 revealed' },
  { id:'crash',    label:'Crash',   sub:'Exit before collapse',  tag:'⚠️ High risk', bg: C.peach,    textCol: C.ink,    uiLine:'Multiplier × 2.4 live' },
  { id:'soon',     label:'Coming',  sub:'Something new stirs',   tag:'✨ Soon',      bg: C.ochre,    textCol: C.ink,    uiLine:'Stay tuned…' },
];

const GameIcon = ({ id, col }) => {
  const s = { width:'100%', height:'100%' };
  if (id === 'dice') return (
    <svg viewBox="0 0 120 120" style={s}>
      <rect x="15" y="15" width="90" height="90" rx="18" fill="rgba(255,255,255,0.22)" />
      <rect x="22" y="22" width="76" height="76" rx="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      {[[38,38],[82,38],[60,60],[38,82],[82,82],[60,38]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="7" fill="rgba(255,255,255,0.9)" />
      ))}
    </svg>
  );
  if (id === 'coinflip') return (
    <svg viewBox="0 0 120 120" style={s}>
      <ellipse cx="60" cy="62" rx="34" ry="10" fill="rgba(0,0,0,0.15)" />
      <circle cx="60" cy="55" r="36" fill="#f5c842" />
      <circle cx="60" cy="55" r="30" fill="#e8b800" />
      <circle cx="60" cy="55" r="24" fill="#f5c842" />
      <text x="60" y="61" textAnchor="middle" fontSize="18" fontWeight="700" fill="#8a6800">V</text>
      <path d="M50 18 Q60 8 70 18" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" />
    </svg>
  );
  if (id === 'mines') return (
    <svg viewBox="0 0 120 120" style={s}>
      {[[20,20],[50,20],[80,20],[20,50],[50,50],[80,50],[20,80],[50,80],[80,80]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="24" height="24" rx="5"
          fill={i===4 ? '#ef4444' : i===1||i===7 ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.25)'}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      ))}
      <circle cx="82" cy="22" r="6" fill="#ef4444" />
      <text x="32" y="37" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.8)">2</text>
      <text x="32" y="67" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.8)">1</text>
      <circle cx="62" cy="62" r="6" fill="rgba(0,0,0,0.5)" />
      <line x1="62" y1="50" x2="62" y2="44" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
    </svg>
  );
  if (id === 'crash') return (
    <svg viewBox="0 0 120 120" style={s}>
      <polyline points="15,105 35,80 55,60 75,30 88,12" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M88 12 L100 18 L92 26 Z" fill="rgba(255,255,255,0.8)" />
      <circle cx="88" cy="12" r="4" fill="#ef4444" />
      <g transform="translate(28,58) rotate(-40)">
        <ellipse cx="0" cy="0" rx="12" ry="7" fill="rgba(255,255,255,0.85)" />
        <polygon points="0,-7 -5,7 5,7" fill="rgba(255,100,50,0.9)" />
      </g>
      <line x1="15" y1="105" x2="105" y2="105" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  );
  return (
    <svg viewBox="0 0 120 120" style={s}>
      <circle cx="60" cy="60" r="40" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="60" y="68" textAnchor="middle" fontSize="36" fontWeight="700" fill="rgba(255,255,255,0.8)">?</text>
      {[0,60,120,180,240,300].map((deg,i) => (
        <circle key={i} cx={60+38*Math.cos(deg*Math.PI/180)} cy={60+38*Math.sin(deg*Math.PI/180)} r="3" fill="rgba(255,255,255,0.5)" />
      ))}
    </svg>
  );
};

const GameCard = ({ game, delay: d }) => {
  const [hov, setHov] = useState(false);
  const onDark = game.textCol === '#ffffff';
  return (
    <motion.div
      initial={{ opacity:0, y:36 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ delay:d, duration:0.7, ease:[0.16,1,0.3,1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ cursor:'pointer' }}
    >
      <motion.div
        animate={{ y: hov ? -8 : 0, scale: hov ? 1.02 : 1 }}
        transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
        style={{
          backgroundColor: game.bg,
          borderRadius: R.xl,
          padding: S.xl,
          aspectRatio:'3/4',
          display:'flex', flexDirection:'column', justifyContent:'space-between',
          border:`1.5px solid ${hov ? 'rgba(0,0,0,0.18)' : 'transparent'}`,
          boxShadow: hov ? '0 20px 40px rgba(0,0,0,0.18)' : '0 4px 12px rgba(0,0,0,0.06)',
          transition:'border-color 0.25s, box-shadow 0.35s',
          overflow:'hidden', position:'relative',
        }}
      >
        {/* Tag badge */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <span style={{
            display:'inline-block', padding:'4px 10px',
            backgroundColor:'rgba(0,0,0,0.12)', borderRadius: R.pill,
            ...caption, color: game.textCol,
          }}>{game.tag}</span>
        </div>

        {/* Game Icon */}
        <motion.div
          animate={{ scale: hov ? 1.1 : 1, y: hov ? -6 : 0, rotate: hov && game.id==='dice' ? 8 : 0 }}
          transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'4px 0' }}
        >
          <div style={{ width:'80%', aspectRatio:'1', filter: hov ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))', transition:'filter 0.3s' }}>
            <GameIcon id={game.id} col={game.textCol} />
          </div>
        </motion.div>

        {/* Label area */}
        <div>
          <div style={{ ...titleLg, color: game.textCol, marginBottom:4 }}>{game.label}</div>
          <div style={{ ...bodySm, color: onDark ? 'rgba(255,255,255,0.7)' : C.body, marginBottom:10 }}>{game.sub}</div>
          <div style={{
            backgroundColor:'rgba(0,0,0,0.08)', borderRadius: R.md,
            padding:'6px 10px', ...caption,
            color: onDark ? 'rgba(255,255,255,0.8)' : C.bodyStrong,
          }}>{game.uiLine}</div>
          <motion.div
            animate={{ x: hov ? 4 : 0, opacity: hov ? 1 : 0 }}
            transition={{ duration:0.2 }}
            style={{ ...btnType, color: game.textCol, marginTop:10 }}
          >Play now →</motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════
   STEP CARDS — cream-card surface
════════════════════════════════════════════ */
const StepCard = ({ num, title, desc, delay: d }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ delay:d, duration:0.7, ease:[0.16,1,0.3,1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:'relative',
        padding: S.xl,
        backgroundColor: C.surfaceCard,
        border:`1px solid ${hov ? C.hairline : C.hairlineSoft}`,
        borderRadius: R.lg,
        transition:'border-color 0.25s',
        overflow:'hidden',
      }}
    >
      {/* Ghost number */}
      <div style={{ ...displayXl, color: C.hairline, position:'absolute', top:-12, right:16, lineHeight:1, userSelect:'none', fontSize:96 }}>{num}</div>
      <div style={{ ...capUpper, color: C.muted, marginBottom: S.sm }}>{num}</div>
      <div style={{ ...titleMd, color: C.ink, marginBottom: S.xs }}>{title}</div>
      <div style={{ ...bodyMd, color: C.body }}>{desc}</div>
    </motion.div>
  );
};



/* ════════════════════════════════════════════
   SECTION HEADING HELPER
════════════════════════════════════════════ */
function SectionHead({ eyebrow, title }) {
  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
      style={{ marginBottom: S.xxl + S.md }}
    >
      <div style={{ ...capUpper, color: C.muted, marginBottom: S.sm }}>{eyebrow}</div>
      <div style={{ ...displayLg, color: C.ink }}>{title}</div>
      <motion.div
        initial={{ width:0 }}
        whileInView={{ width:48 }}
        viewport={{ once:true }}
        transition={{ duration:0.8, delay:0.25, ease:[0.16,1,0.3,1] }}
        style={{ height:3, backgroundColor: C.coral, borderRadius: R.pill, marginTop: S.lg }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const LandingPage = () => {
  const { scrollY }   = useScroll();
  const heroY         = useTransform(scrollY, [0, 700], [0, -70]);
  const heroOpacity   = useTransform(scrollY, [0, 450], [1, 0]);

  return (
    <div style={{ backgroundColor: C.canvas, color: C.ink, minHeight:'100vh', overflowX:'hidden', fontFamily:"'Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:${C.ochre}60; color:${C.ink}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:${C.canvas}; }
        ::-webkit-scrollbar-thumb { background:${C.hairline}; border-radius:2px; }
        button { background:none; border:none; cursor:pointer; }
        a { text-decoration:none; }
      `}</style>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <motion.nav
        initial={{ y:-64 }}
        animate={{ y:0 }}
        transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
        style={{
          position:'sticky', top:0, zIndex:100,
          backgroundColor: C.canvas,
          borderBottom:`1px solid ${C.hairline}`,
          height:64,
        }}
      >
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 40px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, backgroundColor: C.primary, borderRadius: R.sm, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:10, height:10, backgroundColor:'white', borderRadius:3 }}/>
            </div>
            <span style={{ ...titleMd, color: C.ink, letterSpacing:'-0.3px' }}>Vexora</span>
          </div>

          {/* Nav links */}
          <div style={{ display:'flex', gap:28 }}>
            {['Games','Leaderboard','Promotions','About'].map(item => (
              <span key={item} style={{ ...navLink, color: C.muted, cursor:'pointer', transition:'color 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.ink}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >{item}</span>
            ))}
          </div>

          {/* CTA cluster */}
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <Link to="/login">
              <span style={{ ...navLink, color: C.muted, cursor:'pointer', transition:'color 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.ink}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >Sign in</span>
            </Link>
            <Link to="/register">
              <BtnPrimary>Try free</BtnPrimary>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', backgroundColor: C.canvas }}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:820, margin:'0 auto', padding:'0 40px' }}>

            {/* Live badge */}
            <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} style={{ marginBottom: S.xl, display:'flex', justifyContent:'center' }}>
              <LiveBadge />
            </motion.div>

            {/* Eyebrow */}
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.1 }}>
              <div style={{ ...capUpper, color: C.muted, marginBottom: S.md }}>🎰 Vexora · The Premium Gaming Arena</div>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, delay:0.2, ease:[0.16,1,0.3,1] }}
              style={{ ...displayXl, color: C.ink, margin:`0 0 ${S.lg}px`, fontSize:'clamp(48px,8vw,72px)' }}
            >
              Where winners<br/>
              <motion.span
                animate={{ color:[C.coral,'#ff6b35',C.coral] }}
                transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
                style={{ display:'inline-block' }}
              >dare to play</motion.span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.38 }}
              style={{ ...bodyMd, color: C.body, maxWidth:480, margin:`0 auto ${S.xxl}px`, lineHeight:1.7 }}
            >
              Five electrifying games. Real-time thrills. Zero risk.<br/>
              Start with <strong style={{ color: C.ink }}>1,000 free coins</strong> — no deposit, no card ever.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.52 }}
              style={{ display:'flex', gap: S.sm, justifyContent:'center', flexWrap:'wrap' }}
            >
              <Link to="/register">
                <motion.div
                  animate={{ boxShadow:['0 0 0px rgba(255,107,90,0)','0 0 18px rgba(255,107,90,0.45)','0 0 0px rgba(255,107,90,0)'] }}
                  transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
                  style={{ borderRadius: R.md }}
                >
                  <BtnPrimary large>🚀 Start Playing Free</BtnPrimary>
                </motion.div>
              </Link>
              <Link to="/login"><BtnSecondary>Sign in →</BtnSecondary></Link>
            </motion.div>

            {/* Micro stats */}
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.75 }}
              style={{ display:'flex', gap: S.xxl, justifyContent:'center', marginTop: S.xxl + S.lg, paddingTop: S.xl, borderTop:`1px solid ${C.hairline}` }}
            >
              {[['99.2%','Uptime'],['12ms','Avg latency'],['100%','Provably fair']].map(([v,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ ...displaySm, color: C.ink, fontSize:28 }}>{v}</div>
                  <div style={{ ...capUpper, color: C.muted, marginTop:6 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y:[0,8,0] }}
          transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
        >
          <div style={{ ...capUpper, color: C.mutedSoft, fontSize:10 }}>Scroll</div>
          <div style={{ width:1, height:36, backgroundColor: C.hairline }}/>
        </motion.div>
      </section>

      {/* ═══════════════ TICKER ═══════════════ */}
      <Ticker />

      {/* ═══════════════ STATS ═══════════════ */}
      <section style={{ padding:`${S.section}px 40px`, backgroundColor: C.canvas }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', border:`1px solid ${C.hairline}` }}>
            {[
              { value:'48,200+', label:'Active Players'  },
              { value:'2,100,000+', label:'Games Played' },
              { value:'99%',     label:'Satisfaction'    },
              { value:'5',       label:'Live Games'      },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding:`${S.xxl}px ${S.xl}px`,
                borderRight: i < 3 ? `1px solid ${C.hairline}` : 'none',
                backgroundColor: i === 1 ? C.surfaceCard : 'transparent',
              }}>
                <StatDisplay value={s.value} label={s.label} delay={i * 0.1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ GAMES — feature cards ═══════════════ */}
      <section style={{ padding:`${S.section}px 40px`, backgroundColor: C.canvas }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead eyebrow="Our Games" title="Choose your game" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap: S.sm }}>
            {GAME_DATA.map((game, i) => (
              <GameCard key={game.id} game={game} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section style={{ padding:`${S.section}px 40px`, backgroundColor: C.surfaceSoft }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead eyebrow="Simple Steps" title="Up & running in 60 seconds" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: S.md }}>
            <StepCard num="01" title="Create account"   desc="Sign up free in under 30 seconds. No deposit, no card, no conditions."                 delay={0}    />
            <StepCard num="02" title="Claim free coins" desc="Receive 1 000 demo coins the moment your account opens. Yours to keep."                 delay={0.12} />
            <StepCard num="03" title="Play & win"       desc="Choose any live game. Place bets. Feel every outcome in real time."                     delay={0.24} />
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST STRIP (replaces testimonials) ═══════════════ */}
      <section style={{ padding:`${S.section}px 40px`, backgroundColor: C.canvas }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: S.md }}
          >
            {[
              { icon:'🛡️', title:'Provably Fair', desc:'Every outcome is cryptographically verified and independently auditable in real time.' },
              { icon:'⚡', title:'Instant Settlement', desc:'Winnings hit your balance the moment the result lands. No delays, no waiting, ever.' },
              { icon:'🔒', title:'SSL Encrypted', desc:'Military-grade encryption protects every session and every transaction on the platform.' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.12, duration:0.65, ease:[0.16,1,0.3,1] }}
                whileHover={{ y: -4, boxShadow:'0 12px 28px rgba(0,0,0,0.08)' }}
                style={{
                  padding: S.xl,
                  backgroundColor: C.surfaceCard,
                  border:`1px solid ${C.hairline}`,
                  borderRadius: R.lg,
                  transition:'box-shadow 0.3s',
                }}
              >
                <div style={{ fontSize:36, marginBottom: S.md }}>{icon}</div>
                <div style={{ ...titleMd, color: C.ink, marginBottom: S.xs }}>{title}</div>
                <div style={{ ...bodyMd, color: C.body, lineHeight:1.6 }}>{desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA BAND ═══════════════ */}
      <section style={{ padding:`${S.section}px 40px ${S.section + S.xxl}px`, backgroundColor: C.surfaceSoft }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.75, ease:[0.16,1,0.3,1] }}
            style={{
              backgroundColor: C.teal,
              borderRadius: R.xl,
              padding:`${S.section}px ${S.section}px`,
              display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap: S.xxl,
            }}
          >
            <div style={{ maxWidth:480 }}>
              <div style={{ ...capUpper, color: C.mint, marginBottom: S.md }}>Begin now</div>
              <h2 style={{ ...displayMd, color: C.onDark, marginBottom: S.lg }}>Ready to play?</h2>
              <p style={{ ...bodyMd, color: C.onDarkSoft, lineHeight:1.7 }}>
                Join thousands of players. Start with 1 000 free coins — no deposit, no card required.
              </p>
            </div>
            <Link to="/register">
              <motion.button
                whileTap={{ scale:0.97 }}
                style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  height:52, padding:'0 32px',
                  backgroundColor: C.canvas,
                  color: C.ink,
                  border:'none', borderRadius: R.md, cursor:'pointer',
                  ...btnType, fontSize:15,
                }}
              >Create free account →</motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ backgroundColor: C.surfaceSoft, borderTop:`1px solid ${C.hairline}`, padding:`${S.xxl}px 40px` }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap: S.lg, paddingBottom: S.xl, marginBottom: S.xl, borderBottom:`1px solid ${C.hairline}` }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:24, height:24, backgroundColor: C.primary, borderRadius: R.xs, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:8, height:8, backgroundColor:'white', borderRadius:2 }}/>
              </div>
              <span style={{ ...titleMd, color: C.ink }}>Vexora</span>
            </div>

            {/* Footer links */}
            <div style={{ display:'flex', gap: S.xl, flexWrap:'wrap' }}>
              {['Privacy','Terms','Support','Responsible Gaming'].map(item => (
                <span key={item} style={{ ...bodySm, color: C.muted, cursor:'pointer', transition:'color 0.18s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.ink}
                  onMouseLeave={e => e.currentTarget.style.color = C.muted}
                >{item}</span>
              ))}
            </div>

            {/* Trust badges */}
            <div style={{ display:'flex', gap: S.xs }}>
              {['SSL Secured','Provably Fair','Licensed'].map(badge => (
                <span key={badge} style={{
                  ...caption, color: C.muted,
                  padding:'4px 10px',
                  border:`1px solid ${C.hairline}`,
                  borderRadius: R.sm,
                }}>{badge}</span>
              ))}
            </div>
          </div>

          <div style={{ ...bodySm, color: C.mutedSoft, textAlign:'center' }}>
            © 2025 Vexora. For entertainment purposes only. 18+ · Play Responsibly
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;