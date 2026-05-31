import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar";
import Input from "../common/ui/Input";
import Button from "../common/ui/Button";

const ease = [0.16, 1, 0.3, 1];

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (tone, message, ttl = 2400) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ tone, message });
    toastTimerRef.current = setTimeout(() => setToast(null), ttl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    setError(null);
    showToast("success", "Reset link sent. Check your inbox.");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-black text-zinc-200 antialiased selection:bg-emerald-400/30 overflow-hidden"
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

      <main className="w-full flex-1 bg-gradient-to-b from-black to-emerald-950/30 flex flex-col justify-center px-6 py-10 lg:px-16 lg:py-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-emerald-400/15 blur-[120px]" />

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
                — Recovery request
              </p>
              <h2 className="font-serif text-4xl tracking-tight text-white mb-2">
                Retrieve <span className="italic text-emerald-300">credentials</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Use the email you registered with and we will send the reset link.
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
                    {error}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="johndoe@gmail.com"
                  fontWeight={600}
                  labelWeight={600}
                  error={error}
                />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              >
                <Button type="submit" fullWidth height={42} paddingX={18} fontSize={12}>
                  <span className="uppercase tracking-[0.2em]">Send reset link</span>
                </Button>
              </motion.div>
            </form>

            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } } }}
              className="text-center text-xs text-zinc-500 mt-10"
            >
              Remembered it?{" "}
              <Link to="/login" className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline transition-colors">
                Return to sign in →
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;
