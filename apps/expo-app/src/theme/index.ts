import fonts from "./fonts"
export { fonts }

export {
  activeColorClasses,
  colorClasses,
  fontFamily,
  textSizeClasses,
  type FontWeight,
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

export const defaultThemes: Record<string, ThemeColors> = {
  light: {
    background: "#eeeeee",
    text: "#14532D",
    secondaryText: "#737f92",
    mutedText: "#a6afc0",
    card: "#e6e6e6",
    border: "#D1D5DB",
    primary: "#059669",
    success: "#10B981",
    error: "#DC2626",
  },
  dark: {
    background: "#131316",
    text: "#F9FAFB",
    secondaryText: "#9aa0ac",
    mutedText: "#636871",
    card: "#2e2e33",
    border: "#3a3a3f",
    primary: "#34D399",
    success: "#22C55E",
    error: "#EF4444",
  },
}
