import useDeviceSettings from "@/hooks/useDeviceSettings"
import { nativewindThemes, type Theme, themes } from "@/themes"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { Appearance, View } from "react-native"

export type ThemeMode = "system" | "light" | "dark"
export type ResolvedTheme = "light" | "dark"

interface ThemeContextType {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (mode: ThemeMode) => Promise<void>
  colors: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>()
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  const settings = useDeviceSettings()

  // Resolve stored theme on mount
  useEffect(() => {
    settings
      .getValue<string | undefined>("theme")
      .then((value) => setThemeState((value ?? "system") as ThemeMode))
  }, [settings])

  // Listen to system changes if theme is "system"
  useEffect(() => {
    if (!theme) return

    const colorScheme = Appearance.getColorScheme() ?? "light"
    setResolvedTheme(theme === "system" ? colorScheme : theme)

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system" && colorScheme) {
        setResolvedTheme(colorScheme)
      }
    })

    return () => listener.remove()
  }, [theme])

  const setTheme = async (mode: ThemeMode) => {
    await settings.setValue("theme", mode)
    setThemeState(mode)
  }

  if (!theme || !resolvedTheme) return

  const colors = themes[resolvedTheme]
  const nativewindStyles = nativewindThemes[resolvedTheme]

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, colors }}>
      <View style={[{ flex: 1 }, nativewindStyles]}>{children}</View>
    </ThemeContext.Provider>
  )
}

const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}

export default useTheme
