import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import logo1x from '../assets/brand/whas-logo-64.png';
import logo2x from '../assets/brand/whas-logo-128.png';
import { MENU, META, NAV } from '../lib/copy';
import { useJakartaTime } from '../lib/useJakartaTime';
import { startScroll, stopScroll } from '../lib/scroll';
import { ArrowE } from './Arrow';

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  /** tombol MENU di header — fokus dikembalikan ke sini saat overlay ditutup */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

/**
 * MENU OVERLAY (mobile) — panel penuh layar.
 *
 * Aturan gerak yang sama dengan hero: TIDAK ADA opacity. Panelnya meluncur naik
 * (transform), teksnya naik dari balik mask, garis-garisnya tergores dari kiri.
 * Jadi cara buka/tutupnya terasa satu bahasa dengan masuknya hero — bukan
 * lapisan baru yang muncul entah dari mana.
 *
 * Selalu ter-mount (bukan conditional render) supaya animasi keluar bisa jalan;
 * saat tertutup ia `visibility: hidden` + `pointer-events: none`, jadi tidak
 * ikut terjangkau keyboard maupun tab.
 */
export default function MenuOverlay({ open, onClose, triggerRef }: MenuOverlayProps) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pertama = useRef(true);
  const pernahDibuka = useRef(false);
  const waktu = useJakartaTime();
  const reduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  /** masuk / keluar */
  useLayoutEffect(() => {
    const el = root.current;
    const p = panel.current;
    if (!el || !p) return;

    const items = el.querySelectorAll('[data-menu-item]');
    const rules = el.querySelectorAll('[data-menu-rule]');

    // pemasangan pertama: langsung ke keadaan tertutup, tanpa animasi
    if (pertama.current) {
      pertama.current = false;
      if (!open) {
        gsap.set(el, { yPercent: 100, visibility: 'hidden', pointerEvents: 'none' });
        gsap.set(items, { yPercent: 112 });
        gsap.set(rules, { scaleX: 0 });
      }
      if (!open) return;
    }

    if (reduced.current) {
      gsap.set(el, open
        ? { yPercent: 0, visibility: 'visible', pointerEvents: 'auto' }
        : { yPercent: 100, visibility: 'hidden', pointerEvents: 'none' });
      gsap.set(items, { yPercent: open ? 0 : 112 });
      gsap.set(rules, { scaleX: open ? 1 : 0 });
      return;
    }

    const tl = gsap.timeline();

    if (open) {
      tl.set(el, { visibility: 'visible', pointerEvents: 'auto' })
        .to(el, { yPercent: 0, duration: 0.62, ease: 'power4.out' })
        .to(rules, { scaleX: 1, duration: 0.5, stagger: 0.06, ease: 'power3.inOut' }, 0.18)
        .to(items, { yPercent: 0, duration: 0.72, stagger: 0.06, ease: 'power4.out' }, 0.22);
    } else {
      tl.to(items, { yPercent: 112, duration: 0.28, stagger: 0.03, ease: 'power2.in' })
        .to(rules, { scaleX: 0, duration: 0.3, ease: 'power2.in' }, 0)
        .to(el, { yPercent: 100, duration: 0.5, ease: 'power4.inOut' }, 0.16)
        .set(el, { visibility: 'hidden', pointerEvents: 'none' });
    }

    return () => {
      tl.kill();
    };
  }, [open]);

  /** kunci scroll selama overlay terbuka */
  useEffect(() => {
    if (open) stopScroll();
    else startScroll();
    return () => startScroll();
  }, [open]);

  /** fokus, Esc, dan kurungan Tab */
  useEffect(() => {
    /*
      PENTING: fokus HANYA dikembalikan ke tombol MENU kalau overlay ini pernah
      dibuka sebelumnya. Tanpa penanda `pernahDibuka`, efek ini jalan saat halaman
      pertama dimuat (open = false) dan langsung memfokuskan tombol MENU — akibatnya
      cincin fokus muncul di halaman yang baru dibuka.
    */
    if (!open) {
      if (pernahDibuka.current) triggerRef.current?.focus({ preventScroll: true });
      return;
    }
    pernahDibuka.current = true;

    const el = root.current;
    if (!el) return;

    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter(
        (n) => n.offsetParent !== null,
      );

    focusables()[0]?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !el.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={root}
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[90] flex flex-col bg-void px-5 pt-6 pb-8 md:hidden md:px-10 md:pt-9 md:pb-10"
    >
      {/* baris atas: brand + tutup */}
      <div ref={panel} className="flex items-center justify-between">
        <img
          src={logo1x}
          srcSet={`${logo1x} 1x, ${logo2x} 2x`}
          width={314}
          height={64}
          alt={META.brand}
          className="h-[13px] w-auto"
        />
        <button
          type="button"
          onClick={onClose}
          className="t-label inline-flex cursor-pointer items-center gap-2 hover:underline underline-offset-4"
        >
          {MENU.close}
          <ArrowE />
        </button>
      </div>

      {/* daftar menu — besar, bernomor, dengan garis di tiap item */}
      <nav aria-label="Menu utama" className="mt-auto mb-auto pt-16">
        <ul>
          {NAV.map((item) => (
            <li key={item.label} className="relative">
              <a
                href={item.href}
                onClick={onClose}
                className="group block py-3"
              >
                {/*
                  `.mask-sup-display` menyediakan headroom untuk angka superskrip.
                  Sebelumnya pakai `pt-[0.4em]` — nilainya dihitung dari font-size
                  pembungkus (16px bawaan), bukan 54px teksnya, jadi hanya 6,4px
                  sementara angka butuh 13,2px → terpotong.
                */}
                <span className="mask-sup-display block">
                  {/*
                    SENGAJA bukan flex: kalau jadi flex item, `vertical-align: super`
                    tidak berlaku dan posisi angka superskrip jadi bergantung nasib.
                    Sebagai elemen inline, dia berperilaku persis sama seperti di nav
                    header — satu perilaku untuk satu hal.
                  */}
                  <span data-menu-item className="t-display block text-[clamp(2rem,11vw,3.4rem)]">
                    {item.label}
                    {item.sup && <sup className="nav-sup">{item.sup}</sup>}
                  </span>
                </span>
              </a>
              <span
                data-menu-rule
                aria-hidden="true"
                className="block h-px origin-left bg-ink"
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* baris bawah: label + jam */}
      <div className="flex items-end justify-between">
        <span className="t-label">Portofolio personal</span>
        <span className="t-label t-figure">JKT {waktu}</span>
      </div>
    </div>
  );
}
