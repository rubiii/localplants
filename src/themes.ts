import { vars } from "nativewind"

export type Theme = {
  "background": string // Main background
  "card": string // Card background

  "text": string // Primary text color
  "secondary-text": string // Secondary text
  "muted-text": string // Muted text

  "primary": string // Primary color

  "border": string // Border color
  "success": string // Success indicator
  "error": string // Error indicator
}

export const themes: Record<string, Theme> = {
  light: {
    "background": "#eeeeee",
    "text": "#14532D",
    "secondary-text": "#374151",
    "muted-text": "#6B7280",
    "card": "#e6e6e6",
    "border": "#D1D5DB",
    "primary": "#059669",
    "success": "#10B981",
    "error": "#DC2626",
  },
  dark: {
    "background": "#131316",
    "text": "#F9FAFB",
    "secondary-text": "#E5E7EB",
    "muted-text": "#9CA3AF",
    "card": "#2e2e33",
    "border": "#3a3a3f",
    "primary": "#34D399",
    "success": "#22C55E",
    "error": "#EF4444",
  },
}

export const nativewindThemes = {
  light: vars(themes.light),
  dark: vars(themes.dark),
}
