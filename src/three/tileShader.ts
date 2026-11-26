/**
 * Tile field shaders. Every tile's position is computed on the GPU from its
 * grid coordinate, so animating thousands of tiles costs no per-frame JS.
 *
 * Formations, blended by scroll:
 *   wave     (hero)       → rolling heightfield with a cursor ripple
 *   cloud    (mid page)   → tiles drift loose and spin (also the intro start state)
 *   wall     (lower page) → calm upright mosaic far behind the content
 *   monogram (contact)    → a subset of tiles flies forward to spell "FG"
 *
 * Shockwaves (clicks / taps / theme toggle) are rings travelling outward in
 * field space, so they read the same in the wave, the cloud and the wall.
 */
export const MAX_WAVES = 4

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;         // 0 → 1 while tiles assemble on first load
  uniform float uK1;            // wave → cloud
  uniform float uK2;            // cloud → wall
  uniform float uK4;            // → monogram
  uniform vec3  uMouse;         // cursor hit point on the wave plane
  uniform float uMouseStrength;
  uniform vec2  uSize;          // wave field extent
  uniform vec4  uWaves[${MAX_WAVES}]; // xy: origin in field space, z: start time, w: strength

  attribute vec2 aGrid;         // -0.5 .. 0.5
  attribute vec4 aRand;         // xyz: random point in unit ball, w: 0..1
  attribute vec4 aMono;         // xyz: monogram target, w: 1 if this tile is part of it

  varying vec3  vNormal;
  varying float vGlow;
  varying float vDepth;
  varying float vSolid;

  mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1, 0, 0,  0, c, s,  0, -s, c); }
  mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0, -s,  0, 1, 0,  s, 0, c); }

  float field(vec2 p, float t) {
    return sin(p.x * 0.55 + t * 0.60) * 0.35
         + sin(p.y * 0.80 - t * 0.45) * 0.28
         + sin((p.x + p.y) * 0.35 + t * 0.30) * 0.45
         + sin(length(p) * 0.90 - t * 0.80) * 0.12;
  }

  void main() {
    float t = uTime;
    float k1 = max(uK1, 1.0 - uIntro);
    vec2 p = aGrid * uSize;

    // shockwave rings
    float ring = 0.0;
    for (int i = 0; i < ${MAX_WAVES}; i++) {
      vec4 w = uWaves[i];
      float age = t - w.z;
      if (age < 0.0 || age > 4.0) continue;
      float front = age * 7.0;
      float dist = distance(p, w.xy);
      float dr = dist - front; // negative ahead of the ring: pow() would be undefined there
      ring += exp(-dr * dr * 0.6) * exp(-age * 1.1) * w.w;
    }

    // wave
    float h = field(p, t);
    float d = distance(p, uMouse.xz);
    float bump = exp(-d * d * 0.08) * uMouseStrength;
    h += bump * 0.7 + sin(d * 1.6 - t * 3.0) * exp(-d * 0.35) * 0.12 * uMouseStrength + ring * 0.9;
    vec3 wave = vec3(p.x, h, p.y);

    // cloud
    float ph = aRand.w * 6.2831;
    vec3 cloud = aRand.xyz * vec3(13.0, 5.0, 6.0)
               + vec3(sin(t * 0.30 + ph) * 0.5, cos(t * 0.25 + ph * 2.0) * 0.5, 0.0)
               + vec3(0.0, 1.5, -5.0)
               + normalize(aRand.xyz + 1e-4) * ring * 0.8;

    // wall
    vec2 q = p * vec2(1.15, 1.05);
    vec3 wall = vec3(q.x, q.y + 1.0, -8.0 + field(q * 0.6, t * 0.5) * 0.3 + ring * 1.2);

    vec3 center = mix(mix(wave, cloud, k1), wall, uK2);

    // monogram
    float sel = step(0.5, aMono.w);
    float m = uK4 * sel;
    vec3 mono = aMono.xyz + vec3(0.0, sin(t * 1.2 + aMono.x * 0.6) * 0.06, 0.0);
    center = mix(center, mono, m);

    float loose = k1 * (1.0 - uK2) * (1.0 - m);
    mat3 R = rotX(uK2 * 1.5707963 + loose * sin(ph + t * 0.4) * 1.2) * rotY(loose * (ph + t * 0.35));
    // Only ~35% of tiles stay visible in the cloud so it reads as sparse drift, not noise.
    float keep = step(0.65, fract(aRand.w * 7.31));
    float scale = mix(1.0, 0.75 * keep, loose);
    scale *= 1.0 - 0.45 * uK4 * (1.0 - sel);

    vec4 mv = modelViewMatrix * vec4(center + R * position * scale, 1.0);
    gl_Position = projectionMatrix * mv;

    vNormal = normalize(normalMatrix * (R * normal));
    vDepth = -mv.z;
    vSolid = m;

    float accent = step(0.97, aRand.w);
    float peak = smoothstep(0.95, 1.6, h) * (1.0 - k1);
    vGlow = clamp(peak * 0.6 + bump * 0.35 * (1.0 - k1) + accent * 0.6 + ring * 0.4, 0.0, 1.0);
    vGlow = mix(vGlow, 0.7, m);
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3  uBase;
  uniform vec3  uAccent;
  uniform vec3  uBg;
  uniform float uIntensity;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec4  uHoverRect;     // device pixels, gl_FragCoord space: x0, y0, x1, y1
  uniform float uHoverStrength;
  uniform float uHoverRadius;

  varying vec3  vNormal;
  varying float vGlow;
  varying float vDepth;
  varying float vSolid;

  void main() {
    vec3 n = normalize(vNormal);
    float light = max(dot(n, normalize(vec3(0.35, 0.9, 0.45))), 0.0);
    vec3 col = mix(uBase, uAccent, vGlow) * mix(0.85, 1.08, light);

    float fog = smoothstep(uFogNear, uFogFar, vDepth) * (1.0 - 0.75 * vSolid);
    col = mix(col, uBg, fog);
    // The monogram sits behind contact details, so it stays a watermark rather than a headline.
    col = mix(uBg, col, mix(uIntensity, 0.38, vSolid));

    // warm halo of tiles around a hovered project card
    if (uHoverStrength > 0.001) {
      vec2 c = (uHoverRect.xy + uHoverRect.zw) * 0.5;
      vec2 hs = (uHoverRect.zw - uHoverRect.xy) * 0.5;
      vec2 e = abs(gl_FragCoord.xy - c) - hs;
      float sdf = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0);
      float halo = 1.0 - smoothstep(0.0, uHoverRadius, max(sdf, 0.0));
      col = mix(col, uAccent, halo * 0.45 * uHoverStrength);
    }

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`
