export const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export const FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2 uRes;
uniform float uTime;
uniform float uProgress;
uniform float uState;
uniform float uMorph;
uniform vec2 uPointer;
uniform float uIntro;
uniform float uVel;
uniform float uOct;

const vec3 VOIDC = vec3(0.008, 0.008, 0.008); // #020202
const vec3 BONE  = vec3(0.918, 0.910, 0.882); // #EAE8E1

void main() {
  vec2 uv = vUv;

  // latar flat — awan tinta, grid, vignette, grain dibuang
  vec3 col = VOIDC;

  // kilau velositas scroll (samar, hanya saat scroll)
  float shimmer = clamp(abs(uVel) * 0.002, 0.0, 0.08);
  col += BONE * shimmer;

  // kilau warp saat transisi halaman
  col += BONE * uMorph * 0.10 * (0.5 + 0.5 * sin(uv.x * 20.0 + uTime * 8.0));

  // fade-in intro dari void
  col = mix(VOIDC, col, uIntro);

  gl_FragColor = vec4(col, 1.0);
}
`;
