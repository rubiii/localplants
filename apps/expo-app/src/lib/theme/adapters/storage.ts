import { THEME_COLORS, THEME_MODES, type ThemeColor, type ThemeMode } from "@localplants/theme"
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEYS = {
  THEME_MODE: "themeMode",
  THEME_COLOR: "themeColor",
} as const

export async function getStoredThemeMode(): Promise<ThemeMode | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE)

  if (stored && THEME_MODES.includes(stored as ThemeMode)) {
    return stored as ThemeMode
  }

  return null
}

export async function setStoredThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode)
}

export async function getStoredThemeColor(): Promise<ThemeColor | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME_COLOR)

  if (stored && THEME_COLORS.includes(stored as ThemeColor)) {
    return stored as ThemeColor
  }

  return null
}

export async function setStoredThemeColor(color: ThemeColor): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.THEME_COLOR, color)
}
