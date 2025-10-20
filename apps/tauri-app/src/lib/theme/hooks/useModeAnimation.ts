import { useTheme, type ThemeColor, type ThemeMode } from "@localplants/theme"
import { useEffect, useRef, type RefObject } from "react"
import { getStoredThemeColor, getStoredThemeMode, setStoredThemeColor, setStoredThemeMode } from "../adapters/storage"
import { useSystemTheme } from "../adapters/system"
import { injectBaseStyles } from "../utils/themeHelpers"
import { animateFromElement } from "../utils/viewTransition"
import { useThemeClasses } from "./useThemeClasses"

export interface ModeAnimationConfig {
  duration?: number // milliseconds
  easing?: string
  pseudoElement?: string
  darkModeClassName?: string
}

/**
 * Return type for the animated theme hook
 */
export interface ModeAnimationHook {
  ref: RefObject<HTMLButtonElement | null>
  setThemeMode: (mode: ThemeMode, element?: HTMLElement) => Promise<void>
  themeMode: ThemeMode
  isDarkMode: boolean
  themeColor: ThemeColor
  changeThemeColor: (color: ThemeColor) => void
}

// Much love to Võ Ngọc Quang Minh (@MinhOmega) for react-theme-switch-animation
export function useModeAnimation(config?: ModeAnimationConfig): ModeAnimationHook {
  const {
    easing = "ease-in-out",
    pseudoElement = "::view-transition-new(root)",
    darkModeClassName,
  } = config ?? {}
  const duration = config?.duration ?? 500

  useEffect(() => {
    injectBaseStyles()
  }, [])

  const systemPrefersDark = useSystemTheme()
  const initialMode = getStoredThemeMode() ?? "system"
  const initialColor = getStoredThemeColor() ?? "stone"

  const theme = useTheme({
    initialMode,
    initialColor,
  }, systemPrefersDark)

  useThemeClasses(theme.isDarkMode, theme.color, darkModeClassName)

  useEffect(() => {
    setStoredThemeMode(theme.mode)
  }, [theme.mode])

  useEffect(() => {
    setStoredThemeColor(theme.color)
  }, [theme.color])

  const ref = useRef<HTMLButtonElement>(null)

  const setThemeMode = async (mode: ThemeMode, element?: HTMLElement): Promise<void> => {
    const targetElement = element ?? ref.current

    // Determine if this mode change will result in an actual isDarkMode change
    const currentIsDarkMode = theme.isDarkMode
    const newIsDarkMode = mode === "system" ? systemPrefersDark : mode === "dark"
    const willChangeActualMode = currentIsDarkMode !== newIsDarkMode

    // Only animate if there's an actual light/dark mode change
    if (!targetElement || !willChangeActualMode) {
      theme.setMode(mode)
      return
    }

    await animateFromElement({
      element: targetElement,
      updateFn: () => {
        theme.setMode(mode)
      },
      duration,
      easing,
      pseudoElement,
    })
  }

  const changeThemeColor = (color: ThemeColor): void => {
    // No animation for color changes, just update immediately
    theme.setColor(color)
  }

  return {
    ref,
    setThemeMode,
    themeMode: theme.mode,
    isDarkMode: theme.isDarkMode,
    themeColor: theme.color,
    changeThemeColor,
  }
}
