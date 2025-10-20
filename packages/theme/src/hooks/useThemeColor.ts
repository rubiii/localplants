import { useState } from "react"
import type { ThemeColor } from "../types"

// Hook for managing theme color state (stone/blue/green/etc).
export function useThemeColor(config?: {
  initialColor?: ThemeColor
  color?: ThemeColor
  onColorChange?: (color: ThemeColor) => void
}): {
  color: ThemeColor
  setColor: (color: ThemeColor) => void
} {
  const { initialColor = "stone", color: externalColor, onColorChange } = config ?? {}

  const [internalColor, setInternalColor] = useState<ThemeColor>(initialColor)
  const color = externalColor ?? internalColor

  const setColor = (newColor: ThemeColor): void => {
    if (onColorChange) {
      onColorChange(newColor) // Controlled mode: notify parent
    } else {
      setInternalColor(newColor) // Uncontrolled mode: update internal state
    }
  }

  return {
    color,
    setColor,
  }
}
