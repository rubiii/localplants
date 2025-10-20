import type { ThemeColor, ThemeMode } from "@localplants/theme"
import { useTheme as useCoreTheme } from "@localplants/theme"
import { useEffect, useState } from "react"
import { getStoredThemeColor, getStoredThemeMode, setStoredThemeColor, setStoredThemeMode } from "../adapters/storage"
import { useSystemTheme } from "../adapters/system"
import { getThemeColors, type ThemeColorValues } from "../colors"

export interface NativeThemeHook {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  color: ThemeColor
  setColor: (color: ThemeColor) => void
  isDarkMode: boolean
  colors: ThemeColorValues
}

/**
 * Hook for theme management in React Native
 * Integrates @localplants/theme core with AsyncStorage persistence
 * and provides color values for NativeWind vars.
 */
export function useTheme(): NativeThemeHook {
  const systemPrefersDark = useSystemTheme()

  // State for controlled theme values
  const [mode, setMode] = useState<ThemeMode>("system")
  const [color, setColor] = useState<ThemeColor>("stone")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial values from AsyncStorage on mount
  useEffect(() => {
    const loadInitialValues = async () => {
      const [storedMode, storedColor] = await Promise.all([
        getStoredThemeMode(),
        getStoredThemeColor(),
      ])

      if (storedMode) setMode(storedMode)
      if (storedColor) setColor(storedColor)
      setIsLoaded(true)
    }

    void loadInitialValues()
  }, [])

  // Use core theme hook in controlled mode
  const theme = useCoreTheme(
    {
      mode,
      onModeChange: setMode,
      color,
      onColorChange: setColor,
    },
    systemPrefersDark
  )

  // Persist theme mode to AsyncStorage
  useEffect(() => {
    if (!isLoaded) return
    void setStoredThemeMode(mode)
  }, [mode, isLoaded])

  // Persist theme color to AsyncStorage
  useEffect(() => {
    if (!isLoaded) return
    void setStoredThemeColor(color)
  }, [color, isLoaded])

  // Get color values for NativeWind
  const colors = getThemeColors(theme.color, theme.isDarkMode)

  return {
    mode: theme.mode,
    setMode: theme.setMode,
    color: theme.color,
    setColor: theme.setColor,
    isDarkMode: theme.isDarkMode,
    colors,
  }
}
