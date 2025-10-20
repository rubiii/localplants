import { getThemeColors, type ThemeColor } from "@localplants/theme"
import { useEffect } from "react"

const DARK_MODE_CLASS = "dark"
const THEME_COLOR_PREFIX = "theme-"

// Applies dark mode class to document.documentElement.
function useDarkModeClass(
  isDarkMode: boolean,
  className: string = DARK_MODE_CLASS
): void {
  useEffect(() => {
    const element = document.documentElement

    if (isDarkMode) {
      element.classList.add(className)
    } else {
      element.classList.remove(className)
    }
  }, [isDarkMode, className])
}

// Applies theme color class to document.documentElement.
function useThemeColorClass(themeColor: ThemeColor): void {
  useEffect(() => {
    const element = document.documentElement

    // Remove all theme color classes
    const classes = Array.from(element.classList)
    const themeColorClasses = classes.filter((cls) =>
      cls.startsWith(THEME_COLOR_PREFIX)
    )
    themeColorClasses.forEach((cls) => {
      element.classList.remove(cls)
    })

    // Add current theme color class
    element.classList.add(`${THEME_COLOR_PREFIX}${themeColor}`)
  }, [themeColor])
}

export function useThemeClasses(
  isDarkMode: boolean,
  themeColor: ThemeColor,
  darkModeClassName?: string
): void {
  useDarkModeClass(isDarkMode, darkModeClassName)
  useThemeColorClass(themeColor)
  useDynamicCSSVariables(isDarkMode, themeColor)
}

function useDynamicCSSVariables(
  isDarkMode: boolean,
  themeColor: ThemeColor
): void {
  useEffect(() => {
    const colors = getThemeColors(themeColor, isDarkMode)
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }, [isDarkMode, themeColor])
}
