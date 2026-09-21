import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { EASE } from './ui';
import { dimsOf, srcSetOf } from '../lib/img';
import { useGo } from '../lib/transition';
import type { Work } from '../data/works';

type Props = {
  work: Work;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  /** dipakai React untuk remount panel saat karya berganti (prev/next) */
  key?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus overlay fullscreen untuk satu karya.
 * - Di-render lewat portal ke `document.body` supaya `position: fixed`-nya tidak
 *   rusak saat wrapper konten di-transform oleh transisi halaman.
 * - Fokus dikelola: pindah ke tombol tutup saat dibuka, kembali ke pemicu saat
 *   ditutup, dan Tab dikurung di dalam dialog (aria-modal yang benar-benar benar).
 */
export default function WorksFocusOverlay({ work, total, onClose, onPrev, onNext }: Props) {
  const go = useGo();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);

  useEffect(() => {
    restoreRef.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      const el = restoreRef.current;
      if (el instanceof HTMLElement) el.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        onNext();
        return;
      }
      if (e.key === 'ArrowLeft') {
        onPrev();
        return;
      }
      if (e.key !== 'Tab') return;
      // kurung fokus di dalam dialog
      const root = panelRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll(FOCUSABLE)) as HTMLElement[];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (e.shiftKey && (current === first || !current || !root.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[80] bg-void/[0.97] overflow-y-auto"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="min-h-full max-w-[1400px] mx-auto px-5 md:px-10 py-5 md:py-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-bone/60">
          <span>
            [ {work.index} / {String(total).padStart(3, '0')} ]
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="hover:text-bone transition-colors cursor-pointer tracking-[0.18em]"
          >
            tutup ×
          </button>
        </div>

        <motion.div
          key={work.index}
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [...EASE] }}
          className="mt-5 md:mt-8"
        >
          <div className="relative overflow-hidden bg-[#141412] min-h-[36vh]">
            <span
              aria-hidden
              className="img-mono absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${work.blur})` }}
            />
            <img
              src={work.thumb}
              srcSet={srcSetOf(work.thumb)}
              sizes="(min-width: 768px) 90vw, 100vw"
              {...dimsOf(work.thumb)}
              alt={work.title}
              decoding="async"
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              className="img-mono relative w-full max-h-[52vh] md:max-h-[58vh] object-cover opacity-0 transition-opacity duration-700"
            />
          </div>
          <h3 className="mt-6 font-sans font-semibold uppercase tracking-tight leading-[0.9] text-[clamp(2.2rem,7vw,5.5rem)]">
            {work.title}
          </h3>
          <p className="mt-4 text-[15px] md:text-base text-bone/65 max-w-[52ch] leading-relaxed">
            {work.blurb}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/45">
            {work.category} — {work.year}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4 pb-10">
            <button
              onClick={() => {
                onClose();
                go(`/works/${work.slug}`);
              }}
              className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all cursor-pointer"
            >
              buka case study{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group font-sans font-medium text-lg underline underline-offset-8 decoration-bone/30 hover:decoration-bone transition-all"
            >
              visit live site{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
            <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em]">
              <button
                onClick={onPrev}
                className="text-bone/50 hover:text-bone transition-colors cursor-pointer"
              >
                [ ← prev ]
              </button>
              <button
                onClick={onNext}
                className="text-bone/50 hover:text-bone transition-colors cursor-pointer"
              >
                [ next → ]
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  );
}
