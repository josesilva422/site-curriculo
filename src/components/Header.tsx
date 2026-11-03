import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navItems, resumeDownloadUrl } from "../data/profile";

function useActiveSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function Header() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || menuOpen ? "border-white/10 bg-space/80 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#topo" className="group flex items-center gap-3" aria-label="Ir para o início">
          <span className="logo-mark">
            JG<span className="logo-caret">_</span>
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-display font-semibold text-text">José Gabriel</span>
            <span className="block font-mono text-[0.68rem] text-muted">full-stack · dados · IA</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl lg:flex">
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.href}
              className={`relative rounded-full px-4 py-2 text-sm transition ${
                active === item.href ? "text-text" : "text-muted hover:text-text"
              }`}
            >
              {active === item.href ? (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={resumeDownloadUrl}
            className="inline-flex items-center gap-2 rounded-full bg-neon px-4 py-2 text-sm font-semibold text-space transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-space"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Currículo
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-soft lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-celular"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="menu-celular"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="grid gap-1 px-4 py-4 sm:px-6">
              {navItems.map((item) => (
                <a
                  href={item.href}
                  key={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-base transition ${
                    active === item.href ? "bg-white/10 text-text" : "text-soft hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
