import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bg:           '#040605',
  bgElevated:   '#070a08',
  bgCard:       '#0b110d',
  bgSubtle:     '#0f1612',
  bgDeep:       '#020403',
  surface:      '#141c16',
  border:       'rgba(85,211,150,0.07)',
  borderMid:    'rgba(85,211,150,0.14)',
  borderStrong: 'rgba(85,211,150,0.26)',
  green:        '#55D396',
  greenDeep:    '#169A50',
  greenMuted:   'rgba(85,211,150,0.45)',
  greenDim:     'rgba(85,211,150,0.10)',
  greenGlow:    'rgba(85,211,150,0.18)',
  white:        '#FFFFFF',
  offWhite:     '#E6ECE8',
  muted:        '#667069',
  faint:        '#323D35',
  ink:          '#1E2721',
  red:          '#EF4444',
  redDim:       'rgba(239,68,68,0.12)',
  gold:         '#C9A94E',
  goldDim:      'rgba(201,169,78,0.10)',
};

const FD = `'General Sans', 'DM Sans', sans-serif`;
const FB = `'Barlow', 'Inter', sans-serif`;
const FM = `'JetBrains Mono', 'Fira Code', monospace`;

/* ─────────────────────────────────────────────
   LIVE BADGE
───────────────────────────────────────────── */
const LiveBadge = ({ count = 5 }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 13px', borderRadius:9999, border:`1px solid ${C.borderMid}`, backgroundColor: C.greenDim, fontFamily:FB, fontSize:11, fontWeight:600, letterSpacing:'0.8px', color: C.green }}>
    <motion.span animate={{ opacity:[1,0.15,1] }} transition={{ duration:1.6, repeat:Infinity }}
      style={{ width:5, height:5, borderRadius:'50%', backgroundColor: C.green, display:'inline-block' }} />
    {count} games live
  </span>
);

/* ─────────────────────────────────────────────
   TICKER
───────────────────────────────────────────── */
const TICKER_ITEMS = ['Provably Fair','Instant Settlement','1 000 Free Coins','5 Live Games','Zero Deposit','SSL Encrypted','99.2% Uptime','12ms Latency'];

const Ticker = () => (
  <div style={{ overflow:'hidden', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'11px 0', backgroundColor: C.bgDeep }}>
    <motion.div animate={{ x:['0%','-50%'] }} transition={{ duration:36, repeat:Infinity, ease:'linear' }}
      style={{ display:'flex', width:'max-content' }}>
      {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i) => (
        <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:18, padding:'0 22px', whiteSpace:'nowrap', fontFamily:FB, fontSize:10, fontWeight:500, letterSpacing:'2px', textTransform:'uppercase', color: C.muted }}>
          {t}
          <span style={{ color:C.green, fontSize:3 }}>●</span>
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─────────────────────────────────────────────
   LIVE BETS FEED (simulated)
───────────────────────────────────────────── */
const USERNAMES = ['crypto_monk','vex_ghost','0xNova','rizz_trader','nite_wolf','silentRoll','arcane_x','drkMatter','hex_void','coin_sage'];
const GAMES_LIST = ['Dice','Crash','Mines','Coinflip'];

function randBet() {
  return {
    id: Math.random().toString(36).slice(2),
    user: USERNAMES[Math.floor(Math.random()*USERNAMES.length)],
    game: GAMES_LIST[Math.floor(Math.random()*GAMES_LIST.length)],
    amount: (Math.random()*480+20).toFixed(2),
    multiplier: (Math.random()*6+1).toFixed(2),
    win: Math.random() > 0.45,
    ts: Date.now(),
  };
}

const BetRow = ({ bet }) => {
  const profit = (bet.amount * bet.multiplier - bet.amount * (bet.win ? 1 : 0)).toFixed(2);
  return (
    <motion.div
      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
      style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 80px', alignItems:'center', gap:8, padding:'10px 20px', borderBottom:`1px solid ${C.border}` }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:28, height:28, borderRadius:6, backgroundColor: C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:C.green, fontFamily:FM, fontWeight:700 }}>
          {bet.user[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily:FM, fontSize:12, color:C.offWhite, letterSpacing:'-0.3px' }}>{bet.user}</div>
          <div style={{ fontFamily:FB, fontSize:10, color:C.muted, marginTop:1 }}>{bet.game}</div>
        </div>
      </div>
      <div style={{ fontFamily:FM, fontSize:12, color:C.muted, textAlign:'right' }}>{bet.amount}</div>
      <div style={{ fontFamily:FM, fontSize:12, color:C.green, textAlign:'right' }}>{bet.multiplier}×</div>
      <div style={{ fontFamily:FM, fontSize:12, color: bet.win ? C.green : C.red, textAlign:'right', fontWeight:600 }}>
        {bet.win ? `+${profit}` : `-${bet.amount}`}
      </div>
    </motion.div>
  );
};

const LiveFeed = () => {
  const [bets, setBets] = useState(() => Array.from({length:8}, randBet));
  useEffect(() => {
    const id = setInterval(() => {
      setBets(prev => [randBet(), ...prev.slice(0,9)]);
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ backgroundColor:C.bgCard, border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <motion.div animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.6, repeat:Infinity }}
            style={{ width:6, height:6, borderRadius:'50%', backgroundColor:C.green }} />
          <span style={{ fontFamily:FB, fontSize:11, fontWeight:600, letterSpacing:'1.8px', textTransform:'uppercase', color:C.muted }}>Live bets</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 80px', gap:8, padding:'0 0 0 0', width:'calc(100% - 120px)' }}>
          {['Player','Bet','Multi','Profit'].map(h => (
            <div key={h} style={{ fontFamily:FB, fontSize:9, fontWeight:600, letterSpacing:'1.6px', textTransform:'uppercase', color:C.faint, textAlign: h==='Player' ? 'left' : 'right' }}>{h}</div>
          ))}
        </div>
      </div>
      <div style={{ maxHeight:360, overflow:'hidden', position:'relative' }}>
        <AnimatePresence initial={false}>
          {bets.slice(0,8).map(bet => <BetRow key={bet.id} bet={bet} />)}
        </AnimatePresence>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:`linear-gradient(transparent, ${C.bgCard})`, pointerEvents:'none' }} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STAT STRIP
───────────────────────────────────────────── */
const StatStrip = () => (
  <div style={{ backgroundColor:C.bg }}>
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 40px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', border:`1px solid ${C.border}` }}>
        {[
          { v:'48,200+', l:'Active Players' },
          { v:'2.1M+',   l:'Games Played'  },
          { v:'99.2%',   l:'Uptime'        },
          { v:'12ms',    l:'Avg Latency'   },
        ].map(({ v, l }, i) => (
          <motion.div key={l}
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:i*0.08, duration:0.55, ease:[0.16,1,0.3,1] }}
            style={{ padding:'36px 28px', borderRight: i<3 ? `1px solid ${C.border}` : 'none', backgroundColor: i===1 ? C.bgCard : 'transparent', textAlign:'center' }}
          >
            <div style={{ fontFamily:FD, fontSize:32, fontWeight:700, letterSpacing:'-1.5px', color:C.white, lineHeight:1 }}>{v}</div>
            <div style={{ fontFamily:FB, fontSize:10, fontWeight:500, letterSpacing:'1.8px', textTransform:'uppercase', color:C.muted, marginTop:8 }}>{l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   GAME CARD
───────────────────────────────────────────── */
const GAMES = [
  { id:'dice',     label:'Dice',     sub:'Roll. Risk. Repeat.',   tag:'Live',  accent:C.green,  icon:'⚄', href:'/dice'     },
  { id:'coinflip', label:'Coinflip', sub:'Heads or tails — fast', tag:'Quick', accent:C.greenDeep, icon:'◉', href:'/coinflip' },
  { id:'mines',    label:'Mines',    sub:'Navigate the field',    tag:'Hot',   accent:C.green,  icon:'⊛', href:'/mines'    },
  { id:'crash',    label:'Crash',    sub:'Exit before collapse',  tag:'Risk',  accent:C.gold,   icon:'◈', href:'/crash'    },
  { id:'soon',     label:'Soon',     sub:'Something new stirs',   tag:'Soon',  accent:C.faint,  icon:'?', href:'#'         },
];

const GameCard = ({ game, delay: d, tall = false }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ delay:d, duration:0.6, ease:[0.16,1,0.3,1] }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ gridRow: tall ? 'span 2' : 'span 1' }}
    >
      <Link to={game.href} style={{ textDecoration:'none' }}>
        <motion.div
          animate={{ y: hov ? -5 : 0, borderColor: hov ? C.borderMid : C.border }}
          transition={{ duration:0.28, ease:[0.16,1,0.3,1] }}
          style={{
            height: tall ? '100%' : 'auto',
            minHeight: tall ? 320 : 220,
            padding:'28px 24px', borderRadius:14, cursor:'pointer',
            backgroundColor: hov ? C.bgSubtle : C.bgCard,
            border:`1px solid ${C.border}`,
            transition:'background 0.25s',
            display:'flex', flexDirection:'column', justifyContent:'space-between',
            position:'relative', overflow:'hidden',
          }}
        >
          {hov && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.3 }}
              style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle, ${game.accent}15 0%, transparent 70%)`, pointerEvents:'none' }} />
          )}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <span style={{ fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color: game.accent, padding:'3px 9px', border:`1px solid ${game.accent}28`, borderRadius:9999 }}>{game.tag}</span>
            <motion.div animate={{ rotate: hov ? 45 : 0 }} transition={{ duration:0.22 }} style={{ color:C.faint, fontSize:16, lineHeight:1 }}>+</motion.div>
          </div>

          <div style={{ textAlign:'center', fontSize: tall ? 64 : 44, opacity: game.id==='soon' ? 0.25 : 0.85, lineHeight:1, margin:'auto 0' }}>{game.icon}</div>

          <div>
            <div style={{ fontFamily:FD, fontSize: tall ? 26 : 20, fontWeight:600, letterSpacing:'-0.5px', color:C.white, marginBottom:4 }}>{game.label}</div>
            <div style={{ fontFamily:FB, fontSize:12, color:C.muted, marginBottom:10 }}>{game.sub}</div>
            <motion.div animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -8 }} transition={{ duration:0.18 }}
              style={{ fontFamily:FB, fontSize:11, fontWeight:700, letterSpacing:'0.5px', color:C.green }}>Play now →</motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────── */
const SectionHead = ({ eyebrow, title, align = 'left' }) => (
  <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
    transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
    style={{ marginBottom:56, textAlign: align }}
  >
    <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:C.green, marginBottom:14 }}>{eyebrow}</div>
    <div style={{ fontFamily:FD, fontSize:44, fontWeight:700, letterSpacing:'-2px', color:C.white, lineHeight:1.05 }}>{title}</div>
    <motion.div initial={{ width:0 }} whileInView={{ width:32 }} viewport={{ once:true }}
      transition={{ duration:0.65, delay:0.18, ease:[0.16,1,0.3,1] }}
      style={{ height:2, backgroundColor:C.green, borderRadius:9999, marginTop:20, marginLeft: align==='center' ? 'auto' : 0, marginRight: align==='center' ? 'auto' : 0 }} />
  </motion.div>
);

/* ─────────────────────────────────────────────
   VIP SECTION
───────────────────────────────────────────── */
const VIP_TIERS = [
  { name:'Silver',   color:'#8C8C96', req:'Wager 10K', perks:['5% Rakeback','Weekly reload','Priority support'] },
  { name:'Gold',     color:C.gold,    req:'Wager 50K', perks:['10% Rakeback','Daily reload','VIP manager','Custom limits'] },
  { name:'Platinum', color:'#B0C4DE', req:'Wager 200K', perks:['15% Rakeback','Instant reload','Dedicated manager','Exclusive events','Withdrawal priority'] },
];

const VipSection = () => {
  const [active, setActive] = useState(1);
  const tier = VIP_TIERS[active];
  return (
    <section style={{ padding:'96px 40px', backgroundColor:C.bgElevated }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <SectionHead eyebrow="VIP Program" title={`Earn more.\nPlay bigger.`} />
            <p style={{ fontFamily:FB, fontSize:15, fontWeight:300, color:C.muted, lineHeight:1.75, maxWidth:380, marginBottom:36 }}>
              Every bet climbs your rank. Higher tiers unlock exclusive rakeback, private bonuses, and a dedicated VIP manager.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {VIP_TIERS.map((t, i) => (
                <motion.button key={t.name} onClick={() => setActive(i)}
                  whileTap={{ scale:0.96 }}
                  style={{ padding:'8px 18px', borderRadius:9999, fontFamily:FB, fontSize:12, fontWeight:600, letterSpacing:'0.3px', cursor:'pointer', border:`1px solid ${active===i ? t.color : C.border}`, backgroundColor: active===i ? `${t.color}18` : 'transparent', color: active===i ? t.color : C.muted, transition:'all 0.2s' }}
                >{t.name}</motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tier.name}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              transition={{ duration:0.32, ease:[0.16,1,0.3,1] }}
              style={{ backgroundColor:C.bgCard, border:`1px solid ${tier.color}28`, borderRadius:18, padding:'40px 36px', position:'relative', overflow:'hidden' }}
            >
              <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle, ${tier.color}10 0%, transparent 65%)`, pointerEvents:'none' }} />
              <div style={{ fontFamily:FD, fontSize:11, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:tier.color, marginBottom:8 }}>Tier</div>
              <div style={{ fontFamily:FD, fontSize:40, fontWeight:700, letterSpacing:'-2px', color:C.white, marginBottom:4 }}>{tier.name}</div>
              <div style={{ fontFamily:FM, fontSize:12, color:C.muted, marginBottom:32 }}>{tier.req} to unlock</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {tier.perks.map((perk, i) => (
                  <motion.div key={perk} initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.07, duration:0.3 }}
                    style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:20, height:20, borderRadius:6, backgroundColor:`${tier.color}18`, border:`1px solid ${tier.color}28`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ color:tier.color, fontSize:10 }}>✓</span>
                    </div>
                    <span style={{ fontFamily:FB, fontSize:14, color:C.offWhite }}>{perk}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   STEP
───────────────────────────────────────────── */
const Step = ({ num, title, desc, delay: d }) => (
  <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
    transition={{ delay:d, duration:0.6, ease:[0.16,1,0.3,1] }}
    style={{ padding:'32px 28px', backgroundColor:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, position:'relative', overflow:'hidden' }}
  >
    <div style={{ fontFamily:FD, fontSize:72, fontWeight:700, color:'rgba(85,211,150,0.035)', position:'absolute', top:-8, right:12, lineHeight:1, pointerEvents:'none' }}>{num}</div>
    <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:'2.2px', textTransform:'uppercase', color:C.green, marginBottom:12 }}>{num}</div>
    <div style={{ fontFamily:FD, fontSize:18, fontWeight:600, letterSpacing:'-0.3px', color:C.white, marginBottom:8 }}>{title}</div>
    <div style={{ fontFamily:FB, fontSize:13, color:C.muted, lineHeight:1.68 }}>{desc}</div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   TRUST CARDS
───────────────────────────────────────────── */
const TRUST = [
  { icon:'🛡', title:'Provably Fair', desc:'Every outcome is cryptographically verified and independently auditable in real time.' },
  { icon:'⚡', title:'Instant Settlement', desc:'Winnings hit your balance the moment the result lands. No delays, no waiting, ever.' },
  { icon:'🔒', title:'SSL Encrypted', desc:'Military-grade encryption protects every session and every transaction on the platform.' },
];

/* ─────────────────────────────────────────────
   MULTIPLIER PREVIEW CARD (hero decoration)
───────────────────────────────────────────── */
const MultiplierCard = () => {
  const [val, setVal] = useState(1.00);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    let v = 1.00;
    let going = true;
    const tick = () => {
      if (!going) return;
      v += Math.random() * 0.08 + 0.01;
      setVal(parseFloat(v.toFixed(2)));
      if (Math.random() < 0.008 || v > 9) {
        setCrashed(true);
        setTimeout(() => { v = 1.00; setCrashed(false); setVal(1.00); }, 2000);
      }
      setTimeout(tick, 120);
    };
    tick();
    return () => { going = false; };
  }, []);

  return (
    <motion.div initial={{ opacity:0, x:24, rotate:2 }} animate={{ opacity:1, x:0, rotate:2 }}
      transition={{ delay:0.6, duration:0.7, ease:[0.16,1,0.3,1] }}
      style={{ position:'absolute', right:-20, top:'50%', transform:'translateY(-50%) rotate(2deg)', width:200, backgroundColor:C.bgCard, border:`1px solid ${crashed ? 'rgba(239,68,68,0.28)' : C.borderMid}`, borderRadius:14, padding:'20px', zIndex:10 }}
    >
      <div style={{ fontFamily:FB, fontSize:9, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color: crashed ? C.red : C.muted, marginBottom:10 }}>
        {crashed ? '💥 Crashed' : '🚀 Crash'}
      </div>
      <div style={{ fontFamily:FM, fontSize:36, fontWeight:700, letterSpacing:'-2px', color: crashed ? C.red : C.green, lineHeight:1 }}>
        {crashed ? '—' : `${val}×`}
      </div>
      <div style={{ marginTop:12, height:2, backgroundColor: crashed ? C.redDim : C.greenDim, borderRadius:9999 }}>
        <motion.div animate={{ width: crashed ? '100%' : `${Math.min((val/10)*100, 100)}%` }}
          transition={{ duration:0.12 }}
          style={{ height:2, backgroundColor: crashed ? C.red : C.green, borderRadius:9999 }} />
      </div>
      <div style={{ fontFamily:FB, fontSize:10, color:C.muted, marginTop:8 }}>14 players riding</div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────── */
const LandingPage = () => {
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 600], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const [navBorder, setNavBorder] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on('change', v => setNavBorder(v > 20));
    return unsub;
  }, [scrollY]);

  return (
    <div style={{ backgroundColor:C.bg, color:C.white, minHeight:'100vh', overflowX:'hidden', fontFamily:FB }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:rgba(85,211,150,0.18); color:#55D396; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:${C.bg}; }
        ::-webkit-scrollbar-thumb { background:${C.faint}; border-radius:2px; }
        a { text-decoration:none; }
      `}</style>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y:-60, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
        style={{ position:'sticky', top:0, zIndex:100, height:60, borderBottom:`1px solid ${navBorder ? C.borderMid : C.border}`, backgroundColor:'rgba(4,6,5,0.94)', backdropFilter:'blur(24px)', transition:'border-color 0.3s' }}
      >
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 40px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:26, height:26, border:`1px solid ${C.borderStrong}`, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:C.greenDim }}>
              <div style={{ width:7, height:7, backgroundColor:C.green, borderRadius:2 }} />
            </div>
            <span style={{ fontFamily:FD, fontSize:16, fontWeight:700, letterSpacing:'-0.3px', color:C.white }}>Vexora</span>
          </div>

          {/* Nav links */}
          <div style={{ display:'flex', gap:28 }}>
            {['Games','Leaderboard','Promotions','About'].map(item => (
              <span key={item} style={{ fontFamily:FB, fontSize:13, fontWeight:400, color:C.muted, cursor:'pointer', transition:'color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.color=C.offWhite}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              >{item}</span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Link to="/login">
              <span style={{ fontFamily:FB, fontSize:13, fontWeight:400, color:C.muted, cursor:'pointer', transition:'color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.color=C.offWhite}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              >Sign in</span>
            </Link>
            <Link to="/register">
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                style={{ display:'inline-flex', alignItems:'center', height:36, padding:'0 16px', backgroundColor:C.green, color:C.bg, border:'none', borderRadius:8, cursor:'pointer', fontFamily:FB, fontSize:12, fontWeight:700, letterSpacing:'0.2px' }}
              >Try free</motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO — asymmetric 55/45 split ── */}
      <section style={{ position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        {/* Background grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(85,211,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(85,211,150,0.025) 1px, transparent 1px)`, backgroundSize:'52px 52px', pointerEvents:'none' }} />
        {/* Radial glow */}
        <div style={{ position:'absolute', top:'30%', left:'28%', transform:'translate(-50%,-50%)', width:700, height:500, background:'radial-gradient(ellipse, rgba(85,211,150,0.065) 0%, transparent 65%)', pointerEvents:'none' }} />
        {/* Right side tint */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg, transparent 55%, rgba(7,10,8,0.7) 100%)', pointerEvents:'none' }} />

        <motion.div style={{ y:heroY, opacity:heroOpacity, position:'relative', zIndex:2, maxWidth:1280, margin:'0 auto', padding:'80px 40px', width:'100%', display:'grid', gridTemplateColumns:'55% 45%', gap:40, alignItems:'center' }}>
          {/* LEFT */}
          <div>
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ marginBottom:22 }}>
              <LiveBadge count={5} />
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.06, duration:0.6 }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:600, letterSpacing:'2.8px', textTransform:'uppercase', color:C.muted, marginBottom:18 }}>
                Vexora · The Premium Gaming Arena
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.14, duration:0.75, ease:[0.16,1,0.3,1] }}
              style={{ fontFamily:FD, fontSize:'clamp(48px,6.5vw,76px)', fontWeight:700, letterSpacing:'-3.5px', lineHeight:0.93, color:C.white, marginBottom:28 }}
            >
              Where<br />
              winners<br />
              <motion.span animate={{ color:[C.green,'#8ee8c0',C.green] }} transition={{ duration:4.5, repeat:Infinity, ease:'easeInOut' }}>
                dare to play
              </motion.span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.6 }}
              style={{ fontFamily:FB, fontSize:15, fontWeight:300, color:C.muted, maxWidth:420, lineHeight:1.72, marginBottom:40 }}
            >
              Five electrifying games. Real-time thrills. Zero risk to start.<br />
              Begin with <strong style={{ color:C.offWhite, fontWeight:500 }}>1,000 free coins</strong> — no deposit, no card, ever.
            </motion.p>

            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44, duration:0.55 }}
              style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}
            >
              <Link to="/register">
                <motion.button whileHover={{ scale:1.04, boxShadow:'0 0 36px rgba(85,211,150,0.28)' }} whileTap={{ scale:0.96 }}
                  style={{ display:'inline-flex', alignItems:'center', height:48, padding:'0 26px', backgroundColor:C.green, color:C.bg, border:'none', borderRadius:10, cursor:'pointer', fontFamily:FD, fontSize:14, fontWeight:700, letterSpacing:'-0.2px', boxShadow:'0 0 24px rgba(85,211,150,0.16)' }}
                >Start Playing Free →</motion.button>
              </Link>
              <Link to="/login">
                <motion.button whileHover={{ scale:1.02, borderColor:C.borderStrong }} whileTap={{ scale:0.97 }}
                  style={{ display:'inline-flex', alignItems:'center', height:48, padding:'0 22px', backgroundColor:'transparent', color:C.offWhite, border:`1px solid ${C.borderMid}`, borderRadius:10, cursor:'pointer', fontFamily:FB, fontSize:13, fontWeight:400, transition:'border-color 0.2s' }}
                >Sign in</motion.button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.64 }}
              style={{ display:'flex', gap:40, marginTop:52, paddingTop:28, borderTop:`1px solid ${C.border}` }}
            >
              {[['99.2%','Uptime'],['12ms','Avg latency'],['100%','Provably fair']].map(([v,l])=>(
                <div key={l}>
                  <div style={{ fontFamily:FD, fontSize:22, fontWeight:700, letterSpacing:'-1px', color:C.white }}>{v}</div>
                  <div style={{ fontFamily:FB, fontSize:10, fontWeight:500, letterSpacing:'1.5px', textTransform:'uppercase', color:C.muted, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — live feed + multiplier card */}
          <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4, duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{ position:'relative' }}
          >
            <MultiplierCard />
            <div style={{ borderRadius:16, overflow:'hidden', border:`1px solid ${C.border}`, backgroundColor:C.bgCard, paddingTop:0 }}>
              {/* mini feed header */}
              <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
                <motion.div animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.6, repeat:Infinity }}
                  style={{ width:5, height:5, borderRadius:'50%', backgroundColor:C.green }} />
                <span style={{ fontFamily:FB, fontSize:10, fontWeight:600, letterSpacing:'1.8px', textTransform:'uppercase', color:C.muted }}>Recent wins</span>
              </div>
              <MiniWinFeed />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}
        >
          <div style={{ fontFamily:FB, fontSize:9, fontWeight:500, letterSpacing:'1.5px', textTransform:'uppercase', color:C.faint }}>Scroll</div>
          <div style={{ width:1, height:28, backgroundColor:C.faint }} />
        </motion.div>
      </section>

      <Ticker />
      <StatStrip />

      {/* ── GAMES SECTION — offset grid ── */}
      <section style={{ padding:'96px 40px', backgroundColor:C.bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead eyebrow="Our Games" title="Choose your arena" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'auto auto', gap:12 }}>
            <GameCard game={GAMES[0]} delay={0}    tall />
            <GameCard game={GAMES[1]} delay={0.08} />
            <GameCard game={GAMES[2]} delay={0.16} />
            <GameCard game={GAMES[3]} delay={0.24} />
            <GameCard game={GAMES[4]} delay={0.32} />
          </div>
        </div>
      </section>

      {/* ── LIVE BETS FEED ── */}
      <section style={{ padding:'96px 40px', backgroundColor:C.bgElevated }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:48, alignItems:'flex-start' }}>
            <div>
              <SectionHead eyebrow="Right Now" title={`Live at\nVexora`} />
              <p style={{ fontFamily:FB, fontSize:14, fontWeight:300, color:C.muted, lineHeight:1.72, maxWidth:320, marginBottom:32 }}>
                Watch real bets land in real time. Every win, every loss — completely transparent and verifiable on-chain.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[['Total wagered today','$1,204,800'],['Players online right now','3,142'],['Biggest win today','$4,820']].map(([l,v])=>(
                  <div key={l} style={{ padding:'16px 20px', backgroundColor:C.bgCard, border:`1px solid ${C.border}`, borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontFamily:FB, fontSize:12, color:C.muted }}>{l}</span>
                    <span style={{ fontFamily:FM, fontSize:14, color:C.green, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <LiveFeed />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'96px 40px', backgroundColor:C.bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead eyebrow="Simple Steps" title="Up & running in 60 seconds" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            <Step num="01" title="Create account"   desc="Sign up free in under 30 seconds. No deposit, no card, no conditions."  delay={0}    />
            <Step num="02" title="Claim free coins" desc="Receive 1,000 demo coins the moment your account opens. Yours to keep."  delay={0.12} />
            <Step num="03" title="Play & win"       desc="Choose any live game. Place bets. Feel every outcome in real time."      delay={0.24} />
          </div>
        </div>
      </section>

      {/* ── VIP ── */}
      <VipSection />

      {/* ── TRUST ── */}
      <section style={{ padding:'96px 40px', backgroundColor:C.bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead eyebrow="Why Vexora" title="Built on trust" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {TRUST.map(({ icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.1, duration:0.55, ease:[0.16,1,0.3,1] }}
                whileHover={{ y:-4, borderColor:C.borderMid }}
                style={{ padding:'36px 30px', backgroundColor:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, transition:'border-color 0.25s' }}
              >
                <div style={{ fontSize:26, marginBottom:16 }}>{icon}</div>
                <div style={{ fontFamily:FD, fontSize:18, fontWeight:600, letterSpacing:'-0.3px', color:C.white, marginBottom:8 }}>{title}</div>
                <div style={{ fontFamily:FB, fontSize:13, color:C.muted, lineHeight:1.68 }}>{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ padding:'80px 40px 120px', backgroundColor:C.bgElevated }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
            style={{ border:`1px solid ${C.borderMid}`, borderRadius:18, padding:'64px 72px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:40, backgroundColor:C.bgCard, position:'relative', overflow:'hidden' }}
          >
            <div style={{ position:'absolute', top:-90, right:-90, width:420, height:420, background:'radial-gradient(circle, rgba(85,211,150,0.055) 0%, transparent 65%)', pointerEvents:'none' }} />
            <div style={{ maxWidth:480, position:'relative' }}>
              <div style={{ fontFamily:FB, fontSize:10, fontWeight:700, letterSpacing:'2.2px', textTransform:'uppercase', color:C.green, marginBottom:14 }}>Begin now</div>
              <h2 style={{ fontFamily:FD, fontSize:38, fontWeight:700, letterSpacing:'-1.8px', color:C.white, marginBottom:14, lineHeight:1.05 }}>Ready to play?</h2>
              <p style={{ fontFamily:FB, fontSize:14, fontWeight:300, color:C.muted, lineHeight:1.72 }}>
                Join thousands of players. Start with 1,000 free coins — no deposit, no card required.
              </p>
            </div>
            <Link to="/register">
              <motion.button whileHover={{ scale:1.04, boxShadow:'0 0 32px rgba(85,211,150,0.22)' }} whileTap={{ scale:0.96 }}
                style={{ display:'inline-flex', alignItems:'center', height:48, padding:'0 28px', backgroundColor:C.green, color:C.bg, border:'none', borderRadius:10, cursor:'pointer', fontFamily:FD, fontSize:14, fontWeight:700, letterSpacing:'-0.2px', boxShadow:'0 0 20px rgba(85,211,150,0.12)', position:'relative' }}
              >Create free account →</motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor:C.bg, borderTop:`1px solid ${C.border}`, padding:'36px 40px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20, paddingBottom:24, marginBottom:24, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:22, height:22, border:`1px solid ${C.borderStrong}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:C.greenDim }}>
                <div style={{ width:6, height:6, backgroundColor:C.green, borderRadius:2 }} />
              </div>
              <span style={{ fontFamily:FD, fontSize:15, fontWeight:700, color:C.white }}>Vexora</span>
            </div>
            <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
              {['Privacy','Terms','Support','Responsible Gaming'].map(item => (
                <span key={item} style={{ fontFamily:FB, fontSize:12, color:C.muted, cursor:'pointer', transition:'color 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.color=C.offWhite}
                  onMouseLeave={e=>e.currentTarget.style.color=C.muted}
                >{item}</span>
              ))}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {['SSL Secured','Provably Fair','Licensed'].map(badge=>(
                <span key={badge} style={{ fontFamily:FB, fontSize:10, fontWeight:500, color:C.faint, padding:'3px 9px', border:`1px solid ${C.border}`, borderRadius:5 }}>{badge}</span>
              ))}
            </div>
          </div>
          <div style={{ fontFamily:FB, fontSize:11, color:C.faint, textAlign:'center', letterSpacing:'0.3px' }}>
            © 2025 Vexora. For entertainment purposes only. 18+ · Play Responsibly
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MINI WIN FEED (hero panel)
───────────────────────────────────────────── */
const MiniWinFeed = () => {
  const [rows, setRows] = useState(() =>
    Array.from({ length:6 }, () => ({ ...randBet(), win:true }))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setRows(prev => [{ ...randBet(), win:true }, ...prev.slice(0,7)]);
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ overflow:'hidden', maxHeight:260 }}>
      <AnimatePresence initial={false}>
        {rows.map(r => (
          <motion.div key={r.id}
            initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 18px', borderBottom:`1px solid ${C.border}` }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:22, height:22, borderRadius:5, backgroundColor:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:C.green, fontFamily:FM, fontWeight:700 }}>
                {r.user[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily:FM, fontSize:11, color:C.offWhite }}>{r.user}</div>
                <div style={{ fontFamily:FB, fontSize:9, color:C.muted }}>{r.game}</div>
              </div>
            </div>
            <div style={{ fontFamily:FM, fontSize:12, color:C.green, fontWeight:700 }}>
              +{(r.amount * r.multiplier - r.amount).toFixed(2)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;