import { nativewindThemes, themes } from "@/themes"
import { useColorScheme } from "nativewind"
import { Appearance } from "react-native"

export default function useTheme() {
  const { colorScheme } = useColorScheme()

  const theme = colorScheme ?? "dark"
  const colors = themes[theme]
  const nativewindStyles = nativewindThemes[theme]

  const toggleTheme = () => {
    Appearance.setColorScheme(theme === "dark" ? "light" : "dark")
  }

  return {
    theme,
    colors,
    nativewindStyles,
    toggleTheme,
  }
}
