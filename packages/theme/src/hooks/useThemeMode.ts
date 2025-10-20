import { useState } from "react"
import type { ThemeMode } from "../types"

// Hook for managing theme mode state (system/light/dark).
export function useThemeMode(config?: {
  initialMode?: ThemeMode
  mode?: ThemeMode
  onModeChange?: (mode: ThemeMode) => void
}): {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
} {
  const { initialMode = "system", mode: externalMode, onModeChange } = config ?? {}

  const [internalMode, setInternalMode] = useState<ThemeMode>(initialMode)
  const mode = externalMode ?? internalMode

  const setMode = (newMode: ThemeMode): void => {
    if (onModeChange) {
      onModeChange(newMode) // Controlled mode: notify parent
    } else {
      setInternalMode(newMode) // Uncontrolled mode: update internal state
    }
  }

  return {
    mode,
    setMode,
  }
}
