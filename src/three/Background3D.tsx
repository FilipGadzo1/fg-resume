import { useEffect, useRef, useState } from 'react'
import { TileScene } from './TileScene'
import { useThemeColors } from './useThemeColors'

// Content sits in a left-aligned column; soften the field there so body text stays crisp.
const TEXT_COLUMN_MASK = 'linear-gradient(100deg, rgb(0 0 0 / 0.4) 15%, rgb(0 0 0 / 0.55) 45%, #000 80%)'
const INTRO_KEY = 'fg-intro-played'

function gridSize() {
  const small = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4
  return small ? { cols: 60, rows: 38 } : { cols: 96, rows: 58 }
}

function shouldPlayIntro() {
  try {
    // Only on the first visit of a session, and only if the hero is on screen.
    if (sessionStorage.getItem(INTRO_KEY) || scrollY > innerHeight * 0.5) return false
    sessionStorage.setItem(INTRO_KEY, '1')
    return true
  } catch {
    return true
  }
}

// Evaluated once when this lazy chunk loads (an effect would run twice under StrictMode).
const PLAY_INTRO = shouldPlayIntro()

/** Lazy-loaded WebGL layer. Keep every three.js import behind this module. */
export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<TileScene | null>(null)
  const colors = useThemeColors()
  const colorsRef = useRef(colors)
  colorsRef.current = colors
  const [visible, setVisible] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let scene: TileScene
    try {
      scene = new TileScene(canvasRef.current!, {
        ...gridSize(),
        colors: colorsRef.current,
        playIntro: PLAY_INTRO,
      })
      scene.start()
    } catch {
      // Context creation can still fail (GPU process crash, context limit). The
      // background is decorative, so drop it and keep the static glow.
      setFailed(true)
      return
    }
    sceneRef.current = scene
    const id = requestAnimationFrame(() => setVisible(true))
    return () => {
      cancelAnimationFrame(id)
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.setColors(colors)
  }, [colors])

  if (failed) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full transition-opacity duration-[1500ms] ease-out"
      style={{ opacity: visible ? 1 : 0, maskImage: TEXT_COLUMN_MASK, WebkitMaskImage: TEXT_COLUMN_MASK }}
    />
  )
}
