import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import logo1x from '../assets/brand/whas-logo-64.png';
import logo2x from '../assets/brand/whas-logo-128.png';
import { HERO, MENU, NAV, META } from '../lib/copy';
import { useJakartaTime } from '../lib/useJakartaTime';
import { ArrowE } from './Arrow';
import MenuOverlay from './MenuOverlay';

type NavItemType = (typeof NAV)[number];

/**
 * HERO — "halaman judul".
 *
 * Struktur mengikuti hero Studio DADO, TANPA FOTO dan TANPA GARIS PEMBELAH
 * (revisi): yang tinggal adalah nav stasiun yang tidak sejajar, band info di
 * sepertiga atas, dan headline besar yang duduk di dasar layar.
 *
 * Hierarki teks murni dari ukuran/bobot/tracking — TIDAK ADA opacity sama sekali.
 * Semua teks putih 100%.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const waktu = useJakartaTime();
  useEntrance(root);

  return (
    <>
      <section
      ref={root}
      className="relative flex min-h-svh flex-col overflow-hidden px-5 pt-6 pb-8 md:px-10 md:pt-9 md:pb-10"
    >
      {/* ─────────────── NAV — stasiun ─────────────── */}
      <header className="relative z-20 grid grid-cols-12 gap-x-4 md:gap-x-6">
        <a
          href="#top"
          className="col-span-6 flex items-center md:col-span-3"
          aria-label={`${META.brand} — kembali ke atas`}
        >
          <img
            src={logo1x}
            srcSet={`${logo1x} 1x, ${logo2x} 2x`}
            width={314}
            height={64}
            alt={META.brand}
            className="h-[13px] w-auto md:h-[15px]"
          />
        </a>

        {/* stasiun 1 & 2 — hanya desktop, mengikuti sebaran nav DADO */}
        <nav aria-label="Navigasi utama" className="hidden md:contents">
          <ul data-g="nav" className="col-span-2 col-start-6 flex flex-col">
            {NAV.slice(0, 2).map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </ul>
          <ul data-g="nav" className="col-span-2 col-start-9 flex flex-col">
            {NAV.slice(2).map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </ul>
          <p className="t-label t-figure col-span-2 col-start-11 hidden justify-self-end md:block">
            JKT {waktu}
          </p>
        </nav>

        {/* mobile: satu tombol MENU di kanan — daftarnya ada di overlay penuh layar */}
        <div data-g="nav" className="col-span-6 flex justify-end md:hidden">
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="menu"
            className="t-label cursor-pointer hover:underline underline-offset-4"
          >
            <span className="block overflow-hidden pt-[0.18em] -mt-[0.18em]">
              <span data-mask-inner className="block">
                {MENU.open}
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* ─────────────── BAND INFO ─────────────── */}
      <div
        data-band
        className="absolute inset-x-5 top-[42%] grid grid-cols-12 gap-x-4 gap-y-6 md:inset-x-10 md:top-[33%] md:gap-x-6 md:gap-y-0"
      >
        {/* 4 kolom, bukan 3: supaya "Portofolio personal" tidak pecah di 768px */}
        <div data-g="band" className="col-span-12 md:col-span-4">
          <p className="t-label overflow-hidden pt-[0.18em] -mt-[0.18em]">
            <span data-mask-inner className="block">
              {HERO.label}
            </span>
          </p>
        </div>

        {/*
          Label + paragraf dalam SATU baris (mengikuti referensi DADO: "About" kecil
          di kiri, paragrafnya di kanan). Dibuat satu wadah supaya di mobile keduanya
          tetap berdampingan — kalau dijadikan dua elemen grid terpisah, "About" akan
          mengambang sendirian di antara label atas dan paragraf.
        */}
        <div className="col-span-12 flex items-start gap-3 md:col-span-5 md:col-start-5 md:gap-6">
          <div data-g="band" className="shrink-0 md:pt-[2px]">
            <a
              href={HERO.introHref}
              className="t-label inline-block hover:underline underline-offset-4"
            >
              <span className="block overflow-hidden pt-[0.18em] -mt-[0.18em]">
                <span data-mask-inner className="block">
                  {HERO.introLabel}
                </span>
              </span>
            </a>
          </div>

          <p data-wipe className="t-body max-w-[46ch] md:max-w-none">
            {HERO.intro}
          </p>
        </div>

        <a
          href="#karya"
          className="t-label group col-span-12 inline-flex self-start md:col-span-3 md:col-start-10 md:justify-self-end"
        >
          <span data-mask className="overflow-hidden pt-[0.18em] -mt-[0.18em]">
            <span data-mask-inner className="flex items-center gap-2">
              {HERO.link}
              <ArrowE className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </span>
        </a>
      </div>

      {/* ─────────────── HEADLINE — duduk di dasar layar ─────────────── */}
      <div className="hero-type relative z-10 mt-auto pt-28 md:pt-32">
        <h1 className="t-display hero-headline">
          {HERO.headline.map((baris) => (
            /* lapisan mask: tiap baris naik dari balik garis, tanpa fade */
            <span
              key={baris}
              className="-mt-[0.06em] -mb-[0.12em] block overflow-hidden pt-[0.06em] pb-[0.12em]"
            >
              <span data-mask-inner className="block">
                <span data-line className="block">
                  {baris}
                </span>
              </span>
            </span>
          ))}
        </h1>

        <p
          data-g="closing"
          className="t-body mt-5 overflow-hidden pt-[0.18em] -mt-[0.18em] md:mt-6"
        >
          <span data-mask-inner className="block">
            {HERO.closing}
          </span>
        </p>
      </div>
      </section>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuBtn} />
    </>
  );
}

/**
 * Satu tautan nav. Angka "08" ditulis sebagai SUPERSKRIP di belakang label
 * ("Index⁰⁸"), diambil dari jumlah karya.
 *
 * `pt/-mt` di lapisan mask memberi ruang untuk superskrip — tanpa itu,
 * `overflow: hidden` akan memotong bagian atas angkanya.
 */
function NavItem({ item, align = 'left' }: { item: NavItemType; align?: 'left' | 'right' }) {
  return (
    <li className={align === 'right' ? 'text-right' : undefined}>
      <a
        href={item.href}
        className="t-label block hover:underline underline-offset-4"
      >
        <span className="mask-sup block">
          <span data-mask-inner className="block">
            {item.label}
            {item.sup && <sup className="nav-sup">{item.sup}</sup>}
          </span>
        </span>
      </a>
    </li>
  );
}

/**
 * MASUK — satu garis waktu GSAP, tanpa satu pun opacity.
 *
 * Urutannya meniru mesin cetak: huruf-huruf naik ke tempatnya dari balik mask,
 * paragraf "tercetak" kiri→kanan. Tidak ada elemen yang memudar.
 *
 * `prefers-reduced-motion` → tanpa animasi, langsung keadaan akhir.
 * Tanpa JS pun isi tetap terbaca (keadaan awal di CSS = tampil normal).
 */
function useEntrance(root: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const nav = q('[data-g="nav"] [data-mask-inner]');
      const band = q('[data-g="band"] [data-mask-inner]');
      const link = q('[data-mask] [data-mask-inner]');
      const lines = q('[data-line]');
      const closing = q('[data-g="closing"] [data-mask-inner]');
      const wipe = q('[data-wipe]');

      // keadaan awal dipasang sebelum paint (useLayoutEffect) → tidak ada kedip
      gsap.set([...nav, ...band, ...link, ...lines, ...closing], { yPercent: 112 });
      gsap.set(wipe, { clipPath: 'inset(0% 0% 100% 0%)' });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(nav, { yPercent: 0, duration: 0.7, stagger: 0.05 }, 0.1)
        .to(band, { yPercent: 0, duration: 0.7, stagger: 0.06 }, 0.32)
        .to(link, { yPercent: 0, duration: 0.7 }, 0.44)
        .to(wipe, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power2.inOut' }, 0.38)
        .to(lines, { yPercent: 0, duration: 1, stagger: 0.085, ease: 'power4.out' }, 0.45)
        .to(closing, { yPercent: 0, duration: 0.7 }, 1.3);
    }, el);

    return () => ctx.revert();
  }, [root]);
}
