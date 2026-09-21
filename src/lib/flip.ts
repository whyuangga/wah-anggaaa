import gsap from 'gsap';

/**
 * FLIP — miniatur dari plugin Flip yang dipakai iamrossmason.com.
 *
 * Sumber aslinya (modul 206 di bundle mereka) hanyalah port kecil: ukur kotak
 * lama (`getState`), pindahkan elemen ke wadah baru, lalu animasikan transform
 * (`from`) supaya elemen terlihat "terbang" dari posisi lama ke posisi baru —
 * durasi 1 detik, easing `expo.inOut`, persis panggilan aslinya:
 *
 *     const state = Flip.getState(el);
 *     wadah.appendChild(el);
 *     Flip.from(state, { absolute: true, duration: 1, ease: 'expo.inOut' });
 *
 * Di sini dilakukan dengan GSAP core yang sudah ada di bundel — tidak menambah
 * satu pun dependensi baru. Elemen yang diterbangkan harus sudah terisi penuh
 * ke wadah tujuannya lewat CSS (absolute inset-0), seperti img di slot hero
 * referensi — maka "ke" selalu = kotak wadah, dan animasinya murni transform.
 */

export type Kotak = { x: number; y: number; w: number; h: number };

/** Ukur posisi & ukuran elemen di layar (padanan `Flip.getState`). */
export function ambilKotak(el: Element): Kotak {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

/**
 * Animasikan elemen dari kotak `dari` ke posisinya sekarang (padanan
 * `Flip.from(state, { absolute: true, ... })`). ELEMEN TIDAK DIPINDAHKAN —
 * hanya transform yang dianimasikan, sampai identitas di akhir.
 */
export function terbang(el: HTMLElement, dari: Kotak, durasi = 1): gsap.core.Tween {
  const ke = ambilKotak(el);
  gsap.set(el, { transformOrigin: '0 0' });
  return gsap.fromTo(
    el,
    {
      x: dari.x - ke.x,
      y: dari.y - ke.y,
      scaleX: dari.w / ke.w,
      scaleY: dari.h / ke.h,
    },
    { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: durasi, ease: 'expo.inOut' },
  );
}
