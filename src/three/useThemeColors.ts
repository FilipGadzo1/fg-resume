import { useEffect, useState } from 'react'
import { Color } from 'three'
import { useTheme } from '../context/ThemeContext'

export type SceneColors = { background: Color; foreground: Color; primary: Color }

let ctx: CanvasRenderingContext2D | null = null

/**
 * Resolve a CSS custom property (Tessera tokens are oklch()) to a THREE.Color.
 * The browser does the color-space conversion: we paint the computed value
 * into a 1×1 canvas and read back the sRGB pixel.
 */
function resolveToken(name: string, fallback: string): Color {
  const probe = document.createElement('span')
  probe.style.color = `var(${name})`
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()

  ctx ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Color(fallback)

  ctx.fillStyle = fallback
  ctx.fillStyle = computed // ignored if the browser can't parse it
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return new Color().setRGB(r / 255, g / 255, b / 255, 'srgb')
}

function readColors(): SceneColors {
  return {
    background: resolveToken('--background', '#0c0a09'),
    foreground: resolveToken('--foreground', '#fafaf9'),
    primary: resolveToken('--primary', '#ba4209'),
  }
}

/** Scene colors from the Tessera tokens, re-read whenever the theme changes. */
export function useThemeColors() {
  const { theme } = useTheme()
  const [colors, setColors] = useState(readColors)

  useEffect(() => {
    setColors(readColors())
  }, [theme])

  return colors
}
