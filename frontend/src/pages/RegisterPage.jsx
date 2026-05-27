import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Trophy } from "lucide-react";
import { useRegister } from "../hooks/useAuth";
import rouletteBg from "../assets/vexora-roulette.jpg";
import brandLogo from "../assets/vexora_brand.jpeg";
import PublicNavbar from "../components/PublicNavbar";
import Input from "../common/ui/Input";
import Button from "../common/ui/Button";

const ease = [0.16, 1, 0.3, 1];

const steps = [
  { Icon: ShieldCheck, title: "Secure Validation", body: "Identity checks keep every seat reserved for real members." },
  { Icon: Zap, title: "Instant Credits", body: "Join with a starter balance so you can play immediately." },
  { Icon: Trophy, title: "Tiered Rewards", body: "Unlock rewards the more you play across the floor." },
];

function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const { mutate: register, isPending, error } = useRegister();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.username || form.username.length < 3) next.username = "Username must be at least 3 characters";
    if (!form.email) next.email = "Email is required";
    if (!form.password || form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (!form.confirmPassword || form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
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
      className="min-h-screen pt-10 flex flex-col lg:flex-row bg-black text-zinc-200 antialiased selection:bg-emerald-400/30 overflow-hidden"
      style={{ fontFamily: "'Geist', ui-sans-serif, system-ui" }}
    >
      <PublicNavbar />
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
            Open the <span className="italic text-emerald-300">private floor</span>.
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="mt-4 text-base lg:text-lg text-zinc-300/80 max-w-[44ch] leading-relaxed tracking-[0.01em]"
          >
            Create your credentials and unlock curated tables, rewards, and
            a starting balance that is ready on arrival.
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

      {/* RIGHT — form */}
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
              className="mb-8 mt-10"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-3">
                — Member onboarding
              </p>
              <h2 className="font-serif text-4xl tracking-tight text-white mb-2">
                Claim your <span className="italic text-emerald-300">seat</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Register once and your membership follows you across every table.
              </p>
            </motion.div>

            <AnimatePresence>
              {error && (
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
                    {error.response?.data?.message || "Something went wrong"}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <motion.div
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
                className="space-y-1.5"
              >
                <label htmlFor="username" className="block font-mono font-semibold text-[10px] uppercase tracking-[0.25em] text-zinc-400 ml-0.5">
                  Username
                </label>
                <Input
                  id="username"
                  label=""
                  type="text"
                  value={form.username}
                  onChange={handleChange("username")}
                  placeholder="shadow.player"
                  fontWeight={600}
                  labelWeight={600}
                  error={errors.username}
                />
              </motion.div>

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
                  onChange={handleChange("email")}
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
                <label htmlFor="password" className="block font-mono font-semibold text-[10px] uppercase tracking-[0.25em] text-zinc-400 ml-0.5">
                  Password
                </label>
                <Input
                  id="password"
                  label=""
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Create a password"
                  fontWeight={600}
                  labelWeight={600}
                  error={errors.password}
                />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
                className="space-y-1.5"
              >
                <label htmlFor="confirmPassword" className="block font-mono font-semibold text-[10px] uppercase tracking-[0.25em] text-zinc-400 ml-0.5">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  label=""
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Confirm Password"
                  fontWeight={600}
                  labelWeight={600}
                  error={errors.confirmPassword}
                />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              >
                <Button type="submit" loading={isPending} fullWidth height={42} paddingX={18} fontSize={12}>
                  <span className="uppercase tracking-[0.2em]">Create membership</span>
                </Button>
              </motion.div>
            </form>

            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } } }}
              className="text-center text-xs text-zinc-500 mt-10"
            >
              Already approved?{" "}
              <Link to="/login" className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline transition-colors">
                Sign in →
              </Link>
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } } }}
              className="flex justify-center gap-6 pt-8 mt-8 border-t border-emerald-400/10"
            >
              {["Instant Credits", "24h Support", "Private Tables"].map((b) => (
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

export default RegisterPage;