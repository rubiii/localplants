import type { ThemeMode } from "../types"

// Returns whether dark mode should be active based on theme mode and system preference.
export function resolveIsDarkMode(
  mode: ThemeMode,
  systemPrefersDark: boolean
): boolean {
  if (mode === "system") return systemPrefersDark
  return mode === "dark"
}
