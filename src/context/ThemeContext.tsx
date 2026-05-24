import { createContext, useContext, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  applyTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', applyTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    const initial: Theme = saved === 'light' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', initial === 'dark')
    return initial
  })

  // Apply theme directly to DOM synchronously + sync React state.
  // No useEffect — avoids the async paint gap that causes the flash.
  const applyTheme = useCallback((newTheme: Theme) => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
