import {
  Color,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { MAX_WAVES, fragmentShader, vertexShader } from './tileShader'
import type { SceneColors } from './useThemeColors'

const FIELD = new Vector2(26, 16)
const LOOK_AT = new Vector3(0, 1.2, 0)
const WALL_Z = -8
const MONO_Z = -2
const INTRO_SECONDS = 2.6
const { clamp, damp, smoothstep } = MathUtils

type Options = { cols: number; rows: number; colors: SceneColors; playIntro: boolean }

function randomInUnitBall() {
  for (;;) {
    const x = Math.random() * 2 - 1
    const y = Math.random() * 2 - 1
    const z = Math.random() * 2 - 1
    if (x * x + y * y + z * z <= 1) return [x, y, z]
  }
}

/**
 * The whole background scene in plain three.js (no React renderer), so only
 * the three.js classes used here end up in the bundle. React owns lifecycle
 * and theme colors via Background3D; everything per-frame lives here.
 */
export class TileScene {
  private readonly renderer: WebGLRenderer
  private readonly camera = new PerspectiveCamera(45, 1, 0.1, 60)
  private readonly scene = new Scene()
  private readonly material: ShaderMaterial
  private readonly geometry: RoundedBoxGeometry
  private readonly mesh: InstancedMesh
  private readonly monoAttr: InstancedBufferAttribute
  private readonly order: Uint32Array // random tile order for monogram assignment
  private readonly tileSize: number
  private readonly raycaster = new Raycaster()
  private readonly groundPlane = new Plane(new Vector3(0, 1, 0), 0)
  private readonly wallPlane = new Plane(new Vector3(0, 0, 1), -WALL_Z)
  private readonly hit = new Vector3()
  private readonly ndc = new Vector2()
  private readonly targets: { base: Color; accent: Color; bg: Color }

  private raf = 0
  private disposed = false
  private lastTime = 0
  private scroll = 0
  private introT: number
  private snapColors = true
  private pointerActive = false
  private hoverEl: Element | null = null
  private waveIndex = 0
  private fps = { frames: 0, time: 0, done: false }
  private resizeTimer = 0
  private contactEl: HTMLElement | null = null

  constructor(
    private readonly canvas: HTMLCanvasElement,
    { cols, rows, colors, playIntro }: Options,
  ) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    this.introT = playIntro ? 0 : 1
    this.targets = { base: new Color(), accent: new Color(), bg: new Color() }
    this.setColors(colors)

    const count = cols * rows
    this.tileSize = Math.min(FIELD.x / cols, FIELD.y / rows) * 0.8
    const s = this.tileSize
    this.geometry = new RoundedBoxGeometry(s, s * 0.28, s, 2, s * 0.16)
    const grid = new Float32Array(count * 2)
    const rand = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      grid[i * 2] = (i % cols) / (cols - 1) - 0.5
      grid[i * 2 + 1] = Math.floor(i / cols) / (rows - 1) - 0.5
      rand.set([...randomInUnitBall(), Math.random()], i * 4)
    }
    this.monoAttr = new InstancedBufferAttribute(new Float32Array(count * 4), 4)
    this.geometry.setAttribute('aGrid', new InstancedBufferAttribute(grid, 2))
    this.geometry.setAttribute('aRand', new InstancedBufferAttribute(rand, 4))
    this.geometry.setAttribute('aMono', this.monoAttr)

    this.order = new Uint32Array(count).map((_, i) => i)
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.order[i], this.order[j]] = [this.order[j], this.order[i]]
    }

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntro: { value: this.introT },
        uK1: { value: 0 },
        uK2: { value: 0 },
        uK4: { value: 0 },
        uMouse: { value: new Vector3(0, 0, 100) },
        uMouseStrength: { value: 0 },
        uSize: { value: FIELD },
        uWaves: { value: Array.from({ length: MAX_WAVES }, () => new Vector4(0, 0, -100, 0)) },
        uBase: { value: this.targets.base.clone() },
        uAccent: { value: this.targets.accent.clone() },
        uBg: { value: this.targets.bg.clone() },
        uIntensity: { value: 1 },
        uFogNear: { value: 10 },
        uFogFar: { value: 24 },
        uHoverRect: { value: new Vector4() },
        uHoverStrength: { value: 0 },
        uHoverRadius: { value: 90 },
      },
    })

    this.mesh = new InstancedMesh(this.geometry, this.material, count)
    this.mesh.frustumCulled = false
    this.scene.add(this.mesh)
  }

  start() {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true })
    document.addEventListener('pointerover', this.onPointerOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', this.onPointerLeave)
    this.contactEl = document.getElementById('contact')
    this.resize()
    // Inter may still be loading; build the monogram once it can be measured.
    document.fonts.load('900 100px Inter').finally(() => {
      if (!this.disposed) this.buildMonogram()
    })
    this.raf = requestAnimationFrame(this.frame)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    clearTimeout(this.resizeTimer)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerdown', this.onPointerDown)
    document.removeEventListener('pointerover', this.onPointerOver)
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave)
    this.mesh.dispose() // frees the instanceMatrix buffer; renderer.dispose() doesn't
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }

  setColors(colors: SceneColors) {
    // Base tile color sits just off the page background so the field stays quiet behind text.
    // Mixed in sRGB: a linear-space mix toward white reads far lighter than the ratio suggests.
    this.targets.base
      .copy(colors.background)
      .convertLinearToSRGB()
      .lerp(colors.foreground.clone().convertLinearToSRGB(), 0.08)
      .convertSRGBToLinear()
    this.targets.accent.copy(colors.primary)
    this.targets.bg.copy(colors.background)
  }

  /** Send a ring through the tiles from a screen point. */
  shockwave(clientX: number, clientY: number, strength: number) {
    const u = this.material.uniforms
    this.toNdc(clientX, clientY)
    this.raycaster.setFromCamera(this.ndc, this.camera)
    const ray = this.raycaster.ray
    // Convert to field space (the coordinates the shader measures ring distance in).
    let x: number, y: number
    if (u.uK2.value > 0.5) {
      if (!ray.intersectPlane(this.wallPlane, this.hit)) return
      x = this.hit.x / 1.15
      y = (this.hit.y - 1) / 1.05
    } else if (ray.intersectPlane(this.groundPlane, this.hit) && this.hit.z > -FIELD.y / 2) {
      x = this.hit.x
      y = this.hit.z
    } else {
      // Clicked above the horizon (e.g. the nav): start the ring at the field's far edge below it.
      if (!ray.intersectPlane(this.wallPlane, this.hit)) return
      x = this.hit.x
      y = -FIELD.y / 2
    }
    ;(u.uWaves.value as Vector4[])[this.waveIndex].set(x, y, u.uTime.value, strength)
    this.waveIndex = (this.waveIndex + 1) % MAX_WAVES
  }

  private toNdc(clientX: number, clientY: number) {
    // Normalise against the canvas, not the window (innerWidth includes the scrollbar).
    const r = this.canvas.getBoundingClientRect()
    this.ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    this.toNdc(e.clientX, e.clientY)
    this.pointerActive = true
  }

  private onPointerLeave = () => {
    this.pointerActive = false
    this.hoverEl = null
  }

  private onPointerDown = (e: PointerEvent) => {
    const strong = (e.target as Element | null)?.closest?.('[data-shockwave="strong"]')
    this.shockwave(e.clientX, e.clientY, strong ? 2 : 1)
  }

  private onPointerOver = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    this.hoverEl = (e.target as Element | null)?.closest?.('[data-tile-glow]') ?? null
  }

  private onResize = () => {
    this.resize()
    clearTimeout(this.resizeTimer)
    this.resizeTimer = window.setTimeout(() => this.buildMonogram(), 200)
  }

  private resize() {
    const w = this.canvas.clientWidth || innerWidth
    const h = this.canvas.clientHeight || innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  /** Rasterize "FG" and assign tiles to a lattice over its filled pixels. */
  private buildMonogram() {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 256
    const ctx = c.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.font = '900 220px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('FG', 256, 128)
    const { data } = ctx.getImageData(0, 0, 512, 256)
    const alpha = (x: number, y: number) => data[(Math.floor(y) * 512 + Math.floor(x)) * 4 + 3]

    let minX = 512, maxX = 0, minY = 256, maxY = 0
    for (let y = 0; y < 256; y++)
      for (let x = 0; x < 512; x++)
        if (alpha(x, y) > 128) {
          minX = Math.min(minX, x); maxX = Math.max(maxX, x)
          minY = Math.min(minY, y); maxY = Math.max(maxY, y)
        }
    const bw = maxX - minX + 1
    const bh = maxY - minY + 1
    if (bw <= 1) return

    // Fit the letters into what the camera sees at the monogram depth (camera ends ~15 units away).
    const aspect = this.camera.aspect
    const visH = 2 * 15 * Math.tan(MathUtils.degToRad(this.camera.fov / 2))
    const wide = aspect > 1.2
    const width = Math.min(9, visH * aspect * (wide ? 0.45 : 0.8))
    const cx = wide ? visH * aspect * 0.2 : 0
    const cy = wide ? 1.4 : 2.2

    const spacing = this.tileSize * 1.22
    const lcols = Math.max(8, Math.floor(width / spacing))
    const lrows = Math.max(5, Math.round((lcols * bh) / bw))
    const step = width / lcols

    const arr = this.monoAttr.array as Float32Array
    arr.fill(0)
    let n = 0
    for (let j = 0; j < lrows; j++)
      for (let i = 0; i < lcols; i++) {
        if (n >= this.order.length) break
        if (alpha(minX + ((i + 0.5) / lcols) * bw, minY + ((j + 0.5) / lrows) * bh) <= 128) continue
        const tile = this.order[n++]
        arr.set(
          [cx - width / 2 + (i + 0.5) * step, cy + (lrows * step) / 2 - (j + 0.5) * step, MONO_Z, 1],
          tile * 4,
        )
      }
    this.monoAttr.needsUpdate = true
  }

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame)
    const dt = Math.min(this.lastTime ? (now - this.lastTime) / 1000 : 0.016, 0.1)
    this.lastTime = now
    const u = this.material.uniforms

    u.uTime.value += dt

    // intro: tiles assemble from the cloud into the wave
    this.introT = Math.min(1, this.introT + dt / INTRO_SECONDS)
    const intro = 1 - Math.pow(1 - this.introT, 3)
    u.uIntro.value = intro

    // scroll-driven formations
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
    this.scroll = damp(this.scroll, scrollY / max, 3, dt)
    const s = this.scroll
    u.uK1.value = smoothstep(s, 0.08, 0.38)
    u.uK2.value = smoothstep(s, 0.5, 0.82)
    u.uIntensity.value = 0.85 - 0.4 * smoothstep(s, 0.04, 0.3)

    // monogram: driven by how far the contact section has scrolled into view
    const top = this.contactEl?.getBoundingClientRect().top ?? Infinity
    const k4 = smoothstep(clamp((innerHeight - top) / (innerHeight * 0.6), 0, 1), 0, 1)
    u.uK4.value = damp(u.uK4.value, k4, 2.5, dt)

    // theme colors
    const t = this.snapColors ? 1 : 1 - Math.exp(-5 * dt)
    this.snapColors = false
    u.uBase.value.lerp(this.targets.base, t)
    u.uAccent.value.lerp(this.targets.accent, t)
    u.uBg.value.lerp(this.targets.bg, t)

    // cursor ripple on the wave
    if (this.pointerActive) {
      this.raycaster.setFromCamera(this.ndc, this.camera)
      if (this.raycaster.ray.intersectPlane(this.groundPlane, this.hit)) {
        const m = u.uMouse.value as Vector3
        m.x = damp(m.x, this.hit.x, 6, dt)
        m.z = damp(m.z, this.hit.z, 6, dt)
      }
    }
    u.uMouseStrength.value = damp(u.uMouseStrength.value, this.pointerActive ? 1 : 0, 2.5, dt)

    // project card halo
    if (this.hoverEl) {
      const r = this.hoverEl.getBoundingClientRect()
      const pr = this.renderer.getPixelRatio()
      const H = this.renderer.domElement.height
      ;(u.uHoverRect.value as Vector4).set(r.left * pr, H - r.bottom * pr, r.right * pr, H - r.top * pr)
      u.uHoverRadius.value = 90 * pr
    }
    u.uHoverStrength.value = damp(u.uHoverStrength.value, this.hoverEl ? 1 : 0, 6, dt)

    // camera: pulls in during the intro, dollies back as the page scrolls
    this.camera.position.set(0, 3.6 - s * 1.5, 11 + s * 2 + (1 - intro) * 3)
    this.camera.lookAt(LOOK_AT)

    this.renderer.render(this.scene, this.camera)
    this.guardFrameRate(dt)
  }

  /** If the GPU struggles in the first seconds, drop to 1× pixel ratio. */
  private guardFrameRate(dt: number) {
    const f = this.fps
    if (f.done) return
    f.time += dt
    if (f.time < 0.5) return // ignore shader-compile warmup
    f.frames++
    if (f.time > 3) {
      f.done = true
      if (f.frames / (f.time - 0.5) < 45) {
        this.renderer.setPixelRatio(1)
        this.resize()
      }
    }
  }
}
