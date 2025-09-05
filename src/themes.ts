import { vars } from "nativewind"

// https://colorwind.dev/app
type Theme = {
  // Background Colors (60%)
  background: string // Main background color
  backgroundSecondary: string // Secondary background
  backgroundMuted: string // Muted background areas
  card: string // Card background

  // Text Colors (30%)
  foreground: string // Primary text color
  foregroundSecondary: string // Secondary text
  foregroundMuted: string // Muted text
  cardForeground: string // Card text

  // Interactive Elements (10%)
  primary: string // Primary brand color
  primaryForeground: string // Text on primary
  secondary: string // Secondary color
  secondaryForeground: string // Text on secondary

  // Utility Colors
  border: string // Border color
  input: string // Input background
  ring: string // Focus ring color
  success: string // Success indicator
  warning: string // Warning indicator
  error: string // Error indicator
  info: string // Info indicator
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
