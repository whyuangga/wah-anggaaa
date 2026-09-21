import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CAROUSEL, WORKS } from '../lib/copy';
import { useJakartaTime } from '../lib/useJakartaTime';
import { scrollToY } from '../lib/scroll';
import Wordmark from './Wordmark';

const BATAS_DESKTOP = 768;

/**
 * Foto karya diambil lewat glob, bukan string yang disusun saat render:
 * Vite harus tahu berkas mana saja yang dipakai sejak build — kalau path-nya
 * dirakit dengan template literal, berkasnya tidak akan ikut ter-*bundle*.
 */
const FOTO = import.meta.glob('../../assets/works/*-hero-*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const fotoHero = (slug: string, lebar: 800 | 1600) =>
  FOTO[`../../assets/works/${slug}-hero-${lebar}.webp`];

/** Posisi yang dipegang saat karya diklik — bebenet untuk transisi overlay. */
export type PosisiKlik = {
  slug: string;
  src: string;
  slide: { x: number; y: number; w: number; h: number };
  /** tepi atas wadah strip, dalam koordinat layar saat klik */
  stageTop: number;
};

/**
 * CAROUSEL KARYA — delapan karya, satu baris, LOOPING TAK BERUJUNG,
 * digerakkan roda/geseran/papan ketik; klik membuka overlay detail.
 *
 * MEKANISME DIAMBIL DARI iamrossmason.com (kode sumber terbedah ada di
 * /home/user/reference/rossmason-riset/, ringkasan di docs/SPEC-CAROUSEL.md).
 * Nama variabel & kelas sengaja sama dengan sumbernya (`t`, `tc`, `diff`,
 * `--x`, `--x-text`, `--scale`, `--diff`, `.is-big`, `.is-left`, `.is-right`,
 * `.is-not-visible`) supaya bisa dibaca berdampingan.
 *
 * Intinya persis seperti aslinya:
 *   • SATU skalar `--diff` (0→1) di elemen track mengendalikan seluruh gerakan.
 *   • Posisi halus (tc) mengejar target (t) dengan `tc += (t-tc) * 0.1`.
 *   • Berhenti 130 ms → SNAP ke kelipatan lebar sel terdekat.
 *
 * LOOPING — bagian yang dulu versi kita masih berhujung:
 *   Di sumber, tiap slide diberi transform SENDIRI (bukan track-nya):
 *     t_item = wrap(right - max, right, tc)      ← modul 724, fungsi transforms()
 *     translate3d(-t_item, 0, 0)
 *   Karena `right` per slide berbeda, tiap slide "berbalik" ke ujung strip di
 *   saat yang berbeda — dan karena jarak balik (max) lebih lebar dari layar,
 *   pembalikan itu terjadi di luar layar: tidak pernah terlihat. Hasilnya
 *   strip tak pernah habis: gulir terus, karya terus berputar.
 *   Kelas `is-left`/`is-right` di sumber bukan dari indeks slide, melainkan
 *   dari posisi slide terhadap pusat LAYAR (parameter p):
 *     p = clamp(0, 1, (t_item - (right - vw)) / (vw - width));  p > 0.5 → is-left
 *   dan karya besar = slide yang tepinya paling dekat ke acuan
 *     vw/2 + lebarSel/2 − 5  (fungsi idx() di sumber).
 *
 *   LOOP TAK BERUJUNG KE BAWAH: tampilan periodik per `max` (di t = max identik
 *   dengan t = 0), jadi begitu posisi gulir melewati satu putaran, scrollY
 *   dilipat kembali −max SEKETIKA — lompatannya tak terlihat karena framanya
 *   sama persis. Ke bawah strip berputar selamanya; ke atas gulir tetap bisa
 *   keluar seksi menuju hero (posisi tidak pernah dilipat di bawah 0).
 *
 * Yang berbeda karena keadaan kita memang lain (lihat SPEC §2):
 *   • Halaman kita panjang, bukan setinggi satu layar. Seksi ini `sticky`
 *     setinggi `100vh + 2× jarak satu putaran` (putaran kedua = headroom agar
 *     batas lipatan bisa dilewati secara fisik); gulir vertikal dipetakan 1:1
 *     ke geseran strip, dan karena layout periodik (di t = max tampilannya
 *     identik dengan t = 0), scrollY yang melewati satu putaran dilipat −max
 *     seketika → ke BAWAH loop tak berujung. Ke ATAS, gulir keluar seksi
 *     menuju hero seperti biasa (raw tidak pernah dilipat di bawah 0).
 *   • Sel 20vw dan rasio 16:10 asli (foto tidak boleh di-crop, aturan ⑦).
 *   • Mobile & `prefers-reduced-motion`: wadah gulir horizontal asli.
 */
export default function Carousel({
  jeda,
  onOpen,
}: {
  /** overlay detail sedang terbuka → mesin dijeda */
  jeda: boolean;
  onOpen: (posisi: PosisiKlik) => void;
}) {
  const pin = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const waktu = useJakartaTime();

  /** true = mode gulir asli (mobile atau reduced-motion): tanpa penjepitan. */
  const [asli, setAsli] = useState(true);

  useEffect(() => {
    const cek = () =>
      setAsli(
        window.innerWidth < BATAS_DESKTOP ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
    cek();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('resize', cek);
    mq.addEventListener('change', cek);
    return () => {
      window.removeEventListener('resize', cek);
      mq.removeEventListener('change', cek);
    };
  }, []);

  usePenjepitan({ pin, panel, track, slides, aktif: !asli, jeda, onOpen });
  useMasuk({ panel, aktif: !asli });
  useKlikAsli({ aktif: asli, onOpen });

  return (
    <section id="karya" ref={pin} className="karya-pin" aria-label="Karya terpilih">
      <div ref={panel} className="karya-panel" tabIndex={0} role="group" aria-label="Delapan karya">
        {/* ─────────────── STRIP KARYA ─────────────── */}
        <div ref={track} className="karya-track">
          {WORKS.map((w, i) => (
            <article
              key={w.slug}
              ref={(el) => {
                slides.current[i] = el;
              }}
              className="karya-slide"
              data-slug={w.slug}
              tabIndex={-1}
            >
              {/* caption DI ATAS foto — mengikuti referensi */}
              <div className="karya-caption">
                <p className="t-label t-figure mask-sup">
                  <span data-mask-inner className="block">
                    {String(i + 1).padStart(2, '0')}
                    .
                  </span>
                </p>
                <h3 className="t-work mask-sup">
                  <span data-mask-inner className="block">
                    {w.title}
                  </span>
                </h3>
                <p className="t-label mask-sup">
                  <span data-mask-inner className="block">
                    {w.category}
                  </span>
                </p>
              </div>

              {/* pembungkus yang digerakkan & diskalakan (padanan .slide__scale) */}
              <div className="karya-scale">
                <img
                  className="karya-foto"
                  src={fotoHero(w.slug, 800)}
                  srcSet={`${fotoHero(w.slug, 800)} 800w, ${fotoHero(w.slug, 1600)} 1600w`}
                  sizes="(min-width: 768px) 20vw, 100vw"
                  width={1600}
                  height={1000}
                  alt={`${w.title} — ${w.category}`}
                  draggable={false}
                />
              </div>
            </article>
          ))}
        </div>

        {/* ─────────────── BAR BAWAH + WORDMARK ─────────────── */}
        <div className="karya-bawah">
          <div className="karya-bar">
            <p className="t-label mask-sup">
              <span data-mask-inner className="block">
                {CAROUSEL.label}
              </span>
            </p>
            <p className="t-label t-figure mask-sup">
              <span data-mask-inner className="block">
                {CAROUSEL.kota} {waktu}
              </span>
            </p>
          </div>

          <Wordmark />
        </div>
      </div>
    </section>
  );
}

type Ref<T> = React.RefObject<T>;

const clamp = (a: number, b: number, v: number) => Math.min(b, Math.max(a, v));

/**
 * `wrap(min, max, v)` — salinan langsung `gsap.utils.wrap` dari sumber
 * (modul 724): membalik nilai ke dalam rentang [min, max).
 */
const wrap = (min: number, max: number, v: number) => {
  const rentang = max - min;
  return ((v - min) % rentang + rentang) % rentang + min;
};

/** `mod(n, m)` — sisa pembagian yang selalu non-negatif (pelipatan posisi loop). */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** selisih terpendek dua posisi pada ruang periodik [0, m) — untuk lerp & snap. */
const deltaPutaran = (a: number, b: number, m: number) => {
  let d = a - b;
  if (d > m / 2) d -= m;
  if (d < -m / 2) d += m;
  return d;
};

/**
 * PENJEPITAN — mesin inti, termasuk LOOPING.
 *
 * Beda utama dengan versi berhujung: track TIDAK lagi di-transform. Tiap slide
 * mendapat transform sendiri dari rumus `wrap` sumber — itu yang membuat
 * strip tak pernah habis.
 */
function usePenjepitan({
  pin,
  panel,
  track,
  slides,
  aktif,
  jeda,
  onOpen,
}: {
  pin: Ref<HTMLElement | null>;
  panel: Ref<HTMLDivElement | null>;
  track: Ref<HTMLDivElement | null>;
  slides: Ref<(HTMLElement | null)[]>;
  aktif: boolean;
  jeda: boolean;
  onOpen: (posisi: PosisiKlik) => void;
}) {
  const jedaRef = useRef(jeda);
  jedaRef.current = jeda;
  useEffect(() => {
    if (!aktif) return;
    const el = pin.current;
    const pn = panel.current;
    const tr = track.current;
    if (!el || !pn || !tr) return;

    const s = {
      cell: 0,
      max: 0, // lebar seluruh strip = jarak satu putaran penuh (px)
      t: 0, // posisi target TERLIPAT di [0, max)
      tc: 0,
      prev: -1,
      lastChange: performance.now(),
      lastSnap: 0,
      drag: false,
      downX: 0,
      downY: 0,
      startRaw: 0,
      gerak: 0,
      snapSisa: 0,
      top: 0,
      raf: 0,
    };

    const ukur = () => {
      const first = slides.current[0];
      const bawah = pn.querySelector('.karya-bawah');
      const bar = pn.querySelector('.karya-bar');
      const caption = pn.querySelector('.karya-caption');
      if (!first || !bawah || !bar || !caption) return;

      s.cell = first.getBoundingClientRect().width;
      // jarak satu putaran = lebar seluruh strip (8 sel × 20vw = 160vw)
      s.max = Math.max(0, s.cell * WORKS.length);
      s.top = el.getBoundingClientRect().top + window.scrollY;
      // headroom SATU putaran ekstra: dokumen harus bisa melewati batas `max`
      // secara fisik, kalau tidak roda/snap mengerem 1 px sebelum lipat dan
      // loop mati. Lipatan −max tiap frame menjaga raw tetap di [0, max) —
      // headroom-nya sendiri tak pernah terlihat.
      el.style.height = `${window.innerHeight + s.max * 2}px`;
      s.t = mod(s.t, s.max || 1);
      s.tc = s.t;

      /*
       * POSISI BAND DIHITUNG, BUKAN DITEBAK.
       * Karya yang sedang membesar 2× tingginya = 2 × (lebar sel × 10/16), dan
       * blok bawah (bar + wordmark) ikut berubah di tiap ukuran layar.
       * Blok "caption + karya besar" ditaruh di tengah ruang antara tepi atas
       * panel dan garis bar, lalu dijepit dua arah.
       */
      pn.style.setProperty('--strip-atas', '0px');
      const tepiAtasPanel = pn.getBoundingClientRect().top;
      const barAtas = bar.getBoundingClientRect().top - tepiAtasPanel;
      const tinggiCaption = caption.getBoundingClientRect().height;
      const tinggiBesar = s.cell * 1.25; // 2× tinggi foto 16:10
      const PAD = 36;
      const JEDA = 16;

      const tinggiBand = tinggiCaption + tinggiBesar;
      let atas = PAD + (barAtas - PAD - tinggiBand) / 2; // = posisi atas caption
      atas = Math.max(PAD + 8, atas);
      atas = Math.min(atas, barAtas - JEDA - tinggiBesar - tinggiCaption);
      pn.style.setProperty('--strip-atas', `${Math.max(0, Math.round(atas + tinggiCaption - PAD))}px`);
    };

    /**
     * Snap ke kelipatan sel (ruang terlipat; tujuan BOLEH = max). Kalau snap
     * melewati batas putaran, sisa jaraknya disimpan di `snapSisa`: loop yang
     * melipat scrollY (saat raw menyentuh max) sekaligus memulai animasi sisa
     * itu — lipatan di tengah animasi Lenis akan mematikan animasinya, jadi
     * lipatan dan lanjutan animasi harus terjadi di tempat yang sama.
     */
    const snapKe = (tujuan: number, now: number) => {
      s.lastSnap = now;
      if (tujuan <= s.max || s.max <= 0) {
        scrollToY(s.top + Math.max(0, tujuan), { duration: 0.55 });
        return;
      }
      s.snapSisa = tujuan - s.max;
      // sasaran lewat 4 px dari max supaya lipatan pasti terlampaui; loop yang
      // melipat sekaligus memulai animasi sisa (snapSisa).
      const seg1 = s.max + 4 - s.t;
      scrollToY(s.top + s.max + 4, {
        duration: Math.max(0.15, 0.55 * (seg1 / (tujuan - s.t))),
      });
    };

    const loop = () => {
      s.raf = requestAnimationFrame(loop);
      if (jedaRef.current) return; // overlay terbuka — semua beku

      const vw = window.innerWidth;

      // 1. posisi target dari posisi gulir (pemetaan 1:1, seperti aslinya),
      //    DILIPAT ke [0, max): lewat satu putaran, scrollY dikembalikan −max
      //    seketika — tak terlihat karena frame di t dan t−max identik.
      let raw = window.scrollY - s.top;
      if (raw >= s.max && s.max > 0) {
        const sisa = s.snapSisa;
        s.snapSisa = 0;
        scrollToY(s.top + (raw - s.max), { immediate: true });
        raw -= s.max;
        if (sisa > 0.5) scrollToY(s.top + sisa, { duration: 0.25 });
      }
      const keluarAtas = raw < 0; // sedang digulir keluar menuju hero
      s.t = keluarAtas ? 0 : raw;

      // 2. posisi halus — lerp 0.1 sama seperti sumbernya, tapi di ruang
      //    periodik: selisih terpendek, supaya lipatan tidak memutar balik strip
      const d = keluarAtas ? -s.tc : deltaPutaran(s.t, mod(s.tc, s.max), s.max);
      s.tc += d * 0.1;

      // 3. SATU skalar untuk seluruh gerakan (ditulis di wrapper, seperti sumber)
      tr.style.setProperty('--diff', String(clamp(0, 1, 1 - Math.abs(d) * 0.001)));

      // 4. LOOPING: transform per slide dari rumus wrap sumber.
      //    t_item = wrap(right - max, right, tc)  →  translate3d(-t_item, 0, 0)
      const kanan = slides.current.map((_, i) => (i + 1) * s.cell);
      const vw2 = vw;
      let tItem = 0;
      for (let i = 0; i < slides.current.length; i++) {
        const sl = slides.current[i];
        if (!sl) continue;
        const kiri = i * s.cell;
        const r = kanan[i];
        tItem = wrap(r - s.max, r, s.tc);
        sl.style.transform = `translate3d(${-tItem}px, 0, 0)`;
        // visibilitas persis sumber: t_item > kiri - vw - w  &&  t_item < kanan + w
        sl.classList.toggle(
          'is-not-visible',
          !(tItem > kiri - vw2 - s.cell && tItem < r + s.cell),
        );
      }

      // 5. karya besar = acuan vw/2 + sel/2 − 5 di-snap ke tepi kanan terdekat
      //    (fungsi idx() di sumber), sisanya is-left/is-right dari p
      const acuan = wrap(0, s.max, s.tc + vw2 / 2 + s.cell / 2 - 5);
      const dekat = clamp(1, WORKS.length, Math.round(acuan / s.cell)) * s.cell;
      const besar = dekat / s.cell - 1;
      slides.current.forEach((sl, i) => {
        if (!sl) return;
        const r = kanan[i];
        if (i === besar) {
          sl.classList.add('is-big');
          sl.classList.remove('is-left', 'is-right');
          return;
        }
        sl.classList.remove('is-big');
        const p = clamp(0, 1, (tItemDari(i) - (r - vw2)) / (vw2 - s.cell));
        sl.classList.toggle('is-left', p > 0.5);
        sl.classList.toggle('is-right', p <= 0.5);
      });

      function tItemDari(i: number) {
        return wrap(kanan[i] - s.max, kanan[i], s.tc);
      }

      // 6. diam 130 ms → snap ke kelipatan lebar sel (di ruang periodik: snap
      //    yang melewati batas putaran ikut melipat, bukan memutar balik)
      if (Math.abs(s.t - s.prev) > 0.4) {
        s.prev = s.t;
        s.lastChange = performance.now();
      }
      const now = performance.now();
      if (!s.drag && !keluarAtas && now - s.lastChange > 130 && now - s.lastSnap > 420) {
        const snapW = Math.round(s.t / s.cell) * s.cell;
        const dSnap = deltaPutaran(snapW, s.t, s.max);
        if (Math.abs(dSnap) > 1.2) snapKe(s.t + dSnap, now);
      }
    };

    /* ── geser dengan tetikus / jari ───────────────────────────────────── */
    const onDown = (e: PointerEvent) => {
      if (jedaRef.current) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      s.drag = true;
      s.downX = e.clientX;
      s.downY = e.clientY;
      s.startRaw = Math.max(0, window.scrollY - s.top);
      s.gerak = 0;
      pn.setPointerCapture(e.pointerId);
      pn.classList.add('is-drag');
    };
    const onMove = (e: PointerEvent) => {
      if (!s.drag) return;
      const dx = e.clientX - s.downX;
      s.gerak = Math.max(s.gerak, Math.hypot(dx, e.clientY - s.downY));
      if (s.gerak > 4) {
        // geseran jari memutar strip; melewati batas putaran = mod (seamless),
        // ke atas berhenti di 0 — keluar seksi lewat gulir biasa, bukan drag.
        let r0 = s.startRaw - dx;
        if (r0 >= s.max) r0 = mod(r0, s.max);
        r0 = Math.max(0, r0);
        s.snapSisa = 0;
        scrollToY(s.top + r0, { immediate: true });
      }
    };
    const onUp = (e: PointerEvent) => {
      const wasDrag = s.drag;
      s.drag = false;
      pn.classList.remove('is-drag');
      if (!wasDrag) return;
      // klik (bukan geser) di atas karya → buka overlay detail.
      // Catatan: e.target di sini bisa jadi panel karena setPointerCapture,
      // jadi elemen bawah kursor dicari lewat elementFromPoint.
      if (s.gerak < 6) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const art = el?.closest?.('.karya-slide');
        if (art) buka(art);
      }
    };

    const buka = (art: Element) => {
      const img = art.querySelector<HTMLImageElement>('.karya-foto');
      const slug = art.getAttribute('data-slug') ?? '';
      if (!img) return;
      const r = img.getBoundingClientRect();
      onOpen({
        slug,
        src: img.currentSrc || img.src,
        slide: { x: r.left, y: r.top, w: r.width, h: r.height },
        stageTop: tr!.getBoundingClientRect().top,
      });
    };

    /* ── papan ketik: satu langkah = satu sel ──────────────────────────── */
    const onKey = (e: KeyboardEvent) => {
      if (jedaRef.current) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const arah = e.key === 'ArrowRight' ? 1 : -1;
      const tujuan = Math.round(s.t / s.cell) * s.cell + arah * s.cell;
      if (tujuan < 0) return; // panah kiri di sel pertama tetap di karya
      snapKe(tujuan, performance.now());
    };

    ukur();
    tr.style.setProperty('--diff', '1');
    s.raf = requestAnimationFrame(loop);

    pn.addEventListener('pointerdown', onDown);
    pn.addEventListener('pointermove', onMove);
    pn.addEventListener('pointerup', onUp);
    pn.addEventListener('pointercancel', onUp);
    pn.addEventListener('keydown', onKey);
    window.addEventListener('resize', ukur);
    window.addEventListener('orientationchange', ukur);

    return () => {
      cancelAnimationFrame(s.raf);
      pn.removeEventListener('pointerdown', onDown);
      pn.removeEventListener('pointermove', onMove);
      pn.removeEventListener('pointerup', onUp);
      pn.removeEventListener('pointercancel', onUp);
      pn.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', ukur);
      window.removeEventListener('orientationchange', ukur);
      el.style.height = '';
    };
  }, [aktif, pin, panel, track, slides, onOpen]);
}

/** Mode gulir asli (mobile / reduced-motion): klik biasa membuka overlay. */
function useKlikAsli({
  aktif,
  onOpen,
}: {
  aktif: boolean;
  onOpen: (posisi: PosisiKlik) => void;
}) {
  useEffect(() => {
    if (!aktif) return;
    const on = (e: Event) => {
      const art = (e.target as Element | null)?.closest?.('.karya-slide');
      if (!art) return;
      const img = art.querySelector<HTMLImageElement>('.karya-foto');
      const track = art.closest('.karya-track');
      const slug = art.getAttribute('data-slug') ?? '';
      if (!img || !track) return;
      const r = img.getBoundingClientRect();
      onOpen({
        slug,
        src: img.currentSrc || img.src,
        slide: { x: r.left, y: r.top, w: r.width, h: r.height },
        stageTop: track.getBoundingClientRect().top,
      });
    };
    document.addEventListener('click', on);
    return () => document.removeEventListener('click', on);
  }, [aktif, onOpen]);
}

/**
 * MASUK — reveal yang sama bahasanya dengan hero: naik dari balik mask,
 * tanpa satu pun opacity. Dipicu sekali saat seksi pertama kali terlihat.
 */
function useMasuk({ panel, aktif }: { panel: Ref<HTMLDivElement | null>; aktif: boolean }) {
  useLayoutEffect(() => {
    const pn = panel.current;
    if (!pn) return;
    if (!aktif) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(pn);
      const captions = q('.karya-caption [data-mask-inner]');
      const baris = q('.karya-bar [data-mask-inner], .wordmark [data-wm]');
      gsap.set([...captions, ...baris], { yPercent: 112 });

      let sudah = false;
      const io = new IntersectionObserver(
        (entries) => {
          if (sudah || !entries[0]?.isIntersecting) return;
          sudah = true;
          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .to(captions, { yPercent: 0, duration: 0.8, stagger: 0.035 }, 0.1)
            .to(baris, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.45);
          io.disconnect();
        },
        { threshold: 0.25 },
      );
      io.observe(pn);
      return () => io.disconnect();
    }, pn);

    return () => ctx.revert();
  }, [panel, aktif]);
}
