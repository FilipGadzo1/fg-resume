import { lazy, Suspense, useEffect, useState } from 'react'
import { useCan3D } from '../three/useCan3D'

// three.js lives in its own chunk and loads only after the page is interactive.
// A failed load (offline, or a stale chunk hash after a redeploy) must not take the
// page down with it — Suspense doesn't catch rejections — so it resolves to nothing.
const Background3D = lazy(() => import('../three/Background3D').catch(() => ({ default: () => null })))

export default function Backdrop() {
  const can3D = useCan3D()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!can3D) return
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 1500 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(() => setReady(true), 300)
    return () => clearTimeout(id)
  }, [can3D])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="backdrop-glow absolute inset-0" />
      {can3D && ready && (
        <Suspense fallback={null}>
          <Background3D />
        </Suspense>
      )}
    </div>
  )
}
