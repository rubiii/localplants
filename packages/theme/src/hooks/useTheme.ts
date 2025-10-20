import { useMemo } from "react"
import type { ThemeColor, ThemeMode } from "../types"
import { resolveIsDarkMode } from "../utils/helpers"
import { useThemeColor } from "./useThemeColor"
import { useThemeMode } from "./useThemeMode"

// Combined hook for managing complete theme state
// Manages both theme mode (system/light/dark) and theme color (stone/blue/etc).
export function useTheme(
  config?: {
    initialMode?: ThemeMode
    initialColor?: ThemeColor
    mode?: ThemeMode
    onModeChange?: (mode: ThemeMode) => void
    color?: ThemeColor
    onColorChange?: (color: ThemeColor) => void
  },
  systemPrefersDark = false
): {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  color: ThemeColor
  setColor: (color: ThemeColor) => void
  isDarkMode: boolean
} {
  const {
    initialMode = "system",
    initialColor = "stone",
    mode: externalMode,
    onModeChange,
    color: externalColor,
    onColorChange,
  } = config ?? {}

  // Manage theme mode
  const modeConfig: Parameters<typeof useThemeMode>[0] = { initialMode }
  if (externalMode !== undefined) {
    modeConfig.mode = externalMode
  }
  if (onModeChange !== undefined) {
    modeConfig.onModeChange = onModeChange
  }
  const { mode, setMode } = useThemeMode(modeConfig)

  // Manage theme color
  const colorConfig: Parameters<typeof useThemeColor>[0] = { initialColor }
  if (externalColor !== undefined) {
    colorConfig.color = externalColor
  }
  if (onColorChange !== undefined) {
    colorConfig.onColorChange = onColorChange
  }
  const { color, setColor } = useThemeColor(colorConfig)

  // Compute isDarkMode based on mode and system preference
  const isDarkMode = useMemo(
    () => resolveIsDarkMode(mode, systemPrefersDark),
    [mode, systemPrefersDark]
  )

  return {
    mode,
    setMode,
    color,
    setColor,
    isDarkMode,
  }
}
