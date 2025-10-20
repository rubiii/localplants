import { THEME_COLORS, THEME_MODES, type ThemeColor, type ThemeMode } from "@localplants/theme"

const STORAGE_KEYS = {
  THEME_MODE: "themeMode",
  THEME_COLOR: "themeColor",
} as const

export function getStoredThemeMode(): ThemeMode | null {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE)

  if (stored && THEME_MODES.includes(stored as ThemeMode)) {
    return stored as ThemeMode
  }

  return null
}

export function setStoredThemeMode(mode: ThemeMode): void {
  localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode)
}

export function getStoredThemeColor(): ThemeColor | null {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME_COLOR)

  if (stored && THEME_COLORS.includes(stored as ThemeColor)) {
    return stored as ThemeColor
  }

  return null
}

export function setStoredThemeColor(color: ThemeColor): void {
  localStorage.setItem(STORAGE_KEYS.THEME_COLOR, color)
}
