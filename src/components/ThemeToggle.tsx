import { Sun, Moon } from 'lucide-react'
import { Button } from '@tessera/ui'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, applyTheme } = useTheme()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // Store click position as CSS vars for the clip-path animation origin
    document.documentElement.style.setProperty('--vt-x', `${e.clientX}px`)
    document.documentElement.style.setProperty('--vt-y', `${e.clientY}px`)

    // View Transitions API: captures old state → runs callback synchronously
    // (class change + CSS update happen in one frame) → animates to new state.
    // Fallback: instant toggle for browsers without support.
    if (!('startViewTransition' in document)) {
      applyTheme(newTheme)
      return
    }

    (document as Document & { startViewTransition: (cb: () => void) => void })
      .startViewTransition(() => applyTheme(newTheme))
  }

  return (
    <Button
      variant="ghost"
      color="neutral"
      size="icon-sm"
      onClick={handleClick}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
