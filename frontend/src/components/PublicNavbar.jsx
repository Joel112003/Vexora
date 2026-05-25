import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";
import brandLogo from "../assets/vexora_brand.jpeg";

function PublicNavbar() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-emerald-400/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-7 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg ring-1 ring-emerald-300/60">
            <img src={brandLogo} alt="Vexora" className="h-full w-full object-cover" />
          </div>
          <span className="font-serif text-2xl tracking-tight text-white">Vexora</span>
        </Link>

        <div className="flex items-center gap-4">
          {!isLogin && !isRegister && (
            <Link
              to="/login"
              className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-white sm:inline"
            >
              Sign in
            </Link>
          )}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="group inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-black transition-all hover:bg-emerald-300 hover:shadow-[0_0_30px_rgba(85,211,150,0.5)]"
          >
            {isRegister ? "Sign in" : "Try free"}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button className="md:hidden text-zinc-400" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
