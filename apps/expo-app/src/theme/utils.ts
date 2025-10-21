import { type FontSize, type ThemeColor } from "@/theme"
import { clsx } from "clsx"

export function colorClasses(value?: ThemeColor) {
  return clsx({
    "text-[--text]": !value || value === "text",
    "text-[--secondaryText]": value === "secondary",
    "text-[--mutedText]": value === "muted",
    "text-[--background]": value === "background",
    "text-[--primary]": value === "primary",
    "text-[--success]": value === "success",
    "text-[--error]": value === "error",
  })
}

export function activeColorClasses(value?: ThemeColor) {
  return clsx({
    "group-active:text-[--text]": value === "text",
    "group-active:text-[--secondaryText]": value === "secondary",
    "group-active:text-[--mutedText]": value === "muted",
    "group-active:text-[--background]": value === "background",
    "group-active:text-[--primary]": value === "primary",
    "group-active:text-[--success]": value === "success",
    "group-active:text-[--error]": value === "error",
  })
}

export function textSizeClasses(value?: FontSize) {
  return clsx({
    "text-xs": value === "xs",
    "text-sm": value === "sm",
    "text-base": !value || value === "base",
    "text-lg": value === "lg",
    "text-xl": value === "xl",
    "text-2xl": value === "2xl",
    "text-3xl": value === "3xl",
    "text-4xl": value === "4xl",
    "text-5xl leading-[1.1]": value === "5xl",
    "text-6xl leading-[1.1]": value === "6xl",
    "text-7xl leading-[1.1]": value === "7xl",
    "text-8xl leading-[1.1]": value === "8xl",
    "text-9xl leading-[1.1]": value === "9xl",
  })
}

export const DEFAULT_FONT_WEIGHT = 400
const FONT_FAMILY_BY_WEIGHT = {
  100: "Inter_100Thin",
  200: "Inter_200ExtraLight",
  300: "Inter_300Light",
  400: "Inter_400Regular",
  500: "Inter_500Medium",
  600: "Inter_600SemiBold",
  700: "Inter_700Bold",
  800: "Inter_800ExtraBold",
  900: "Inter_900Black",
}
export type FontWeight = keyof typeof FONT_FAMILY_BY_WEIGHT

export function fontFamily(weight: FontWeight = DEFAULT_FONT_WEIGHT) {
  return FONT_FAMILY_BY_WEIGHT[weight]
}
