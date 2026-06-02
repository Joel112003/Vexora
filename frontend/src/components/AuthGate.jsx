import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useInitAuth } from "../hooks/useInitAuth";

const BootSplash = () => (
  <div className="fixed inset-0 bg-[#050c07] flex items-center justify-center z-50">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
      className="flex flex-col items-center gap-4"
    >
      <span className="text-4xl">🎲</span>
      <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-emerald-500/60">
        Vexora
      </span>
    </motion.div>
  </div>
);

const AuthGate = ({ children }) => {
  const { isHydrating } = useAuthStore();

  useInitAuth();

  if (isHydrating) return <BootSplash />;

  return children;
};

export default AuthGate;
