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
  visible: (i) => ({ opacity:1, x:0, transition:{ delay:0.28+i*0.08, duration:0.36, ease:[0.4,0,0.2,1] } }),
};

const LoginPage = () => {
  const [form, setForm]   = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({});
  const { mutate:login, isPending, error } = useLogin();

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if(errors[field]) setErrors(p => ({ ...p, [field]:'' }));
  };

  const validate = () => {
    const e = {};
    if(!form.email)    e.email    = 'Email is required';
    if(!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validate()) return;
    login(form);
  };

  return (
    <div style={{ minHeight:'100vh', backgroundColor: C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 16px', position:'relative', overflow:'hidden', fontFamily:FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* Grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(85,211,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(85,211,150,0.025) 1px, transparent 1px)`, backgroundSize:'48px 48px', pointerEvents:'none' }} />
      {/* Glow */}
      <div style={{ position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)', width:480, height:240, background:'radial-gradient(ellipse, rgba(85,211,150,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:440 }}>
        {/* Header */}
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}} style={{textAlign:'center',marginBottom:32}}>
          <motion.div
            style={{ width:48, height:48, border:`1px solid ${C.borderStrong}`, borderRadius:12, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor: C.greenDim }}
            animate={{ boxShadow:['0 0 0px rgba(85,211,150,0)','0 0 24px rgba(85,211,150,0.2)','0 0 0px rgba(85,211,150,0)'] }}
            transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
          >
            <div style={{ width:12, height:12, backgroundColor: C.green, borderRadius:3 }}/>
          </motion.div>

          <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:40, fontWeight:600, letterSpacing:'-2px', lineHeight:1.0, color: C.white, margin:0 }}>
            Welcome back
          </h1>
          <p style={{ fontFamily:FONT_BODY, fontSize:15, fontWeight:300, color: C.muted, marginTop:8 }}>
            Sign in to your account
          </p>
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

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { field:'email',    label:'Email',    type:'email'},
              { field:'password', label:'Password', type:'password'},
            ].map(({ field:f, label, type, placeholder }, i) => (
              <motion.div key={f} custom={i} variants={field} initial="hidden" animate="visible">
                <Input label={label} type={type} value={form[f]} onChange={handleChange(f)} placeholder={placeholder} error={errors[f]} />
              </motion.div>
            ))}

            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.48}} style={{ display:'flex', justifyContent:'flex-end', marginTop:-4 }}>
              <span style={{ fontFamily:FONT_BODY, fontSize:12, fontWeight:500, color: C.muted, cursor:'pointer', transition:'color 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.color=C.offWhite}
                onMouseLeave={e=>e.currentTarget.style.color=C.muted}
              >Forgot password?</span>
            </motion.div>

            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.54}}>
              <Button type="submit" loading={isPending} fullWidth>Sign in</Button>
            </motion.div>
          </form>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.65}} style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
            <div style={{ flex:1, height:1, backgroundColor: C.border }} />
            <span style={{ fontFamily:FONT_BODY, fontSize:12, fontWeight:400, color: C.muted }}>New here?</span>
            <div style={{ flex:1, height:1, backgroundColor: C.border }} />
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}} style={{textAlign:'center'}}>
            <Link to="/register" style={{textDecoration:'none'}}>
              <motion.span
                style={{ fontFamily:FONT_BODY, fontSize:13, fontWeight:500, color: C.offWhite, display:'inline-flex', alignItems:'center', gap:4, padding:'9px 18px', borderRadius:9999, border:`1px solid ${C.border}` }}
                whileHover={{ borderColor: C.borderMid, color: C.white, scale:1.02 }}
                whileTap={{ scale:0.98 }}
              >Create an account →</motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.85}} style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20, flexWrap:'wrap' }}>
          {['🎰 Instant Access','🏆 Leaderboards','🎁 Daily Rewards'].map(label => (
            <span key={label} style={{ display:'inline-flex', alignItems:'center', padding:'5px 12px', borderRadius:9999, border:`1px solid ${C.border}`, backgroundColor: C.greenDim, fontFamily:FONT_BODY, fontSize:11, fontWeight:500, color: C.muted, letterSpacing:'0.3px' }}>{label}</span>
          ))}
        </motion.div>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} style={{ textAlign:'center', fontFamily:FONT_BODY, fontSize:11, fontWeight:400, color: C.faint, marginTop:16, letterSpacing:'0.3px' }}>
          Play responsibly · 18+ only · Licensed &amp; Secure
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;