import { Sun, Moon } from 'lucide-react'
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
    <button
      onClick={handleClick}
      aria-label="Toggle theme"
      className="text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
