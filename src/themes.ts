export type Theme = {
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

export const defaultThemes: Record<string, Theme> = {
  light: {
    background: "#eeeeee",
    text: "#14532D",
    secondaryText: "#374151",
    mutedText: "#6B7280",
    card: "#e6e6e6",
    border: "#D1D5DB",
    primary: "#059669",
    success: "#10B981",
    error: "#DC2626",
  },
  dark: {
    background: "#131316",
    text: "#F9FAFB",
    secondaryText: "#E5E7EB",
    mutedText: "#9CA3AF",
    card: "#2e2e33",
    border: "#3a3a3f",
    primary: "#34D399",
    success: "#22C55E",
    error: "#EF4444",
  },
}
