import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { nav } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-border bg-background/90 py-3 backdrop-blur-sm"
          : "border-transparent bg-transparent py-6"
      }`}
    >
      <div className="shell flex items-center justify-between gap-6">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="leading-none"
          aria-label="Oriana Weddings — home"
        >
          <span className="block font-display text-xl tracking-[0.22em] uppercase md:text-2xl">
            Oriana
          </span>
          <span className="mt-1 block text-[0.55rem] tracking-[0.42em] uppercase text-muted-foreground">
            Weddings
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.slice(1, 6).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[0.66rem] tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden border border-foreground px-6 py-3 text-[0.62rem] tracking-[0.28em] uppercase transition-colors hover:bg-foreground hover:text-primary-foreground lg:inline-block"
          >
            Enquire
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden"
          >
            {open ? <X className="size-6" strokeWidth={1} /> : <Menu className="size-6" strokeWidth={1} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-0 z-40 flex flex-col justify-center bg-background lg:hidden"
          >
            <nav className="shell flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border py-4 font-display text-3xl"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
