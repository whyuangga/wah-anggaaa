import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sceneBus, sceneTarget } from './bus';
import { FRAG, VERT } from './shaders';

/**
 * SATU kanvas WebGL fixed full-viewport — latar kontinu semua halaman.
 * Quad fullscreen + shader: murah di GPU, aman di mobile.
 * Monokrom penuh, hormat prefers-reduced-motion, pause saat tab hidden.
 * Adaptive quality: bila frame melambat, otomatis turunkan DPR/oktaf.
 */
export default function Scene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // WebGL gagal → biarkan background void polos
    }

    // level kualitas: [oktaf, cap DPR] — index 0 = awal
    const LEVELS: Array<[number, number]> = coarse
      ? [[3, 1], [2, 1], [2, 0.8]]
      : [[4, 1.5], [3, 1.5], [3, 1.25], [2, 1]];
    let level = 0;

    const applySize = () => {
      const cap = LEVELS[level][1];
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      (uniforms.uRes.value as THREE.Vector2).set(window.innerWidth, window.innerHeight);
    };

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uState: { value: 0 },
      uMorph: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uIntro: { value: 0 },
      uVel: { value: 0 },
      uOct: { value: LEVELS[0][0] },
    };
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }),
    );
    scene.add(mesh);
    applySize();

    // pointer (mouse + sentuh) — parallax halus
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (clientX: number, clientY: number) => {
      pointer.tx = (clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((clientY / window.innerHeight) * 2 - 1);
    };
    const onMouse = (e: PointerEvent) => onPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener('pointermove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    const onResize = () => applySize();
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    let intro = 0;
    let state = 0;
    let progress = 0;
    let morph = 0;
    let vel = 0;
    let emaMs = 16;
    let frames = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const k = 1 - Math.exp(-dt * 4.5); // peredam independen frame-rate
      intro = lerp(intro, 1, 1 - Math.exp(-dt * 2.2));
      state = lerp(state, sceneTarget(), k);
      progress = lerp(progress, sceneBus.progress, k);
      morph = lerp(morph, sceneBus.morph, 1 - Math.exp(-dt * 7));
      vel = lerp(vel, sceneBus.velocity, 1 - Math.exp(-dt * 5));
      pointer.x = lerp(pointer.x, pointer.tx, k);
      pointer.y = lerp(pointer.y, pointer.ty, k);

      uniforms.uTime.value = clock.elapsedTime;
      uniforms.uIntro.value = intro;
      uniforms.uState.value = state;
      uniforms.uProgress.value = progress;
      uniforms.uMorph.value = morph;
      uniforms.uVel.value = vel;
      (uniforms.uPointer.value as THREE.Vector2).set(pointer.x, pointer.y);

      renderer.render(scene, camera);

      // adaptive: rata-rata frame > 26ms → turunkan kualitas (satu arah)
      emaMs = emaMs * 0.95 + dt * 1000 * 0.05;
      frames += 1;
      if (frames >= 120) {
        if (emaMs > 26 && level < LEVELS.length - 1) {
          level += 1;
          uniforms.uOct.value = LEVELS[level][0];
          applySize();
        }
        frames = 0;
        emaMs = 16;
      }
    };

    if (reduced) {
      // satu frame statis, tanpa loop
      uniforms.uIntro.value = 1;
      renderer.render(scene, camera);
    } else {
      const loop = () => {
        if (!document.hidden) render();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="fixed inset-0 z-0 pointer-events-none" />;
}
