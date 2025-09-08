import { vars } from "nativewind"

// https://colorwind.dev/app
export type Theme = {
  // Background Colors (60%)
  background: string // Main background color
  card: string // Card background

  // Text Colors (30%)
  foreground: string // Primary text color
  foregroundSecondary: string // Secondary text
  foregroundMuted: string // Muted text

  // Interactive Elements (10%)
  primary: string // Primary brand color
  primaryForeground: string // Text on primary

  // Utilities
  border: string // Border color
  success: string // Success indicator
  warning: string // Warning indicator
  error: string // Error indicator
  info: string // Info indicator

  // Components
  button: string
  buttonActive: string
  buttonActiveForeground: string
  buttonDisabled: string
  buttonDisabledForeground: string
  buttonForeground: string
}

export const themes: Record<string, Theme> = {
  light: {
    background: "#eeeeee",
    foreground: "#14532D",
    foregroundSecondary: "#374151",
    foregroundMuted: "#6B7280",
    card: "#e6e6e6",
    border: "#D1D5DB",
    button: "#e9e9e9",
    buttonActive: "#059669",
    buttonDisabled: "#F3F4F6",
    buttonForeground: "#14532D",
    buttonActiveForeground: "#FFFFFF",
    buttonDisabledForeground: "#d0d4dc",
    primary: "#059669",
    primaryForeground: "#FFFFFF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#DC2626",
    info: "#059669",
  },
  dark: {
    background: "#131316",
    foreground: "#F9FAFB",
    foregroundSecondary: "#E5E7EB",
    foregroundMuted: "#9CA3AF",
    card: "#1F2937",
    border: "#3a3a3f",
    button: "#2e2e33",
    buttonActive: "#6B7280",
    buttonDisabled: "#2e2e33",
    buttonForeground: "#FFFFFF",
    buttonActiveForeground: "#111827",
    buttonDisabledForeground: "#131316",
    primary: "#34D399",
    primaryForeground: "#111827",
    success: "#22C55E",
    warning: "#EAB308",
    error: "#EF4444",
    info: "#34D399",
  },
}

export const nativewindThemes = {
  light: vars(themes.light),
  dark: vars(themes.dark),
}
