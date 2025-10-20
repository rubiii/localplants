import { vars } from "nativewind"
import { createContext, useContext, type ReactNode } from "react"
import { View } from "react-native"
import { useTheme, type NativeThemeHook } from "./hooks/useTheme"

const ThemeContext = createContext<NativeThemeHook | undefined>(undefined)

export function useThemeContext(): NativeThemeHook {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useThemeContext must be used within a ThemeProvider")
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTheme()

  return (
    <ThemeContext.Provider value={theme}>
      <View style={[{ flex: 1 }, vars(theme.colors)]}>
        {children}
      </View>
    </ThemeContext.Provider>
  )
}
