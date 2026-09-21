import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { DETAIL, NAV, WORKS } from '../lib/copy';
import { useJakartaTime } from '../lib/useJakartaTime';
import { fotoHero, type PosisiKlik } from './Carousel';
import { ambilKotak, terbang } from '../lib/flip';
import logoWhas from '../assets/brand/whas-logo-128.png';

/**
 * OVERLAY DETAIL KARYA.
 *
 * Strukturnya meniru halaman case di iamrossmason.com, dan transisi MASUK-nya
 * disalin satu-satu dari kode transisi aslinya (modul 492 di bundle mereka —
 * bedah lengkap di /home/user/reference/rossmason-riset/):
 *
 *   T=0     foto yang diklik pindah ke stage & di-FLIP dari posisinya
 *           di carousel (1 detik, expo.inOut); halaman lama memudar
 *           alpha → 0 (0,35 detik, power1) — persis `leave` sumber.
 *   T=0,35  halaman "baru" (overlay) tampil: foto pindah ke slot hero &
 *           di-FLIP lagi (1 detik, expo.inOut) — persis `enter` sumber.
 *   T=0,85  judul terungkap per-huruf (1,5 s, cubic-bezier(.075,.82,.165,1),
 *           stagger 100 ms/huruf) — timeline `mounted` halaman case mereka.
 *   T=1,35  baris meta terungkap.
 *
 * Yang berbeda karena aturannya (dicatat di docs/SPEC-CAROUSEL.md):
 *   • kotak foto 16:10 rasio asli (bukan 16:9 crop) — aturan ⑦
 *   • meta terungkap lewat mask, bukan alpha — aturan nol opacity
 *   • satu-satunya fade tetap: halaman lama yang memudar 0,35 s — itu bagian
 *     dari "transisi masuk sama persis" yang diminta.
 *
 * KELUAR: mask gelap menyapu turun (transform, bukan opacity), foto terbang
 * kembali ke sel carousel, halaman lama kembali, lalu overlay dilepas.
 */
export default function ProjectOverlay({
  slug,
  posisi,
  onSelesai,
  onPindah,
}: {
  slug: string;
  posisi: PosisiKlik;
  /** animasi keluar selesai → App unmount overlay */
  onSelesai: () => void;
  /** tautan nav di dalam overlay: tutup dulu, baru pindah hash */
  onPindah: (hash: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const stageBox = useRef<HTMLDivElement>(null);
  const heroSlot = useRef<HTMLDivElement>(null);
  const heroFoto = useRef<HTMLImageElement>(null);
  const judul = useRef<HTMLHeadingElement>(null);
  const tahun = useRef<HTMLParagraphElement>(null);
  const meta = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLImageElement | null>(null);
  const sibuk = useRef(false);
  /** delayedCall entry — harus dibatalkan kalau user menutup sebelum selesai */
  const tundaRef = useRef<gsap.core.Tween[]>([]);

  const waktu = useJakartaTime();
  const [slugAktif, setSlugAktif] = useState(slug);
  const [kontenTersimpan, setKontenTersimpan] = useState(false);
  /**
   * clone penerbang sedang memegang peran foto hero → img React di slot
   * disembunyikan (visibility, BUKAN opacity — aturan nol opacity tetap utuh).
   * Tanpa ini, selama 0–0,35 s pertama foto terlihat GANDA: clone yang terbang
   * + foto statis yang sudah menunggu di slot, dan ilusi penerbangannya buyar.
   */
  const [cloneAktif, setCloneAktif] = useState(false);

  const karya = WORKS.find((w) => w.slug === slugAktif) ?? WORKS[0];
  const detail = DETAIL[slugAktif];
  const berikut = WORKS[(WORKS.findIndex((w) => w.slug === slugAktif) + 1) % WORKS.length];

  /* ── MASUK ─────────────────────────────────────────────────────────────── */
  const buka = useCallback(() => {
    const pn = root.current;
    const sb = stageBox.current;
    const hs = heroSlot.current;
    if (!pn || !sb || !hs) return;
    const home = document.getElementById('top');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const jelaskan = (el: HTMLElement | null) => el?.classList.add('is-terbuka');

    if (reduced || !home) {
      // tanpa animasi: img React tetap di slot sebagai foto hero.
      gsap.set(home, { alpha: 0 });
      jelaskan(judul.current);
      jelaskan(tahun.current);
      jelaskan(meta.current);
      return;
    }

    const clone = document.createElement('img');
    clone.src = posisi.src;
    clone.alt = `${karya.title} — ${karya.category}`;
    clone.className = 'karya-clone';
    clone.draggable = false;
    cloneRef.current = clone;
    setCloneAktif(true); // slot hero diserahkan ke clone; img React minggir

    // T=0 — `leave` di sumber: foto di stage, FLIP 1 s; halaman lama memudar.
    sb.appendChild(clone);
    const t1 = terbang(clone, posisi.slide);
    gsap.to(home, { alpha: 0, duration: 0.35, ease: 'power1' });

    // T=0,35 — `enter` di sumber: foto ke slot hero, FLIP lagi.
    // State (posisi tengah-penerbangan) HARUS diukur sebelum dipindah.
    const d1 = gsap.delayedCall(0.35, () => {
      const state = ambilKotak(clone);
      t1.kill();
      hs.appendChild(clone);
      tundaRef.current.push(terbang(clone, state));
    });
    // T=0,85 / T=1,35 — reveal judul & meta (timeline halaman case mereka).
    const d2 = gsap.delayedCall(0.85, () => {
      jelaskan(judul.current);
      jelaskan(tahun.current);
    });
    const d3 = gsap.delayedCall(1.35, () => jelaskan(meta.current));
    tundaRef.current.push(d1, d2, d3);
  }, [posisi]);

  useLayoutEffect(() => {
    buka();
    const home = document.getElementById('top');
    root.current?.focus({ preventScroll: true });
    return () => {
      tundaRef.current.forEach((t) => t.kill());
      tundaRef.current = [];
      gsap.killTweensOf('*');
      if (home) gsap.set(home, { clearProps: 'opacity,visibility' });
      cloneRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── reveal galeri saat digulir (padanan ScrollTrigger mereka) ──────────── */
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    const els = [...sc.querySelectorAll<HTMLElement>('[data-reveal]')];
    const io = new IntersectionObserver(
      (entris) => {
        for (const e of entris) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting && e.boundingClientRect.top < window.innerHeight * 0.94) {
            el.classList.add('terbuka');
          } else if (!e.isIntersecting && e.boundingClientRect.top < 0) {
            el.classList.remove('terbuka'); // mundur saat digulir ke atas — persis sumbernya
          }
        }
      },
      { root: sc, threshold: [0, 0.05] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slugAktif]);

  /* ── TUTUP ─────────────────────────────────────────────────────────────── */
  const tutup = useCallback(() => {
    if (sibuk.current) return;
    sibuk.current = true;
    const pn = root.current;
    const m = mask.current;
    const clone = cloneRef.current;
    const home = document.getElementById('top');
    if (!pn || !m || !home) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // batalkan sisa penerbangan/reveal entry
    tundaRef.current.forEach((t) => t.kill());
    tundaRef.current = [];
    gsap.killTweensOf('*');

    if (reduced) {
      onSelesai();
      return;
    }

    // foto harus penerbang dari slot hero KEMBALI ke sel carousel.
    // Caranya: kuncikan posisi fixed tepat di kotak sel, lalu FLIP-kan dari
    // kotak hero (state) ke sana. Kontennya akan disembunyikan di 0,7 s —
    // foto sudah di layer penerbangan, tidak ikut.
    const stateHero = clone ? ambilKotak(clone) : null;
    if (clone && stateHero) {
      clone.style.position = 'fixed';
      clone.style.inset = 'auto';
      clone.style.left = `${posisi.slide.x}px`;
      clone.style.top = `${posisi.slide.y}px`;
      clone.style.width = `${posisi.slide.w}px`;
      clone.style.height = `${posisi.slide.h}px`;
      pn.appendChild(clone);
      tundaRef.current = [terbang(clone, stateHero)]; // pulang, 1 s expo.inOut
    }

    const tl = gsap.timeline({
      onComplete: () => {
        tundaRef.current.forEach((t) => t.kill());
        gsap.set(home, { clearProps: 'opacity,visibility' });
        onSelesai();
      },
    });
    tl.to(m, { yPercent: 0, duration: 0.35, ease: 'power1' }, 0); // mask menutup
    tl.to(home, { alpha: 1, duration: 0.35, ease: 'power1' }, 0.35);
    tl.to(m, { yPercent: -100, duration: 0.35, ease: 'power1' }, 0.35); // mask membuka
    tl.call(() => setKontenTersimpan(true), undefined, 0.7);
    tl.to({}, { duration: 0.3 }); // tahan sampai penerbangan mendarat
  }, [onSelesai, posisi]);

  /* ── NEXT PROJECT (padanan blok [Next project] di case mereka) ──────────── */
  const keBerikut = useCallback(
    (e: React.MouseEvent) => {
      if (sibuk.current) return;
      e.preventDefault();
      sibuk.current = true;
      const pn = root.current;
      const sb = stageBox.current;
      const hs = heroSlot.current;
      const m = mask.current;
      const home = document.getElementById('top');
      if (!pn || !sb || !hs || !m || !home) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // foto yang terbang = FOTO PREVIEW next project (persis sumber:
      // .js-t-flip di dalam blok yang diklik)
      const preview = pn.querySelector<HTMLImageElement>('.karya-next-foto');
      const dari = preview ? ambilKotak(preview) : null;
      const srcBaru = preview?.currentSrc || preview?.src || '';

      const ganti = () => {
        cloneRef.current?.remove();
        // matikan reveal lama sebelum isinya diganti
        [judul.current, tahun.current, meta.current].forEach((el) => {
          el?.classList.remove('is-terbuka');
        });
        if (judul.current) void judul.current.offsetHeight; // paksa reflow
        setKontenTersimpan(false);
        setSlugAktif(berikut.slug);
      };

      if (reduced || !dari) {
        ganti();
        setCloneAktif(false); // img React mengambil alih slot hero
        requestAnimationFrame(() => {
          [judul.current, tahun.current, meta.current].forEach((el) =>
            el?.classList.add('is-terbuka'),
          );
        });
        sibuk.current = false;
        return;
      }

      const tl = gsap.timeline();
      tl.to(m, { yPercent: 0, duration: 0.35, ease: 'power1' }, 0); // mask menutup
      tl.call(ganti, undefined, 0.35); // konten tertukar di balik mask
      tl.call(
        () => {
          // img React tetap tersembunyi (cloneAktif) — slot diisi clone baru
          const clone = document.createElement('img');
          clone.src = srcBaru;
          clone.alt = `${berikut.title} — ${berikut.category}`;
          clone.className = 'karya-clone';
          clone.draggable = false;
          cloneRef.current = clone;
          sb.appendChild(clone);
          tundaRef.current = [terbang(clone, dari)]; // preview → stage
          requestAnimationFrame(() => {
            const state = ambilKotak(clone); // ukur sebelum pindah
            tundaRef.current[0]?.kill();
            hs.appendChild(clone);
            tundaRef.current = [terbang(clone, state)]; // stage → hero
          });
        },
        undefined,
        0.35,
      );
      tl.to(m, { yPercent: -100, duration: 0.35, ease: 'power1' }, 0.7); // mask membuka
      tl.call(
        () => {
          [judul.current, tahun.current, meta.current].forEach((el) =>
            el?.classList.add('is-terbuka'),
          );
        },
        undefined,
        1.2,
      );
      tl.to({}, { duration: 0.3 });
      tl.eventCallback('onComplete', () => {
        sibuk.current = false;
      });
    },
    [berikut.slug],
  );

  /* ── papan ketik: Esc menutup ──────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutup();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tutup]);

  /* ── render ────────────────────────────────────────────────────────────── */
  const huruf = (teks: string) => {
    let i = 0;
    return teks.split(' ').map((kata, ki) => (
      <span key={ki} className="judul-kata">
        {kata.split('').map((ch, ci) => {
          const n = i++;
          return (
            <span key={ci} className="judul-char-mask">
              <span className="judul-char" style={{ ['--i' as never]: n }}>
                {ch}
              </span>
            </span>
          );
        })}
      </span>
    ));
  };

  return (
    <div
      ref={root}
      className="karya-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${karya.title} — detail karya`}
      tabIndex={-1}
    >
      {/* chrome: header kembaran persis dengan header situs (stasiun DADO) */}
      <header className="karya-ov-head">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onPindah('#top');
            tutup();
          }}
          aria-label="WHAS — kembali ke atas"
        >
          <img
            src={logoWhas}
            alt="WHAS"
            width={314}
            height={64}
            className="h-[13px] w-auto md:h-[15px]"
          />
        </a>
        <nav aria-label="Navigasi" className="hidden md:contents">
          <ul className="karya-ov-nav-kol">
            {NAV.slice(0, 2).map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="t-label"
                  onClick={(e) => {
                    e.preventDefault();
                    onPindah(item.href);
                    tutup();
                  }}
                >
                  {item.label}
                  {item.sup && <sup className="nav-sup">{item.sup}</sup>}
                </a>
              </li>
            ))}
          </ul>
          <ul className="karya-ov-nav-kol">
            {NAV.slice(2).map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="t-label"
                  onClick={(e) => {
                    e.preventDefault();
                    onPindah(item.href);
                    tutup();
                  }}
                >
                  {item.label}
                  {item.sup && <sup className="nav-sup">{item.sup}</sup>}
                </a>
              </li>
            ))}
          </ul>
          <p className="t-label t-figure karya-ov-jam">Jakarta, ID {waktu}</p>
        </nav>
        <div className="karya-ov-mobile">
          <button
            type="button"
            className="t-label cursor-pointer hover:underline underline-offset-4"
            onClick={tutup}
          >
            Tutup
          </button>
        </div>
      </header>

      {/* isi halaman case — digulir sendiri */}
      <div
        ref={scroller}
        className="karya-ov-scroll"
        style={{ visibility: kontenTersimpan ? 'hidden' : 'visible' }}
      >
        <div className="karya-ov-isi">
          <div className="karya-ov-judul-wrap">
            <h1 ref={judul} className="karya-ov-judul" aria-label={karya.title}>
              {huruf(karya.title)}
            </h1>
            <div className="karya-ov-tahun-mask">
              <p ref={tahun} className="karya-ov-tahun">
                ({karya.year})
              </p>
            </div>
          </div>

          <div className="karya-ov-meta-mask">
            <div ref={meta} className="karya-ov-meta">
            <div className="karya-ov-meta-kol">
              <span className="t-label">Kategori</span>
              <span className="karya-ov-meta-val">{`[${karya.category}]`}</span>
            </div>
            <div className="karya-ov-meta-kanan">
              <div className="karya-ov-meta-kol">
                <span className="t-label">Peran</span>
                <span className="karya-ov-meta-val">{`[${karya.role}]`}</span>
              </div>
              <div className="karya-ov-meta-kol">
                <span className="t-label">Status</span>
                <span className="karya-ov-meta-val">[Merek khayalan]</span>
              </div>
            </div>
            </div>
          </div>

          <div className="karya-ov-hero" ref={heroSlot}>
            <img
              ref={heroFoto}
              className={`karya-ov-hero-foto${cloneAktif ? ' is-gaib' : ''}`}
              src={fotoHero(karya.slug, 1600)}
              srcSet={`${fotoHero(karya.slug, 800)} 800w, ${fotoHero(karya.slug, 1600)} 1600w`}
              sizes="100vw"
              width={1600}
              height={1000}
              alt={`${karya.title} — ${karya.category}`}
              draggable={false}
            />
          </div>

          <div className="karya-ov-statement" data-reveal>
            <div className="karya-ov-mask">
              <div className="karya-ov-statement-dalam">
                <h2 className="karya-ov-statement-judul">{detail.pernyataan}</h2>
                <div className="karya-ov-statement-txt">
                  {detail.paragraf.map((p, i) => (
                    <p key={i} className="karya-ov-p">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="karya-ov-galeri">
            {detail.galeri.map((g, i) => (
              <GaleriFoto key={i} file={g.file} w={g.w} h={g.h} letak={g.letak} />
            ))}
          </div>

          <a
            href="#karya"
            onClick={keBerikut}
            className="karya-ov-next"
            data-reveal
            aria-label={`Lanjut ke ${berikut.title}`}
          >
            <p className="t-label karya-ov-next-label">[Next project]</p>
            <h3 className="karya-ov-next-judul">{berikut.title}</h3>
            <p className="karya-ov-next-tahun">({berikut.year})</p>
            <div className="karya-ov-next-foto-wrap">
              <img
                className="karya-next-foto"
                src={fotoHero(berikut.slug, 800)}
                srcSet={`${fotoHero(berikut.slug, 800)} 800w, ${fotoHero(berikut.slug, 1600)} 1600w`}
                sizes="(min-width: 768px) 60vw, 90vw"
                width={1600}
                height={1000}
                alt={`Berikutnya: ${berikut.title}`}
                draggable={false}
              />
            </div>
          </a>

          <div className="karya-ov-akhir">
            <p className="t-label">WHAS — Jakarta, ID</p>
          </div>
        </div>
      </div>

      {/* stage: wadah penerbangan (padanan .js-t-target di sumber) */}
      <div className="karya-ov-stage" style={{ top: posisi.stageTop }} aria-hidden="true">
        <div ref={stageBox} className="karya-ov-stage-box" />
      </div>

      {/* mask gelap untuk keluar & ganti (sweep transform — bukan opacity) */}
      <div ref={mask} className="karya-ov-mask" aria-hidden="true" />
    </div>
  );
}

/** Satu foto galeri: kotak rasio ASLI foto (tanpa crop), clip reveal saat masuk. */
function GaleriFoto({
  file,
  w,
  h,
  letak,
}: {
  file: string;
  w: number;
  h: number;
  letak: 'penuh' | 'senja' | 'pasangan';
}) {
  const src = FOTOG[Object.keys(FOTOG).find((k) => k.endsWith(`/${file}`)) ?? ''];
  if (!src) return null;
  return (
    <figure
      className={`karya-fig karya-fig--${letak}`}
      data-reveal
      style={{ ['--rasio' as never]: `${(h / w) * 100}%` }}
    >
      <div className="karya-fig-aspek">
        <img src={src} width={w} height={h} loading="lazy" decoding="async" alt="" draggable={false} />
      </div>
    </figure>
  );
}

/**
 * Foto galeri lewat glob (Vite harus tahu berkasnya sejak build). Semua foto
 * overlay tinggal di assets/works/<slug>/ — diambil dari landing page tiap
 * projek, rasio asli, tanpa efek. `_raw/` (PNG sumber 2880×1800) DIKECUALIKAN:
 * ia satu tingkat sama dalam, tapi tidak pernah dipakai di UI — kalau ikut
 * terglob, belasan MB aset mentah tersalin ke dist tanpa guna.
 */
const FOTOG = import.meta.glob(
  ['../../assets/works/*/*.{webp,jpg,png}', '!../../assets/works/_raw/*'],
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
) as Record<string, string>;
