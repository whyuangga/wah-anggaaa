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

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p, float oct) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= oct) break;
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // aliran lambat — tiap state sedikit beda kecepatan & arah
  float st = uState;
  vec2 flow = vec2(uTime * 0.020 * (1.0 + st * 0.35), uTime * 0.013 * (1.0 - st * 0.12));
  vec2 q = p * 1.4 + flow + uPointer * 0.08;

  // warp transisi: geser + turbulensi
  q.x += uMorph * 0.35 * sin(q.y * 4.0 + uTime * 6.0);
  q += uMorph * 0.25 * vec2(fbm(q * 2.0 + uTime, uOct), fbm(q * 2.0 - uTime, uOct));

  float n = fbm(q + fbm(q * 1.7 - flow * 0.6, uOct), uOct);

  // awan tinta monokrom — progres scroll menggeser terang
  float band = smoothstep(0.35, 0.9, n + uProgress * 0.12 - st * 0.03);

  // grid tipis samar
  vec2 g = abs(fract(p * 14.0 + flow * 2.0) - 0.5);
  float grid = 1.0 - smoothstep(0.0, 0.03, min(g.x, g.y));

  // kilau velositas scroll
  float shimmer = clamp(abs(uVel) * 0.002, 0.0, 0.08);

  vec3 col = VOIDC;
  col += BONE * band * (0.05 + 0.035 * st / 4.0);
  col += BONE * grid * 0.028;
  col += BONE * shimmer * band;
  col += BONE * uMorph * 0.10 * (0.5 + 0.5 * sin(uv.x * 20.0 + uTime * 8.0));

  // vignette
  float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5)));
  col = mix(VOIDC * 0.85, col, mix(0.6, 1.0, vig));

  // fade-in intro dari void
  col = mix(VOIDC, col, uIntro);

  gl_FragColor = vec4(col, 1.0);
}
`;
