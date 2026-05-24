import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ─── DESIGN TOKENS ─── */
const C = {
  bg:           '#040605',
  bgElevated:   '#080c0a',
  bgCard:       '#0d1410',
  bgSubtle:     '#111a14',
  surface:      '#161e18',
  border:       'rgba(85,211,150,0.08)',
  borderMid:    'rgba(85,211,150,0.15)',
  borderStrong: 'rgba(85,211,150,0.28)',
  green:        '#55D396',
  greenDeep:    '#169A50',
  greenMuted:   'rgba(85,211,150,0.5)',
  greenDim:     'rgba(85,211,150,0.12)',
  white:        '#FFFFFF',
  offWhite:     '#E8EDE9',
  muted:        '#6B7B6E',
  faint:        '#3A4A3D',
  ink:          '#272C2A',
};

const FONT_DISPLAY = `'General Sans', 'DM Sans', sans-serif`;
const FONT_BODY    = `'Barlow', 'Inter', sans-serif`;

/* ─── TICKER ─── */
const TICKER = ['Provably Fair','Instant Settlement','1 000 Free Coins','5 Live Games','Zero Deposit','SSL Encrypted','99.2% Uptime'];

const Ticker = () => (
  <div style={{ overflow:'hidden', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'12px 0', backgroundColor: C.bgElevated }}>
    <motion.div
      animate={{ x:['0%','-50%'] }}
      transition={{ duration:32, repeat:Infinity, ease:'linear' }}
      style={{ display:'flex', width:'max-content' }}
    >
      {[...TICKER,...TICKER].map((t,i) => (
        <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:20, padding:'0 24px', whiteSpace:'nowrap', fontFamily:FONT_BODY, fontSize:11, fontWeight:500, letterSpacing:'1.8px', textTransform:'uppercase', color: C.muted }}>
          {t}
          <span style={{ color: C.green, fontSize:4 }}>●</span>
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─── LIVE BADGE ─── */
const LiveBadge = () => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:9999, border:`1px solid ${C.borderMid}`, backgroundColor: C.greenDim, fontFamily:FONT_BODY, fontSize:12, fontWeight:500, letterSpacing:'0.5px', color: C.green }}>
    <motion.span
      animate={{ opacity:[1,0.2,1] }}
      transition={{ duration:1.8, repeat:Infinity }}
      style={{ width:6, height:6, borderRadius:'50%', backgroundColor: C.green, display:'inline-block' }}
    />
    5 games live
  </span>
);

/* ─── STAT ─── */
const Stat = ({ value, label, delay:d }) => {
  const ref   = useRef(null);
  const [go, setGo] = useState(false);
  const [out, setOut] = useState('0');
  const num    = parseFloat(value.replace(/[^0-9.]/g,''));
  const suffix = value.replace(/[0-9.,]/g,'');

  const observe = () => {
    const io = new IntersectionObserver(([e]) => { if(e.isIntersecting && !go) setGo(true); }, { threshold:0.5 });
    if(ref.current) io.observe(ref.current); return () => io.disconnect();
  };
  // eslint-disable-next-line
  typeof window !== 'undefined' && useRef(observe);

  useState(() => {
    if(!go) return;
    const dur=1800, s=performance.now();
    const tick=(n)=>{ const p=Math.min((n-s)/dur,1); const e=1-Math.pow(1-p,3); setOut(Math.floor(e*num).toLocaleString()+suffix); if(p<1) requestAnimationFrame(tick); else setOut(value); };
    requestAnimationFrame(tick);
  }, [go]);

  return (
    <motion.div ref={ref} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:d,duration:0.7,ease:[0.16,1,0.3,1]}} style={{textAlign:'center'}}>
      <div style={{ fontFamily:FONT_DISPLAY, fontSize:36, fontWeight:600, color: C.white, letterSpacing:'-1.5px', lineHeight:1 }}>{value}</div>
      <div style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:500, letterSpacing:'1.6px', textTransform:'uppercase', color: C.muted, marginTop:10 }}>{label}</div>
    </motion.div>
  );
};

/* ─── GAME CARD ─── */
const GAMES = [
  { id:'dice',     label:'Dice',     sub:'Roll. Risk. Repeat.',     tag:'Live',   accent:'#55D396' },
  { id:'coinflip', label:'Coinflip', sub:'Heads or tails — fast',   tag:'Quick',  accent:'#169A50' },
  { id:'mines',    label:'Mines',    sub:'Navigate the field',      tag:'Hot',    accent:'#55D396' },
  { id:'crash',    label:'Crash',    sub:'Exit before collapse',     tag:'Risk',   accent:'#169A50' },
  { id:'soon',     label:'Soon',     sub:'Something new stirs',     tag:'Soon',   accent:'#272C2A' },
];

const GameCard = ({ game, delay:d }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
      transition={{delay:d,duration:0.6,ease:[0.16,1,0.3,1]}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    >
      <motion.div
        animate={{ y: hov ? -6 : 0 }}
        transition={{duration:0.3,ease:[0.16,1,0.3,1]}}
        style={{
          padding:'28px 24px', borderRadius:16, cursor:'pointer',
          backgroundColor: hov ? C.bgSubtle : C.bgCard,
          border:`1px solid ${hov ? C.borderMid : C.border}`,
          transition:'background 0.25s, border-color 0.25s',
          aspectRatio:'3/4', display:'flex', flexDirection:'column', justifyContent:'space-between',
        }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <span style={{ fontFamily:FONT_BODY, fontSize:10, fontWeight:600, letterSpacing:'1.8px', textTransform:'uppercase', color: game.accent, padding:'4px 10px', border:`1px solid ${game.accent}30`, borderRadius:9999 }}>{game.tag}</span>
          <motion.div animate={{ rotate: hov ? 45 : 0 }} transition={{duration:0.25}} style={{ color: C.faint, fontSize:16 }}>+</motion.div>
        </div>

        <div style={{ textAlign:'center', fontSize:48, opacity: game.id==='soon' ? 0.3 : 0.9 }}>
          {game.id==='dice'?'⚄': game.id==='coinflip'?'◉': game.id==='mines'?'⊛': game.id==='crash'?'◈':'?'}
        </div>

        <div>
          <div style={{ fontFamily:FONT_DISPLAY, fontSize:22, fontWeight:600, letterSpacing:'-0.5px', color: C.white, marginBottom:4 }}>{game.label}</div>
          <div style={{ fontFamily:FONT_BODY, fontSize:13, color: C.muted, marginBottom:12 }}>{game.sub}</div>
          <motion.div animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -6 }} transition={{duration:0.2}}
            style={{ fontFamily:FONT_BODY, fontSize:12, fontWeight:600, letterSpacing:'0.5px', color: C.green }}>Play now →</motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── STEP ─── */
const Step = ({ num, title, desc, delay:d }) => (
  <motion.div
    initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
    transition={{delay:d,duration:0.65,ease:[0.16,1,0.3,1]}}
    style={{ padding:'36px 32px', backgroundColor: C.bgCard, border:`1px solid ${C.border}`, borderRadius:16, position:'relative', overflow:'hidden' }}
  >
    <div style={{ fontFamily:FONT_DISPLAY, fontSize:80, fontWeight:700, color:'rgba(85,211,150,0.04)', position:'absolute', top:-10, right:16, lineHeight:1 }}>{num}</div>
    <div style={{ fontFamily:FONT_BODY, fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color: C.green, marginBottom:14 }}>{num}</div>
    <div style={{ fontFamily:FONT_DISPLAY, fontSize:20, fontWeight:600, letterSpacing:'-0.3px', color: C.white, marginBottom:10 }}>{title}</div>
    <div style={{ fontFamily:FONT_BODY, fontSize:14, color: C.muted, lineHeight:1.65 }}>{desc}</div>
  </motion.div>
);

/* ─── SECTION HEADING ─── */
const SectionHead = ({ eyebrow, title }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.65,ease:[0.16,1,0.3,1]}} style={{marginBottom:64}}>
    <div style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:600, letterSpacing:'2.2px', textTransform:'uppercase', color: C.green, marginBottom:16 }}>{eyebrow}</div>
    <div style={{ fontFamily:FONT_DISPLAY, fontSize:48, fontWeight:600, letterSpacing:'-2px', color: C.white, lineHeight:1.05 }}>{title}</div>
    <motion.div initial={{width:0}} whileInView={{width:36}} viewport={{once:true}} transition={{duration:0.7,delay:0.2,ease:[0.16,1,0.3,1]}} style={{ height:2, backgroundColor: C.green, borderRadius:9999, marginTop:24 }} />
  </motion.div>
);

/* ─── MAIN ─── */
const LandingPage = () => {
  const { scrollY }  = useScroll();
  const heroY        = useTransform(scrollY,[0,700],[0,-60]);
  const heroOpacity  = useTransform(scrollY,[0,400],[1,0]);

  return (
    <div style={{ backgroundColor: C.bg, color: C.white, minHeight:'100vh', overflowX:'hidden', fontFamily:FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:rgba(85,211,150,0.2); color:#55D396; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:${C.bg}; }
        ::-webkit-scrollbar-thumb { background:${C.faint}; border-radius:2px; }
        a { text-decoration:none; }
      `}</style>

      {/* NAV */}
      <motion.nav
        initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}}
        style={{ position:'sticky', top:0, zIndex:100, height:64, borderBottom:`1px solid ${C.border}`, backgroundColor: 'rgba(4,6,5,0.92)', backdropFilter:'blur(20px)' }}
      >
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 40px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, border:`1px solid ${C.borderStrong}`, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor: C.greenDim }}>
              <div style={{ width:8, height:8, backgroundColor: C.green, borderRadius:2 }}/>
            </div>
            <span style={{ fontFamily:FONT_DISPLAY, fontSize:17, fontWeight:600, letterSpacing:'-0.3px', color: C.white }}>Vexora</span>
          </div>

          <div style={{ display:'flex', gap:32 }}>
            {['Games','Leaderboard','Promotions','About'].map(item => (
              <span key={item} style={{ fontFamily:FONT_BODY, fontSize:14, fontWeight:400, color: C.muted, cursor:'pointer', transition:'color 0.15s', letterSpacing:'0.1px' }}
                onMouseEnter={e=>e.currentTarget.style.color=C.offWhite}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              >{item}</span>
            ))}
          </div>

          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <Link to="/login">
              <span style={{ fontFamily:FONT_BODY, fontSize:14, fontWeight:400, color: C.muted, cursor:'pointer', transition:'color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.color=C.offWhite}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              >Sign in</span>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                style={{ display:'inline-flex', alignItems:'center', height:38, padding:'0 18px', backgroundColor: C.green, color: C.bg, border:'none', borderRadius:9, cursor:'pointer', fontFamily:FONT_BODY, fontSize:13, fontWeight:600, letterSpacing:'0.2px' }}
              >Try free</motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'90vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        {/* BG grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(85,211,150,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(85,211,150,0.03) 1px, transparent 1px)`, backgroundSize:'48px 48px', pointerEvents:'none' }} />
        {/* Glow */}
        <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:300, background:'radial-gradient(ellipse, rgba(85,211,150,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

        <motion.div style={{ y:heroY, opacity:heroOpacity, position:'relative', zIndex:2, textAlign:'center', maxWidth:800, margin:'0 auto', padding:'0 40px' }}>
          <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:0.5}} style={{marginBottom:24,display:'flex',justifyContent:'center'}}>
            <LiveBadge />
          </motion.div>

          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.08}}>
            <div style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color: C.muted, marginBottom:20 }}>Vexora · The Premium Gaming Arena</div>
          </motion.div>

          <motion.h1
            initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.75,delay:0.18,ease:[0.16,1,0.3,1]}}
            style={{ fontFamily:FONT_DISPLAY, fontSize:'clamp(52px,8vw,80px)', fontWeight:600, letterSpacing:'-3.5px', lineHeight:0.95, color: C.white, margin:`0 0 28px` }}
          >
            Where winners<br/>
            <motion.span
              animate={{ color:[C.green,'#a4e8c4',C.green] }}
              transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
            >dare to play</motion.span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.34}}
            style={{ fontFamily:FONT_BODY, fontSize:16, fontWeight:300, color: C.muted, maxWidth:440, margin:`0 auto 44px`, lineHeight:1.7 }}
          >
            Five electrifying games. Real-time thrills. Zero risk.<br/>
            Start with <strong style={{ color: C.offWhite, fontWeight:500 }}>1,000 free coins</strong> — no deposit, no card ever.
          </motion.p>

          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.48}}
            style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}
          >
            <Link to="/register">
              <motion.button
                whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                style={{ display:'inline-flex', alignItems:'center', height:48, padding:'0 28px', backgroundColor: C.green, color: C.bg, border:'none', borderRadius:10, cursor:'pointer', fontFamily:FONT_DISPLAY, fontSize:15, fontWeight:600, letterSpacing:'-0.2px', boxShadow:'0 0 32px rgba(85,211,150,0.2)' }}
              >Start Playing Free →</motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                style={{ display:'inline-flex', alignItems:'center', height:48, padding:'0 24px', backgroundColor:'transparent', color: C.offWhite, border:`1px solid ${C.borderMid}`, borderRadius:10, cursor:'pointer', fontFamily:FONT_BODY, fontSize:14, fontWeight:400 }}
              >Sign in</motion.button>
            </Link>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}
            style={{ display:'flex', gap:48, justifyContent:'center', marginTop:56, paddingTop:32, borderTop:`1px solid ${C.border}` }}
          >
            {[['99.2%','Uptime'],['12ms','Avg latency'],['100%','Provably fair']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{ fontFamily:FONT_DISPLAY, fontSize:26, fontWeight:600, letterSpacing:'-1px', color: C.white }}>{v}</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:500, letterSpacing:'1.4px', textTransform:'uppercase', color: C.muted, marginTop:6 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{y:[0,8,0]}} transition={{duration:2.4,repeat:Infinity,ease:'easeInOut'}}
          style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
        >
          <div style={{ fontFamily:FONT_BODY, fontSize:10, fontWeight:500, letterSpacing:'1.5px', textTransform:'uppercase', color: C.faint }}>Scroll</div>
          <div style={{ width:1, height:32, backgroundColor: C.faint }} />
        </motion.div>
      </section>

      <Ticker />

      {/* STATS */}
      <section style={{ padding:'96px 40px', backgroundColor: C.bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', border:`1px solid ${C.border}` }}>
            {[{value:'48,200+',label:'Active Players'},{value:'2,100,000+',label:'Games Played'},{value:'99%',label:'Satisfaction'},{value:'5',label:'Live Games'}].map((s,i)=>(
              <div key={s.label} style={{ padding:'48px 32px', borderRight: i<3 ? `1px solid ${C.border}` : 'none', backgroundColor: i===1 ? C.bgCard : 'transparent' }}>
                <Stat value={s.value} label={s.label} delay={i*0.1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section style={{ padding:'96px 40px', backgroundColor: C.bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead eyebrow="Our Games" title="Choose your game" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {GAMES.map((g,i)=><GameCard key={g.id} game={g} delay={i*0.08} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'96px 40px', backgroundColor: C.bgElevated }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead eyebrow="Simple Steps" title="Up & running in 60 seconds" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            <Step num="01" title="Create account"   desc="Sign up free in under 30 seconds. No deposit, no card, no conditions."     delay={0}    />
            <Step num="02" title="Claim free coins" desc="Receive 1 000 demo coins the moment your account opens. Yours to keep."     delay={0.12} />
            <Step num="03" title="Play & win"       desc="Choose any live game. Place bets. Feel every outcome in real time."         delay={0.24} />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding:'96px 40px', backgroundColor: C.bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { icon:'🛡', title:'Provably Fair', desc:'Every outcome is cryptographically verified and independently auditable in real time.' },
              { icon:'⚡', title:'Instant Settlement', desc:'Winnings hit your balance the moment the result lands. No delays, no waiting, ever.' },
              { icon:'🔒', title:'SSL Encrypted', desc:'Military-grade encryption protects every session and every transaction on the platform.' },
            ].map(({icon,title,desc},i)=>(
              <motion.div key={title}
                initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                transition={{delay:i*0.12,duration:0.6,ease:[0.16,1,0.3,1]}}
                whileHover={{y:-4,borderColor: C.borderMid}}
                style={{ padding:'36px 32px', backgroundColor: C.bgCard, border:`1px solid ${C.border}`, borderRadius:16, transition:'border-color 0.25s' }}
              >
                <div style={{ fontSize:28, marginBottom:18 }}>{icon}</div>
                <div style={{ fontFamily:FONT_DISPLAY, fontSize:18, fontWeight:600, letterSpacing:'-0.3px', color: C.white, marginBottom:10 }}>{title}</div>
                <div style={{ fontFamily:FONT_BODY, fontSize:14, color: C.muted, lineHeight:1.65 }}>{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ padding:'96px 40px 120px', backgroundColor: C.bgElevated }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div
            initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,ease:[0.16,1,0.3,1]}}
            style={{ border:`1px solid ${C.borderMid}`, borderRadius:20, padding:'72px 80px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:48, backgroundColor: C.bgCard, position:'relative', overflow:'hidden' }}
          >
            <div style={{ position:'absolute', top:-80, right:-80, width:400, height:400, background:'radial-gradient(circle, rgba(85,211,150,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />
            <div style={{ maxWidth:480, position:'relative' }}>
              <div style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color: C.green, marginBottom:16 }}>Begin now</div>
              <h2 style={{ fontFamily:FONT_DISPLAY, fontSize:40, fontWeight:600, letterSpacing:'-1.8px', color: C.white, marginBottom:16, lineHeight:1.05 }}>Ready to play?</h2>
              <p style={{ fontFamily:FONT_BODY, fontSize:15, fontWeight:300, color: C.muted, lineHeight:1.7 }}>
                Join thousands of players. Start with 1 000 free coins — no deposit, no card required.
              </p>
            </div>
            <Link to="/register">
              <motion.button
                whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                style={{ display:'inline-flex', alignItems:'center', height:48, padding:'0 28px', backgroundColor: C.green, color: C.bg, border:'none', borderRadius:10, cursor:'pointer', fontFamily:FONT_DISPLAY, fontSize:15, fontWeight:600, letterSpacing:'-0.2px', boxShadow:'0 0 28px rgba(85,211,150,0.15)', position:'relative' }}
              >Create free account →</motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: C.bg, borderTop:`1px solid ${C.border}`, padding:'40px 40px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:24, paddingBottom:28, marginBottom:28, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{ width:24, height:24, border:`1px solid ${C.borderStrong}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor: C.greenDim }}>
                <div style={{ width:7, height:7, backgroundColor: C.green, borderRadius:2 }}/>
              </div>
              <span style={{ fontFamily:FONT_DISPLAY, fontSize:16, fontWeight:600, color: C.white }}>Vexora</span>
            </div>
            <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
              {['Privacy','Terms','Support','Responsible Gaming'].map(item=>(
                <span key={item} style={{ fontFamily:FONT_BODY, fontSize:13, fontWeight:400, color: C.muted, cursor:'pointer', transition:'color 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.color=C.offWhite} onMouseLeave={e=>e.currentTarget.style.color=C.muted}
                >{item}</span>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {['SSL Secured','Provably Fair','Licensed'].map(badge=>(
                <span key={badge} style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:500, letterSpacing:'0.3px', color: C.faint, padding:'4px 10px', border:`1px solid ${C.border}`, borderRadius:6 }}>{badge}</span>
              ))}
            </div>
          </div>
          <div style={{ fontFamily:FONT_BODY, fontSize:12, color: C.faint, textAlign:'center', letterSpacing:'0.3px' }}>
            © 2025 Vexora. For entertainment purposes only. 18+ · Play Responsibly
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;