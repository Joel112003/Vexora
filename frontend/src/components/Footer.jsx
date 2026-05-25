import { motion } from "framer-motion";
import brandLogo from "../assets/vexora_brand.jpeg";

function Footer() {
  return (
    <footer className="border-t border-emerald-400/10 bg-gradient-to-b from-black via-black to-emerald-950/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5"
          >
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg ring-1 ring-emerald-300/60">
              <img src={brandLogo} alt="Vexora" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-serif text-2xl text-white">Vexora</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Premium Casino Arena</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center"
          >
            {["Privacy", "Terms", "Support", "Responsible Gaming"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-emerald-300"
              >
                {item}
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 md:text-right"
          >
            No deposit required
          </motion.div>
        </div>

        <div className="mt-10 border-t border-emerald-400/10 pt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400">
          © 2026 Vexora · For entertainment purposes only · 18+ · Play Responsibly
        </div>
      </div>
    </footer>
  );
}

export default Footer;
