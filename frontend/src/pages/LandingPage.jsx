import { motion, useScroll, useTransform } from "framer-motion";
import {
  Dice5, Coins, Bomb, TrendingUp, 
  Shield, Zap, Lock, ArrowRight, ArrowUpRight,
  Play,
} from "lucide-react";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import diceImage from "../assets/Dice.jpeg";
import mineImage from "../assets/Mine.jpeg";
import crashImage from "../assets/Crash.jpeg";
import coinflipVideo from "../assets/coinflip.mp4";

const TICKER = ["Provably Fair","Instant Settlement","1,000 Free Coins","Zero Deposit","SSL Encrypted","99.2% Uptime"];
function Ticker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="border-y border-emerald-400/10 bg-emerald-950/20 overflow-hidden"
    >
      <div className="flex gap-12 py-3 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
        {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: (i % 6) * 0.04 }}
            className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-300/70"
          >
            {t}
            <span className="text-emerald-400/40">●</span>
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

const GAMES = [
  { id: "dice", label: "Dice", sub: "Roll. Risk. Repeat.", tag: "Live", Icon: Dice5, image: diceImage },
  { id: "coinflip", label: "Coinflip", sub: "Heads or tails — instant.", tag: "Quick", Icon: Coins, video: coinflipVideo },
  { id: "mines", label: "Mines", sub: "Navigate the field.", tag: "Hot", Icon: Bomb, image: mineImage },
  { id: "crash", label: "Crash", sub: "Exit before the collapse.", tag: "Risk", Icon: TrendingUp, image: crashImage },
];

function GameCard({ game, i }) {
  const { Icon, image, video } = game;
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-emerald-400/10 bg-gradient-to-b from-emerald-950/30 to-black p-8 min-h-80 md:min-h-96 transition-all duration-500 hover:border-emerald-400/40"
    >
      {(image || video) && (
        <div className="pointer-events-none absolute inset-0">
          {video ? (
            <video
              className="h-full w-full object-cover opacity-80"
              src={video}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover opacity-85"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
        </div>
      )}
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(85,211,150,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(85,211,150,0.4)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/80 drop-shadow">{game.tag}</span>
        <ArrowUpRight className="size-4 text-emerald-300/50 transition-transform duration-500 group-hover:rotate-45 group-hover:text-emerald-300" />
      </div>

      {!image && !video && (
        <div className="relative my-12 flex items-center justify-center">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative flex size-24 items-center justify-center rounded-2xl border border-emerald-400/20 bg-black/40 backdrop-blur"
          >
            <Icon className="size-10 text-emerald-300" strokeWidth={1.2} />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-emerald-400/0 group-hover:ring-emerald-400/30 transition" />
          </motion.div>
        </div>
      )}

      <div className="relative">
        <h3 className="font-serif text-3xl text-white tracking-tight drop-shadow">{game.label}</h3>
        <p className="mt-1 text-sm text-zinc-200/80 drop-shadow">{game.sub}</p>
        <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-200 drop-shadow">
          Play now
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.a>
  );
}

function Step({ num, title, desc, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl border border-emerald-400/10 bg-emerald-950/10 p-8 transition-colors hover:border-emerald-400/30"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/60">Step {num}</div>
      <div className="absolute right-6 top-6 font-serif italic text-6xl text-emerald-400/10 transition-colors group-hover:text-emerald-400/30">{num}</div>
      <h4 className="mt-6 font-serif text-2xl text-white">{title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{desc}</p>
    </motion.div>
  );
}

function SectionHead({ eyebrow, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {eyebrow}
        </div>
        <h2 className="mt-4 font-serif text-5xl md:text-6xl text-white tracking-tight leading-[0.95] max-w-3xl">{title}</h2>
      </div>
      <div className="h-px flex-1 md:max-w-xs bg-gradient-to-r from-emerald-400/40 to-transparent" />
    </motion.div>
  );
}

function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div
      className="min-h-screen bg-black text-zinc-200 antialiased selection:bg-emerald-400/30 selection:text-emerald-200"
      style={{ fontFamily: "'Geist', ui-sans-serif, system-ui" }}
    >
      <style>{`
        @keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        .font-serif { font-family: 'Instrument Serif', ui-serif, Georgia, serif; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      <PublicNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(85,211,150,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(85,211,150,0.5)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 size-[700px] rounded-full bg-emerald-500/20 blur-[140px]" />
        <div className="pointer-events-none absolute right-0 top-0 size-[400px] rounded-full bg-emerald-400/10 blur-[120px]" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto max-w-6xl px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-tight text-white">
            Where winners
            <br />
            <span className="italic text-emerald-300">dare to play.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-8 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed">
            Five electrifying games. Real-time thrills. Zero risk. Start with{" "}
            <span className="text-emerald-300">1,000 free coins</span> — no deposit, no card, ever.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#" className="group inline-flex items-center gap-3 rounded-full bg-emerald-400 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-black transition-all hover:bg-emerald-300 hover:shadow-[0_0_60px_rgba(85,211,150,0.6)]">
              <Play className="size-4 fill-black" />
              Start playing free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="/login" className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-zinc-300 transition-all hover:border-emerald-400/60 hover:text-white">
              Sign in
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-20 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-emerald-400/10 bg-emerald-400/10">
            {[["99.2%", "Uptime"], ["12ms", "Avg latency"], ["100%", "Provably fair"]].map(([v, l]) => (
              <div key={l} className="bg-black/80 p-6 backdrop-blur">
                <div className="font-serif text-3xl md:text-4xl text-emerald-300">{v}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </section>

      <Ticker />

      {/* GAMES */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead eyebrow="The Floor" title={<>Pick your <span className="italic text-emerald-300">poison.</span></>} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {GAMES.map((g, i) => <GameCard key={g.id} game={g} i={i} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative border-t border-emerald-400/5 py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHead eyebrow="How it works" title={<>From sign-up to <span className="italic text-emerald-300">first win</span> in 60 seconds.</>} />
          <div className="grid gap-5 md:grid-cols-3">
            <Step num="01" title="Create your account" desc="One email. One click. No card required, no proof of life, no waiting room." i={0} />
            <Step num="02" title="Claim 1,000 coins" desc="Your starter stack lands instantly. Play, win, withdraw — your call." i={1} />
            <Step num="03" title="Enter the arena" desc="Five games. Live leaderboards. Provably fair. Pure adrenaline, on demand." i={2} />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-emerald-400/5 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead eyebrow="Built on trust" title={<>Secure by design. <span className="italic text-emerald-300">Fair by proof.</span></>} />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { Icon: Shield, title: "Provably Fair", desc: "Every outcome is cryptographically verified and independently auditable in real time." },
              { Icon: Zap, title: "Instant Settlement", desc: "Winnings hit your balance the moment the result lands. No delays, no waiting, ever." },
              { Icon: Lock, title: "SSL Encrypted", desc: "Military-grade encryption protects every session and every transaction on the platform." },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-emerald-400/10 bg-gradient-to-br from-emerald-950/20 to-transparent p-8 transition-colors hover:border-emerald-400/30">
                <div className="relative flex size-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/5 transition-all group-hover:bg-emerald-400/15 group-hover:shadow-[0_0_30px_rgba(85,211,150,0.3)]">
                  <Icon className="size-5 text-emerald-300" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-900/40 via-black to-black p-12 md:p-20">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(85,211,150,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(85,211,150,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-emerald-400/30 blur-[120px]" />

          <div className="relative max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300">Begin now</div>
            <h3 className="mt-4 font-serif text-5xl md:text-7xl text-white tracking-tight leading-[0.95]">
              Ready to <span className="italic text-emerald-300">play?</span>
            </h3>
            <p className="mt-6 max-w-md text-base text-zinc-400 leading-relaxed">
              Join thousands of players. Start with 1,000 free coins — no deposit, no card required.
            </p>
            <a href="#" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-emerald-400 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-black transition-all hover:bg-emerald-300 hover:shadow-[0_0_60px_rgba(85,211,150,0.6)]">
              Create free account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
