import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Trophy } from "lucide-react";
import rouletteBg from "../assets/vexora-roulette.jpg";
import brandLogo from "../assets/vexora_brand.jpeg";
import PublicNavbar from "../components/PublicNavbar";
import Input from "../common/ui/Input";
import Button from "../common/ui/Button";

const ease = [0.16, 1, 0.3, 1];

const steps = [
  { Icon: ShieldCheck, title: "Secure Validation", body: "Multi-factor authentication keeps your vault yours alone." },
  { Icon: Zap, title: "Instant Liquidity", body: "Your balance is live across every premium floor on entry." },
  { Icon: Trophy, title: "Tiered Rewards", body: "Loyalty points accrue with every hand in our high-limit salons." },
];

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const showToast = (tone, message, ttl = 2400) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ tone, message });
    toastTimerRef.current = setTimeout(() => setToast(null), ttl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    setServerError(null);
    showToast("success", "Credentials accepted. Signing you in...", 1800);
    setTimeout(() => {
      setPending(false);
      const message = "Invalid credentials. Please verify and try again.";
      setServerError(message);
      showToast("error", message, 2600);
    }, 900);
  };

  return (
    <div
      className="min-h-screen pt-10 flex flex-col lg:flex-row bg-black text-zinc-200 antialiased selection:bg-emerald-400/30 overflow-hidden"
      style={{ fontFamily: "'Geist', ui-sans-serif, system-ui" }}
    >
      <PublicNavbar />
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="fixed top-6 right-6 z-[60]"
          >
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{
                background: "linear-gradient(135deg, rgba(12,16,14,0.98), rgba(8,12,10,0.98))",
                borderColor: toast.tone === "success" ? "rgba(52,211,153,0.4)" : "rgba(244,63,94,0.35)",
                boxShadow:
                  toast.tone === "success"
                    ? "0 18px 45px -22px rgba(52,211,153,0.45)"
                    : "0 18px 45px -22px rgba(244,63,94,0.5)",
              }}
            >
              <span
                className={
                  toast.tone === "success"
                    ? "size-1.5 rounded-full bg-emerald-300"
                    : "size-1.5 rounded-full bg-rose-400"
                }
              />
              <p
                className={
                  toast.tone === "success"
                    ? "text-[12px] text-emerald-100 tracking-[0.02em]"
                    : "text-[12px] text-rose-200 tracking-[0.02em]"
                }
              >
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .font-serif { font-family: 'Instrument Serif', ui-serif, Georgia, serif; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      {/* LEFT — brand */}
      <aside className="relative flex-1 lg:w-[58%] overflow-hidden flex flex-col justify-between p-6 lg:p-12 border-b lg:border-b-0 lg:border-r border-emerald-400/10 min-h-[460px]">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${rouletteBg})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/80" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(85,211,150,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(85,211,150,0.45)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-emerald-500/20 blur-[140px]" />

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.3 }}
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent origin-left z-10"
        />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative z-10 flex items-center gap-3 mt-10"
        >
          <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-lg ring-1 ring-emerald-300/60">
            <img src={brandLogo} alt="Vexora" className="h-full w-full object-cover" />
          </div>
          <span className="font-serif text-3xl tracking-tight text-white">Vexora</span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } } }}
          className="relative z-10 max-w-xl mt-8 lg:mt-0"
        >
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
            className="font-serif text-5xl lg:text-6xl leading-[1.06] tracking-[-0.01em] mt-3 text-white"
          >
            The quiet <span className="italic text-emerald-300">anticipation</span> of the turn.
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="mt-4 text-base lg:text-lg text-zinc-300/80 max-w-[44ch] leading-relaxed tracking-[0.01em]"
          >
            Welcome back to the inner circle. Your preferred table, stakes, and
            settings remain exactly as you left them.
          </motion.p>
        </motion.div>

        <div className="relative z-10 mt-10 lg:mt-8">
          <div className="grid gap-4 mb-8">
            {steps.map((s, i) => {
              const { Icon } = s;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.13, duration: 0.6, ease }}
                  whileHover={{ x: 6 }}
                  className="group flex items-start gap-4 cursor-default"
                >
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/5 transition-colors group-hover:bg-emerald-400/15">
                    <Icon className="size-4 text-emerald-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-serif text-lg text-white">{s.title}</p>
                    <p className="text-sm text-zinc-400 max-w-[42ch] mt-1 leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 border-t border-emerald-400/10 pt-6"
          >
            Play Responsibly · Licensed &amp; Secure · 18+
          </motion.p>
        </div>
      </aside>

      <main className="lg:w-[42%] bg-gradient-to-b from-black to-emerald-950/30 flex flex-col justify-center px-6 py-10 lg:px-16 lg:py-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-emerald-400/15 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="max-w-sm mx-auto w-full relative"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              className="mb-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-3">
                — Member sign in
              </p>
              <h2 className="font-serif text-4xl tracking-tight text-white mb-2">
                Secure <span className="italic text-emerald-300">access</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Welcome back. Verify your identity to continue to the floor.
              </p>
            </motion.div>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <motion.div
                    animate={{ x: [0, -6, 6, -4, 4, 0] }}
                    transition={{ duration: 0.4 }}
                    className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-[13px] text-rose-300"
                  >
                    {serverError}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <motion.div
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
                className="space-y-1.5"
              >
                <label htmlFor="email" className="block font-mono font-semibold text-[10px] uppercase tracking-[0.25em] text-zinc-400 ml-0.5">
                  Email address
                </label>
                <Input
                  id="email"
                  label=""
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, email: e.target.value }));
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="johndoe@gmail.com"
                  fontWeight={600}
                  labelWeight={600}
                  error={errors.email}
                />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
                className="space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="font-mono font-semibold text-[10px] uppercase tracking-[0.25em] text-zinc-400 ml-0.5">
                    Password
                  </label>
                  <a href="#" className="text-[11px] text-emerald-300 hover:text-emerald-200 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  label=""
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  fontWeight={600}
                  error={errors.password}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="text-zinc-500 hover:text-emerald-300 transition-colors"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              >
                <Button
                  type="submit"
                  loading={pending}
                  fullWidth
                  height={42}
                  paddingX={18}
                  fontSize={12}
                >
                  <span className="uppercase tracking-[0.2em]">Authorize entry</span>
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            </form>

            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } } }}
              className="text-center text-xs text-zinc-500 mt-10"
            >
              New to Vexora?{" "}
              <a href="/register" className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline transition-colors">
                Apply for membership →
              </a>
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } } }}
              className="flex justify-center gap-6 pt-8 mt-8 border-t border-emerald-400/10"
            >
              {["Loyalty", "24h Support", "Global"].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <span className="size-1 bg-emerald-400 rounded-full" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    {b}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default LoginPage;
