import { defaultThemes, type ThemeColors } from "@/theme"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { vars } from "nativewind"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { Appearance, View } from "react-native"

type SystemTheme = "auto" | "light" | "dark"
export type SettingsTheme = "system" | "light" | "dark" | "custom"
export type ResolvedTheme = "light" | "dark" | "custom"

type ThemeContextType = {
  theme: ResolvedTheme
  colors: ThemeColors
  setTheme: (theme: SettingsTheme, colors?: ThemeColors) => Promise<void>
  removeCustomTheme: () => void
  usesSystemTheme: boolean
  hasCustomTheme: boolean
}

const FALLBACK_THEME = "light"
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [systemTheme, setSystemTheme] = useState<SystemTheme>(
    Appearance.getColorScheme() ?? "auto"
  )
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      const newSystemTheme = colorScheme ?? "auto"
      if (newSystemTheme !== systemTheme) setSystemTheme(newSystemTheme)
    })

    return () => listener.remove()
  }, [systemTheme])

  const [settingsTheme, setSettingsTheme] = useState<SettingsTheme>()
  const [settingsColors, setSettingsColors] = useState<ThemeColors>()
  useEffect(() => {
    AsyncStorage.getItem("theme").then((value) => {
      setSettingsTheme((value as SettingsTheme) ?? "system")
    })

    AsyncStorage.getItem("themeColors").then((value) => {
      if (value) {
        const colors = JSON.parse(value)
        setSettingsColors(colors)
      } else {
        setSettingsColors(undefined)
      }
    })
  }, [])

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>()
  const [resolvedColors, setResolvedColors] = useState<ThemeColors>()
  useEffect(() => {
    if (settingsTheme === "custom") {
      setResolvedTheme("custom")

      if (settingsColors) {
        setResolvedColors(settingsColors)
      } else if (systemTheme === "auto") {
        setResolvedTheme(FALLBACK_THEME)
        setResolvedColors(defaultThemes[FALLBACK_THEME])
      } else {
        setResolvedTheme(systemTheme)
        setResolvedColors(defaultThemes[systemTheme])
      }
    } else if (!settingsTheme || settingsTheme === "system") {
      if (systemTheme === "auto") {
        setResolvedTheme(FALLBACK_THEME)
        setResolvedColors(defaultThemes[FALLBACK_THEME])
      } else {
        setResolvedTheme(systemTheme)
        setResolvedColors(defaultThemes[systemTheme])
      }
    } else {
      setResolvedTheme(settingsTheme)
      setResolvedColors(defaultThemes[settingsTheme])
    }
  }, [systemTheme, settingsTheme, settingsColors])

  const setTheme = async (newTheme: SettingsTheme, colors?: ThemeColors) => {
    if (newTheme === "custom" && !colors)
      throw new Error("Setting custom theme requires colors")

    AsyncStorage.setItem("theme", newTheme)
    if (colors) {
      AsyncStorage.setItem("themeColors", JSON.stringify(colors))
    }

    setSettingsTheme(newTheme)
    setSettingsColors(colors)
  }

  const removeCustomTheme = () => {
    AsyncStorage.setItem("theme", "system")
    AsyncStorage.removeItem("themeColors")
    setTheme("system")
  }

  if (!resolvedTheme || !resolvedColors) return

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        colors: resolvedColors,
        setTheme,
        removeCustomTheme,
        hasCustomTheme: !!settingsColors,
        usesSystemTheme: settingsTheme === "system",
      }}
    >
      <View style={[{ flex: 1 }, vars(resolvedColors)]}>{children}</View>
    </ThemeContext.Provider>
  )
}

const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}

export default useTheme
