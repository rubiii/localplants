import { themeColorSchemes } from "@localplants/theme"
import fonts from "./fonts"
export { fonts }

export {
  activeColorClasses,
  colorClasses,
  fontFamily,
  textSizeClasses,
  type FontWeight
} from "./utils"

export type ThemeColors = {
  background: string
  card: string
  text: string
  secondaryText: string
  mutedText: string
  primary: string
  border: string
  success: string
  error: string
}
export type ThemeColor =
  | "text"
  | "secondary"
  | "muted"
  | "background"
  | "primary"
  | "success"
  | "error"

export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"

// Default themes using centralized color values from @localplants/theme
export const defaultThemes: Record<string, ThemeColors> = {
  light: themeColorSchemes.stone.light,
  dark: themeColorSchemes.stone.dark,
}
