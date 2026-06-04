import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";
import brandLogo from "../assets/vexora_brand.jpeg";

function PublicNavbar() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-emerald-400/15 bg-gradient-to-b from-black/95 via-black/80 to-black/40 backdrop-blur-2xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-4">
          <div className="relative flex size-10 items-center justify-center">
            <div className="absolute -inset-2 rounded-2xl bg-emerald-400/20 blur-lg" />
            <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl ring-1 ring-emerald-300/60">
              <img src={brandLogo} alt="Vexora" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-['Playfair Display'] text-2xl tracking-tight text-white">Vexora</span>
            <span className="text-[10px] font-['Space Grotesk'] uppercase tracking-[0.35em] text-emerald-300/70">
              Edge play
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 font-['Space Grotesk']">
          {!isLogin && !isRegister && (
            <Link
              to="/login"
              className="hidden rounded-full border border-emerald-400/30 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-emerald-100/70 transition hover:border-emerald-300/70 hover:text-white sm:inline"
            >
              Sign in
            </Link>
          )}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="group inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-black shadow-[0_12px_32px_rgba(52,211,153,0.35)] transition-transform hover:-translate-y-0.5"
          >
            {isRegister ? "Sign in" : "Try free"}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            className="md:hidden rounded-full border border-white/10 bg-black/50 px-3 py-2 text-zinc-300 transition hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
