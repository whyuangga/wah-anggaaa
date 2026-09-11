import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { useGo } from '../lib/transition';
import MenuOverlay from './MenuOverlay';

const LINKS = [
  { to: '/', label: 'index' },
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact' },
  { to: '/journal', label: 'journal' },
];

export default function Nav() {
  const time = useJakartaTime(false);
  const pathname = useLocation().pathname;
  const go = useGo();
  const [menuOpen, setMenuOpen] = useState(false);

  // overlay selalu tertutup setiap pindah halaman
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-[#EAE8E1]"
    >
      <nav aria-label="Navigasi utama" className="flex items-center justify-between px-5 md:px-10 py-5">
        <button
          onClick={() => go('/')}
          className="font-sans font-medium tracking-tight text-[17px] leading-none cursor-pointer"
          aria-label="wah:anggaaa — ke halaman index"
        >
          wah:anggaaa<sup className="hidden sm:inline font-mono text-[9px] ml-0.5">®</sup>
        </button>

        <div className="hidden md:flex items-center gap-3 md:gap-8">
          {LINKS.map((l) => {
            const active = pathname === l.to || (l.to === '/' && pathname.startsWith('/works/'));
            return (
              <button
                key={l.to}
                onClick={() => go(l.to)}
                aria-current={active ? 'page' : undefined}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100 cursor-pointer ${
                  active ? 'opacity-100' : 'opacity-55'
                }`}
              >
                {active ? `[ ${l.label} ]` : l.label}
              </button>
            );
          })}
        </div>

        <p className="hidden md:block font-mono text-[11px] tracking-[0.18em] uppercase opacity-55">
          jkt — {time}
        </p>

        <button
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-label="Buka menu"
          className="md:hidden p-2 -m-2 -translate-y-0.5 cursor-pointer opacity-90"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
            <g transform="rotate(28 15 15)" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="10" x2="25" y2="10" />
              <line x1="5" y1="15" x2="25" y2="15" />
              <line x1="5" y1="20" x2="25" y2="20" />
            </g>
          </svg>
        </button>
      </nav>
    </motion.header>
    <MenuOverlay
      open={menuOpen}
      links={LINKS}
      pathname={pathname}
      onClose={() => setMenuOpen(false)}
    />
    </>
  );
}
