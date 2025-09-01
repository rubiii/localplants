import { vars } from "nativewind"

// https://colorwind.dev/app
type Theme = {
  /* --- Background Colors (60%) ------------------ */

  // Main background color
  background: string

  // Secondary background
  backgroundSecondary: string

  // Muted background areas
  backgroundMuted: string

  // Card background
  card: string

  /* --- Text Colors (30%) ------------------ */

  // Primary text color
  foreground: string

  // Secondary text
  foregroundSecondary: string

  // Muted text
  foregroundMuted: string

  // Card text
  cardForeground: string

  /* --- Interactive Elements (10%) ------------------ */

  // Primary brand color
  primary: string

  // Text on primary
  primaryForeground: string

  // Secondary color
  secondary: string

  // Text on secondary
  secondaryForeground: string

  /* --- Utility Colors ------------------ */

  // Border color
  border: string

  // Input background
  input: string

  // Focus ring color
  ring: string

  // Success indicator
  success: string

  // Warning indicator
  warning: string

  // Error indicator
  error: string

  // Info indicator
  info: string
}

export const themes: Record<string, Theme> = {
  light: {
    background: "#FFFFFF",
    backgroundSecondary: "#F0FDF4",
    backgroundMuted: "#D1FAE5",
    foreground: "#14532D",
    foregroundSecondary: "#374151",
    foregroundMuted: "#6B7280",
    card: "#FFFFFF",
    cardForeground: "#14532D",
    border: "#D1D5DB",
    input: "#F3F4F6",
    ring: "#059669",
    primary: "#059669",
    primaryForeground: "#FFFFFF",
    secondary: "#F3F4F6",
    secondaryForeground: "#14532D",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#DC2626",
    info: "#059669",
  },
  dark: {
    background: "#111827",
    backgroundSecondary: "#1F2937",
    backgroundMuted: "#064E3B",
    foreground: "#F9FAFB",
    foregroundSecondary: "#E5E7EB",
    foregroundMuted: "#9CA3AF",
    card: "#1F2937",
    cardForeground: "#F9FAFB",
    border: "#374151",
    input: "#4B5563",
    ring: "#34D399",
    primary: "#34D399",
    primaryForeground: "#111827",
    secondary: "#4B5563",
    secondaryForeground: "#F9FAFB",
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
