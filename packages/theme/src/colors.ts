import type { ThemeColor } from "./types"

export interface ThemeColorValues {
  [key: string]: string
  background: string
  card: string
  button: string
  text: string
  secondaryText: string
  mutedText: string
  border: string
  primary: string
  success: string
  error: string
}

export interface ThemeColorScheme {
  light: ThemeColorValues
  dark: ThemeColorValues
}

// Unified base colors (same across all themes, using neutral stone palette)
const unifiedColors = {
  light: {
    background: "#fafaf9",
    card: "#f5f5f4",
    button: "#e8e7e6",
    border: "#d6d3d1",
    text: "#1c1917",
    secondaryText: "#44403c",
    mutedText: "#78716c",
    success: "#15803d",
    error: "#b91c1c",
  },
  dark: {
    background: "#292524",
    card: "#32302f",
    button: "#42403f",
    border: "#57534e",
    text: "#fafaf9",
    secondaryText: "#d6d3d1",
    mutedText: "#a8a29e",
    success: "#4ade80",
    error: "#f87171",
  },
} as const

// Theme-specific primary colors
const primaryColors = {
  stone: {
    light: "#78716c",
    dark: "#a8a29e",
  },
  blue: {
    light: "#3b82f6",
    dark: "#60a5fa",
  },
  green: {
    light: "#10b981",
    dark: "#34d399",
  },
  purple: {
    light: "#a855f7",
    dark: "#c084fc",
  },
  orange: {
    light: "#f97316",
    dark: "#fb923c",
  },
  red: {
    light: "#ef4444",
    dark: "#f87171",
  },
} as const

// Generate theme color schemes by combining unified colors with theme-specific primary
function createThemeColorScheme(themeColor: ThemeColor): ThemeColorScheme {
  return {
    light: {
      ...unifiedColors.light,
      primary: primaryColors[themeColor].light,
    },
    dark: {
      ...unifiedColors.dark,
      primary: primaryColors[themeColor].dark,
    },
  }
}

export const themeColorSchemes: Record<ThemeColor, ThemeColorScheme> = {
  stone: createThemeColorScheme("stone"),
  blue: createThemeColorScheme("blue"),
  green: createThemeColorScheme("green"),
  purple: createThemeColorScheme("purple"),
  orange: createThemeColorScheme("orange"),
  red: createThemeColorScheme("red"),
}

// Returns all color values for a given theme color and light/dark mode state.
export function getThemeColors(themeColor: ThemeColor, isDarkMode: boolean): ThemeColorValues {
  const scheme = themeColorSchemes[themeColor]
  return isDarkMode ? scheme.dark : scheme.light
}

// Returns just the primary color for a given theme color and dark mode state.
// Useful for theme color selector buttons.
export function getPrimaryColor(themeColor: ThemeColor, isDarkMode = false): string {
  const scheme = themeColorSchemes[themeColor]
  return isDarkMode ? scheme.dark.primary : scheme.light.primary
}

// Map of theme color names to primary color values (light mode).
// Useful for theme color selector buttons and pickers.
export const themePrimaryColors: Record<ThemeColor, string> = {
  stone: primaryColors.stone.light,
  blue: primaryColors.blue.light,
  green: primaryColors.green.light,
  purple: primaryColors.purple.light,
  orange: primaryColors.orange.light,
  red: primaryColors.red.light,
}
