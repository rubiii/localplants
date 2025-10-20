import { useModeAnimation, type ModeAnimationHook } from "@/lib/theme/hooks/useModeAnimation"
import { createContext, useContext, type ReactNode } from "react"

const ThemeContext = createContext<ModeAnimationHook | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useModeAnimation()

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
