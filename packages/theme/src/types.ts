export const THEME_COLORS = ["stone", "blue", "green", "purple", "orange", "red"] as const
export type ThemeColor = typeof THEME_COLORS[number]

export const THEME_MODES = ["system", "light", "dark"] as const
export type ThemeMode = typeof THEME_MODES[number]
