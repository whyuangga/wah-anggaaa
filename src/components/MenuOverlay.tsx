import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { isActivePath, useGo } from '../lib/transition';
import { EASE } from './ui';

export interface MenuLink {
  to: string;
  label: string;
}

interface MenuOverlayProps {
  open: boolean;
  links: MenuLink[];
  pathname: string;
  onClose: () => void;
}

export default function MenuOverlay({ open, links, pathname, onClose }: MenuOverlayProps) {
  const go = useGo();
  const reduced = useReducedMotion();

  // kunci scroll + tutup via Escape selama overlay terbuka
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // resize ke desktop saat terbuka: tutup (overlay md:hidden, scroll jangan kekunci)
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => {
      if (mq.matches) onClose();
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open, onClose]);

  const isActive = (to: string) => isActivePath(to, pathname);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.35, ease: [...EASE] }}
          className="fixed inset-0 z-[60] flex flex-col bg-void px-5 pt-5 pb-6 md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans font-medium tracking-tight text-[17px] leading-none">
              wah:anggaaa
            </span>
            <button
              onClick={onClose}
              aria-label="Tutup menu"
              className="p-2 -m-2 cursor-pointer"
            >
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
                <line x1="4" y1="4" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" />
                <line x1="22" y1="4" x2="4" y2="22" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <nav aria-label="Menu" className="flex flex-1 flex-col justify-center gap-1">
            {links.map((l, i) => {
              const active = isActive(l.to);
              return (
                <motion.button
                  key={l.to}
                  onClick={() => {
                    onClose();
                    go(l.to);
                  }}
                  aria-current={active ? 'page' : undefined}
                  initial={reduced ? false : { opacity: 0, y: 44 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [...EASE] }}
                  className="flex items-baseline justify-between py-1 text-left cursor-pointer"
                >
                  <span
                    className={`font-sans font-semibold uppercase tracking-[-0.02em] leading-[0.95] text-[clamp(3rem,15vw,5rem)] ${
                      active ? 'text-bone' : 'text-bone/45'
                    }`}
                  >
                    {l.label}
                  </span>
                  <span className="font-mono text-[13px] tracking-[0.1em] text-bone/45">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                </motion.button>
              );
            })}
          </nav>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-bone/50"
          >
            <span>© 2026</span>
            <span>[ just for fun ]</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
