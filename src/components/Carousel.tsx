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

const foto = (slug: string, lebar: 800 | 1600) =>
  FOTO[`../../assets/works/${slug}-hero-${lebar}.webp`];

/**
 * CAROUSEL KARYA — delapan karya, satu baris, digerakkan roda/geseran.
 *
 * MEKANISME DIAMBIL DARI iamrossmason.com (bedah kode ada di
 * /home/user/reference/rossmason-riset/, ringkasannya di docs/SPEC-CAROUSEL.md).
 * Intinya persis seperti aslinya — nama variabel dan nama kelas sengaja
 * dipertahankan supaya kode ini bisa dibaca berdampingan dengan sumbernya:
 *
 *   • Satu skalar `--diff` (0→1) di elemen track mengendalikan SELURUH gerakan:
 *     `--x-output`, `--x-text-output`, `--scale-output` semuanya hasil kali
 *     `--x/--x-text/--scale` (dipilih oleh kelas is-left/is-right/is-big)
 *     dengan `--diff`. Jadi tidak ada animasi per-item: hanya satu variabel CSS
 *     yang ditulis tiap frame.
 *   • Saat strip masih bergerak `--diff → 0` → grid rapat & rata.
 *     Saat berhenti `--diff → 1` → karya di tengah membesar 2× dan
 *     tetangganya bergeser ±50% lebar sel untuk memberi ruang.
 *   • Posisi halus (tc) mengejar posisi target (t) dengan `tc += (t-tc) * 0.1`,
 *     persis lerp milik mereka.
 *   • Berhenti 130 ms → SNAP ke kelipatan lebar sel terdekat (mereka 100 ms).
 *
 * Yang berbeda karena keadaan kita memang lain (lihat SPEC §2):
 *   • Halaman kita panjang, bukan setinggi satu layar. Jadi seksi ini
 *     `position: sticky` setinggi `100vh + jarak tempuh`; posisi gulir vertikal
 *     dipetakan 1:1 ke geseran strip — rasio yang sama dengan situs aslinya.
 *   • Sel 20vw (5 karya per layar) dan rasionya 16:10 asli foto, bukan 4:5,
 *     karena foto kita tidak boleh di-crop.
 *   • Di mobile & saat `prefers-reduced-motion`, penjepitan halaman dimatikan:
 *     strip jadi wadah gulir horizontal asli (native scroll-snap).
 *   • Klik karya belum membuka apa pun — overlay detail menyusul.
 */
export default function Carousel() {
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

  usePenjepitan({ pin, panel, track, slides, aktif: !asli });
  useMasuk({ panel, aktif: !asli });

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
            >
              {/* caption DI ATAS foto — mengikuti referensi */}
              <div className="karya-caption">
                <p className="t-label t-figure mask-sup">
                  <span data-mask-inner className="block">
                    {String(i + 1).padStart(2, '0')}.
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
                  src={foto(w.slug, 800)}
                  srcSet={`${foto(w.slug, 800)} 800w, ${foto(w.slug, 1600)} 1600w`}
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

/**
 * PENJEPITAN — mesin intinya.
 *
 * Semua angka dihitung di sini dengan sengaja memakai nama seperti sumbernya:
 * `t` (target), `tc` (posisi halus), `diff`, `cell`, `max`.
 */
function usePenjepitan({
  pin,
  panel,
  track,
  slides,
  aktif,
}: {
  pin: Ref<HTMLElement | null>;
  panel: Ref<HTMLDivElement | null>;
  track: Ref<HTMLDivElement | null>;
  slides: Ref<(HTMLElement | null)[]>;
  aktif: boolean;
}) {
  useEffect(() => {
    if (!aktif) return;
    const el = pin.current;
    const pn = panel.current;
    const tr = track.current;
    if (!el || !pn || !tr) return;

    const clamp = (a: number, b: number, v: number) => Math.min(b, Math.max(a, v));

    const s = {
      cell: 0,
      max: 0, // jarak tempuh total (px)
      t: 0,
      tc: 0,
      prev: -1,
      lastChange: performance.now(),
      lastSnap: 0,
      active: -1,
      drag: false,
      downX: 0,
      downY: 0,
      startY: 0,
      gerak: 0,
      top: 0,
      marginTrack: 0,
      raf: 0,
    };

    const ukur = () => {
      const first = slides.current[0];
      const bawah = pn.querySelector('.karya-bawah');
      const bar = pn.querySelector('.karya-bar');
      const caption = pn.querySelector('.karya-caption');
      if (!first || !bawah || !bar || !caption) return;

      s.cell = first.getBoundingClientRect().width;
      // jarak tempuh = lebar seluruh strip − lebar layar (8 sel × 20vw − 100vw = 60vw)
      s.max = Math.max(0, s.cell * WORKS.length - window.innerWidth);
      s.top = el.getBoundingClientRect().top + window.scrollY;
      el.style.height = `${window.innerHeight + s.max}px`;
      s.t = clamp(0, s.max, s.t);
      s.tc = s.t;

      /*
       * POSISI BAND DIHITUNG, BUKAN DITEBAK.
       *
       * Karya yang sedang membesar 2× tingginya = 2 × (lebar sel × 10/16), dan
       * blok bawah (bar + wordmark) tingginya ikut berubah di tiap ukuran layar.
       * Margin tetap akan bertabrakan di satu ukuran dan menyisakan lubang di
       * ukuran lain. Jadi: blok "caption + karya besar" ditaruh tepat di tengah
       * ruang antara tepi atas panel dan garis bar — lalu dijepit supaya
       * captionnya tidak keluar ke atas dan fotonya tidak menabrak bar.
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
      // jepit: caption jangan mepet ke tepi atas, foto jangan menabrak bar
      atas = Math.max(PAD + 8, atas);
      atas = Math.min(atas, barAtas - JEDA - tinggiBesar - tinggiCaption);
      s.marginTrack = Math.max(0, atas + tinggiCaption - PAD);
      pn.style.setProperty('--strip-atas', `${Math.round(s.marginTrack)}px`);
    };

    const loop = () => {
      const tengah = window.innerWidth / 2;

      // 1. posisi target dari posisi gulir (pemetaan 1:1, seperti aslinya)
      s.t = clamp(0, s.max, window.scrollY - s.top);

      // 2. posisi halus — lerp 0.1, sama seperti sumbernya
      s.tc += (s.t - s.tc) * 0.1;

      // 3. SATU skalar untuk seluruh gerakan
      const diff = clamp(0, 1, 1 - Math.abs(s.t - s.tc) * 0.001);
      tr.style.setProperty('--diff', String(diff));
      tr.style.transform = `translate3d(${-s.tc}px, 0, 0)`;

      // 4. kelas per slide: yang paling dekat ke tengah = is-big, sisanya
      //    is-left / is-right; yang di luar layar dapat is-not-visible
      let dekat = 0;
      let jarak = Infinity;
      const rects = slides.current.map((sl) => (sl ? sl.getBoundingClientRect() : null));
      rects.forEach((r, i) => {
        if (!r) return;
        const d = Math.abs(r.left + r.width / 2 - tengah);
        if (d < jarak) {
          jarak = d;
          dekat = i;
        }
      });
      s.active = dekat;
      rects.forEach((r, i) => {
        const sl = slides.current[i];
        if (!sl || !r) return;
        const kiri = r.left + r.width / 2 < tengah;
        sl.classList.toggle('is-big', i === s.active);
        sl.classList.toggle('is-left', i !== s.active && kiri);
        sl.classList.toggle('is-right', i !== s.active && !kiri);
        sl.classList.toggle('is-not-visible', r.right < 0 || r.left > window.innerWidth);
      });

      // 5. diam 130 ms → snap ke kelipatan lebar sel
      if (Math.abs(s.t - s.prev) > 0.4) {
        s.prev = s.t;
        s.lastChange = performance.now();
      }
      const now = performance.now();
      if (!s.drag && now - s.lastChange > 130 && now - s.lastSnap > 420) {
        const snap = clamp(0, s.max, Math.round(s.t / s.cell) * s.cell);
        if (Math.abs(snap - s.t) > 1.2) {
          s.lastSnap = now;
          scrollToY(s.top + snap, { duration: 0.55 });
        }
      }

      s.raf = requestAnimationFrame(loop);
    };

    /* ── geser dengan tetikus / jari ───────────────────────────────────── */
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      s.drag = true;
      s.downX = e.clientX;
      s.downY = e.clientY;
      s.startY = window.scrollY;
      s.gerak = 0;
      pn.setPointerCapture(e.pointerId);
      pn.classList.add('is-drag');
    };
    const onMove = (e: PointerEvent) => {
      if (!s.drag) return;
      const dx = e.clientX - s.downX;
      s.gerak = Math.max(s.gerak, Math.hypot(dx, e.clientY - s.downY));
      if (s.gerak > 4) scrollToY(s.startY - dx, { immediate: true });
    };
    const onUp = () => {
      s.drag = false;
      pn.classList.remove('is-drag');
    };

    /* ── papan ketik: satu langkah = satu sel ──────────────────────────── */
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const arah = e.key === 'ArrowRight' ? 1 : -1;
      const tujuan = clamp(0, s.max, Math.round(s.t / s.cell) * s.cell + arah * s.cell);
      s.lastSnap = performance.now();
      scrollToY(s.top + tujuan, { duration: 0.55 });
    };

    ukur();
    tr.style.setProperty('--diff', '1');
    tr.style.transform = 'translate3d(0, 0, 0)';
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
  }, [aktif, pin, panel, track, slides]);
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
