import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegister } from '../hooks/useAuth';
import Input from '../common/ui/Input.jsx';
import Button from '../common/ui/Button.jsx';
import PublicNavbar from '../components/PublicNavbar';
import brandLogo from '../assets/vexora_brand.jpeg';

/* ─── TOKENS ─── */
const C = {
  bg:           '#040605',
  bgCard:       '#0d1410',
  border:       'rgba(85,211,150,0.08)',
  borderMid:    'rgba(85,211,150,0.15)',
  borderStrong: 'rgba(85,211,150,0.28)',
  green:        '#55D396',
  greenDeep:    '#169A50',
  greenDim:     'rgba(85,211,150,0.1)',
  white:        '#FFFFFF',
  offWhite:     '#E8EDE9',
  muted:        '#6B7B6E',
  faint:        '#2A3A2D',
  error:        '#ef4444',
};

const FONT_DISPLAY = `'General Sans', 'DM Sans', sans-serif`;
const FONT_BODY    = `'Barlow', 'Inter', sans-serif`;

const card = {
  hidden:  { opacity:0, y:24, scale:0.99 },
  visible: { opacity:1, y:0,  scale:1, transition:{ duration:0.55, ease:[0.16,1,0.3,1] } },
};
const field = {
  hidden:  { opacity:0, x:-12 },
  visible: (i) => ({ opacity:1, x:0, transition:{ delay:0.28+i*0.07, duration:0.35, ease:[0.4,0,0.2,1] } }),
};

const FeatureTile = ({ emoji, label, delay:d }) => (
  <motion.div
    initial={{opacity:0,y:10,scale:0.96}} animate={{opacity:1,y:0,scale:1}}
    transition={{delay:d,duration:0.4,ease:[0.16,1,0.3,1]}}
    whileHover={{y:-2,scale:1.02}}
    style={{ flex:1, minWidth:0, backgroundColor: C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 10px', textAlign:'center', cursor:'default' }}
  >
    <div style={{ fontSize:18, marginBottom:5 }}>{emoji}</div>
    <div style={{ fontFamily:FONT_BODY, fontSize:11, fontWeight:500, letterSpacing:'0.3px', color: C.muted, lineHeight:1.3 }}>{label}</div>
  </motion.div>
);

const RegisterPage = () => {
  const [form, setForm]     = useState({ username:'', email:'', password:'', confirmPassword:'' });
  const [errors, setErrors] = useState({});
  const { mutate:register, isPending, error } = useRegister();

  const handleChange = (f) => (e) => {
    setForm(p => ({ ...p, [f]: e.target.value }));
    if(errors[f]) setErrors(p => ({ ...p, [f]:'' }));
  };

  const validate = () => {
    const e = {};
    if(!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if(!form.email)    e.email    = 'Email is required';
    if(!form.password) e.password = 'Password must be at least 6 characters';
    if(!form.confirmPassword || form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validate()) return;
    const payload = { ...form };
    delete payload.confirmPassword;
    register(payload);
  };

  return (
    <div style={{ minHeight:'100vh', backgroundColor: C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'96px 16px 48px', position:'relative', overflow:'hidden', fontFamily:FONT_BODY }}>
      <PublicNavbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* Grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(85,211,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(85,211,150,0.025) 1px, transparent 1px)`, backgroundSize:'48px 48px', pointerEvents:'none' }} />
      {/* Glow */}
      <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:560, height:280, background:'radial-gradient(ellipse, rgba(85,211,150,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:460 }}>
        {/* Header */}
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}} style={{textAlign:'center',marginBottom:24}}>
          <motion.div
            style={{ width:48, height:48, border:`1px solid ${C.borderStrong}`, borderRadius:12, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor: C.greenDim, overflow:'hidden' }}
            animate={{ boxShadow:['0 0 0px rgba(85,211,150,0)','0 0 28px rgba(85,211,150,0.22)','0 0 0px rgba(85,211,150,0)'] }}
            transition={{ duration:3.2, repeat:Infinity, ease:'easeInOut' }}
          >
            <img src={brandLogo} alt="Vexora" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </motion.div>

          <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:40, fontWeight:600, letterSpacing:'-2px', lineHeight:1.0, color: C.white, margin:0 }}>
            Join the table
          </h1>
          <p style={{ fontFamily:FONT_BODY, fontSize:15, fontWeight:300, color: C.muted, marginTop:8 }}>
            Start with <strong style={{ color: C.white, fontWeight:500 }}>1,000</strong> free demo coins
          </p>
        </motion.div>

        {/* Feature tiles */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.12}} style={{ display:'flex', gap:8, marginBottom:16 }}>
          <FeatureTile emoji="🎰" label="Instant Access"  delay={0.18} />
          <FeatureTile emoji="🏆" label="Leaderboards"   delay={0.23} />
          <FeatureTile emoji="🎁" label="Daily Rewards"  delay={0.28} />
        </motion.div>

        {/* Card */}
        <motion.div variants={card} initial="hidden" animate="visible"
          style={{ backgroundColor: C.bgCard, border:`1px solid ${C.border}`, borderRadius:20, padding:'36px' }}
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{opacity:0,height:0,marginBottom:0}} animate={{opacity:1,height:'auto',marginBottom:20}} exit={{opacity:0,height:0,marginBottom:0}}
                style={{overflow:'hidden'}}
              >
                <div style={{ padding:'12px 16px', borderRadius:10, backgroundColor:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.18)', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', backgroundColor: C.error, flexShrink:0 }}/>
                  <p style={{ fontFamily:FONT_BODY, fontSize:13, color: C.error, margin:0 }}>
                    {error.response?.data?.message || 'Something went wrong'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { field:'username',        label:'Username',         type:'text' },
              { field:'email',           label:'Email',            type:'email' },
              { field:'password',        label:'Password',         type:'password' },
              { field:'confirmPassword', label:'Confirm Password', type:'password' },
            ].map(({ field:f, label, type, placeholder }, i) => (
              <motion.div key={f} custom={i} variants={field} initial="hidden" animate="visible">
                <Input label={label} type={type} value={form[f]} onChange={handleChange(f)} placeholder={placeholder} error={errors[f]} />
              </motion.div>
            ))}

            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.6}}>
              <Button type="submit" loading={isPending} fullWidth>Claim your coins →</Button>
            </motion.div>
          </form>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}} style={{ display:'flex', alignItems:'center', gap:12, margin:'22px 0' }}>
            <div style={{ flex:1, height:1, backgroundColor: C.border }} />
            <span style={{ fontFamily:FONT_BODY, fontSize:12, fontWeight:400, color: C.muted }}>Have an account?</span>
            <div style={{ flex:1, height:1, backgroundColor: C.border }} />
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.76}} style={{textAlign:'center'}}>
            <Link to="/login" style={{textDecoration:'none'}}>
              <motion.span
                style={{ fontFamily:FONT_BODY, fontSize:13, fontWeight:500, color: C.offWhite, display:'inline-flex', alignItems:'center', gap:4, padding:'9px 18px', borderRadius:9999, border:`1px solid ${C.border}` }}
                whileHover={{ borderColor: C.borderMid, color: C.white, scale:1.02 }}
                whileTap={{ scale:0.98 }}
              >Sign in →</motion.span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} style={{ textAlign:'center', fontFamily:FONT_BODY, fontSize:11, fontWeight:400, color: C.faint, marginTop:16, letterSpacing:'0.3px' }}>
          Play responsibly · 18+ only · Licensed &amp; Secure
        </motion.p>
      </div>
    </div>
  );
};

export default RegisterPage;