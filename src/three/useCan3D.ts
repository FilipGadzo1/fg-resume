import { useEffect, useState } from 'react'

// three.js r163+ requires WebGL2; a WebGL1-only device must get the static fallback.
function hasWebGL2() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    // Release the probe context right away; mobile browsers cap live contexts.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

/**
 * Whether the decorative 3D background should run. It is skipped for users who
 * prefer reduced motion, have data saver on, or have no WebGL — they get the
 * static CSS glow instead.
 */
export function useCan3D() {
  const [can, setCan] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    const webgl = hasWebGL2()

    const update = () => setCan(webgl && !saveData && !motion.matches)
    update()
    motion.addEventListener('change', update)
    return () => motion.removeEventListener('change', update)
  }, [])

  return can
}
