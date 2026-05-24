export const EASE = [0.22, 1, 0.36, 1] as const

/** Spread directly onto a `motion.*` element for entrance animations. */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
})
